"use client";

import Image from "next/image";

const pillars = [
  {
    icon: "🎤",
    title: "Técnica Vocal Saludable",
    description: "Desarrolla afinación, potencia y control sin lastimar tu voz.",
    color: "bg-purple/10 text-purple border-purple/20",
  },
  {
    icon: "✨",
    title: "Confianza & Seguridad",
    description: "Vence el miedo a cantar en público y conecta con tu autenticidad.",
    color: "bg-yellow/20 text-orange border-yellow/40",
  },
  {
    icon: "🎭",
    title: "Interpretación & Escena",
    description: "Domina la expresión corporal, la presencia y la conexión emocional.",
    color: "bg-pink-soft text-pink border-pink/30",
  },
  {
    icon: "🚀",
    title: "Proyección Artística",
    description: "Prepárate para audiciones, grabar en estudio o realities de TV.",
    color: "bg-mint/30 text-dark-mint border-mint",
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
          className="object-cover object-center"
        />
      </div>

      {/* 📍 Contenido principal */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Columna izquierda: Manifiesto y CTA */}
          <div className="flex flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-pink/30 bg-pink-soft/80 px-4 py-1.5 font-poppins text-xs font-bold uppercase tracking-wider text-purple">
              ✦ Nuestra Filosofía
            </p>

            <h2
              id="la-magia-de-cantar-titulo"
              className="mt-6 font-poppins text-3xl font-extrabold tracking-tight text-black sm:text-5xl"
            >
              Somos más que una{" "}
              <span className="relative inline-block whitespace-nowrap">
                escuela musical
              </span>
            </h2>

            <div className="mt-6 space-y-4 font-jakarta text-base leading-relaxed text-black sm:text-lg">
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

            <a
              href="#nuestros-servicios"
              className="mt-8 inline-flex items-center justify-center rounded-2xl border-2 border-black bg-mint px-8 py-4 font-poppins text-base font-bold text-black shadow-soft-md transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-orange hover:shadow-soft-lg active:translate-y-0"
            >
              Quiero tener la magia
            </a>
          </div>

          {/* Columna derecha: Grilla de Pilares */}
          <div className="lg:col-span-6">
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pillars.map((pillar) => (
                <li key={pillar.title}>
                  <article className="flex h-full flex-col gap-4 rounded-3xl border border-gray-100 bg-gray-50/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-soft-md">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-2xl ${pillar.color}`}
                      aria-hidden="true"
                    >
                      {pillar.icon}
                    </span>
                    <div>
                      <h3 className="font-poppins text-lg font-bold text-black">
                        {pillar.title}
                      </h3>
                      <p className="mt-2 font-jakarta text-sm leading-relaxed text-gray-700">
                        {pillar.description}
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>

            {/* 📍 Tarjeta Informativa corregida con fondo blanco/90 y sombra suave */}
            <div className="mt-4 rounded-3xl border border-purple/30 bg-white/90 p-5 shadow-sm backdrop-blur-sm">
              <p className="font-jakarta text-center text-xs font-bold text-purple sm:text-sm">
                Un programa pensado para todos los niveles: desde tu primera nota hasta el
                escenario.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}