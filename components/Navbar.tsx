/* eslint-disable @next/next/no-html-link-for-pages -- native anchors required so the browser fires hashchange for same-page section scrolling */
"use client";

import Image from "next/image";
import { useState } from "react";

// Hash ABSOLUTO (/#...) para que los enlaces funcionen desde cualquier página
// (p. ej. /checkout), no solo desde la home donde existen las secciones.
const navLinks = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#la-magia-de-cantar", label: "La magia de cantar" },
  { href: "/#metodo-yanetsis", label: "Método Yanetsis" },
  { href: "/#nuestros-servicios", label: "Nuestros servicios" },
  { href: "/#empresas-o-instituciones", label: "Empresas e instituciones" },
  { href: "/#testimonios", label: "Testimonios" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 sm:px-8 lg:px-8">
        
        {/* 1. LOGO */}
        <a href="/#inicio" className="flex shrink-0 items-center" aria-label="Ir al inicio">
          <Image
            src="/assets/dark-logo.png"
            alt="Yanetsis + La magia de cantar"
            width={1524}
            height={860}
            className="h-8 w-auto object-contain sm:h-9"
            priority
          />
        </a>

        {/* 2. ENLACES CENTRADOS (Desktop) */}
        <ul className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-poppins text-sm font-semibold text-gray-800 transition-colors hover:text-purple"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* 3. BOTÓN DERECHA: WhatsApp Directo (Desktop) */}
        <div className="hidden items-center lg:flex">
          <a
            href="https://wa.me/573053678742?text=Hola%20Yanetsis,%20quiero%20más%20información%20sobre%20tus%20clases"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-brown bg-mint px-5 py-2 font-poppins text-xs font-bold uppercase tracking-wider text-black shadow-soft-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange hover:shadow-soft-md"
          >
            <svg
              className="h-4 w-4 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.707 1.456h.005c6.554 0 11.889-5.335 11.893-11.892a11.821 11.821 0 00-3.475-8.417" />
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>

        {/* BOTÓN MÓVIL (Hamburguesa) */}
        <button
          type="button"
          className="relative z-50 inline-flex items-center justify-center rounded-xl p-2 text-black hover:bg-gray-100 focus:outline-none lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* MENÚ MÓVIL DESPLEGABLE CON POSICIÓN FIXED */}
      {open && (
        <div className="fixed inset-x-0 top-[60px] z-40 h-[calc(100vh-60px)] overflow-y-auto bg-white px-6 pb-12 pt-6 shadow-2xl lg:hidden">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl border border-gray-100 bg-gray-50/80 px-5 py-4 font-poppins text-lg font-bold text-black transition-colors hover:bg-purple/10 hover:text-purple"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <a
              href="https://wa.me/573000000000?text=Hola%20Yanetsis,%20quiero%20más%20información%20sobre%20tus%20clases"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-black bg-mint py-4 text-center font-poppins text-base font-bold text-black shadow-soft-md"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}