// lib/orders/send-confirmation.ts
// Envía la confirmación de pago (email de bienvenida) UNA sola vez por orden.
// Guarda anti-duplicados: usa confirmation_sent_at como flag atómico — solo la
// primera ejecución "gana" el UPDATE condicional y envía. Fire-and-forget para
// no bloquear la respuesta HTTP (spec §7).

import { createAdminClient } from "../supabase/admin";
import { sendPaymentConfirmation } from "../email";

export async function maybeSendConfirmation(orderId: string): Promise<void> {
  const supabase = createAdminClient();

  // Claim atómico: solo el que encuentre confirmation_sent_at NULL gana.
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
    return; // ya se envió (o la orden no existe)
  }

  // ID de pago real (auditoría / detalle para el comprador).
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
