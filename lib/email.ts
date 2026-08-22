import type { CotizacionEmpresaInput } from "@/lib/schemas/cotizacion.schema";

const RESEND_API_URL = "https://api.resend.com/emails";

// Resend acepta una string o un array de strings en `to`. Si alguien pasa una
// string con comas (p. ej. desde CLI), la normalizamos a array.
function normalizeRecipients(value: string | string[] | undefined | null): string | string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value.map((v) => v.trim()).filter(Boolean);
  return value.includes(",") ? value.split(",").map((v) => v.trim()).filter(Boolean) : value;
}

// FROM con nombre visible (mejora confianza/entrega). Si RESEND_FROM_EMAIL ya
// trae "Nombre <email>", se respeta tal cual.
const FROM_DISPLAY_NAME = "La Magia de Cantar";

function buildFrom(): string | undefined {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) return undefined;
  return from.includes("<") ? from : `${FROM_DISPLAY_NAME} <${from}>`;
}

function field(label: string, value?: string) {
  if (!value || value.trim() === "") return "";
  return `<p><strong>${label}:</strong> ${value.replace(/</g, "&lt;")}</p>`;
}

function buildQuoteHtml(data: CotizacionEmpresaInput) {
  return `
    <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#111;max-width:600px;margin:0 auto;">
      <h2 style="margin:0 0 8px;">Nueva solicitud de cotización</h2>
      <p style="margin:0 0 16px;color:#555;">Se recibió una nueva solicitud en la página de Empresas e Instituciones.</p>
      <hr style="border:none;border-top:2px solid #eee;margin:16px 0;" />
      <h3 style="margin:0 0 8px;">Datos de la entidad</h3>
      ${field("Tipo de entidad", data.entityType)}
      ${field("Nombre de la empresa", data.companyName)}
      ${field("Ciudad", data.city)}
      <h3 style="margin:16px 0 8px;">Datos de la capacitación</h3>
      ${field("Lugar", data.locationType)}
      ${field("Participantes", data.participantsRange)}
      ${field("Servicio de interés", data.serviceInterest)}
      ${field("Objetivo", data.objective)}
      ${field("Fecha tentativa", data.tentativeDate)}
      ${field("Duración deseada", data.desiredDuration)}
      <h3 style="margin:16px 0 8px;">Contacto</h3>
      ${field("Nombre", data.contactName)}
      ${field("Cargo", data.jobTitle)}
      ${field("Correo", data.email)}
      ${field("Teléfono / WhatsApp", data.phone)}
      ${field("Mensaje", data.message)}
    </div>
  `;
}

export async function sendQuoteNotification(data: CotizacionEmpresaInput, toOverride?: string | string[]) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = normalizeRecipients(toOverride) ?? process.env.CONTACT_NOTIFICATION_EMAIL;
  const from = buildFrom();

  if (!apiKey || !to || !from) {
    console.warn(
      "[email] Notificación omitida: configura RESEND_API_KEY, RESEND_FROM_EMAIL y CONTACT_NOTIFICATION_EMAIL en .env.local para activarla."
    );
    return;
  }

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Nueva solicitud de cotización — ${data.companyName}`,
      html: buildQuoteHtml(data),
    }),
  });

  if (!res.ok) {
    console.error("[email] Error al enviar la notificación:", await res.text());
  }
}

export interface PaymentConfirmationData {
  payerEmail: string;
  payerFirstName: string;
  payerLastName?: string;
  serviceTitle: string;
  variantLabel: string;
  amount: number;
  orderId: string;
  paymentId?: string | null;
}

function esc(v: string | undefined | null): string {
  return (v ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function detailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 0;font-size:13px;color:#555;width:45%;">${esc(label)}</td>
      <td style="padding:8px 0;font-size:13px;color:#111;font-weight:bold;">${esc(value)}</td>
    </tr>`;
}

function buildPaymentConfirmationHtml(data: PaymentConfirmationData) {
  const amount = (data.amount ?? 0).toLocaleString("es-CO");
  const fullName = [data.payerFirstName, data.payerLastName].filter(Boolean).join(" ");
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;background-color:#FFFBEB;padding:32px 16px;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border:3px solid #000000;border-radius:16px;overflow:hidden;">
        <div style="background:#FDE68A;border-bottom:3px solid #000000;padding:24px;text-align:center;">
          <div style="font-size:20px;font-weight:900;letter-spacing:1px;color:#000;text-transform:uppercase;">La Magia de Cantar</div>
          <div style="font-size:14px;color:#111;margin-top:6px;font-weight:bold;">¡Gracias por tu compra!</div>
        </div>
        <div style="padding:24px;">
          <p style="margin:0 0 12px;font-size:14px;color:#111;">Hola <strong>${esc(fullName)}</strong>,</p>
          <p style="margin:0 0 16px;font-size:14px;color:#111;line-height:1.6;">
            Hemos recibido tu pago correctamente. Tu cupo está asegurado en <strong>La Magia de Cantar</strong>. ¡Estamos felices de que empieces este camino!
          </p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;border:2px solid #111;border-radius:12px;">
            <tbody>
              ${detailRow("Servicio", data.serviceTitle)}
              ${detailRow("Plan", data.variantLabel)}
              ${detailRow("Monto", `$${amount} COP`)}
              ${detailRow("Número de orden", data.orderId)}
              ${data.paymentId ? detailRow("ID de pago", data.paymentId) : ""}
            </tbody>
          </table>
          <h3 style="margin:20px 0 8px;font-size:15px;color:#111;text-transform:uppercase;">¿Qué sigue ahora?</h3>
          <ul style="margin:0 0 16px;padding-left:20px;font-size:14px;color:#111;line-height:1.7;">
            <li><strong>Nuestro equipo te contactará</strong> en las próximas horas para darte la bienvenida y resolver tus dudas.</li>
            <li><strong>Coordinarás tu agenda</strong> para tu primera sesión o tu punto de inicio.</li>
            <li><strong>Prepárate para cantar:</strong> revisa tu correo y tu WhatsApp para las instrucciones de ingreso.</li>
          </ul>
          <p style="margin:0 0 8px;font-size:13px;color:#555;">
            Si tienes dudas antes de iniciar, escríbenos por WhatsApp o a <a href="mailto:contacto@lamagiadecantar.co" style="color:#7C3AED;">contacto@lamagiadecantar.co</a>.
          </p>
        </div>
        <div style="background:#FDE68A;border-top:3px solid #000000;padding:16px 24px;text-align:center;font-size:11px;color:#111;">
          La Magia de Cantar · Bogotá, Colombia · <a href="mailto:contacto@lamagiadecantar.co" style="color:#111;">contacto@lamagiadecantar.co</a>
        </div>
      </div>
    </div>
  `;
}

export async function sendPaymentConfirmation(data: PaymentConfirmationData, toOverride?: string | string[]) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = buildFrom();
  const to = normalizeRecipients(toOverride) ?? data.payerEmail;

  if (!apiKey || !from || !to) {
    console.warn(
      "[email] Confirmación omitida: configura RESEND_API_KEY y RESEND_FROM_EMAIL en .env.local para activarla."
    );
    return;
  }

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "¡Gracias por tu compra en La Magia de Cantar!",
      html: buildPaymentConfirmationHtml(data),
    }),
  });

  if (!res.ok) {
    console.error("[email] Error al enviar la confirmación:", await res.text());
  }
}
