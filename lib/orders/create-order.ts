// lib/orders/create-order.ts
// Lógica central de creación de orden + preferencia (Checkout Pro / Payment Brick).
// SIN "use server": es una función pura ejecutable desde Server Actions,
// Route Handlers o scripts de prueba (scripts/test-create-order.ts).

import { randomUUID } from "crypto";
import { ordenCompraSchema, type OrdenCompraInput } from "../schemas/orden.schema";
import { createAdminClient } from "../supabase/admin";

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  preferenceId?: string;
  amount?: number;
  payer?: {
    email: string;
    firstName: string;
    lastName: string;
  };
  message?: string;
  errors?: Record<string, string[]>;
}

interface VariantWithService {
  id: string;
  service_id: string;
  label: string;
  price: number;
  is_active: boolean;
  services: {
    id: string;
    title: string;
    is_custom_quote: boolean;
    is_active: boolean;
  } | null;
}

// Mapeo de tipos de documento del form → valores que MP acepta (MCO/Colombia).
// MP: CC, CE, NIT, Otro. "PASAPORTE" no existe → va como "Otro".
const MP_DOC_TYPES: Record<string, string> = {
  CC: "CC",
  CE: "CE",
  NIT: "NIT",
  PASAPORTE: "Otro",
};

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "https://pocket-proposed-rarely-recorded.trycloudflare.com" //"http://localhost:3000";
}

function amountForMp(price: number): number {
  // Checkout Pro (preferencias): unit_price es NUMBER en la unidad principal de la
  // moneda. COP no tiene decimales → se envía el entero (validado en sandbox, riesgo
  // off-by-100 según método de pago; ver docs/paymentSpecs.md §5).
  return price;
}

