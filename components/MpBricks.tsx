"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { AlertCircle, Loader2, RotateCcw } from "lucide-react";

interface MpBricksProps {
  preferenceId: string;
  orderId: string;
  amount: number;
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

export default function MpBricks({ preferenceId, orderId, amount }: MpBricksProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState("");
  const createdRef = useRef(false);
  const [retryKey, setRetryKey] = useState(0);

  // Inicializar el brick una vez que el SDK esté cargado.
  // Con preferenceId (Checkout Pro embebido) MP procesa el pago y redirige a los
  // back_urls (success/failure) con payment_id, status y external_reference.
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
          preferenceId,
          amount,
        },
        customization: {
          paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            bankTransfer: "all",
            ticket: "all",
            mercadoPago: "all",
          },
        },
        callbacks: {
          onReady: () => {
            console.log("PaymentBrick listo, order:", orderId, "preference:", preferenceId);
          },
          onSubmit: () => {
            // Con preferenceId el pago lo procesa MP; el redirect lo hacen los
            // back_urls de la preferencia (auto_return). Aquí no hay que hacer nada.
          },
          onError: (brickError: unknown) => {
            // Contrato del SDK: BrickError.type === "critical" es la única falla
            // terminal. Los errores "non_critical" (p. ej. tarjeta inválida mientras
            // se tipea) los muestra el propio brick con validación inline y se
            // recupera solo: NO deben tocar nuestro estado ni desmontar la UI.
            const type = (brickError as { type?: string })?.type;
            if (type === "critical") {
              console.error("Error PaymentBrick (critical):", brickError);
              setError("Ocurrió un error al mostrar el método de pago.");
            } else {
              console.warn("PaymentBrick (non-critical):", brickError);
            }
          },
        },
      })
      .catch((err: unknown) => {
        console.error("Error creando PaymentBrick:", err);
        createdRef.current = false; // permitir reintento
        setError("No se pudo iniciar el pago. Inténtalo de nuevo.");
      });
  }, [sdkReady, preferenceId, orderId, amount, retryKey]);

  const mpMissing = sdkReady && typeof window !== "undefined" && !window.MercadoPago;

  const handleRetry = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""; // limpiar DOM huérfano del brick anterior
    }
    createdRef.current = false;
    setError("");
    setRetryKey((k) => k + 1);
  }, []);

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

      {/* Banner de error SOLO para fallas críticas. Vive en un slot aparte, ARRIBA
          del brick: nunca reemplaza ni comparte el contenedor de MP, por lo que no
          puede encoger ni mover el formulario. */}
      {error && (
        <div className="flex w-full items-start gap-2 rounded-xl border-2 border-black bg-pink-soft p-3 text-xs font-extrabold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <span className="flex-1">{error}</span>
          {!mpMissing && (
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border-2 border-black bg-white px-2.5 py-1 font-poppins text-[10px] font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
            >
              <RotateCcw className="h-3 w-3" /> Reintentar
            </button>
          )}
        </div>
      )}

      {/* El contenedor del brick, una vez que el SDK está listo, se renderiza de
          forma incondicional y NUNCA se desmonta ni se intercambia por otro nodo.
          (mpMissing / !sdkReady son estados previos al montaje: no hay brick aún.) */}
      {mpMissing ? (
        <div className="flex items-start gap-2 rounded-xl border-2 border-black bg-pink-soft p-3 text-xs font-extrabold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <span>No se pudo cargar el método de pago. Recarga la página.</span>
        </div>
      ) : !sdkReady ? (
        <div className="flex items-center justify-center gap-2 py-8 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-jakarta text-sm">Cargando métodos de pago...</span>
        </div>
      ) : (
        <div id="payment-brick-container" ref={containerRef} className="min-h-[300px] w-full" />
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
