// scripts/test-payment-email.ts
// Harness standalone: prueba sendPaymentConfirmation (email de bienvenida)
// con datos de muestra o con una orden real ya pagada — SIN hacer pagos.
// Uso:
//   npx tsx scripts/test-payment-email.ts [email1 email2 ...] [--from-db <orderId>]
// - Sin args: envía a payerEmail de la muestra (o de la orden si --from-db).
// - Con emails: los usa como destinatarios (para pruebas; no se commitean).
// - --from-db <orderId>: carga una orden real pagada y reenvía su confirmación.
// Carga .env.local manualmente (Node no lo hace por defecto con tsx).

import { readFileSync } from "fs";
import { resolve } from "path";
import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

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
    // si no existe .env.local, seguimos con process.env
  }
}
loadEnv();

import { sendPaymentConfirmation } from "../lib/email";

const args = process.argv.slice(2);
const recipients = args.filter((a) => !a.startsWith("--"));
const to = recipients.length ? recipients : undefined;

const dbIdx = args.indexOf("--from-db");
const fromDbOrderId = dbIdx >= 0 ? args[dbIdx + 1] : undefined;

const sample = {
  payerEmail: "comprador@ejemplo.com",
  payerFirstName: "Camila",
  payerLastName: "Pérez",
  serviceTitle: "Asesoría con Yanetsis",
  variantLabel: "Sesión única",
  amount: 179000,
  orderId: randomUUID(),
  paymentId: "PRUEBA-123",
};

async function main() {
  if (fromDbOrderId) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        "id, payer_email, payer_first_name, payer_last_name, service_title, variant_label, amount_total"
      )
      .eq("id", fromDbOrderId)
      .maybeSingle();
    if (error || !order) {
      console.error("Orden no encontrada:", fromDbOrderId, error?.message ?? "");
      return;
    }
    const { data: pay } = await supabase
      .from("order_payments")
      .select("mp_payment_id")
      .eq("order_id", fromDbOrderId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    await sendPaymentConfirmation(
      {
        payerEmail: order.payer_email,
        payerFirstName: order.payer_first_name,
        payerLastName: order.payer_last_name ?? undefined,
        serviceTitle: order.service_title,
        variantLabel: order.variant_label,
        amount: order.amount_total,
        orderId: order.id,
        paymentId: pay?.mp_payment_id ?? null,
      },
      to
    );
    console.log("Confirmación enviada para la orden real:", order.id, "→", to ?? order.payer_email);
  } else {
    await sendPaymentConfirmation(sample, to);
    console.log("Confirmación de MUESTRA enviada →", to ?? sample.payerEmail);
  }
  console.log("Revisa el dashboard de Resend (status delivered) y la bandeja.");
}

main();
