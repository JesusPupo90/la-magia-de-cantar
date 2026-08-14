// app/actions/ordenes.ts
"use server";

import { createOrder } from "@/lib/orders/create-order";
import type { OrdenCompraInput } from "@/lib/schemas/orden.schema";

export async function submitOrder(input: OrdenCompraInput, orderId?: string) {
  return createOrder(input, orderId);
}
