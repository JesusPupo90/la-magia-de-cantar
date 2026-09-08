"use client";

import Image from "next/image";
import { CurlyArrow } from "@/lib/iconsLibrary";
import Cta from "./Cta";

const subtitle =
  "Prepara tu voz y domina el escenario con Yanetsis Alfonso, coach vocal cubana de TV. Un entrenamiento integral para quienes sueñan en grande.";

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
      {/* 1. TOP BLOCK (WITH EXCLUSIVE BACKGROUND IMAGE)           */}
      {/* ========================================================= */}
      <div className="relative w-full px-4 py-8 sm:px-8 sm:py-12 lg:py-12">
        
        {/* BACKGROUND IMAGE */}
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

        {/* ABSOLUTE ARROW */}
        {/* <div className="pointer-events-none absolute left-[0%] top-[35%] z-20 hidden h-28 w-28 -rotate-12 text-pink sm:h-32 sm:w-32 md:h-48 md:w-48 lg:block">
          <CurlyArrow className="h-full w-full stroke-[2.5]" />
        </div> */}

        <div className="relative z-10 mx-auto max-w-7xl sm:px-6">
          
          {/* MAIN GRID WITH CENTERED ORDERING AND ALIGNMENT */}
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
            
            {/* 1. TV SHOWS MARQUEE */}
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

            {/* 2. MAIN TITLE */}
            <h1 className="order-2 text-center font-poppins text-4xl font-extrabold tracking-tight text-black sm:text-6xl lg:col-span-5 lg:col-start-1 lg:text-left lg:text-7xl lg:leading-[1.08]">
              Descubre{" "}
              <br className="hidden lg:inline" />
              la magia de <br />
              cantar
            </h1>

            {/* 3. YANETSIS IMAGE */}
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

            {/* 4. SUBTITLE */}
            <p className="order-4 mx-auto max-w-lg text-center font-jakarta text-base font-medium leading-relaxed text-gray-900 sm:text-lg lg:col-span-5 lg:col-start-1 lg:mx-0 lg:text-left">
              {subtitle}
            </p>

            {/* 5. CTA BUTTON */}
            <div className="order-5 flex justify-center pt-2 lg:col-span-5 lg:col-start-1 lg:justify-start">
              <Cta />
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