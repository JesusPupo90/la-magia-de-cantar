import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, HelpCircle, MessageCircle, Mail } from "lucide-react";
import FaqAccordion, { type FaqItem } from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Preguntas frecuentes | La Magia de Cantar",
  description: "Respuestas a las preguntas más frecuentes sobre inscripción, pagos, clases y políticas de La Magia de Cantar.",
};

const FAQS: FaqItem[] = [
  {
    q: "¿Cómo me inscribo?",
    a: "Elige el servicio y el plan que mejor se adapte a ti, pulsa el botón para continuar y completa el formulario de pago. El proceso es 100% en línea y seguro.",
  },
  {
    q: "¿Qué medios de pago aceptan?",
    a: "Aceptamos tarjetas de crédito y débito, PSE, efectivo y billetera de Mercado Pago. Todos los pagos se procesan a través de Mercado Pago.",
  },
  {
    q: "¿El pago es seguro?",
    a: "Sí. El pago lo procesa Mercado Pago con cifrado de extremo a extremo; nunca almacenamos los datos de tu tarjeta.",
  },
  {
    q: "¿Desde qué edad pueden tomar clases?",
    a: "Kids: niños de 5 a 10 años. Teens: adolescentes de 11 a 16 años. Adultos: desde los 17 años en adelante.",
  },
  {
    q: "¿Las clases son presenciales o virtuales?",
    a: "Depende del servicio: algunos son presenciales, otros virtuales y otros híbridos (presencial o virtual según tu preferencia). El detalle aparece en cada servicio.",
  },
  {
    q: "¿Qué incluye cada plan?",
    a: "Los planes mensuales, trimestrales y anuales (según el servicio) incluyen el programa de clases correspondiente; los paquetes incluyen el número de sesiones indicado. El detalle y el valor aparecen en cada tarjeta de servicio.",
  },
  {
    q: "¿Puedo reprogramar o cancelar una clase?",
    a: "Para reprogramar o coordinar cambios, escríbenos por WhatsApp o correo y nuestro equipo te orientará según las condiciones de tu plan.",
  },
  {
    q: "¿Tienen política de reembolso?",
    a: "Sí. De acuerdo con el Estatuto del Consumidor (Ley 1480 de 2011), puedes ejercer el derecho de retracto dentro de los 5 días hábiles siguientes a la compra, siempre que el servicio no haya iniciado. La devolución se realiza por el mismo medio de pago en un plazo de hasta 30 días calendario. Consulta nuestra política de pagos para más detalle.",
  },
  {
    q: "¿Qué es la asesoría con Yanetsis?",
    a: "Es una sesión inicial directamente con Yanetsis Alfonso para diagnosticar tu punto de partida como artista, conocer tu voz y definir los siguientes pasos de tu proceso.",
  },
  {
    q: "¿Trabajan con empresas e instituciones?",
    a: "Sí. Ofrecemos formación y talleres para empresas e instituciones; puedes solicitar una cotización a la medida desde el formulario de Empresas e Instituciones.",
  },
  {
    q: "¿Dónde están ubicados y cómo puedo contactarlos?",
    a: "Estamos en la Calle 121 No. 11A-23, Bogotá. Puedes escribirnos por WhatsApp al +57 305 3678742 o al correo contacto@lamagiadecantar.co.",
  },
];

export default function PreguntasFrecuentesPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#FFFBEB] py-12 px-4 font-jakarta sm:px-6 lg:px-8">
      {/* Fondo Vectorial */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full bg-[url('/assets/patron-1.svg')] bg-repeat bg-top-left opacity-10 [background-size:1400px]"
      ></div>

      <div className="relative z-10 mx-auto max-w-3xl">
        <Link
          href="/#footer"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2 font-poppins text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al Inicio
        </Link>

        <div className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:p-10">
          <div className="border-b-2 border-black pb-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg border-2 border-black bg-yellow px-3 py-1 font-poppins text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <HelpCircle className="h-4 w-4" /> Ayuda
            </div>
            <h1 className="font-poppins text-3xl font-black text-black sm:text-4xl">
              Preguntas frecuentes
            </h1>
            <p className="mt-2 font-poppins text-xs font-bold text-gray-800">
              Todo lo que necesitas saber antes de empezar
            </p>
          </div>

          <div className="mt-8">
            <FaqAccordion items={FAQS} />
          </div>

          {/* Contacto */}
          <div className="mt-10 rounded-2xl border-2 border-black bg-mint/30 p-5">
            <p className="font-poppins text-sm font-black uppercase tracking-tight text-black">
              ¿Aún tienes dudas?
            </p>
            <p className="mt-1 font-jakarta text-sm text-gray-700">
              Escríbenos y con gusto te ayudamos a elegir tu camino.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://wa.me/573053678742"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-[3px] border-black bg-emerald-400 px-5 py-3 font-poppins text-xs font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a
                href="mailto:contacto@lamagiadecantar.co"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-[3px] border-black bg-white px-5 py-3 font-poppins text-xs font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5"
              >
                <Mail className="h-4 w-4" /> Correo
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
