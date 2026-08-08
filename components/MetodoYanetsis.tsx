"use client";
import Image from "next/image";

import Cta from "./Cta";
import { 
  Sparkles, 
  Activity, 
  Heart, 
  Sliders, 
  Zap, 
  TrendingUp, 
  Award 
} from "lucide-react";

const authorityBadges = [
  "La Voz Colombia", "Yo Me Llamo", "A Otro Nivel", "La Descarga", "La Reina del Flow",
  "Carlos Vives", "Maluma", "Gilberto Santa Rosa", "Greeicy", "Kany García", "Maía"
];

const pillars = [
  {
    num: "01",
    tag: "ESENCIA",
    icon: <Sparkles className="h-5 w-5 text-pink" />,
    title: "Reconoce tu voz",
    description: "Descubre tu color, sensibilidad y fortalezas únicas para construir una voz auténtica.",
    accentBg: "bg-purple/10 border-purple/30",
  },
  {
    num: "02",
    tag: "CUERPO",
    icon: <Activity className="h-5 w-5 text-emerald-700" />,
    title: "Habita tu instrumento",
    description: "Trabaja respiración, postura y expresión corporal para cantar con total libertad y fuerza.",
    accentBg: "bg-emerald-500/10 border-emerald-500/30",
  },
  {
    num: "03",
    tag: "EMOCIONAL",
    icon: <Heart className="h-5 w-5 text-pink" />,
    title: "Canta lo que sientes",
    description: "Conecta con la historia que quieres contar. Una voz que siente es una voz que emociona.",
    accentBg: "bg-pink/10 border-pink/30",
  },
  {
    num: "04",
    tag: "TÉCNICA",
    icon: <Sliders className="h-5 w-5 text-amber-800" />,
    title: "Hábitos y rutinas",
    description: "Afinación, colocación, resonancia y cuidado vocal. La técnica le da estructura al talento.",
    accentBg: "bg-amber-400/10 border-amber-400/30",
  },
  {
    num: "05",
    tag: "CONEXIÓN",
    icon: <Zap className="h-5 w-5 text-orange-600" />,
    title: "El instrumento eres tú",
    description: "Integra voz, cuerpo, emoción y presencia para cantar con seguridad en cualquier escenario.",
    accentBg: "bg-orange-500/10 border-orange-500/30",
  },
  {
    num: "06",
    tag: "CRECER & FLUIR",
    icon: <TrendingUp className="h-5 w-5 text-blue-700" />,
    title: "Ama tu proceso",
    description: "Avanza sin compararte, disfruta cada logro y prepárate para conquistar tu lugar.",
    accentBg: "bg-blue-500/10 border-blue-500/30",
  },
];

export default function MetodoYanetsis() {
  return (
    <section
      id="metodo-yanetsis"
      aria-labelledby="metodo-titulo"
      className="relative w-full overflow-hidden bg-[#E6F4F1] py-16 sm:py-20 lg:py-24"
    >
      {/* 📍 Fondo Vectorial Zigzag Responsivo */}
      <div className="pointer-events-none absolute inset-0 top-0 z-0 h-full w-full overflow-hidden opacity-25">
        <svg
          className="h-full w-full text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="zigzag-pattern"
              x="0"
              y="0"
              width="60"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 15 L 15 0 L 30 15 L 45 0 L 60 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 0 30 L 15 15 L 30 30 L 45 15 L 60 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#zigzag-pattern)" />
        </svg>
      </div>

      {/* CONTENEDOR PRINCIPAL ESTILO "CASA / CARD GIGANTE" */}
      <div className="relative z-10 mx-auto max-w-7xl pt-32 md:pt-45 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-[-85px] md:top-[-130px] left-1/2 -translate-x-1/2 z-100 w-48 sm:w-64 lg:w-80">
          <Image 
            src="/assets/yanetsis-recorte.webp"
            alt="Recorte de Yanetsis"
            width={400}
            height={500}
            priority
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="rounded-[2.5rem] border-2 border-black bg-white p-6 sm:p-12 lg:p-16 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          
          {/* 1. ENCABEZADO Y PROMESA */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-pink-soft px-4 py-1.5 font-poppins text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              ✦ MÉTODOS YANETSIS
            </p>

            <h2
              id="metodo-titulo"
              className="mt-6 font-poppins text-3xl font-extrabold tracking-tight text-black sm:text-5xl"
            >
              Voice Evolution: <br className="hidden sm:inline" />
              <span className="relative inline-block mt-2">
                el instrumento eres tú
              </span>
            </h2>

            <p className="mt-6 font-jakarta text-base leading-relaxed text-gray-800 sm:text-lg">
              Descubrir que tienes talento es apenas el comienzo. Creado por Yanetsis Alfonso tras más de 20 años de trayectoria, <strong>Voice Evolution</strong> integra técnica vocal, identidad, emoción y presencia para preparar artistas que sueñan con la TV, la grabación y los escenarios.
            </p>
          </div>

          {/* 2. CINTA DE AUTORIDAD Y PROCESOS VOCALES */}
          <div className="mt-12 rounded-2xl border-2 border-black bg-[#F8FAFC] p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-purple text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Award className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-poppins text-xs font-black uppercase text-purple">Experiencia Comprobada</p>
                  <p className="font-jakarta text-sm font-bold text-black">Formadora de talentos y coaches en TV e industria musical</p>
                </div>
              </div>

              {/* Badges tipo Sticker */}
              <div className="flex flex-wrap items-center justify-center gap-2 lg:max-w-md">
                {authorityBadges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg border border-black bg-white px-2.5 py-1 font-poppins text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 3. BLOQUE DE LOS 6 PILARES */}
          <div className="mt-16">
            <div className="text-center mb-10">
              <h3 className="font-poppins text-2xl font-black text-black sm:text-3xl">
                Los 6 Pilares del Método
              </h3>
              <p className="mt-2 font-jakarta text-sm font-medium text-gray-700">
                Un entrenamiento integral diseñado para estructurar tu talento.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pillars.map((pillar) => (
                <div
                  key={pillar.num}
                  className="group relative flex flex-col justify-between rounded-2xl border-2 border-black bg-white p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div>
                    {/* Cabecera optimizada: Número ordinal discreto + Tag + Icono */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-poppins text-xs font-black text-gray-400 group-hover:text-black transition-colors">
                          #{pillar.num}
                        </span>
                        <span className="inline-block rounded-md border border-black bg-gray-50 px-2 py-0.5 font-poppins text-[11px] font-black uppercase text-black">
                          {pillar.tag}
                        </span>
                      </div>
                      
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl border border-black ${pillar.accentBg} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0`}>
                        {pillar.icon}
                      </div>
                    </div>

                    {/* Título y Descripción con mejor jerarquía y legibilidad */}
                    <h4 className="font-poppins text-lg sm:text-xl font-extrabold text-black leading-snug">
                      {pillar.title}
                    </h4>

                    <p className="mt-2 font-jakarta text-sm leading-relaxed text-gray-800 sm:text-base">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. FRASE DESTACADA Y CTA */}
          <div className="mt-16 text-center">
            <div className="mx-auto max-w-2xl rounded-2xl border-2 border-black bg-yellow p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1">
              <p className="font-poppins text-base sm:text-xl font-extrabold text-black leading-snug">
                &ldquo;Voice Evolution prepara artistas para cantar con técnica, identidad, emoción y presencia escénica.&rdquo;
              </p>
            </div>

            <div className="mt-10 flex justify-center">
              <Cta />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}