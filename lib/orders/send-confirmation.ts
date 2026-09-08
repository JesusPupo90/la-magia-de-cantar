// lib/orders/send-confirmation.ts
// Sends the payment confirmation (welcome email) ONCE per order.
// Anti-duplicate guard: uses confirmation_sent_at as an atomic flag — only the
// first execution "wins" the conditional UPDATE and sends. Fire-and-forget to
// avoid blocking the HTTP response (spec §7).

import { createAdminClient } from "../supabase/admin";
import { sendPaymentConfirmation } from "../email";

export async function maybeSendConfirmation(orderId: string): Promise<void> {
  const supabase = createAdminClient();

  // Atomic claim: only the one that finds confirmation_sent_at NULL wins.
  const { data: winner, error } = await supabase
    .from("orders")
    .update({ confirmation_sent_at: new Date().toISOString() })
    .eq("id", orderId)
    .is("confirmation_sent_at", null)
    .select(
      "id, payer_email, payer_first_name, payer_last_name, service_title, variant_label, amount_total, preference_id"
    )
    .maybeSingle<{
      id: string;
      payer_email: string;
      payer_first_name: string;
      payer_last_name: string | null;
      service_title: string;
      variant_label: string;
      amount_total: number;
      preference_id: string | null;
    }>();

  if (error) {
    console.error("[email] Error marcando confirmation_sent_at:", error);
    return;
  }
  if (!winner) {
    return; // already sent (or the order doesn't exist)
  }

  // Real payment id (audit / detail for the buyer).
  const { data: paymentRow } = await supabase
    .from("order_payments")
    .select("mp_payment_id")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ mp_payment_id: string | null }>();

  void sendPaymentConfirmation({
    payerEmail: winner.payer_email,
    payerFirstName: winner.payer_first_name,
    payerLastName: winner.payer_last_name ?? undefined,
    serviceTitle: winner.service_title,
    variantLabel: winner.variant_label,
    amount: winner.amount_total,
    orderId: winner.id,
    paymentId: paymentRow?.mp_payment_id ?? winner.preference_id,
  }).catch((err) => console.error("[email] Error enviando confirmación:", err));
}
