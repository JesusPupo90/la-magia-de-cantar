import type { Metadata } from "next";
import PruebaDeVoz from "@/components/PruebaDeVoz";

export const metadata: Metadata = {
  title: "Prueba de voz con IA | La Magia de Cantar",
  description:
    "Graba tu voz 10 segundos y recibe un veredicto personalizado con IA de Yanetsis Alfonso: afinación, estabilidad respiratoria y tu siguiente paso.",
  openGraph: {
    title: "Prueba con IA tu voz | La Magia de Cantar",
    description:
      "Analizamos tu voz con IA y Yanetsis te deja un veredicto personalizado. Gratis y sin guardar tu audio.",
    type: "website",
  },
};

export default function PruebaDeVozPage() {
  return <PruebaDeVoz />;
}
