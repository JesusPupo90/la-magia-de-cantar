"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PoliticaPrivacidadPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#FFFBEB] font-jakarta py-12 px-4 sm:px-6 lg:px-8">
      {/* Fondo Vectorial */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-10 bg-[url('/assets/patron-3.svg')] bg-repeat bg-top-left [background-size:1400px]"
      ></div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Botón de Regreso */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2 font-poppins text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al Inicio
        </Link>

        {/* Tarjeta Principal */}
        <div className="rounded-3xl border-4 border-black bg-white p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
          
          {/* Encabezado */}
          <div className="border-b-2 border-black pb-6">
            <div className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-pink-soft px-3 py-1 font-poppins text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3">
              <ShieldCheck className="h-4 w-4" /> Legal
            </div>
            <h1 className="font-poppins text-3xl sm:text-4xl font-black text-black">
              Política de Privacidad
            </h1>
            <p className="font-poppins text-xs font-bold text-gray-800 mt-2">
              Última actualización: Agosto 2026
            </p>
          </div>

          {/* Contenido */}
          <div className="space-y-6 text-sm text-gray-800 font-medium leading-relaxed">
            <p>
              En <strong>La Magia de Cantar</strong>, marca representada por <strong>Yanetsis Alfonso</strong> (en adelante &quot;La Academia&quot;), valoramos y respetamos la privacidad de nuestros usuarios, estudiantes y acudientes. La presente Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos la información personal ingresada en nuestro sitio web.
            </p>

            <section className="space-y-2">
              <h2 className="font-poppins text-lg font-black text-black">
                1. Identificación del Responsable
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Razón Social / Titular:</strong> Yanetsis Alfonso / La Magia de Cantar</li>
                <li><strong>Domicilio:</strong> Calle 121 No. 11A-23, Bogotá, Colombia</li>
                <li><strong>Correo electrónico:</strong> Lamagiadecantar08@gmail.com</li>
                <li><strong>Teléfono de contacto:</strong> +57 305 3678742</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-poppins text-lg font-black text-black">
                2. Datos Recopilados
              </h2>
              <p>
                Recopilamos datos personales únicamente cuando el usuario los proporciona voluntariamente a través de nuestros formularios de compra, cotización o contacto. Estos incluyen:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Nombre completo del estudiante y/o acudiente.</li>
                <li>Edad (para la asignación adecuada del programa formativo).</li>
                <li>Número de teléfono / WhatsApp de contacto.</li>
                <li>Correo electrónico.</li>
                <li>Ciudad de residencia.</li>
                <li>Historial de transacciones y servicios seleccionados.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-poppins text-lg font-black text-black">
                3. Uso de Cookies y Rastreo
              </h2>
              <p>
                Nuestro sitio web utiliza cookies técnicas y analíticas para optimizar la experiencia de navegación, recordar preferencias de sesión y analizar el tráfico web. El usuario puede configurar o desactivar las cookies desde las opciones de su navegador en cualquier momento.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-poppins text-lg font-black text-black">
                4. Seguridad de la Información
              </h2>
              <p>
                Implementamos medidas de seguridad técnicas, humanas y administrativas para evitar la alteración, pérdida, consulta, uso o acceso no autorizado de la información personal suministrada. Las transacciones financieras no son procesadas ni almacenadas en nuestros servidores; estas se ejecutan directamente bajo los protocolos de cifrado SSL de la pasarela de pagos contratada (Mercado Pago).
              </p>
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}