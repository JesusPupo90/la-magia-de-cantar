import { readFileSync } from "fs";
const c = readFileSync(".env.local", "utf8");
for (const l of c.split("\n")) {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] = m[2];
}
import { randomUUID } from "crypto";

async function main() {
  const body = {
    type: "online",
    external_reference: "probe-" + randomUUID().slice(0, 8),
    processing_mode: "manual",
    total_amount: "2299000",
    payer: {
      email: "test@testuser.com",
      entity_type: "individual",
      first_name: "Juan",
      last_name: "Pérez",
      identification: { type: "CC", number: "1010123456" },
    },
  };
  const r = await fetch("https://api.mercadopago.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      "X-Idempotency-Key": randomUUID(),
    },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  console.log("status:", r.status);
  console.log("keys:", Object.keys(j).join(", "));
  console.log("client_token:", typeof j.client_token === "string" ? j.client_token.slice(0, 40) + "..." : j.client_token);
  console.log("id:", j.id);
  console.log("status:", j.status, "/", j.status_detail);
  if (!r.ok) console.log("errors:", JSON.stringify(j.errors ?? j));
}

main();
