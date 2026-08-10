"use client";

import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export default function TerminosCondicionesPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#FFFBEB] font-jakarta py-12 px-4 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-10 bg-[url('/assets/patron-3.svg')] bg-repeat bg-top-left [background-size:1400px]"
      ></div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <Link
          href="/#footer"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2 font-poppins text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al Inicio
        </Link>

        <div className="rounded-3xl border-4 border-black bg-white p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
          
          <div className="border-b-2 border-black pb-6">
            <div className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-mint px-3 py-1 font-poppins text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3">
              <Scale className="h-4 w-4" /> Términos Legal
            </div>
            <h1 className="font-poppins text-3xl sm:text-4xl font-black text-black">
              Términos y Condiciones
            </h1>
          </div>

          <div className="space-y-6 text-sm text-gray-800 font-medium leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-poppins text-lg font-black text-black">
                1. Aceptación de los Términos
              </h2>
              <p>
                Al acceder, navegar o realizar una compra en el sitio web de <strong>La Magia de Cantar</strong>, el usuario acepta quedar vinculado bajo los presentes Términos y Condiciones, así como por todas las leyes y regulaciones aplicables en Colombia. Si el usuario no está de acuerdo con alguno de estos términos, debe abstenerse de usar el sitio o contratar servicios en línea.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-poppins text-lg font-black text-black">
                2. Servicios Formativos y Contrato
              </h2>
              <p>
                La Magia de Cantar ofrece programas grupales, clases individuales, programas de instrumentos, asesorías corporativas y coaching artístico con Yanetsis Alfonso. La compra de cualquier servicio a través de la web otorga el derecho a recibir la formación bajo las modalidades (presencial o virtual), intensidades y horarios pactados previamente con el equipo de coordinación.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-poppins text-lg font-black text-black">
                3. Propiedad Intelectual
              </h2>
              <p>
                Todo el contenido presente en este sitio web, incluyendo textos, diseños, nombres de métodos (como el método <em>Voice Evolution by Yanetsis</em>), logotipos, gráficos, código fuente y material audiovisual, es propiedad exclusiva de <strong>Yanetsis Alfonso / La Magia de Cantar</strong> o de sus respectivos licenciantes, y está protegido por las leyes internacionales de derechos de autor y propiedad industrial. Queda prohibida la reproducción, distribución o modificación no autorizada de dichos contenidos.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-poppins text-lg font-black text-black">
                4. Limitación de Responsabilidad
              </h2>
              <p>
                La Magia de Cantar realiza esfuerzos continuos para garantizar el correcto funcionamiento del sitio web. No obstante, no se hace responsable por interrupciones temporales del servicio debidas a fallas técnicas, mantenimiento o causas de fuerza mayor ajenas a nuestro control.
              </p>
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}