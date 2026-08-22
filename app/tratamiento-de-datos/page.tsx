"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TratamientoDatosPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#FFFBEB] font-jakarta py-12 px-4 sm:px-6 lg:px-8">
      {/* Fondo Vectorial */}
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
            <div className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-yellow px-3 py-1 font-poppins text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3">
              <FileText className="h-4 w-4" /> Habeas Data
            </div>
            <h1 className="font-poppins text-3xl sm:text-4xl font-black text-black">
              Tratamiento de Datos Personales
            </h1>
            <p className="font-poppins text-xs font-bold text-gray-800 mt-2">
              Cumplimiento Ley 1581 de 2012 de Colombia
            </p>
          </div>

          <div className="space-y-6 text-sm text-gray-800 font-medium leading-relaxed">
            <p>
              En cumplimiento de la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia, <strong>La Magia de Cantar</strong> informa a los titulares sobre la política de Tratamiento de Datos Personales.
            </p>

            <section className="space-y-2">
              <h2 className="font-poppins text-lg font-black text-black">
                1. Finalidad del Tratamiento
              </h2>
              <p>
                Al autorizar el tratamiento de sus datos, el Titular permite que sus datos sean recolectados, almacenados, usados y procesados para las siguientes finalidades:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Gestionar el registro, agendamiento y coordinación de clases presenciales o virtuales.</li>
                <li>Validar el pago de inscripciones, paquetes y programas formativos.</li>
                <li>Enviar confirmaciones de compra, recordatorios de horarios y comprobantes transaccionales vía correo electrónico o WhatsApp.</li>
                <li>Suministrar información sobre nuevos programas, talleres, eventos y servicios.</li>
                <li>Dar cumplimiento a las obligaciones legales y contables aplicables.</li>
                <li>Analizar el tráfico del sitio y medir campañas de marketing mediante cookies propias y de terceros (Meta Pixel), siempre con el consentimiento del usuario según la <Link href="/politica-de-privacidad" className="font-bold text-purple underline">Política de Privacidad</Link>.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-poppins text-lg font-black text-black">
                2. Datos de Menores de Edad
              </h2>
              <p>
                En el caso de programas dirigidos a niños y adolescentes (Kids y Teens), la recolección y tratamiento de datos personales de menores de edad se realiza con la previa autorización expresa del padre, madre o tutor legal, garantizando siempre el respeto a los derechos fundamentales de los menores.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-poppins text-lg font-black text-black">
                3. Derechos del Titular (Habeas Data)
              </h2>
              <p>Como titular de los datos personales, usted tiene derecho a:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Conocer, actualizar y rectificar sus datos personales frente a La Magia de Cantar.</li>
                <li>Solicitar prueba de la autorización otorgada.</li>
                <li>Ser informado sobre el uso que se le ha dado a sus datos personales.</li>
                <li>Revocar la autorización y/o solicitar la supresión de sus datos.</li>
                <li>Acceder de forma gratuita a sus datos personales objeto de tratamiento.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-poppins text-lg font-black text-black">
                4. Canales para el Ejercicio de Derechos
              </h2>
              <p>
                Para ejercer sus derechos de consulta, actualización, rectificación o supresión, el titular puede enviar un correo formal a <strong>contacto@lamagiadecantar.co</strong> o comunicarse vía WhatsApp al <strong>+57 305 3678742</strong>. Las solicitudes serán respondidas en un plazo máximo de diez (10) días hábiles.
              </p>
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}