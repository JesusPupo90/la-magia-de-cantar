// lib/orders/mp-status.ts
// Mapeos compartidos entre el Server Action de pagos, el webhook y createOrder:
//   - Estado de Mercado Pago (payment.status) → order_status de la BD.
//   - Tipos de documento del formulario → valores que MP acepta (MCO/Colombia).

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

// MP: CC, CE, NIT, Otro. "PASAPORTE" no existe → va como "Otro".
export const MP_DOC_TYPES: Record<string, string> = {
  CC: "CC",
  CE: "CE",
  NIT: "NIT",
  PASAPORTE: "Otro",
};
