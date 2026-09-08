// app/actions/payments.ts
"use server";

import { headers } from "next/headers";
import { processCardPayment } from "@/lib/orders/process-payment";
import { firstPublicIp } from "@/lib/ip";

// The Payment Brick delivers the formData (with the card token); this
// Server Action forwards it to the backend to create the real payment on Mercado Pago.
export async function processPayment(orderId: string, paymentFormData: unknown) {
  // Client IP from the request headers (PSE in Colombia requires additional_info.ip_address).
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  const xri = h.get("x-real-ip");
  const cf = h.get("cf-connecting-ip");
  const ipAddress = firstPublicIp([xff, xri, cf]);

  // PSE diagnosis (MP): log headers and selected IP.
  console.log(
    "[PSE-diagnostico] ip_raw_headers:",
    JSON.stringify({ "x-forwarded-for": xff, "x-real-ip": xri, "cf-connecting-ip": cf }),
    "| ip_selected:",
    ipAddress ?? "(ninguna)"
  );

  return processCardPayment(orderId, paymentFormData, ipAddress);
}
