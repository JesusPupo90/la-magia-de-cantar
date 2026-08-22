// scripts/test-resend.ts
// Harness standalone: prueba sendQuoteNotification (email B2B) sin pagos.
// Uso:
//   npx tsx scripts/test-resend.ts [email1 email2 ...]
// (sin emails usa CONTACT_NOTIFICATION_EMAIL del .env.local)
// Carga .env.local manualmente (Node no lo hace por defecto con tsx).

import { readFileSync } from "fs";
import { resolve } from "path";
import type { CotizacionEmpresaInput } from "../lib/schemas/cotizacion.schema";

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

import { sendQuoteNotification } from "../lib/email";

const recipients = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const to = recipients.length ? recipients : undefined;

const sample: CotizacionEmpresaInput = {
  entityType: "Empresa",
  companyName: "Ejemplo S.A.S.",
  city: "Bogotá",
  locationType: "Presencial",
  participantsRange: "10-20",
  serviceInterest: "Taller de canto para equipos",
  objective: "Fortalecer la confianza y la comunicación del equipo",
  tentativeDate: "2026-09-15",
  desiredDuration: "4 horas",
  contactName: "Ana Martínez",
  jobTitle: "Gerente de Talento",
  email: "ana@empresa.com",
  phone: "+57 300 000 0000",
  message: "Mensaje de prueba para verificar la notificación B2B.",
};

async function main() {
  console.log("Destinatario(s):", to ?? "(CONTACT_NOTIFICATION_EMAIL del env)");
  await sendQuoteNotification(sample, to);
  console.log(
    "Email B2B enviado (o no-op si faltan RESEND_API_KEY / RESEND_FROM_EMAIL). Revisa el dashboard de Resend y la bandeja."
  );
}

main();
