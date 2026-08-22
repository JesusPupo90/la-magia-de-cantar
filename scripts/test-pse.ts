// scripts/test-pse.ts
// Diagnóstico (temporal): PSE (bank_transfer) en sandbox de MP.
// Itera variantes del body contra POST /v1/payments para hallar la que MP acepta.
// Uso: npx tsx scripts/test-pse.ts

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
    // noop
  }
}
loadEnv();

const token = process.env.MP_ACCESS_TOKEN;
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://example.com";
const PSE_AMOUNT = 100000;
const PAYER_EMAIL = "comprador.test@example.com";

type PseVariant = { name: string; bank: string; topNames: boolean; extraPayer: boolean; amount?: number };

const VARIANTS: PseVariant[] = [
  { name: "V1 sin nombres en payer top, payer en additional_info", bank: "1007", topNames: false, extraPayer: true },
  { name: "V2 igual que el flujo actual (nombres en top)", bank: "1007", topNames: true, extraPayer: true },
  { name: "V3 otro banco (Davivienda 1051), sin nombres en top", bank: "1051", topNames: false, extraPayer: true },
  { name: "V4 sin additional_info.payer, solo ip", bank: "1007", topNames: true, extraPayer: false },
  { name: "V5 nequi (otro bank_transfer sin banco)", bank: "nequi", topNames: true, extraPayer: true },
  { name: "V6 PSE monto 1000", bank: "1007", topNames: false, extraPayer: true, amount: 1000 },
];

function makeBody(v: PseVariant): Record<string, unknown> {
  const payer: Record<string, unknown> = {
    email: PAYER_EMAIL,
    entity_type: "individual",
    identification: { type: "CC", number: "1012345678" },
  };
  if (v.topNames) {
    payer.first_name = "Camila";
    payer.last_name = "Pérez";
  }

  const additionalInfo: Record<string, unknown> = { ip_address: "190.0.0.1" };
  if (v.extraPayer) {
    additionalInfo.payer = { first_name: "Camila", last_name: "Pérez" };
  }

  const isNequi = v.bank === "nequi";
  return {
    transaction_amount: v.amount ?? PSE_AMOUNT,
    description: "Pago de prueba PSE",
    payment_method_id: isNequi ? "nequi" : "pse",
    ...(isNequi ? {} : { transaction_details: { financial_institution: v.bank } }),
    callback_url: `${baseUrl}/checkout/success`,
    additional_info: additionalInfo,
    payer,
    external_reference: `test-pse-${v.bank}-${Date.now()}`,
    notification_url: `${baseUrl}/api/webhooks/mercadopago`,
  };
}

async function run() {
  console.log("MP_ACCESS_TOKEN:", token ? token.slice(0, 12) + "..." : "FALTA");
  console.log("baseUrl:", baseUrl);
  for (const v of VARIANTS) {
    const body = makeBody(v);
    console.log(`\n=== ${v.name} ===`);
    console.log("body:", JSON.stringify(body));
    try {
      const res = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Idempotency-Key": `${Date.now()}-${v.bank}-${v.topNames ? 1 : 0}-${v.extraPayer ? 1 : 0}`,
        },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
      console.log("HTTP", res.status);
      const status = data?.status;
      const statusDetail = data?.status_detail;
      const redirect = (data as { payment_method?: { data?: { redirect_url?: string } } })?.payment_method?.data?.redirect_url;
      console.log("status:", status, "| detail:", statusDetail, "| redirect:", redirect ? "SI" : "NO");
      if (res.status >= 400) {
        console.log("error:", JSON.stringify(data).slice(0, 400));
      }
    } catch (e) {
      console.log("ERROR:", (e as Error).message);
    }
  }
}

run();
