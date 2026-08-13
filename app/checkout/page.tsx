import { notFound } from "next/navigation";
import Link from "next/link";
import { getCatalog } from "@/data/services";
import type { ServiceItem } from "@/data/services";
import CheckoutForm from "@/components/CheckoutForm";
import { ArrowLeft, ShieldCheck } from "lucide-react";

interface CheckoutPageProps {
  searchParams: Promise<{ service?: string; variant?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { service: serviceId, variant: variantId } = await searchParams;

  if (!serviceId || !variantId) {
    notFound();
  }

  let services: ServiceItem[] = [];
  let catalogError = false;

  try {
    services = await getCatalog();
  } catch (err) {
    console.error("Error cargando catálogo en checkout:", err);
    catalogError = true;
  }

  const service = services.find((s) => s.id === serviceId);
  const variant = service?.plans.find((p) => p.id === variantId);

  if (catalogError || !service || !variant || service.isCustomQuote) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col bg-[#FFFBEB]">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Volver */}
        <Link
          href="/#nuestros-servicios"
          className="inline-flex items-center gap-1.5 font-poppins text-xs font-black uppercase tracking-wider text-purple hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a servicios
        </Link>

        <div className="mt-4 flex flex-col items-center text-center">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-yellow px-4 py-1.5 font-poppins text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            ✦ PAGO SEGURO
          </p>
          <h1 className="mt-4 font-poppins text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            Completa tus datos para empezar
          </h1>
          <p className="mt-2 flex items-center gap-1.5 font-jakarta text-sm font-medium text-gray-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Tu pago se procesa de forma segura con Mercado Pago. Nunca guardamos los datos de tu tarjeta.
          </p>
        </div>

        <CheckoutForm service={service} variant={variant} />
      </div>
    </main>
  );
}
