// app/api/webhooks/mercadopago/route.ts
// Webhook de Mercado Pago (Checkout Pro / Payment Brick).
// Verifica X-Signature, idempotencia en webhook_logs y reconcilia el pago
// contra orders.external_reference (== orders.id). Responde 200 rápido.

import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

interface MpNotification {
  id?: number | string;
  type?: string;
  action?: string;
  data?: { id?: string | number };
}

interface MpPayment {
  external_reference?: string | null;
  status?: string;
  status_detail?: string | null;
  transaction_amount?: number;
  payment_method_id?: string;
  payment_type_id?: string;
}

async function verifySignature(rawBody: string, xSignature: string | null, xRequestId: string | null): Promise<boolean> {
  if (!xSignature || !xRequestId) return false;
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    console.error("MP_WEBHOOK_SECRET no configurado.");
    return false;
  }

  const params = new URLSearchParams(xSignature.replace(/,/g, "&"));
  const ts = params.get("ts");
  const v1 = params.get("v1");
  if (!ts || !v1) return false;

  const manifest = `id:${(JSON.parse(rawBody) as MpNotification).data?.id ?? ""};request-id:${xRequestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const v1Buf = Buffer.from(v1, "utf8");
  if (expectedBuf.length !== v1Buf.length) return false;

  return timingSafeEqual(expectedBuf, v1Buf);
}

function mapPaymentStatus(status: string): { dbStatus: string; detail?: string } | null {
  switch (status) {
    case "approved":
      return { dbStatus: "paid" };
    case "in_process":
    case "pending":
      return { dbStatus: "pending_payment" };
    case "rejected":
    case "cancelled":
      return { dbStatus: "rejected" };
    case "refunded":
      return { dbStatus: "refunded" };
    case "partially_refunded":
      return { dbStatus: "partially_refunded" };
    default:
      return null;
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  // 1. Verificación de firma (§2)
  const valid = await verifySignature(rawBody, xSignature, xRequestId);
  if (!valid) {
    console.warn("Webhook rechazado: firma inválida.");
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let payload: MpNotification;
  try {
    payload = JSON.parse(rawBody) as MpNotification;
  } catch {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const eventId = String(payload.id ?? `${payload.type ?? payload.action ?? "unknown"}:${payload.data?.id ?? ""}`);
  const topic = payload.type ?? payload.action?.split(".")[0] ?? "unknown";
  const resourceId = String(payload.data?.id ?? "");

  // 2. Idempotencia: si este evento ya fue procesado, responder 200 sin repetir.
  const { data: existingLog } = await supabase
    .from("webhook_logs")
    .select("processed")
    .eq("event_id", eventId)
    .maybeSingle<{ processed: boolean }>();

  if (existingLog?.processed) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  // Registrar el evento (aún sin procesar).
  const { error: logInsertError } = await supabase.from("webhook_logs").insert({
    event_id: eventId,
    topic,
    resource_id: resourceId,
    payload: payload as unknown as object,
    processed: false,
  });
  if (logInsertError && !String(logInsertError.message).includes("duplicate")) {
    console.error("Error registrando webhook_logs:", logInsertError);
  }

  // 3. Solo nos importan notificaciones de pago.
  if (topic !== "payment" || !resourceId) {
    await supabase.from("webhook_logs").update({ processed: true }).eq("event_id", eventId);
    return NextResponse.json({ ok: true });
  }

  // 4. Obtener el detalle del pago (fuente de verdad).
  let payment: MpPayment | null = null;
  try {
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${resourceId}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    });
    if (res.ok) {
      payment = (await res.json()) as MpPayment | null;
    }
  } catch (err) {
    console.error("Error consultando pago en MP:", err);
  }

  if (!payment?.external_reference) {
    console.warn("Webhook sin external_reference (pago no vinculado a orden).", resourceId);
    await supabase.from("webhook_logs").update({ processed: true }).eq("event_id", eventId);
    return NextResponse.json({ ok: true });
  }

  // 5. Localizar la orden por external_reference == orders.id.
  const { data: order } = await supabase
    .from("orders")
    .select("id, status, amount_total")
    .eq("external_reference", payment.external_reference)
    .maybeSingle<{ id: string; status: string; amount_total: number }>();

  if (!order) {
    console.warn("Webhook con external_reference desconocida:", payment.external_reference);
    await supabase.from("webhook_logs").update({ processed: true }).eq("event_id", eventId);
    return NextResponse.json({ ok: true });
  }

  // 6. Reconciliación de monto (anti-fraude §2): el pago debe coincidir con el precio de BD.
  const expectedAmount = order.amount_total;
  const actualAmount = Math.round(Number(payment.transaction_amount ?? 0));

  const mapped = mapPaymentStatus(payment.status ?? "");

  if (mapped?.dbStatus === "paid" && actualAmount !== expectedAmount) {
    console.error(
      `⚠️ RECONCILIACIÓN FALLÓ: orden ${order.id} esperaba ${expectedAmount}, pago ${resourceId} por ${actualAmount}. Revisión manual.`
    );
    await supabase.from("webhook_logs").update({ processed: true }).eq("event_id", eventId);
    return NextResponse.json({ ok: true });
  }

  // 7. Actualizar estado (la orden NO retrocede de paid a estados previos; §2).
  const now = new Date().toISOString();
  const statusPatch: Record<string, string | null> = {};

  if (mapped) {
    if (order.status === "paid" && !["paid", "refunded", "partially_refunded"].includes(mapped.dbStatus)) {
      // Evento tardío de rechazo/pendiente sobre orden pagada → ignorar.
    } else {
      statusPatch.status = mapped.dbStatus;
      if (mapped.dbStatus === "paid") statusPatch.paid_at = now;
      if (mapped.dbStatus === "rejected") statusPatch.rejected_at = now;
      if (mapped.dbStatus === "refunded" || mapped.dbStatus === "partially_refunded") statusPatch.refunded_at = now;
    }
  }

  await supabase
    .from("orders")
    .update({
      ...statusPatch,
      mp_status: payment.status ?? null,
      mp_status_detail: payment.status_detail ?? null,
      mp_payment_method: payment.payment_method_id ?? null,
      mp_raw: payment as unknown as object,
    })
    .eq("id", order.id);

  // 8. Registrar el intento de pago en order_payments (1 fila por payment MP).
  const { error: paymentUpsertError } = await supabase.from("order_payments").upsert(
    {
      order_id: order.id,
      mp_payment_id: resourceId,
      amount: expectedAmount,
      paid_amount: mapped?.dbStatus === "paid" ? actualAmount : null,
      status: payment.status ?? null,
      status_detail: payment.status_detail ?? null,
      payment_method: payment.payment_method_id ?? null,
      type: payment.payment_type_id ?? null,
    },
    { onConflict: "mp_payment_id" }
  );
  if (paymentUpsertError) {
    console.error("Error en order_payments:", paymentUpsertError);
  }

  await supabase.from("webhook_logs").update({ processed: true }).eq("event_id", eventId);

  return NextResponse.json({ ok: true });
}

// MP a veces envía GET como verificación de suscripción del webhook.
export async function GET() {
  return NextResponse.json({ ok: true });
}
