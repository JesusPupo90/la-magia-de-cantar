// lib/orders/process-payment.ts
// Crea el pago REAL en Mercado Pago (POST /v1/payments) cuando el usuario
// completa el Payment Brick. El brick SOLO entrega el token de la tarjeta;
// el backend cobra (regla de oro §1: el monto viene de la BD, nunca del cliente).
// SIN "use server": función pura ejecutable desde Server Actions.

import { randomUUID } from "crypto";
import { createAdminClient } from "../supabase/admin";
import { mapPaymentStatus, MP_DOC_TYPES } from "./mp-status";
import { maybeSendConfirmation } from "./send-confirmation";

export interface ProcessPaymentResult {
  success: boolean;
  status?: string;
  statusDetail?: string | null;
  orderId?: string;
  paymentId?: string;
  redirectUrl?: string;
  message?: string;
  code?: string;
  warning?: string;
}

interface OrderRow {
  id: string;
  external_reference: string | null;
  service_title: string;
  variant_label: string;
  amount_total: number;
  status: string;
  expires_at: string | null;
  payer_email: string;
  payer_first_name: string;
  payer_last_name: string;
  payer_doc_type: string;
  payer_doc_number: string;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getBaseUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (url) return url;
  // En dev se mantiene un túnel local de respaldo. En producción NO hay fallback:
  // si falta NEXT_PUBLIC_APP_URL el cobro se bloquea (jamás un pago sin
  // notification_url hacia una URL muerta).
  if (process.env.NODE_ENV !== "production") {
    return "https://pocket-proposed-rarely-recorded.trycloudflare.com";
  }
  return null;
}

// El SDK v3 (3.16.0) llama a onSubmit(formData, additionalData) donde formData
// es { selectedPaymentMethod, formData }. Según la versión, formData.inner puede
// ser un objeto CardData (token plano) o un array con { payment_method: { token } }.
function extractCardData(input: unknown): {
  token: string;
  paymentMethodId?: string;
  issuerId?: string;
  installments: number;
} | null {
  let data = input as Record<string, unknown> | null;
  if (!data || typeof data !== "object") return null;

  const inner = data.formData;
  if (Array.isArray(inner)) {
    data = (inner[0] as Record<string, unknown>) ?? null;
  } else if (inner && typeof inner === "object") {
    data = inner as Record<string, unknown>;
  }

  if (!data || typeof data !== "object") return null;

  const pm =
    data.payment_method && typeof data.payment_method === "object"
      ? (data.payment_method as Record<string, unknown>)
      : {};

  const token = (typeof data.token === "string" && data.token) || (typeof pm.token === "string" && pm.token);
  if (!token) return null;

  const paymentMethodId =
    (typeof data.payment_method_id === "string" && data.payment_method_id) ||
    (typeof pm.id === "string" && pm.id) ||
    undefined;

  const issuerId = (typeof data.issuer_id === "string" && data.issuer_id) || undefined;

  const rawInst = data.installments ?? pm.installments;
  const parsed = typeof rawInst === "number" ? rawInst : Number(rawInst);
  const installments = Number.isFinite(parsed) ? Math.max(1, Math.floor(parsed)) : 1;

  return { token, paymentMethodId, issuerId, installments };
}

// PSE (bank_transfer): no trae token de tarjeta; trae payment_method_id ("pse")
// y el banco (financial_institution). Se extrae defensivamente.
function extractBankTransferData(input: unknown): {
  paymentMethodId?: string;
  financialInstitution?: string;
} | null {
  let data = input as Record<string, unknown> | null;
  if (!data || typeof data !== "object") return null;

  const inner = data.formData;
  if (Array.isArray(inner)) {
    data = (inner[0] as Record<string, unknown>) ?? null;
  } else if (inner && typeof inner === "object") {
    data = inner as Record<string, unknown>;
  }

  if (!data || typeof data !== "object") return null;

  const pm =
    data.payment_method && typeof data.payment_method === "object"
      ? (data.payment_method as Record<string, unknown>)
      : {};

  const paymentMethodId =
    (typeof data.payment_method_id === "string" && data.payment_method_id) ||
    (typeof pm.id === "string" && pm.id) ||
    (typeof pm.payment_method_id === "string" && pm.payment_method_id) ||
    undefined;

  const details = data.transaction_details as Record<string, unknown> | undefined;
  const rawBank =
    data.financial_institution ??
    pm.financial_institution ??
    details?.financial_institution;
  const financialInstitution =
    typeof rawBank === "string" ? rawBank : typeof rawBank === "number" ? String(rawBank) : undefined;

  return { paymentMethodId, financialInstitution };
}

