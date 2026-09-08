// app/api/webhooks/mercadopago/route.ts
// Mercado Pago webhook (Checkout Pro / Payment Brick).
// Verifies X-Signature, idempotency in webhook_logs and reconciles the payment
// against orders.external_reference (== orders.id). Responds 200 fast.

import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapPaymentStatus } from "@/lib/orders/mp-status";
import { maybeSendConfirmation } from "@/lib/orders/send-confirmation";

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

export async function POST(request: Request) {
  const rawBody = await request.text();
  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  // 1. Signature verification (§2)
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

  // 2. Idempotency: if this event was already processed, respond 200 without repeating.
  const { data: existingLog } = await supabase
    .from("webhook_logs")
    .select("processed")
    .eq("event_id", eventId)
    .maybeSingle<{ processed: boolean }>();

  if (existingLog?.processed) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  // Log the event (still unprocessed).
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

  // 3. We only care about payment notifications.
  if (topic !== "payment" || !resourceId) {
    await supabase.from("webhook_logs").update({ processed: true }).eq("event_id", eventId);
    return NextResponse.json({ ok: true });
  }

  // 4. Fetch the payment detail (source of truth).
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

  // 5. Locate the order by external_reference == orders.id.
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

  // 6. Amount reconciliation (anti-fraud §2): the payment must match the DB price.
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

  // 7. Update status (the order does NOT move back from paid to previous states; §2).
  const now = new Date().toISOString();
  const statusPatch: Record<string, string | null> = {};

  if (mapped) {
    if (order.status === "paid" && !["paid", "refunded", "partially_refunded"].includes(mapped.dbStatus)) {
      // Late rejection/pending event on an already paid order → ignore.
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

  // 8. Log the payment attempt in order_payments (1 row per MP payment).
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
    console.error(`Error en order_payments (order ${order.id}, payment ${resourceId}):`, paymentUpsertError);
  }

  await supabase.from("webhook_logs").update({ processed: true }).eq("event_id", eventId);

  // Confirmation email if the order ended up paid (internal anti-duplicate guard).
  if (mapped?.dbStatus === "paid") {
    void maybeSendConfirmation(order.id).catch((err) =>
      console.error("[email] Error en maybeSendConfirmation:", err)
    );
  }

  return NextResponse.json({ ok: true });
}

// MP sometimes sends a GET as the webhook subscription check.
export async function GET() {
  return NextResponse.json({ ok: true });
}
