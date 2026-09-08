// scripts/test-create-order.ts
// Standalone harness: tests createOrder() without a form.
// Run:
//   npx tsx scripts/test-create-order.ts
// (loads .env.local manually; Node doesn't do it by default with tsx)

import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const file = resolve(process.cwd(), ".env.local");
  try {
    const content = readFileSync(file, "utf8");
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !(m[1] in process.env)) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // if .env.local doesn't exist, keep going with process.env
  }
}
loadEnv();

import { createOrder } from "../lib/orders/create-order";
import { createClient } from "@supabase/supabase-js";

// DB verification: uses service_role (bypasses RLS), same as the real app.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const baseInput = {
  serviceId: "kids-grupales",
  variantId: "kids-grupales__trimestral",
  studentFirstName: "Camila",
  studentLastName: "Pérez",
  studentAge: 7,
  studentNotes: "Es alérgica al polvo",
  payerEmail: "PAGADOR@testuser.com",
  payerFirstName: "Andrea",
  payerLastName: "Pérez",
  payerDocType: "CC" as const,
  payerDocNumber: "1010123456",
  payerPhone: "3001234567",
  habeasDataAccepted: true as const,
};

async function checkOrderInDb(orderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("id, external_reference, variant_id, service_title, variant_label, amount_total, status, preference_id, mp_status, idempotency_key")
    .eq("id", orderId)
    .maybeSingle();
  return { data, error };
}

async function runCase(name: string, input: unknown, existingOrderId?: string) {
  console.log(`\n=== ${name} ===`);
  try {
    const result = await createOrder(input as never, existingOrderId);
    console.log("result:", JSON.stringify(result, null, 2));

    if (result.success && result.orderId) {
      const db = await checkOrderInDb(result.orderId);
      console.log("BD:", JSON.stringify(db.data, null, 2));
      if (db.error) console.error("BD error:", db.error);
    }
    return result;
  } catch (err) {
    console.error("EXCEPCIÓN:", err);
    return null;
  }
}

async function main() {
  console.log("MP_ACCESS_TOKEN:", process.env.MP_ACCESS_TOKEN ? "presente" : "FALTA");
  console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ?? "FALTA");

  // 1. Happy path (creates order + preference on MP)
  const first = await runCase("1. Happy path (kids-grupales__trimestral)", baseInput);

  // 1b. Retry: must REUSE the same order (same order_id) and create a new preference.
  if (first?.success && first.orderId) {
    await runCase("1b. Reintento (reutiliza misma orden)", baseInput, first.orderId);
  }

  // 2. Nonexistent variant
  await runCase("2. Variante inexistente", {
    ...baseInput,
    variantId: "no-existe__x",
  });

  // 3. Mismatch variant ↔ service
  await runCase("3. Mismatch (variant de otro servicio)", {
    ...baseInput,
    serviceId: "piano",
  });

  // 4. Quote-only service (has no variants in DB → should never pay)
  await runCase("4. is_custom_quote (coaching-yanetsis, sin variantes)", {
    ...baseInput,
    serviceId: "coaching-yanetsis",
    variantId: "coaching-yanetsis__trimestral",
  });

  // 5. Honeypot
  await runCase("5. Honeypot lleno", {
    ...baseInput,
    honeypot: "soy-un-bot",
  });

  // 6. Habeas data false
  await runCase("6. Habeas data NO aceptado", {
    ...baseInput,
    habeasDataAccepted: false,
  });
}

main();
