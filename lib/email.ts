import type { CotizacionEmpresaInput } from "@/lib/schemas/cotizacion.schema";

const RESEND_API_URL = "https://api.resend.com/emails";

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

export async function sendQuoteNotification(data: CotizacionEmpresaInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

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
