// data/services.ts
// Capa de datos del catálogo: consume Supabase (fuente de verdad §8) y
// expone el contrato que la UI espera. SOLO se ejecuta en el servidor.

import { createClient } from "@supabase/supabase-js";

export interface Plan {
  id: string; // ej: "kids-grupales__mensual" (service_variants.id)
  label: string;
  price: number; // Pesos COP enteros
  isRecommended?: boolean;
  tag?: string;
}

export interface ServiceItem {
  id: string;
  category: string; // Label de la categoría (filtro de la UI)
  microTitle: string;
  title: string;
  isSpecial?: boolean;
  isCustomQuote?: boolean; // true => requiere cotización (nunca pago)
  note?: string;
  metadata: {
    age?: string;
    schedule?: string;
    mode: string;
    intensityOrDuration?: string;
  };
  description: string;
  learnList: string[];
  plans: Plan[];
}

interface CategoryRow {
  id: string;
  label: string;
}

interface ServiceRow {
  id: string;
  category_id: string;
  position: number;
  micro_title: string;
  title: string;
  description: string;
  modality: string;
  mode: string | null;
  age: string | null;
  schedule: string | null;
  intensity_or_duration: string | null;
  learn_list: string[];
  is_special: boolean;
  is_custom_quote: boolean;
  note: string | null;
}

interface VariantRow {
  id: string;
  service_id: string;
  label: string;
  price: number;
  is_recommended: boolean;
  tag: string | null;
}

export async function getCatalog(): Promise<ServiceItem[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [categoriesRes, servicesRes, variantsRes] = await Promise.all([
    supabase.from("categories").select("id, label").order("position", { ascending: true }).eq("is_active", true),
    supabase.from("services").select("*").eq("is_active", true).order("position", { ascending: true }),
    supabase.from("service_variants").select("*").eq("is_active", true),
  ]);

  if (categoriesRes.error || servicesRes.error || variantsRes.error) {
    throw new Error("No se pudo cargar el catálogo de servicios");
  }

  const categories = (categoriesRes.data ?? []) as CategoryRow[];
  const services = (servicesRes.data ?? []) as ServiceRow[];
  const variants = (variantsRes.data ?? []) as VariantRow[];

  const labelByCategoryId = new Map(categories.map((c) => [c.id, c.label]));

  // Orden determinístico del catálogo: agrupar por categoría en el orden de
  // categories.position (Kids = 'Canto para niños' primero) y dentro de cada
  // categoría ordenar por services.position. Así las pestañas de la UI siguen
  // el orden de negocio y 'kids-grupales' queda antes que 'teens-grupales',
  // independientemente del orden físico de la tabla.
  const servicesByCategory = new Map<string, ServiceRow[]>();
  for (const svc of services) {
    const arr = servicesByCategory.get(svc.category_id) ?? [];
    arr.push(svc);
    servicesByCategory.set(svc.category_id, arr);
  }

  const orderedServices = categories.flatMap((cat) =>
    (servicesByCategory.get(cat.id) ?? []).sort((a, b) => a.position - b.position)
  );

  return orderedServices.map((svc) => {
    const plans: Plan[] = variants
      .filter((v) => v.service_id === svc.id)
      .map((v) => ({
        id: v.id,
        label: v.label,
        price: v.price,
        isRecommended: v.is_recommended || undefined,
        tag: v.tag ?? undefined,
      }));

    return {
      id: svc.id,
      category: labelByCategoryId.get(svc.category_id) ?? svc.category_id,
      microTitle: svc.micro_title,
      title: svc.title,
      isSpecial: svc.is_special || undefined,
      isCustomQuote: svc.is_custom_quote || undefined,
      note: svc.note ?? undefined,
      metadata: {
        age: svc.age ?? undefined,
        schedule: svc.schedule ?? undefined,
        mode: svc.mode ?? svc.modality,
        intensityOrDuration: svc.intensity_or_duration ?? undefined,
      },
      description: svc.description,
      learnList: svc.learn_list,
      plans,
    };
  });
}
