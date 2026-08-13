import { z } from "zod";

export const DOC_TYPE_OPTIONS = ["CC", "NIT", "CE", "PASAPORTE"] as const;

// Edad: el form convierte el string con setValueAs; el schema recibe number.
// Opcional en adultos, obligatoria en Kids/Teens (se exige por superRefine).
const ageField = z
  .number("Ingresa una edad válida")
  .int("La edad debe ser un número entero")
  .min(1, "La edad debe ser mayor a 0")
  .max(120, "Ingresa una edad válida")
  .optional();

export type OrderAgeField = number | undefined;

export function buildOrdenSchema(opts?: { requiresAge?: boolean }) {
  const requiresAge = opts?.requiresAge ?? false;

  return z
    .object({    serviceId: z
      .string({ message: "El servicio es obligatorio" })
      .min(1, "El servicio es obligatorio")
      .max(60, "Identificador de servicio inválido"),

    variantId: z
      .string({ message: "El plan es obligatorio" })
      .min(1, "El plan es obligatorio")
      .max(80, "Identificador de plan inválido"),

    // 🎓 ESTUDIANTE
    studentFirstName: z
      .string({ message: "El nombre del estudiante es obligatorio" })
      .min(2, "El nombre del estudiante es obligatorio")
      .max(80, "El nombre no puede superar 80 caracteres")
      .trim(),

    studentLastName: z
      .string({ message: "El apellido del estudiante es obligatorio" })
      .min(2, "El apellido del estudiante es obligatorio")
      .max(80, "El apellido no puede superar 80 caracteres")
      .trim(),

    studentAge: ageField,

    studentNotes: z.string().max(2000).optional().or(z.literal("")),

    // 💳 PAGADOR / FACTURACIÓN
    payerEmail: z
      .string({ message: "El correo del pagador es obligatorio" })
      .email("Ingresa un correo electrónico válido")
      .max(254, "El correo no puede superar 254 caracteres")
      .toLowerCase()
      .trim(),

    payerFirstName: z
      .string({ message: "El nombre del pagador es obligatorio" })
      .min(2, "El nombre del pagador es obligatorio")
      .max(80, "El nombre no puede superar 80 caracteres")
      .trim(),

    payerLastName: z
      .string({ message: "El apellido del pagador es obligatorio" })
      .min(2, "El apellido del pagador es obligatorio")
      .max(80, "El apellido no puede superar 80 caracteres")
      .trim(),

    payerDocType: z.enum(DOC_TYPE_OPTIONS, {
      message: "Selecciona un tipo de documento válido",
    }),

    payerDocNumber: z
      .string({ message: "El número de documento es obligatorio" })
      .min(4, "Ingresa un número de documento válido")
      .max(30, "El número de documento no puede superar 30 caracteres")
      .regex(/^[0-9A-Za-z-]+$/, "Ingresa un número de documento válido")
      .trim(),

    payerPhone: z
      .string({ message: "El teléfono o WhatsApp es obligatorio" })
      .min(7, "Ingresa un número válido (mínimo 7 dígitos)")
      .max(20, "Ingresa un número válido (máximo 20 caracteres)")
      .regex(/^[0-9+\s-]{7,20}$/, "Ingresa un número de teléfono válido")
      .trim(),

    payerIpAddress: z
      .string()
      .regex(/^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/, "IP inválida")
      .optional(),

    // ⚖️ HABEAS DATA (Ley 1581)
    habeasDataAccepted: z.literal(true, {
      message: "Debes autorizar el tratamiento de tus datos personales",
    }),

    // 🍯 Anti-spam
    honeypot: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (requiresAge && (data.studentAge === undefined || data.studentAge === null)) {
      ctx.addIssue({
        code: "custom",
        path: ["studentAge"],
        message: "La edad del estudiante es obligatoria para este servicio",
      });
    }
  });
}

// Esquema base usado por el servidor (createOrder). La edad es opcional a nivel
// de servidor; la obligatoriedad para Kids/Teens se aplica en el cliente (UX).
export const ordenCompraSchema = buildOrdenSchema();

export type OrdenCompraInput = z.infer<typeof ordenCompraSchema>;