export async function createOrder(
  input: OrdenCompraInput,
  existingOrderId?: string
): Promise<CreateOrderResult> {
  // 1. VALIDACIÓN ZOD
  const validation = ordenCompraSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }
  const data = validation.data;

  // 2. 🍯 HONEYPOT: si un bot lo llenó, simulamos éxito sin procesar nada.
  if (data.honeypot && data.honeypot.trim() !== "") {
    return { success: true, message: "Orden simulada (honeypot)." };
  }

  // 2b. auto_return: "approved" exige back_urls HTTPS públicos (validado en sandbox:
  //     MP devuelve 400 invalid_auto_return si back_urls es http://localhost).
  //     Mantenemos auto_return SIEMPRE (no olvidarlo en producción) y solo exigimos
  //     que NEXT_PUBLIC_APP_URL sea HTTPS (en local: un túnel tipo ngrok).
  const baseUrl = getBaseUrl();
  if (!baseUrl.startsWith("https://")) {
    return {
      success: false,
      message:
        "El pago requiere una URL pública HTTPS. Configura NEXT_PUBLIC_APP_URL (por ejemplo con un túnel tipo ngrok) y reinicia el servidor.",
    };
  }

  const supabase = createAdminClient();

  // 3. CONSULTAR VARIANTE + SERVICIO (join) — fuente de verdad del precio.
  const { data: rows, error: queryError } = await supabase
    .from("service_variants")
    .select("id, service_id, label, price, is_active, services(id, title, is_custom_quote, is_active)")
    .eq("id", data.variantId)
    .limit(1)
    .maybeSingle<{ id: string; service_id: string; label: string; price: number; is_active: boolean; services: { id: string; title: string; is_custom_quote: boolean; is_active: boolean } | null }>();

  if (queryError || !rows) {
    return {
      success: false,
      message: "El plan seleccionado no existe.",
    };
  }

  const variant = rows as VariantWithService;
  const service = variant.services;

  // 4. VALIDACIONES DE SEGURIDAD (anti-manipulación, §1)
  if (!service) {
    return { success: false, message: "El servicio seleccionado no existe." };
  }
  if (service.id !== data.serviceId) {
    return { success: false, message: "El plan no pertenece al servicio seleccionado." };
  }
  if (service.is_custom_quote) {
    return { success: false, message: "Este servicio requiere cotización, no se procesa pago." };
  }
  if (!variant.is_active || !service.is_active) {
    return { success: false, message: "Este plan ya no está disponible." };
  }

  // 5. ID DE LA ORDEN (generado en el servidor — nunca del cliente)
  let orderId = existingOrderId?.trim() || "";

  const orderSnapshot = {
    variant_id: variant.id,
    service_title: service.title,
    variant_label: variant.label,
    amount_total: variant.price,
    currency: "COP",
    student_first_name: data.studentFirstName,
    student_last_name: data.studentLastName,
    student_age: data.studentAge ?? null,
    student_notes: data.studentNotes || null,
    payer_email: data.payerEmail,
    payer_first_name: data.payerFirstName,
    payer_last_name: data.payerLastName,
    payer_doc_type: data.payerDocType,
    payer_doc_number: data.payerDocNumber,
    payer_phone: data.payerPhone,
    payer_ip_address: data.payerIpAddress ?? null,
    habeas_data_accepted: true,
    habeas_data_accepted_at: new Date().toISOString(),
  };

  // 6. REUTILIZACIÓN DE ORDEN (fix: 1 orden por intención de compra, N intentos)
  //    Si el cliente reintenta, validamos que la orden exista y pertenezca a esta
  //    misma intención (mismo plan + mismo pagador) antes de reutilizarla.
  if (orderId) {
    const { data: existing, error: existingError } = await supabase
      .from("orders")
      .select("id, variant_id, payer_email, status, external_reference")
      .eq("id", orderId)
      .maybeSingle<{ id: string; variant_id: string; payer_email: string; status: string; external_reference: string | null }>();

    const reusable =
      !existingError &&
      existing &&
      existing.variant_id === data.variantId &&
      existing.payer_email.toLowerCase() === data.payerEmail.toLowerCase() &&
      ["draft", "rejected", "expired"].includes(existing.status);

    if (reusable) {
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          ...orderSnapshot,
          status: "draft",
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          paid_at: null,
          rejected_at: null,
          refunded_at: null,
        })
        .eq("id", orderId);

      if (updateError) {
        console.error("Error reutilizando orden:", updateError);
        return { success: false, message: "Ocurrió un error al crear la orden. Inténtalo de nuevo." };
      }
    } else {
      // La orden indicada no es reutilizable: creamos una nueva.
      orderId = randomUUID();
      const { error: insertError } = await supabase.from("orders").insert({
        id: orderId,
        external_reference: orderId,
        ...orderSnapshot,
        status: "draft",
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      });
      if (insertError) {
        console.error("Error insertando orden:", insertError);
        return { success: false, message: "Ocurrió un error al crear la orden. Inténtalo de nuevo." };
      }
    }
  } else {
    orderId = randomUUID();
    const { error: insertError } = await supabase.from("orders").insert({
      id: orderId,
      external_reference: orderId,
      ...orderSnapshot,
      status: "draft",
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });
    if (insertError) {
      console.error("Error insertando orden:", insertError);
      return { success: false, message: "Ocurrió un error al crear la orden. Inténtalo de nuevo." };
    }
  }

  // 7. CREAR PREFERENCIA EN MERCADO PAGO (POST /checkout/preferences)
  //    El Payment Brick se monta con preferenceId; MP procesa el pago y redirige a
  //    back_urls con payment_id/status/external_reference.
  const idempotencyKey = randomUUID();
  const unitPrice = amountForMp(variant.price);

  const body = {
    items: [
      {
        id: variant.id,
        title: `${service.title} · ${variant.label}`,
        description: service.title,
        quantity: 1,
        unit_price: unitPrice,
        currency_id: "COP",
      },
    ],
    external_reference: orderId,
    notification_url: `${baseUrl}/api/webhooks/mercadopago`,
    back_urls: {
      success: `${baseUrl}/checkout/success`,
      pending: `${baseUrl}/checkout/success`,
      failure: `${baseUrl}/checkout/failure`,
    },
    auto_return: "approved",
    payer: {
      email: data.payerEmail,
      first_name: data.payerFirstName,
      last_name: data.payerLastName,
      identification: {
        type: MP_DOC_TYPES[data.payerDocType] ?? "Otro",
        number: data.payerDocNumber,
      },
      phone: { number: data.payerPhone },
    },
  };

  let mpResponse: Response;
  try {
    mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(body),
    });
  } catch (fetchError) {
    console.error("Error de red llamando a Mercado Pago:", fetchError);
    return {
      success: false,
      message: "No se pudo conectar con la pasarela de pago. Inténtalo de nuevo.",
    };
  }

  const mpBody = await mpResponse.json().catch(() => null);

  if (!mpResponse.ok || !mpBody || typeof mpBody.id !== "string") {
    console.error(
      "Mercado Pago rechazó la preferencia:",
      mpResponse.status,
      JSON.stringify(mpBody),
      "| external_reference:",
      orderId
    );
    const mpError = (mpBody as { error?: string; message?: string } | null)?.error;
    const mpMessage = (mpBody as { message?: string } | null)?.message;
    if (mpError === "invalid_auto_return" || String(mpMessage).includes("back_url")) {
      return {
        success: false,
        message:
          "La pasarela requiere back_urls HTTPS. Configura NEXT_PUBLIC_APP_URL con una URL pública (https://...) y reinicia el servidor.",
      };
    }
    return {
      success: false,
      message: "La pasarela rechazó la operación. Inténtalo de nuevo.",
    };
  }

  // 8. GUARDAR DATOS DE MP EN LA ORDEN
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      idempotency_key: idempotencyKey,
      preference_id: mpBody.id,
      mp_status: mpBody.status ?? null,
      mp_raw: mpBody,
    })
    .eq("id", orderId);

  if (updateError) {
    console.error("Error actualizando datos de MP en la orden:", updateError);
  }

  return {
    success: true,
    orderId,
    preferenceId: mpBody.id,
    amount: variant.price,
    payer: {
      email: data.payerEmail,
      firstName: data.payerFirstName,
      lastName: data.payerLastName,
    },
  };
}
