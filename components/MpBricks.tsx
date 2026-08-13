"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { AlertCircle, Loader2 } from "lucide-react";

interface MpBricksProps {
  clientToken: string;
  orderId: string;
  amount: number;
  payer: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface MpBrick {
  create: (
    name: string,
    containerId: string,
    opts: object
  ) => Promise<unknown>;
}

interface MercadoPagoConstructor {
  new (
    publicKey: string,
    options?: { locale?: string }
  ): { bricks: () => MpBrick };
}

declare global {
  interface Window {
    MercadoPago?: MercadoPagoConstructor;
  }
}

export default function MpBricks({ clientToken, orderId, amount }: MpBricksProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState("");
  const createdRef = useRef(false);

  // Inicializar el brick una vez que el SDK esté cargado
  useEffect(() => {
    if (!sdkReady || createdRef.current || !containerRef.current) return;
    const mp = window.MercadoPago;
    if (!mp) return;

    createdRef.current = true;
    const bricks = new mp(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
      locale: "es-CO",
    }).bricks();

    bricks
      .create("payment", "payment-brick-container", {
        initialization: {
          clientToken,
        },
        callbacks: {
          onReady: () => {
            console.log("PaymentBrick listo, order:", orderId);
          },
          onSubmit: ({ selectedPaymentMethod }: { selectedPaymentMethod: unknown }) => {
            // Con clientToken (Orders API) el pago lo procesa el propio brick.
            console.log("onSubmit", selectedPaymentMethod);
          },
          onError: (brickError: unknown) => {
            console.error("Error PaymentBrick:", brickError);
            setError("Ocurrió un error al mostrar el método de pago.");
          },
        },
      })
      .catch((err: unknown) => {
        console.error("Error creando PaymentBrick:", err);
        setError("No se pudo iniciar el pago. Inténtalo de nuevo.");
      });
  }, [sdkReady, clientToken, orderId]);

  const mpMissing = sdkReady && typeof window !== "undefined" && !window.MercadoPago;

  return (
    <div className="space-y-4">
      <Script
        src="https://sdk.mercadopago.com/js/v2"
        strategy="lazyOnload"
        onReady={() => setSdkReady(true)}
        onError={() => setError("No se pudo cargar el método de pago.")}
      />

      <div className="rounded-2xl border-2 border-black bg-mint/20 p-4">
        <p className="font-poppins text-sm font-black uppercase text-black">
          Elige cómo quieres pagar
        </p>
        <p className="mt-1 font-jakarta text-xs text-gray-600">
          Tarjetas de crédito/débito, PSE o efectivo. Operación segura de Mercado Pago.
        </p>
      </div>

      {error ? (
        <div className="flex items-start gap-2 rounded-xl border-2 border-black bg-pink-soft p-3 text-xs font-extrabold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      ) : mpMissing ? (
        <div className="flex items-start gap-2 rounded-xl border-2 border-black bg-pink-soft p-3 text-xs font-extrabold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>No se pudo cargar el método de pago. Recarga la página.</span>
        </div>
      ) : !sdkReady ? (
        <div className="flex items-center justify-center gap-2 py-8 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-jakarta text-sm">Cargando métodos de pago...</span>
        </div>
      ) : (
        <div id="payment-brick-container" ref={containerRef} className="min-h-[300px]" />
      )}

      <p className="font-jakarta text-[10px] text-gray-500">
        Monto a pagar: {amount.toLocaleString("es-CO")} COP. Al continuar aceptas los{" "}
        <a href="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" className="text-purple underline">
          términos y condiciones
        </a>{" "}
        de La Magia de Cantar.
      </p>
    </div>
  );
}
