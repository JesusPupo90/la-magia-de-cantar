"use client";

import Image from "next/image";
import { CurlyArrow } from "@/lib/iconsLibrary";

const subtitle =
  "Prepara tu voz y domina el escenario con Yanetsis Alfonso, coach vocal de TV. Un entrenamiento integral para quienes sueñan en grande.";

const tvShows = [
  "La Voz Kids",
  "Yo Me Llamo",
  "A Otro Nivel",
  "La Descarga",
  "La reina del Flow",
  "La Voz Senior",
  "La Voz Colombia",
  "La Descarga",
  "La Primera Vez",
  "Tu Cara Me Suena",
  "La Gira"
];

export default function Hero() {
  const marqueeList = [...tvShows, ...tvShows];

  return (
    <section id="inicio" className="relative w-full overflow-hidden bg-white">
      
      {/* ========================================================= */}
      {/* 1. BLOQUE SUPERIOR (CON IMAGEN DE FONDO EXCLUSIVA)        */}
      {/* ========================================================= */}
      <div className="relative w-full px-4 py-8 sm:px-8 sm:py-12 lg:py-12">
        
        {/* 📍 IMAGEN DE FONDO (Limitada solo a la grilla principal) */}
        <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
          <Image
            src="/assets/bg-img.webp"
            alt="Fondo Hero"
            fill
            priority
            quality={100}
            className="object-cover object-center"
          />
        </div>

        {/* 📍 FLECHA ABSOLUTE */}
        <div className="pointer-events-none absolute left-[0%] top-[35%] z-20 hidden h-28 w-28 -rotate-12 text-pink sm:h-32 sm:w-32 md:h-48 md:w-48 lg:block">
          <CurlyArrow className="h-full w-full stroke-[2.5]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl sm:px-6">
          
          {/* GRILLA PRINCIPAL CON ORDENAMIENTO Y ALINEACIÓN CENTRADA */}
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
            
            {/* 1. MARQUESINA DE PROGRAMAS */}
            <div className="order-1 mx-auto w-full max-w-sm overflow-hidden rounded-full border border-pink/30 bg-white/40 py-2 backdrop-blur-sm sm:max-w-md lg:col-span-5 lg:col-start-1 lg:mx-0">
              <div className="flex w-max animate-marquee gap-6">
                {marqueeList.map((show, index) => (
                  <div key={index} className="flex items-center gap-3 whitespace-nowrap">
                    <span className="font-poppins text-xs font-bold uppercase tracking-wider text-purple sm:text-sm">
                      {show}
                    </span>
                    <span className="text-xs text-pink">✦</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. TÍTULO PRINCIPAL */}
            <h1 className="order-2 text-center font-poppins text-4xl font-extrabold tracking-tight text-black sm:text-6xl lg:col-span-5 lg:col-start-1 lg:text-left lg:text-7xl lg:leading-[1.08]">
              Descubre{" "}
              <br className="hidden lg:inline" />
              la magia de <br />
              cantar
            </h1>

            {/* 3. IMAGEN DE YANETSIS */}
            <div className="order-3 -mt-10 pointer-events-none flex items-center justify-center lg:order-none lg:mt-0 lg:col-span-7 lg:col-start-6 lg:row-span-5 lg:row-start-1 lg:justify-end">
              <div className="w-full max-w-[22rem] sm:max-w-[600px] lg:w-[1100px] lg:max-w-none lg:scale-110">
                <Image
                  src="/assets/yanetsis(2).webp"
                  alt="Yanetsis cantando"
                  width={1860}
                  height={1833}
                  sizes="(max-width: 640px) 22rem, (max-width: 1024px) 500px, 1100px"
                  quality={100}
                  priority
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>

            {/* 4. SUBTÍTULO */}
            <p className="order-4 mx-auto max-w-lg text-center font-jakarta text-base font-medium leading-relaxed text-gray-900 sm:text-lg lg:col-span-5 lg:col-start-1 lg:mx-0 lg:text-left">
              {subtitle}
            </p>

            {/* 5. BOTÓN CTA */}
            <div className="order-5 flex justify-center pt-2 lg:col-span-5 lg:col-start-1 lg:justify-start">
              <a
                href="#nuestros-servicios"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-black bg-mint px-8 py-4 font-poppins text-base font-bold text-black shadow-soft-md transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-orange hover:shadow-soft-lg active:translate-y-0 md:text-lg"
              >
                Quiero tener la magia
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. BANNER DE LOGROS Y TRAYECTORIA (Fondo blanco limpio)   */}
      {/* ========================================================= */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-12 sm:px-8 sm:pb-16">
        <div className="border-t border-gray-100 pt-10 lg:pt-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            
            {/* Mensaje de Autoridad */}
            <div className="text-center lg:col-span-5 lg:text-left">
              <p className="mx-auto max-w-md font-poppins text-xl font-bold leading-snug tracking-tight text-black sm:text-2xl lg:mx-0">
                La plataforma de transformación vocal más elegida por artistas y apasionados del canto.
              </p>
            </div>

            {/* Tarjeta con Cifras de Impacto */}
            <div className="rounded-3xl border border-gray-100/80 bg-gray-50/90 p-6 sm:p-8 lg:col-span-7">
              <div className="grid grid-cols-3 gap-4 text-center sm:text-left">
                
                <div>
                  <span className="block font-poppins text-3xl font-black text-black sm:text-4xl">
                    +500
                  </span>
                  <span className="mt-1 block font-jakarta text-xs font-semibold text-gray-900 sm:text-sm">
                    Alumnos formados
                  </span>
                </div>

                <div>
                  <span className="block font-poppins text-3xl font-black text-purple sm:text-4xl">
                    15+
                  </span>
                  <span className="mt-1 block font-jakarta text-xs font-semibold text-gray-900 sm:text-sm">
                    Años de trayectoria
                  </span>
                </div>

                <div>
                  <span className="block font-poppins text-3xl font-black text-black sm:text-4xl">
                    6+
                  </span>
                  <span className="mt-1 block font-jakarta text-xs font-semibold text-gray-900 sm:text-sm">
                    Programas de TV
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-marquee {
          will-change: transform;
          animation: marquee 30s linear infinite;
        }
        @media (hover: hover) and (pointer: fine) {
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        }
      `}</style>
    </section>
  );
}