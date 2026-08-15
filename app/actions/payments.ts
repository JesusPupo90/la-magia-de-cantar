// app/actions/payments.ts
"use server";

import { processCardPayment } from "@/lib/orders/process-payment";

// El Payment Brick entrega el formData (con el token de la tarjeta); este
// Server Action lo reenvía al backend para crear el pago real en Mercado Pago.
export async function processPayment(orderId: string, paymentFormData: unknown) {
  return processCardPayment(orderId, paymentFormData);
}
