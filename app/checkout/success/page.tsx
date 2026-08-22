import Link from "next/link";
import { CheckCircle2, Music, Mail, MessageCircle, ArrowRight, Receipt } from "lucide-react";
import MetaPurchaseEvent from "@/components/MetaPurchaseEvent";

interface SuccessPageProps {
  searchParams: Promise<{
    payment_id?: string;
    status?: string;
    external_reference?: string;
    amount?: string;
  }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  // En Next.js App Router (v15+), searchParams es una promesa
  const params = await searchParams;
  
  const orderId = params.external_reference;
  const paymentId = params.payment_id;
  const isPending = params.status === "in_process" || params.status === "pending";
  const amount = Number(params.amount);

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center bg-[#FFFBEB] px-4 py-16 sm:px-6 lg:px-8">
      <MetaPurchaseEvent value={amount} orderId={orderId ?? ""} status={params.status} />
      <div className="w-full max-w-2xl">
        
        {/* TARJETA PRINCIPAL */}
        <div className="overflow-hidden rounded-3xl border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          
          {/* Cabecera de éxito */}
          <div className={`border-b-[3px] border-black p-8 text-center sm:p-10 ${isPending ? 'bg-yellow' : 'bg-mint/40'}`}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {isPending ? (
                <Receipt className="h-10 w-10 text-yellow-600" />
              ) : (
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              )}
            </div>
            
            <h1 className="mt-6 font-poppins text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
              {isPending ? "Pago en proceso" : "¡Pago exitoso!"}
            </h1>
            <p className="mt-4 font-jakarta text-sm font-medium text-gray-700 sm:text-base">
              {isPending 
                ? "Tu pago por PSE o efectivo está siendo procesado. Te notificaremos en cuanto se confirme."
                : "Hemos recibido tu pago correctamente. Tu cupo está asegurado en La Magia de Cantar."}
            </p>
          </div>

          {/* Detalles de la orden */}
          <div className="p-8 sm:p-10">
            <h2 className="font-poppins text-lg font-black uppercase tracking-tight text-black">
              Resumen de la transacción
            </h2>
            
            <div className="mt-4 rounded-2xl border-2 border-black/10 bg-gray-50 p-5 space-y-3">
              {orderId && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="font-poppins text-xs font-bold text-gray-500 uppercase tracking-wider">Número de Orden</span>
                  <span className="font-jakarta text-sm font-semibold text-black break-all">{orderId}</span>
                </div>
              )}
              {paymentId && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-t border-black/10 pt-3">
                  <span className="font-poppins text-xs font-bold text-gray-500 uppercase tracking-wider">ID de Transacción (Mercado Pago)</span>
                  <span className="font-jakarta text-sm font-semibold text-black">{paymentId}</span>
                </div>
              )}
            </div>

            {/* Siguientes pasos */}
            <h3 className="mt-10 font-poppins text-lg font-black uppercase tracking-tight text-black">
              ¿Qué sigue ahora?
            </h3>
            
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-black bg-pink-soft text-black">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-poppins text-sm font-bold text-black">Revisa tu correo electrónico</h4>
                  <p className="mt-1 font-jakarta text-xs font-medium text-gray-600">
                    En unos minutos recibirás un comprobante detallado y las instrucciones para tu primera clase. Revisa la carpeta de Spam por si acaso.
                  </p>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-black bg-yellow text-black">
                  <Music className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-poppins text-sm font-bold text-black">Prepárate para cantar</h4>
                  <p className="mt-1 font-jakarta text-xs font-medium text-gray-600">
                    Si tienes dudas antes de iniciar, nuestro equipo está listo para ayudarte.
                  </p>
                </div>
              </li>
            </ul>

            {/* Botones de acción */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-[3px] border-black bg-white px-6 py-4 font-poppins text-sm font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                Volver al inicio <ArrowRight className="h-4 w-4" />
              </Link>
              
              <a
                href="https://wa.me/573000000000" // Cambiar por el número de WhatsApp real de la academia
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-[3px] border-black bg-emerald-400 px-6 py-4 font-poppins text-sm font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <MessageCircle className="h-5 w-5" /> Escribir a soporte
              </a>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}