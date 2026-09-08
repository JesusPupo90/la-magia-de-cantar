// lib/orders/create-order.ts
// Central order + preference creation logic (Checkout Pro / Payment Brick).
// WITHOUT "use server": it's a pure function callable from Server Actions,
// Route Handlers or test scripts (scripts/test-create-order.ts).

import { randomUUID } from "crypto";
import { ordenCompraSchema, type OrdenCompraInput } from "../schemas/orden.schema";
import { createAdminClient } from "../supabase/admin";
import { MP_DOC_TYPES } from "./mp-status";

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
  code?: string;
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

// Mapping of form document types → values MP accepts (MCO/Colombia):
// see MP_DOC_TYPES in ./mp-status (shared with payment processing).

function getBaseUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (url) return url;
// Dev keeps a local fallback tunnel. In production there's NO fallback:
// if NEXT_PUBLIC_APP_URL is missing the payment is blocked with a clear error (the
// notification_url/back_urls must never point to a dead URL).
  if (process.env.NODE_ENV !== "production") {
    return "https://pocket-proposed-rarely-recorded.trycloudflare.com";
  }
  return null;
}

function amountForMp(price: number): number {
  // Checkout Pro (preferences): unit_price is NUMBER in the currency's main unit.
  // COP has no decimals → the integer is sent (validated in sandbox, off-by-100
  // risk depending on payment method; see docs/paymentSpecs.md §5).
  return price;
}

export async function createOrder(
  input: OrdenCompraInput,
  existingOrderId?: string
): Promise<CreateOrderResult> {
  // 1. ZOD VALIDATION
  const validation = ordenCompraSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }
  const data = validation.data;

  // 2. HONEYPOT: if a bot filled it, simulate success without processing anything.
  if (data.honeypot && data.honeypot.trim() !== "") {
    return { success: true, message: "Orden simulada (honeypot)." };
  }

// 2b. auto_return: "approved" requires public HTTPS back_urls (validated in sandbox:
//     MP returns 400 invalid_auto_return if back_urls is http://localhost).
//     We keep auto_return ALWAYS (don't forget it in production) and only require
//     NEXT_PUBLIC_APP_URL to be HTTPS (locally: an ngrok-style tunnel).
  const baseUrl = getBaseUrl();
  if (!baseUrl || !baseUrl.startsWith("https://")) {
    return {
      success: false,
      message:
        "El pago requiere una URL pública HTTPS. Configura NEXT_PUBLIC_APP_URL (por ejemplo con un túnel tipo ngrok) y reinicia el servidor.",
    };
  }

  const supabase = createAdminClient();

  // 3. QUERY VARIANT + SERVICE (join) — source of truth for the price.
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

  // 4. SECURITY VALIDATIONS (anti-manipulation, §1)
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

  // 5. ORDER ID (generated on the server — never from the client)
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

  // 6. ORDER REUSE (fix: 1 order per purchase intent, N attempts)
  //    On retry we validate the order exists and belongs to this same intent
  //    (same plan + same payer) before reusing it.
  if (orderId) {
    const { data: existing, error: existingError } = await supabase
      .from("orders")
      .select("id, variant_id, payer_email, status, external_reference")
      .eq("id", orderId)
      .maybeSingle<{ id: string; variant_id: string; payer_email: string; status: string; external_reference: string | null }>();

    const sameIntent =
      !existingError &&
      !!existing &&
      existing.variant_id === data.variantId &&
      existing.payer_email.toLowerCase() === data.payerEmail.toLowerCase();

    // If there's already a payment in progress (e.g. unconfirmed PSE/cash) for this
    // same intent, NO new order is opened: avoids double charging (shield §3).
    if (sameIntent && existing!.status === "pending_payment") {
      return {
        success: false,
        code: "PENDING_PAYMENT",
        message:
          "Ya hay un pago en proceso de confirmación para esta compra. Espera el resultado antes de intentarlo de nuevo.",
      };
    }

    const reusable = sameIntent && ["draft", "rejected", "expired"].includes(existing!.status);

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
      // The given order is not reusable: we create a new one.
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

  // 7. CREATE PREFERENCE AT MERCADO PAGO (POST /checkout/preferences)
  //    The Payment Brick mounts with preferenceId; MP processes the payment and redirects to
  //    back_urls with payment_id/status/external_reference.
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

  // 8. SAVE MP DATA ON THE ORDER
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
