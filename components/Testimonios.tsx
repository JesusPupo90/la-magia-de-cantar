"use client";

import { Star, Quote, Mic2, Sparkles, Award } from "lucide-react";

// 1. TESTIMONIOS PRINCIPALES (Laura de León & Martin Trevy)
const FEATURED_TESTIMONIALS = [
  {
    id: "laura",
    name: "Laura de León",
    role: "Actriz & Cantante",
    badge: "Testimonio Destacado",
    bg: "bg-pink-soft",
    process: "Preparación vocal para personajes, producciones de TV y proyección escénica",
    testimonial:
      "Formarme con Yanetsis es encontrar la seguridad técnica para cantar con emoción y soltar la voz sin miedo en cualquier escenario o rodaje.",
    tag: "Producciones TV & Música"
  },
  {
    id: "martin",
    name: "Martin Trevy",
    role: "DJ, Productor & Artista Internacional",
    badge: "Testimonio Destacado",
    bg: "bg-mint",
    process: "Técnica vocal avanzada, resistencia e interpretación para shows en vivo",
    testimonial: "El método Voice Evolution me dio el control total de mi voz en el escenario y en el estudio. La guía de Yanetsis es un pilar clave en mi proyecto.",
    tag: "Giras & Performance"
  }
];

// 2. OTROS ARTISTAS Y VOCES ACOMPAÑADAS
const OTHER_ARTISTS = [
  {
    name: "Carlos Vives",
    role: "Artista Internacional",
    detail: "Acompañamiento vocal y preparación artística"
  },
  {
    name: "Maluma",
    role: "Artista Global",
    detail: "Entrenamiento vocal y presencia en escena"
  },
  {
    name: "Goyo",
    role: "Cantante & Referente Musical",
    detail: "Técnica vocal e interpretación"
  },
  {
    name: "Natalia Jiménez",
    role: "Cantante Internacional",
    detail: "Entrenamiento y cuidado vocal"
  },
  {
    name: "Talentos de Televisión",
    role: "Yo me llamo / La Voz / A Otro Nivel",
    detail: "Preparación intensiva para galas y realities"
  },
  {
    name: "Producciones Audiovisuales",
    role: "La Reina del Flow / La Primera Vez",
    detail: "Coaching vocal para actrices y cantantes"
  }
];

export default function TestimoniosSection() {
  return (
    <section
      id="testimonios"
      aria-labelledby="testimonios-titulo"
      className="relative w-full overflow-hidden bg-[#FFFBEB] py-16 sm:py-20 lg:py-24"
    >
      {/* 📍 Fondo Vectorial Repetido */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-15 bg-[url('/assets/patron-2.svg')] bg-repeat bg-top-left [background-size:1400px] md:bg-auto"
      ></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-yellow px-4 py-1.5 font-poppins text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            ✦ VOCES QUE HAN LLEGADO MÁS LEJOS
          </p>

          <h2
            id="testimonios-titulo"
            className="mt-6 font-poppins text-3xl font-extrabold tracking-tight text-black sm:text-5xl"
          >
            Voces acompañadas por Yanetsis
          </h2>

          <p className="mt-4 font-jakarta text-base leading-relaxed text-gray-800 sm:text-lg">
            Más de 20 años acompañando artistas, cantantes, actores y talentos que han ocupado escenarios, realities, producciones audiovisuales y proyectos musicales de alto nivel.
          </p>
        </div>

        {/* 1. BLOQUE DE DESTACADOS: LAURA DE LEÓN & MARTIN TREVY */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {FEATURED_TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className={`relative flex flex-col justify-between rounded-3xl border-2 border-black ${item.bg} p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md border border-black bg-white px-3 py-1 font-poppins text-[11px] font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Sparkles className="h-3.5 w-3.5 text-purple-700" /> {item.badge}
                  </span>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-poppins text-2xl font-black text-black">
                    {item.name}
                  </h3>
                  <p className="font-poppins text-xs font-extrabold uppercase tracking-wide text-purple-800 mt-1">
                    {item.role}
                  </p>
                </div>

                <div className="relative mt-5 rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Quote className="absolute right-3 top-3 h-6 w-6 text-black/10" />
                  <p className="font-jakarta text-sm font-semibold italic leading-relaxed text-gray-900">
                    &ldquo;{item.testimonial}&rdquo;
                  </p>
                </div>

                <div className="mt-4">
                  <p className="font-jakarta text-xs font-bold text-black/80">
                    Proceso con Yanetsis:
                  </p>
                  <p className="font-jakarta text-xs text-gray-800 font-medium leading-relaxed mt-0.5">
                    {item.process}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-black/10 flex items-center justify-between">
                <span className="inline-block rounded-lg border border-black bg-yellow px-2.5 py-0.5 font-poppins text-[10px] font-black uppercase text-black">
                  {item.tag}
                </span>
                <span className="font-poppins text-[10px] font-black uppercase text-black/60">
                  Voice Evolution
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. GRILLA SECUNDARIA: OTROS ARTISTAS Y PROCESOS */}
        <div className="mt-14">
          <div className="mb-6 text-center md:text-left">
            <h3 className="font-poppins text-xl font-black text-black sm:text-2xl flex items-center justify-center md:justify-start gap-2">
              <Mic2 className="h-5 w-5" /> Más grandes artistas preparados por Yanetsis
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OTHER_ARTISTS.map((artist, index) => (
              <div
                key={index}
                className="flex flex-col justify-between rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-poppins text-base font-extrabold text-black">
                      {artist.name}
                    </h4>
                    <Award className="h-4 w-4 text-purple" />
                  </div>
                  <p className="font-poppins text-[11px] font-bold text-purple-700 mt-0.5">
                    {artist.role}
                  </p>
                  <p className="mt-2 font-jakarta text-xs text-gray-700 font-medium">
                    {artist.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. FRASE DE CIERRE DE SECCIÓN */}
        <div className="mt-16 text-center">
          <div className="mx-auto max-w-3xl rounded-3xl border-2 border-black bg-purple p-6 sm:p-8 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-1">
            <p className="font-poppins text-lg sm:text-2xl font-black leading-snug text-yellow">
              &ldquo;Yanetsis ha acompañado voces que ya están donde puedes llegar.&rdquo;
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}