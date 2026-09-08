// lib/orders/mp-status.ts
// Shared mappings between the payment Server Action, the webhook and createOrder:
//   - Mercado Pago status (payment.status) → DB order_status.
//   - Document types from the form → values MP accepts (MCO/Colombia).

export function mapPaymentStatus(status: string): { dbStatus: string; detail?: string } | null {
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

// MP: CC, CE, NIT, Other. "PASAPORTE" doesn't exist → goes as "Otro".
export const MP_DOC_TYPES: Record<string, string> = {
  CC: "CC",
  CE: "CE",
  NIT: "NIT",
  PASAPORTE: "Otro",
};
