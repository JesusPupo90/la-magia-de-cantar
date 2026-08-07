"use client";

import Image from "next/image";
import Cta from "./Cta";
import { Mic, Sparkles, Drama, Rocket } from "lucide-react";

const pillars = [
  {
    num: "01 / VOZ",
    icon: <Mic className="h-6 w-6 text-purple stroke-[2.5]" />,
    title: "Técnica Vocal Saludable",
    description: "Desarrolla afinación, potencia y control sin lastimar tu voz.",
    bgCard: "bg-[#F3E8FF]", // Lavanda pastel
    borderTag: "border-purple/40 bg-purple/10 text-purple",
    rotation: "lg:-rotate-2 hover:rotate-0",
  },
  {
    num: "02 / MENTE",
    icon: <Sparkles className="h-6 w-6 text-amber-700 stroke-[2.5]" />,
    title: "Confianza & Seguridad",
    description: "Vence el miedo a cantar en público y conecta con tu autenticidad.",
    bgCard: "bg-[#FEF9C3]", // Amarillo/Crema pastel
    borderTag: "border-amber-400/40 bg-amber-100 text-amber-900",
    rotation: "lg:rotate-1 lg:translate-y-2 hover:rotate-0",
  },
  {
    num: "03 / ESCENA",
    icon: <Drama className="h-6 w-6 text-pink stroke-[2.5]" />,
    title: "Interpretación & Escena",
    description: "Domina la expresión corporal, la presencia y la conexión emocional.",
    bgCard: "bg-[#FCE7F3]", // Rosa pastel
    borderTag: "border-pink/40 bg-pink-soft text-pink",
    rotation: "lg:-rotate-1 hover:rotate-0",
  },
  {
    num: "04 / FUTURO",
    icon: <Rocket className="h-6 w-6 text-black stroke-[2.5]" />,
    title: "Proyección Artística",
    description: "Prepárate para audiciones, grabar en estudio o realities de TV.",
    bgCard: "bg-[#E6F4F1]", // Menta pastel
    borderTag: "border-dark-mint/40 bg-mint/40 text-black",
    rotation: "lg:rotate-2 lg:translate-y-2 hover:rotate-0",
  },
];

export default function LaMagiaDeCantar() {
  return (
    <section
      id="la-magia-de-cantar"
      aria-labelledby="la-magia-de-cantar-titulo"
      className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
    >
      {/* 📍 Imagen de fondo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full">
        <Image
          src="/assets/bg-composition.webp"
          alt=""
          fill
          priority
          quality={100}
          className="object-cover object-center opacity-90"
        />
      </div>

      {/* 📍 Contenido principal */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8">
        
        {/* BLOQUE SUPERIOR: Título, Filosofía, Descripción y CTA */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-pink/30 bg-pink-soft/80 px-4 py-1.5 font-poppins text-xs font-bold uppercase tracking-wider text-purple shadow-sm">
            ✦ Nuestra Filosofía
          </p>

          <h2
            id="la-magia-de-cantar-titulo"
            className="mt-6 font-poppins text-3xl font-extrabold tracking-tight text-white sm:text-5xl drop-shadow-sm"
          >
            Somos más que una{" "}
            <span className="relative inline-block whitespace-nowrap">
              escuela musical
            </span>
          </h2>

          <div className="mt-6 space-y-4 font-jakarta text-base leading-relaxed text-white sm:text-lg">
            <p>
              La magia de cantar no es solo técnica: es un proceso integral donde la voz,
              el cuerpo y la emoción se entrenan juntos. Nuestro programa acompaña a cada
              persona en su propio ritmo, en un ambiente seguro, cálido y libre de
              competencia, para que descubra su verdadera expresión.
            </p>
            <p>
              De la mano de Yanetsis Alfonso, coach vocal de televisión, formamos a
              adultos, niños y adolescentes, y a artistas que quieren dar el siguiente
              paso. Aquí no solo aprendes a cantar: aprendes a creer en tu voz.
            </p>
          </div>
          
          <div className="mt-10 flex justify-center">
            <Cta />
          </div>
        </div>

        {/* BLOQUE INFERIOR: Tarjetas estilo Sticker Pop con rotación e Iconos Lucide */}
        <div className="mt-16">
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <li key={pillar.title} className="flex">
                <article
                  className={`group relative flex w-full flex-col justify-between rounded-3xl border-2 border-black ${pillar.bgCard} p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ${pillar.rotation} hover:z-20 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
                >
                  <div>
                    {/* Header de la tarjeta: Badge / Sticker e Icono Lucide */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-block rounded-lg border px-2.5 py-1 font-poppins text-[10px] font-black uppercase tracking-wider ${pillar.borderTag}`}
                      >
                        {pillar.num}
                      </span>
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-110"
                        aria-hidden="true"
                      >
                        {pillar.icon}
                      </span>
                    </div>

                    {/* Título y descripción */}
                    <h3 className="mt-5 font-poppins text-lg font-extrabold text-black">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 font-jakarta text-xs font-semibold leading-relaxed text-gray-800 sm:text-sm">
                      {pillar.description}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          {/* Tarjeta Informativa estilo "Bono / Tape" al final */}
          <div className="mt-8 rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-jakarta text-center text-xs font-bold text-black sm:text-sm">
              ✨ Un programa pensado para todos los niveles: desde tu primera nota hasta el escenario.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}