/* eslint-disable @next/next/no-html-link-for-pages -- native anchors are required so the browser fires hashchange for same-page service deep links */
"use client";

import Link from "next/link";
import { MessageCircle, Mail, MapPin } from "lucide-react";

// 📍 ÍCONOS SVG NATIVOS PARA REDES SOCIALES
const SocialIcons = {
  Instagram: () => (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  Youtube: () => (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  TikTok: () => (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.31 1.52-1.28 2.52.02.97.51 1.91 1.33 2.45.92.62 2.14.73 3.12.28 1.05-.46 1.71-1.57 1.72-2.73.02-5.3.01-10.6.01-15.9z" />
    </svg>
  ),
  Facebook: () => (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  )
};

export default function Footer() {
  return (
    <footer id="footer" className="w-full bg-neutral-900 text-neutral-300 font-jakarta border-t border-neutral-800">

      {/* 1. BANNER CON FRASE DE CIERRE */}
      <div className="border-b border-neutral-800 py-10 px-4 sm:px-6 lg:px-8 text-center bg-neutral-950/50">
        <p className="font-poppins text-lg sm:text-2xl font-extrabold tracking-wide text-white">
          &ldquo;La magia empieza cuando decides escuchar tu voz.&rdquo;
        </p>
      </div>

      {/* 2. CONTENIDO PRINCIPAL EN COLUMNAS */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">

          {/* COLUMNA 1: MARCA Y CONTACTO */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="font-poppins text-xl font-black text-white tracking-tight">
                La Magia de Cantar
              </h3>
              <p className="font-poppins text-xs font-bold text-yellow uppercase tracking-widest mt-0.5">
                Yanetsis Alfonso
              </p>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm font-poppins">
              Plataforma de transformación vocal, emocional y artística. Entrenamos voces con sueños grandes para la escena, la televisión y la vida.
            </p>

            {/* DATOS DE CONTACTO */}
            <div className="space-y-3 text-xs">
              <a
                href="https://wa.me/573053678742"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-neutral-300 hover:text-white transition-colors font-poppins"
              >
                <MessageCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Hablar por WhatsApp</span>
              </a>

              <a
                href="mailto:Lamagiadecantar08@gmail.com"
                className="flex items-center gap-2.5 text-neutral-300 hover:text-white transition-colors font-poppins"
              >
                <Mail className="h-4 w-4 text-yellow shrink-0" />
                <span>Hablar por email</span>
              </a>

              <div className="flex items-start gap-2.5 text-neutral-300 font-poppins">
                <MapPin className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Calle 121 No. 11A-23 Bogotá, Colombia</span>
              </div>
            </div>

            {/* REDES SOCIALES CON SVGs DIRECTOS */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com/lamagiadecantar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-white hover:bg-white hover:text-black transition-all"
              >
                <SocialIcons.Instagram />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-white hover:bg-white hover:text-black transition-all"
              >
                <SocialIcons.Youtube />
              </a>

              <a
                href="https://tiktok.com/@lamagiadeantar_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-white hover:bg-white hover:text-black transition-all"
              >
                <SocialIcons.TikTok />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-white hover:bg-white hover:text-black transition-all"
              >
                <SocialIcons.Facebook />
              </a>
            </div>
          </div>

          {/* COLUMNA 2: MENÚ RÁPIDO */}
          <div>
            <h4 className="font-poppins text-xs font-black uppercase tracking-wider text-white mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-poppins">
              <li>
                <Link href="/#inicio" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/#la-magia-de-cantar" className="hover:text-white transition-colors">
                  La Magia de Cantar
                </Link>
              </li>
              <li>
                <Link href="/#voice-evolution" className="hover:text-white transition-colors">
                  Voice Evolution
                </Link>
              </li>
              <li>
                <Link href="/#nuestros-servicios" className="hover:text-white transition-colors">
                  Nuestros Servicios
                </Link>
              </li>
              <li>
                <Link href="/#empresas-e-instituciones" className="hover:text-white transition-colors">
                  Empresas e Instituciones
                </Link>
              </li>
              <li>
                <Link href="/#testimonios" className="hover:text-white transition-colors">
                  Testimonios
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: SERVICIOS DESTACADOS */}
          <div>
            <h4 className="font-poppins text-xs font-black uppercase tracking-wider text-white mb-4">
              Servicios Destacados
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-poppins">
              <li>
                <a href="/#tecnica-vocal-ind" className="hover:text-white transition-colors">
                  Clases de canto en Bogotá
                </a>
              </li>
              <li>
                <a href="/#tecnica-vocal-ind" className="hover:text-white transition-colors">
                  Técnica vocal
                </a>
              </li>
              <li>
                <a href="/#kids-grupales" className="hover:text-white transition-colors">
                  Entrenamiento vocal para niños
                </a>
              </li>
              <li>
                <a href="/#teens-grupales" className="hover:text-white transition-colors">
                  Entrenamiento vocal para adolescentes
                </a>
              </li>
              <li>
                <a href="/#adultos-grupales" className="hover:text-white transition-colors">
                  Canto para adultos
                </a>
              </li>
              <li>
                <a href="/#tecnica-yanetsis" className="hover:text-white transition-colors">
                  Técnica vocal con Yanetsis Alfonso
                </a>
              </li>
              <li>
                <a href="/#coaching-yanetsis" className="hover:text-white transition-colors">
                  Coaching artístico
                </a>
              </li>
              <li>
                <a href="/#empresas-e-instituciones" className="hover:text-white transition-colors">
                  Entrenamiento vocal corporativo
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: LEGAL (Rutas conectadas a App Router) */}
          <div>
            <h4 className="font-poppins text-xs font-black uppercase tracking-wider text-white mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-poppins">
              <li>
                <Link href="/politica-de-privacidad" className="hover:text-white transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos-y-condiciones" className="hover:text-white transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/tratamiento-de-datos" className="hover:text-white transition-colors">
                  Tratamiento de datos personales
                </Link>
              </li>
              <li>
                <Link href="/politica-de-pagos" className="hover:text-white transition-colors">
                  Política de pagos y cancelaciones
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. BARRA INFERIOR DE COPYRIGHT */}
      <div className="w-full border-t border-neutral-800 bg-black py-6 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 font-poppins text-xs">

          {/* Izquierda: Derechos Reservados */}
          <p className="text-neutral-400 text-center sm:text-left">
            © 2026 Yanetsis Alfonso · La Magia de Cantar. Todos los derechos reservados.
          </p>

          {/* Derecha: Créditos de Desarrollo */}
          <p className="text-neutral-400 text-center sm:text-right">
            Desarrollado por{' '}
            <span className="text-lime-400 font-semibold">Jesus Pupo</span>{' '}
            <span className="text-sky-400">&bull;</span>{' '}
            <a
              href="https://jesuspupo.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-bold hover:text-lime-400 transition-colors underline-offset-4"
            >
              WannaDev Studios
            </a>
          </p>
        </div>
      </div>

    </footer>
  );
}