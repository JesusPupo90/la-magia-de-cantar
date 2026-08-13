import Hero from "@/components/Hero";
import AchievementsBanner from "@/components/AchievementsBanner";
import LaMagiaDeCantar from "@/components/LaMagiaDeCantar";
import MetodoYanetsis from "@/components/MetodoYanetsis";
import NuestrosServicios from "@/components/NuestrosServicios";
import EmpresasEInstituciones from "@/components/EmpresasEInstituciones";
import TestimoniosSection from "@/components/Testimonios";
import { getCatalog } from "@/data/services";
import type { ServiceItem } from "@/data/services";
// import DemoEstetica from "@/components/DemoEstetica";

export default async function Home() {
  let services: ServiceItem[] = [];
  let catalogError = false;

  try {
    services = await getCatalog();
  } catch (err) {
    console.error("Error cargando catálogo de servicios:", err);
    catalogError = true;
  }

  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <AchievementsBanner />
      <LaMagiaDeCantar />
      <MetodoYanetsis />
      {catalogError ? (
        <div
          className="bg-mint py-16 sm:py-20 lg:py-24 text-center px-4"
          role="alert"
        >
          <p className="font-jakarta text-base text-gray-800">
            No pudimos cargar nuestros servicios en este momento. Por favor,
            intenta de nuevo más tarde.
          </p>
        </div>
      ) : (
        <NuestrosServicios services={services} />
      )}
      <EmpresasEInstituciones />
      <TestimoniosSection />
      {/* <DemoEstetica /> */}
    </main>
  );
}
