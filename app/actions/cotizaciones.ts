// app/actions/cotizaciones.ts
"use server";

import { cotizacionEmpresaSchema, CotizacionEmpresaInput } from "@/lib/schemas/cotizacion.schema";
import { createClient } from "@/lib/supabase/server";
import { sendQuoteNotification, sendQuoteConfirmation } from "@/lib/email";

export async function submitCompanyQuote(formData: CotizacionEmpresaInput) {
  const validation = cotizacionEmpresaSchema.safeParse(formData);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const data = validation.data;

  // ⚡ AQUÍ USAMOS EL AWAIT
  const supabase = await createClient();

  // 🍯 Honeypot anti-spam
  if (data.honeypot && data.honeypot.trim() !== "") {
    return { success: true, message: "Solicitud enviada correctamente." };
  }

  // 🔁 Dedupe por email: evita spam repetido sin informar al atacante
  const existing = await supabase
    .from("company_quotes")
    .select("id")
    .eq("email", data.email)
    .limit(1)
    .maybeSingle();

  if (existing.data) {
    return { success: true, message: "Solicitud enviada correctamente." };
  }

  const { error } = await supabase.rpc("submit_company_quote", {
    p_company_name: data.companyName,
    p_entity_type: data.entityType || null,
    p_contact_name: data.contactName,
    p_job_title: data.jobTitle,
    p_email: data.email,
    p_phone: data.phone,
    p_city: data.city,
    p_location_type: data.locationType || null,
    p_participants_range: data.participantsRange || null,
    p_service_interest: data.serviceInterest || null,
    p_objective: data.objective || null,
    p_tentative_date: data.tentativeDate || null,
    p_desired_duration: data.desiredDuration || null,
    p_message: data.message || null,
  });

  if (error) {
    console.error("Error insertando en Supabase:", error);
    return {
      success: false,
      message: "Ocurrió un error al enviar la solicitud. Inténtalo de nuevo.",
    };
  }

  // 📧 Notificación al dueño (inactiva hasta configurar las claves en .env.local)
  await sendQuoteNotification(data);

  // 📧 Confirmación transaccional al solicitante (plazo de respuesta ≤3 días hábiles)
  await sendQuoteConfirmation(data).catch((err) =>
    console.error("[email] Error enviando confirmación al solicitante:", err)
  );

  return {
    success: true,
    message: "Gracias por escribirnos. Revisaremos tu solicitud y nos pondremos en contacto para construir una propuesta a la medida de tu empresa o institución.",
  };
}