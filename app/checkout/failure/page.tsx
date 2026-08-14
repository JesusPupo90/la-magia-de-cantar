import Link from "next/link";
import { XCircle, ArrowLeft, MessageCircle, AlertTriangle } from "lucide-react";

interface FailurePageProps {
  searchParams: Promise<{
    payment_id?: string;
    status?: string;
    external_reference?: string;
  }>;
}

export default async function FailurePage({ searchParams }: FailurePageProps) {
  const params = await searchParams;
  
  const orderId = params.external_reference;
  const paymentId = params.payment_id;

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center bg-[#FFFBEB] px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        
        {/* MAIN CARD */}
        <div className="overflow-hidden rounded-3xl border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          
          {/* HEADER */}
          <div className="border-b-[3px] border-black bg-pink-soft p-8 text-center sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            
            <h1 className="mt-6 font-poppins text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
              Pago rechazado
            </h1>
            <p className="mt-4 font-jakarta text-sm font-medium text-gray-800 sm:text-base">
              No pudimos procesar tu transacción. Esto suele ocurrir por medidas de seguridad de tu banco, fondos insuficientes o un error de conexión temporal.
            </p>
          </div>

          {/* TRANSACTION DETAILS */}
          <div className="p-8 sm:p-10">
            <h2 className="font-poppins text-lg font-black uppercase tracking-tight text-black">
              Detalles del intento
            </h2>
            
            <div className="mt-4 rounded-2xl border-2 border-black/10 bg-gray-50 p-5 space-y-3">
              {orderId && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="font-poppins text-xs font-bold uppercase tracking-wider text-gray-500">Número de Orden</span>
                  <span className="break-all font-jakarta text-sm font-semibold text-black">{orderId}</span>
                </div>
              )}
              {paymentId && paymentId !== "null" && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-t border-black/10 pt-3">
                  <span className="font-poppins text-xs font-bold uppercase tracking-wider text-gray-500">ID de Transacción</span>
                  <span className="font-jakarta text-sm font-semibold text-black">{paymentId}</span>
                </div>
              )}
            </div>

            {/* TROUBLESHOOTING */}
            <h3 className="mt-10 font-poppins text-lg font-black uppercase tracking-tight text-black">
              ¿Qué puedes hacer?
            </h3>
            
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-poppins text-sm font-bold text-black">Verifica con tu banco</h4>
                  <p className="mt-1 font-jakarta text-xs font-medium text-gray-600">
                    Algunas tarjetas requieren autorización previa para compras en línea.
                  </p>
                </div>
              </li>
            </ul>

            {/* ACTIONS */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/#nuestros-servicios"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-[3px] border-black bg-yellow px-6 py-4 font-poppins text-sm font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <ArrowLeft className="h-4 w-4" /> Volver a intentar
              </Link>
              
              <a
                href="https://wa.me/573000000000" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-[3px] border-black bg-white px-6 py-4 font-poppins text-sm font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <MessageCircle className="h-5 w-5" /> Soporte
              </a>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}