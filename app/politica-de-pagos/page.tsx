"use client";

import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";

export default function PoliticaPagosPage() {
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
            <div className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-sky-300 px-3 py-1 font-poppins text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3">
              <CreditCard className="h-4 w-4" /> Pagos & Cancelaciones
            </div>
            <h1 className="font-poppins text-3xl sm:text-4xl font-black text-black">
              Política de Pagos y Cancelaciones
            </h1>
          </div>

          <div className="space-y-6 text-sm text-gray-800 font-medium leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-poppins text-lg font-black text-black">
                1. Procesamiento de Pagos
              </h2>
              <p>
                Los pagos de los programas, paquetes de clases y asesorías se realizan en línea de forma segura a través de pasarelas de pago autorizadas (Mercado Pago, PSE, tarjetas de crédito y débito). Para dar por confirmada la reserva o cupo en un programa, el estudiante o acudiente debe completar la transacción y enviar el comprobante de pago a través de nuestros canales oficiales de WhatsApp (+57 305 3678742).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-poppins text-lg font-black text-black">
                2. Derecho de Retracto (Ley 1480 de 2011)
              </h2>
              <p>
                De acuerdo con el Estatuto del Consumidor en Colombia (Ley 1480 de 2011, Art. 47), el comprador tiene derecho a ejercer el Derecho de Retracto dentro de los <strong>cinco (5) días hábiles</strong> siguientes a la fecha de la compra en línea, siempre y cuando la prestación del servicio formativo contratado no haya iniciado.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Para solicitar el retracto, se debe enviar una comunicación formal al correo <strong>contacto@lamagiadecantar.co</strong>.</li>
                <li>La devolución del dinero se realizará a través del mismo medio de pago utilizado dentro de los treinta (30) días calendario siguientes a la solicitud.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-poppins text-lg font-black text-black">
                3. Política de Reprogramación e Inasistencias
              </h2>
              <p>
                <strong>Clases Individuales (Canto, Instrumentos, Yanetsis Alfonso):</strong> Para reprogramar una sesión individual sin costo adicional, el estudiante debe notificar a La Magia de Cantar con al menos <strong>24 horas de anticipación</strong> a la hora agendada. De lo contrario, la clase se dará por dictada y cobrada sin opción de reembolso ni reposición.
              </p>
              <p>
                <strong>Clases Grupales (Kids, Teens, Adultos):</strong> Debido a que responden a una programación y cupo predeterminado, las inasistencias a clases grupales no son reembolsables ni acumulables para periodos posteriores.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-poppins text-lg font-black text-black">
                4. Vencimiento de Paquetes
              </h2>
              <p>
                Los paquetes de 5 y 10 clases individuales tienen una vigencia máxima de uso de 60 y 120 días calendario respectivamente, contados a partir de la fecha de la primera clase programada. Pasado este tiempo, las clases no ejecutadas expirarán.
              </p>
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}