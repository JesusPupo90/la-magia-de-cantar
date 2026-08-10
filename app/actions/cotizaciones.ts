// app/actions/cotizaciones.ts
"use server";

import { cotizacionEmpresaSchema, CotizacionEmpresaInput } from "@/lib/schemas/cotizacion.schema";
import { createClient } from "@/lib/supabase/server";

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

  const { error } = await supabase.from("company_quotes").insert({
    company_name: data.companyName,
    entity_type: data.entityType || null,
    contact_name: data.contactName,
    job_title: data.jobTitle,
    email: data.email,
    phone: data.phone,
    city: data.city,
    location_type: data.locationType || null,
    participants_range: data.participantsRange || null,
    service_interest: data.serviceInterest || null,
    objective: data.objective || null,
    tentative_date: data.tentativeDate || null,
    desired_duration: data.desiredDuration || null,
    message: data.message || null,
  });

  if (error) {
    console.error("Error insertando en Supabase:", error);
    return {
      success: false,
      message: "Ocurrió un error al enviar la solicitud. Inténtalo de nuevo.",
    };
  }

  return {
    success: true,
    message: "Gracias por escribirnos. Revisaremos tu solicitud y nos pondremos en contacto para construir una propuesta a la medida de tu empresa o institución.",
  };
}