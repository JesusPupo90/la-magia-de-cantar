import { z } from "zod";

// 📍 OPCIONES DE SELECCIÓN (ENUMS)
export const TIPO_ENTIDAD_OPTIONS = [
  "Empresa privada",
  "Institución educativa",
  "Entidad pública",
  "Fundación / ONG",
  "Medio de comunicación",
  "Otro",
] as const;

export const LUGAR_CAPACITACION_OPTIONS = [
  "En las instalaciones de la entidad",
  "En La Magia de Cantar",
  "Virtual",
  "Híbrido",
  "Por definir",
] as const;

export const PARTICIPANTES_OPTIONS = [
  "1 a 5 personas",
  "6 a 15 personas",
  "16 a 30 personas",
  "Más de 30 personas",
  "Por definir",
] as const;

export const SERVICIO_INTERES_OPTIONS = [
  "Voz para liderazgo y comunicación profesional",
  "Vocería, discursos y transmisión de mensaje",
  "Seguridad vocal y manejo del miedo escénico",
  "Presencia escénica y lenguaje corporal",
  "Voz para docentes, conferencistas y formadores",
  "Experiencia de voz, bienestar y equipo",
  "Programa personalizado",
  "Quiero orientación",
] as const;

export const DURACION_DESEADA_OPTIONS = [
  "Conferencia",
  "Taller de medio día",
  "Taller de un día",
  "Proceso de varias sesiones",
  "Programa mensual",
  "Por definir",
] as const;

// Helper para transformar valores vacíos de selecciones opcionales a undefined
const optionalString = z.string().max(80).optional().or(z.literal(""));

// 🛡️ ESQUEMA ALINEADO CON LA BASE DE DATOS
export const cotizacionEmpresaSchema = z.object({
  // 🔴 CAMPOS OBLIGATORIOS (NOT NULL en SQL)
  companyName: z
    .string({ message: "El nombre de la empresa es obligatorio" })
    .min(2, "El nombre de la empresa es obligatorio")
    .max(120, "El nombre de la empresa no puede superar 120 caracteres")
    .trim(),

  contactName: z
    .string({ message: "El nombre del contacto es obligatorio" })
    .min(2, "El nombre del contacto es obligatorio")
    .max(80, "El nombre del contacto no puede superar 80 caracteres")
    .trim(),

  jobTitle: z
    .string({ message: "El cargo es obligatorio" })
    .min(2, "El cargo es obligatorio")
    .max(80, "El cargo no puede superar 80 caracteres")
    .trim(),

  email: z
    .string({ message: "El correo electrónico es obligatorio" })
    .email("Ingresa un correo electrónico válido")
    .max(254, "El correo electrónico no puede superar 254 caracteres")
    .toLowerCase()
    .trim(),

  phone: z
    .string({ message: "El teléfono o WhatsApp es obligatorio" })
    .min(7, "Ingresa un número válido (mínimo 7 dígitos)")
    .max(20, "Ingresa un número válido (máximo 20 caracteres)")
    .regex(/^[0-9+()\-\s]{7,20}$/, "Ingresa un número de teléfono válido")
    .trim(),

  city: z
    .string({ message: "La ciudad es obligatoria" })
    .min(2, "La ciudad es obligatoria")
    .max(80, "La ciudad no puede superar 80 caracteres")
    .trim(),

  honeypot: z.string().optional(),

  // 🟢 CAMPOS OPCIONALES (NULL en SQL)
  entityType: optionalString,
  locationType: optionalString,
  participantsRange: optionalString,
  serviceInterest: optionalString,
  objective: z.string().max(2000).optional().or(z.literal("")),
  tentativeDate: optionalString,
  desiredDuration: optionalString,
  message: z.string().max(2000).optional().or(z.literal("")),
});



export type CotizacionEmpresaInput = z.infer<typeof cotizacionEmpresaSchema>;