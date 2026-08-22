// app/actions/payments.ts
"use server";

import { headers } from "next/headers";
import { processCardPayment } from "@/lib/orders/process-payment";

// El Payment Brick entrega el formData (con el token de la tarjeta); este
// Server Action lo reenvía al backend para crear el pago real en Mercado Pago.
export async function processPayment(orderId: string, paymentFormData: unknown) {
  // IP del cliente desde los headers (PSE en Colombia exige additional_info.ip_address).
  const h = await headers();
  const ipAddress =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    undefined;

  return processCardPayment(orderId, paymentFormData, ipAddress);
}