export async function processCardPayment(
  orderId: string,
  paymentFormData: unknown,
  ipAddress?: string
): Promise<ProcessPaymentResult> {
  // 1. VALIDAR orderId (uuid generado en el servidor)
  const cleanOrderId = (orderId ?? "").trim();
  if (!UUID_RE.test(cleanOrderId)) {
    return { success: false, message: "La intención de pago no es válida." };
  }

  // 2. DETECTAR MÉTODO Y EXTRAER DATOS del formData del brick
  const selectedMethod = (paymentFormData as { selectedPaymentMethod?: string } | null)?.selectedPaymentMethod;
  const isPse = selectedMethod === "bank_transfer";

  let card: ReturnType<typeof extractCardData> = null;
  let bankTransfer: ReturnType<typeof extractBankTransferData> = null;

  if (isPse) {
    bankTransfer = extractBankTransferData(paymentFormData);
    if (!bankTransfer?.paymentMethodId || !bankTransfer.financialInstitution) {
      return { success: false, message: "No se recibieron los datos del banco (PSE). Inténtalo de nuevo." };
    }
  } else {
    card = extractCardData(paymentFormData);
    if (!card) {
      return { success: false, message: "No se recibió el token del medio de pago." };
    }
  }

  // 3. CARGAR LA ORDEN (service-role) — fuente de verdad del monto y del pagador.
  const supabase = createAdminClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      "id, external_reference, service_title, variant_label, amount_total, status, expires_at, payer_email, payer_first_name, payer_last_name, payer_doc_type, payer_doc_number"
    )
    .eq("id", cleanOrderId)
    .maybeSingle<OrderRow>();

  if (orderError || !order) {
    return { success: false, message: "La intención de pago no existe." };
  }

  // 3b. GUARDAS DE ESTADO (blinda el cobro: no pagar dos veces ni pagar vencido)
  if (order.status === "paid") {
    return { success: true, status: "approved", orderId: cleanOrderId, message: "El pago ya fue confirmado." };
  }
  if (order.status === "pending_payment") {
    return {
      success: false,
      code: "PENDING_PAYMENT",
      message: "El pago ya está en proceso de confirmación. Espera el resultado antes de reintentar.",
    };
  }

  // draft con expires_at vencido (o ya marcado expired por el cron) → expirado.
  const isExpired =
    order.status === "expired" ||
    (order.status === "draft" && !!order.expires_at && new Date(order.expires_at).getTime() < Date.now());

  if (isExpired) {
    if (order.status !== "expired") {
      await supabase.from("orders").update({ status: "expired" }).eq("id", cleanOrderId);
    }
    return {
      success: false,
      message: "La intención de pago expiró. Vuelve a intentar desde el inicio.",
    };
  }

  // 4. CREAR EL PAGO EN MERCADO PAGO (POST /v1/payments)
  const idempotencyKey = randomUUID();
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    return {
      success: false,
      message:
        "El cobro requiere una URL pública HTTPS configurada (NEXT_PUBLIC_APP_URL) para poder notificar a la pasarela.",
    };
  }

  const payer = {
    email: order.payer_email,
    first_name: order.payer_first_name,
    last_name: order.payer_last_name,
    identification: {
      type: MP_DOC_TYPES[order.payer_doc_type] ?? "Otro",
      number: order.payer_doc_number,
    },
    // PSE (Colombia) exige entity_type: "individual" (persona natural) o
    // "association" (persona jurídica). Derivado del tipo de documento.
    ...(isPse ? { entity_type: order.payer_doc_type === "NIT" ? "association" : "individual" } : {}),
  };

  const body: Record<string, unknown> = {
    transaction_amount: order.amount_total, // NUNCA confiar en el monto del cliente
    description: `${order.service_title} · ${order.variant_label}`,
    payer,
    external_reference: order.external_reference ?? cleanOrderId,
    notification_url: `${baseUrl}/api/webhooks/mercadopago`,
  };

  if (isPse && bankTransfer) {
    // PSE: sin token de tarjeta; se indica el banco (financial_institution).
    body.payment_method_id = bankTransfer.paymentMethodId;
    body.transaction_details = { financial_institution: bankTransfer.financialInstitution };
    // URL de retorno tras completar la transferencia en el banco (requerida por MP).
    body.callback_url = `${baseUrl}/checkout/success`;
  } else if (card) {
    body.token = card.token;
    body.payment_method_id = card.paymentMethodId;
    body.installments = card.installments;
    if (card.issuerId) body.issuer_id = card.issuerId;
  }

  // PSE (Colombia) exige additional_info.ip_address + payer con identificación.
  const additionalInfo: Record<string, unknown> = {};
  if (ipAddress) additionalInfo.ip_address = ipAddress;
  if (isPse) {
    // La identificación del pagador va a nivel payer (top-level), NO aquí
    // (MP rechaza additional_info.payer.identification).
    additionalInfo.payer = {
      first_name: order.payer_first_name,
      last_name: order.payer_last_name,
    };
  }
  if (Object.keys(additionalInfo).length > 0) {
    body.additional_info = additionalInfo;
  }

  // Diagnóstico PSE (MP): registrar los campos del request justo antes del POST.
  if (isPse) {
    const institution = (body.transaction_details as { financial_institution?: unknown } | undefined)
      ?.financial_institution;
    console.log(
      "[PSE-diagnostico] request:",
      JSON.stringify({
        ip_selected: ipAddress ?? "(ninguna)",
        financial_institution: institution,
        transaction_amount: body.transaction_amount,
        payment_method_id: body.payment_method_id,
        installments: body.installments ?? null,
      })
    );
  }

  let res: Response;
  try {
    res = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Error de red creando pago en MP:", err);
    return { success: false, message: "No se pudo conectar con la pasarela de pago. Inténtalo de nuevo." };
  }

  const mpBody = (await res.json().catch(() => null)) as
    | {
        id?: string | number;
        status?: string;
        status_detail?: string | null;
        transaction_amount?: number;
        payment_method_id?: string;
        payment_type_id?: string;
        message?: string;
        payment_method?: { redirect_url?: string; data?: { redirect_url?: string } };
        point_of_interaction?: { transaction_data?: { ticket_url?: string } };
        transaction_details?: { external_resource_url?: string };
      }
    | null;

  if (!res.ok || !mpBody || !mpBody.id) {
    console.error("MP rechazó el pago:", res.status, JSON.stringify(mpBody), "| order:", cleanOrderId);
    // Diagnóstico PSE (MP): correlación interna (cause[0].data) del fallo.
    const cause = (mpBody as { cause?: Array<{ code?: number | string; description?: string; data?: string }> } | null)?.cause;
    if (isPse && cause?.[0]) {
      console.error(
        "[PSE-diagnostico] failure:",
        JSON.stringify({ status: res.status, cause_code: cause[0].code, cause_data: cause[0].data })
      );
    }
    const mpMessage = (mpBody as { message?: string } | null)?.message;
    if (mpMessage) {
      return { success: false, message: String(mpMessage) };
    }
    return { success: false, message: "La pasarela rechazó el pago. Inténtalo de nuevo." };
  }

  const paymentId = String(mpBody.id);
  const mapped = mapPaymentStatus(mpBody.status ?? "");

  // URL de PSE (banco simulado) para completar la transferencia, si aplica.
  const redirectUrl =
    mpBody.payment_method?.data?.redirect_url ??
    mpBody.payment_method?.redirect_url ??
    mpBody.transaction_details?.external_resource_url ??
    mpBody.point_of_interaction?.transaction_data?.ticket_url ??
    undefined;

  // 5. ACTUALIZAR LA ORDEN (la orden NO retrocede desde 'paid'; §5).
  const now = new Date().toISOString();
  const patch: Record<string, string | null> = {};
  if (mapped) {
    patch.status = mapped.dbStatus;
    if (mapped.dbStatus === "paid") patch.paid_at = now;
    if (mapped.dbStatus === "rejected") patch.rejected_at = now;
    if (mapped.dbStatus === "refunded" || mapped.dbStatus === "partially_refunded") patch.refunded_at = now;
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      ...patch,
      idempotency_key: idempotencyKey,
      payer_ip_address: ipAddress,
      mp_status: mpBody.status ?? null,
      mp_status_detail: mpBody.status_detail ?? null,
      mp_payment_method: mpBody.payment_method_id ?? null,
      mp_raw: mpBody as unknown as object,
    })
    .eq("id", cleanOrderId);

  if (updateError) {
    console.error("Error actualizando orden tras pago:", updateError);
  }

  // 6. REGISTRAR EL INTENTO DE PAGO (1 fila por mp_payment_id).
  const { error: paymentUpsertError } = await supabase.from("order_payments").upsert(
    {
      order_id: cleanOrderId,
      mp_payment_id: paymentId,
      amount: order.amount_total,
      paid_amount:
        mapped?.dbStatus === "paid"
          ? Math.round(Number(mpBody.transaction_amount ?? order.amount_total))
          : null,
      status: mpBody.status ?? null,
      status_detail: mpBody.status_detail ?? null,
      payment_method: mpBody.payment_method_id ?? null,
      type: mpBody.payment_type_id ?? null,
    },
    { onConflict: "mp_payment_id" }
  );
  if (paymentUpsertError) {
    console.error(`Error en order_payments (order ${cleanOrderId}, payment ${paymentId}):`, paymentUpsertError);
  }

  // 7. EMAIL DE CONFIRMACIÓN (solo si quedó pagado; guarda anti-duplicados interna).
  if (mapped?.dbStatus === "paid") {
    void maybeSendConfirmation(cleanOrderId).catch((err) =>
      console.error("[email] Error en maybeSendConfirmation:", err)
    );
  }

  return {
    success: true,
    status: mpBody.status ?? "unknown",
    statusDetail: mpBody.status_detail ?? null,
    orderId: cleanOrderId,
    paymentId,
    redirectUrl,
    warning: paymentUpsertError
      ? `El pago se aprobó pero no se pudo registrar en order_payments: ${paymentUpsertError.message}`
      : undefined,
  };
}
