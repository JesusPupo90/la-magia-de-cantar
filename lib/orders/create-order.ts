// lib/orders/create-order.ts
// Lógica central de creación de orden (Mercado Pago Checkout API — Orders).
// SIN "use server": es una función pura ejecutable desde Server Actions,
// Route Handlers o scripts de prueba (scripts/test-create-order.ts).

import { randomUUID } from "crypto";
import { ordenCompraSchema, type OrdenCompraInput } from "../schemas/orden.schema";
import { createAdminClient } from "../supabase/admin";

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  mpOrderId?: string;
  clientToken?: string;
  mpStatus?: string;
  mpStatusDetail?: string;
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

export async function createOrder(input: OrdenCompraInput): Promise<CreateOrderResult> {
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

  // 5. IDs (generados en el servidor — nunca del cliente)
  const orderId = randomUUID();
  const idempotencyKey = randomUUID();

  // 6. INSERT ORDEN (estado 'draft', external_reference = order id)
  const { error: insertError } = await supabase.from("orders").insert({
    id: orderId,
    external_reference: orderId,
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
    status: "draft",
    idempotency_key: idempotencyKey,
  });

  if (insertError) {
    console.error("Error insertando orden:", insertError);
    return {
      success: false,
      message: "Ocurrió un error al crear la orden. Inténtalo de nuevo.",
    };
  }

  // 7. CREAR ORDER EN MERCADO PAGO (POST /v1/orders)
  //    processing_mode "manual" SIN transactions (no requiere token de tarjeta):
  //    Bricks usa el client_token devuelto para procesar el pago del lado del cliente.
  //    FORMATO DE MONTO COP (validado en sandbox): string de dígitos SIN decimales.
  //    MP rechaza "2299000.00" (pattern) con property_value; acepta "2299000".
  //    ⚠️ MP NO devuelve client_token si la Order no incluye payer (validado en sandbox).
  const totalAmount = String(variant.price);

  const body = {
    type: "online",
    external_reference: orderId,
    processing_mode: "manual",
    total_amount: totalAmount,
    description: `${service.title} · ${variant.label}`,
    payer: {
      email: data.payerEmail,
      entity_type: "individual",
      first_name: data.payerFirstName,
      last_name: data.payerLastName,
      identification: {
        type: data.payerDocType,
        number: data.payerDocNumber,
      },
    },
    items: [
      {
        title: `${service.title} · ${variant.label}`,
        description: service.title,
        unit_price: totalAmount,
        quantity: 1,
        external_code: variant.id,
      },
    ],
  };

  let mpResponse: Response;
  try {
    mpResponse = await fetch("https://api.mercadopago.com/v1/orders", {
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
    console.error("Mercado Pago rechazó la order:", mpResponse.status, JSON.stringify(mpBody));
    return {
      success: false,
      message: "La pasarela rechazó la operación. Inténtalo de nuevo.",
    };
  }

  // 8. GUARDAR DATOS DE MP EN LA ORDEN
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      mp_order_id: mpBody.id,
      mp_status: mpBody.status ?? null,
      mp_status_detail: mpBody.status_detail ?? null,
      mp_raw: mpBody,
    })
    .eq("id", orderId);

  if (updateError) {
    console.error("Error actualizando datos de MP en la orden:", updateError);
  }

  return {
    success: true,
    orderId,
    mpOrderId: mpBody.id,
    clientToken: typeof mpBody.client_token === "string" ? mpBody.client_token : undefined,
    mpStatus: mpBody.status ?? undefined,
    mpStatusDetail: mpBody.status_detail ?? undefined,
  };
}
