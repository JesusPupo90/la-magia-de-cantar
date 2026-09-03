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

function esc(v: string | undefined | null): string {
  return (v ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Logo oficial del sitio (oscuro → legible sobre fondo blanco).
const BRAND_LOGO =
  '<img src="https://www.lamagiadecantar.co/assets/dark-logo.png" alt="La Magia de Cantar" width="200" height="113" style="display:block;border:0;width:200px;height:113px;margin:0 auto;" />';

function detailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 14px;font-size:13px;color:#6b7280;width:45%;border-bottom:1px solid #e5e7eb;">${esc(label)}</td>
      <td style="padding:10px 14px;font-size:13px;color:#111827;font-weight:700;border-bottom:1px solid #e5e7eb;">${esc(value)}</td>
    </tr>`;
}

// ============================================================================
// B2B — NOTIFICACIÓN INTERNA (para el equipo/la clienta). Sobrio/formal, blanco.
// ============================================================================

function buildQuoteHtml(data: CotizacionEmpresaInput) {
  const rows = [
    ["Tipo de entidad", data.entityType],
    ["Nombre de la empresa", data.companyName],
    ["Ciudad", data.city],
    ["Lugar", data.locationType],
    ["Participantes", data.participantsRange],
    ["Servicio de interés", data.serviceInterest],
    ["Objetivo", data.objective],
    ["Fecha tentativa", data.tentativeDate],
    ["Duración deseada", data.desiredDuration],
    ["Nombre", data.contactName],
    ["Cargo", data.jobTitle],
    ["Correo", data.email],
    ["Teléfono / WhatsApp", data.phone],
    ["Mensaje", data.message],
  ].filter(([, v]) => v && v.trim() !== "");

  const body = rows
    .map(
      ([l, v]) => `
        <tr>
          <td style="padding:8px 0;width:38%;color:#6b7280;font-size:13px;vertical-align:top;">${esc(l)}</td>
          <td style="padding:8px 0;color:#111827;font-size:13px;font-weight:600;">${esc(v)}</td>
        </tr>`
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
      <tr>
        <td align="center" style="padding:24px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;border:1px solid #e5e7eb;border-radius:12px;">
            <tr>
              <td style="border-bottom:1px solid #e5e7eb;text-align:center;padding:20px 24px;">
                ${BRAND_LOGO}
                <div style="margin-top:10px;font-size:13px;font-weight:bold;color:#374151;text-transform:uppercase;letter-spacing:1px;">Nueva solicitud de cotización</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 16px;color:#374151;font-size:13px;line-height:1.6;">Se recibió una nueva solicitud desde el formulario de Empresas e Instituciones.</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tbody>${body}</tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td style="border-top:1px solid #e5e7eb;padding:14px 24px;font-size:11px;color:#9ca3af;">
                La Magia de Cantar · Bogotá, Colombia · cotizaciones@lamagiadecantar.co
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
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

// ============================================================================
// B2B — CONFIRMACIÓN AL SOLICITANTE (transaccional). Breve y profesional.
// ============================================================================

function buildQuoteConfirmationHtml(data: CotizacionEmpresaInput) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
      <tr>
        <td align="center" style="padding:24px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border:1px solid #e5e7eb;border-radius:12px;">
            <tr>
              <td style="border-bottom:1px solid #e5e7eb;text-align:center;padding:20px 24px;">
                ${BRAND_LOGO}
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 12px;font-size:15px;color:#111;font-weight:bold;">Hemos recibido tu solicitud de cotización</p>
                <p style="margin:0 0 12px;font-size:14px;color:#374151;line-height:1.6;">
                  Gracias por escribirnos${data.contactName ? `, ${esc(data.contactName)}` : ""}. Recibimos tu solicitud${data.companyName ? ` de <strong>${esc(data.companyName)}</strong>` : ""} y uno de nuestros asesores te contactará en un plazo de <strong>hasta 3 días hábiles</strong>.
                </p>
                <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
                  Si tu solicitud es urgente, puedes escribirnos por <a href="https://wa.me/573053678742" style="color:#7C3AED;font-weight:bold;">WhatsApp al +57 305 3678742</a> o al correo contacto@lamagiadecantar.co.
                </p>
              </td>
            </tr>
            <tr>
              <td style="border-top:1px solid #e5e7eb;text-align:center;padding:14px 24px;font-size:11px;color:#9ca3af;">
                La Magia de Cantar · Bogotá, Colombia
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
}

export async function sendQuoteConfirmation(data: CotizacionEmpresaInput, toOverride?: string | string[]) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = buildFrom();
  const to = normalizeRecipients(toOverride) ?? data.email;

  if (!apiKey || !from || !to) {
    console.warn(
      "[email] Confirmación de cotización omitida: configura RESEND_API_KEY y RESEND_FROM_EMAIL en .env.local para activarla."
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
      subject: "Hemos recibido tu solicitud de cotización",
      html: buildQuoteConfirmationHtml(data),
    }),
  });

  if (!res.ok) {
    console.error("[email] Error al enviar la confirmación de cotización:", await res.text());
  }
}

// ============================================================================
// PAGO — CONFIRMACIÓN AL COMPRADOR (diseño de marca, fondo blanco).
// ============================================================================

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

function buildPaymentConfirmationHtml(data: PaymentConfirmationData) {
  const amount = (data.amount ?? 0).toLocaleString("es-CO");
  const fullName = [data.payerFirstName, data.payerLastName].filter(Boolean).join(" ");
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;border:3px solid #000000;border-radius:16px;">
            <tr>
              <td style="border-bottom:3px solid #000000;text-align:center;padding:28px 24px;">
                ${BRAND_LOGO}
                <div style="margin:14px auto 0;display:inline-block;background:#FDE68A;border:2px solid #000000;padding:6px 14px;border-radius:999px;font-size:12px;font-weight:900;color:#000;text-transform:uppercase;letter-spacing:0.5px;">¡Gracias por tu compra!</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px;">
                <p style="margin:0 0 14px;font-size:15px;color:#111;font-weight:bold;">Hola ${esc(fullName)},</p>
                <p style="margin:0 0 18px;font-size:14px;color:#374151;line-height:1.6;">
                  Hemos recibido tu pago correctamente. Tu cupo está asegurado en <strong>La Magia de Cantar</strong>. ¡Estamos felices de que empieces este camino!
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #111827;border-collapse:collapse;border-radius:12px;">
                  <tbody>
                    ${detailRow("Servicio", data.serviceTitle)}
                    ${detailRow("Plan", data.variantLabel)}
                    ${detailRow("Monto", `$${amount} COP`)}
                    ${detailRow("Número de orden", data.orderId)}
                    ${data.paymentId ? detailRow("ID de pago", data.paymentId) : ""}
                  </tbody>
                </table>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;background:#ECFDF5;border:2px solid #000000;border-radius:12px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-size:13px;font-weight:900;color:#000;text-transform:uppercase;letter-spacing:0.5px;">¿Qué sigue ahora?</div>
                      <ul style="margin:10px 0 0;padding-left:18px;font-size:13px;color:#374151;line-height:1.8;">
                        <li><strong>Nuestro equipo te contactará</strong> en las próximas horas para darte la bienvenida.</li>
                        <li><strong>Coordinarás tu agenda</strong> para tu primera sesión o punto de inicio.</li>
                        <li><strong>Prepárate para cantar:</strong> revisa tu correo y WhatsApp para las instrucciones.</li>
                      </ul>
                    </td>
                  </tr>
                </table>
                <p style="margin:18px 0 0;font-size:13px;color:#6b7280;">
                  Si tienes dudas, escríbenos por <a href="https://wa.me/573053678742" style="color:#7C3AED;font-weight:bold;">WhatsApp</a> o a <a href="mailto:contacto@lamagiadecantar.co" style="color:#7C3AED;font-weight:bold;">contacto@lamagiadecantar.co</a>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#FDE68A;border-top:3px solid #000000;text-align:center;padding:16px 24px;font-size:11px;color:#111;">
                La Magia de Cantar · Bogotá, Colombia · <a href="mailto:contacto@lamagiadecantar.co" style="color:#111;">contacto@lamagiadecantar.co</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
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
