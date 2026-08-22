// app/actions/payments.ts
"use server";

import { headers } from "next/headers";
import { processCardPayment } from "@/lib/orders/process-payment";
import { firstPublicIp } from "@/lib/ip";

// El Payment Brick entrega el formData (con el token de la tarjeta); este
// Server Action lo reenvía al backend para crear el pago real en Mercado Pago.
export async function processPayment(orderId: string, paymentFormData: unknown) {
  // IP del cliente desde los headers (PSE en Colombia exige additional_info.ip_address).
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  const xri = h.get("x-real-ip");
  const cf = h.get("cf-connecting-ip");
  const ipAddress = firstPublicIp([xff, xri, cf]);

  // Diagnóstico PSE (MP): registrar headers e IP seleccionada.
  console.log(
    "[PSE-diagnostico] ip_raw_headers:",
    JSON.stringify({ "x-forwarded-for": xff, "x-real-ip": xri, "cf-connecting-ip": cf }),
    "| ip_selected:",
    ipAddress ?? "(ninguna)"
  );

  return processCardPayment(orderId, paymentFormData, ipAddress);
}
