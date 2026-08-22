"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { processPayment } from "@/app/actions/payments";
import { clearOrderId } from "@/lib/checkout-storage";
import { fireEvent } from "@/lib/meta";

interface MpBricksProps {
  preferenceId: string;
  orderId: string;
  amount: number;
  onToast?: (message: string) => void;
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

export default function MpBricks({ preferenceId, orderId, amount, onToast }: MpBricksProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const createdRef = useRef(false);
  const [retryKey, setRetryKey] = useState(0);

  // Inicializar el brick una vez que el SDK esté cargado.
  // Con preferenceId se habilita la opción "Mercado Pago" (wallet). Para tarjetas
  // y otros métodos, el brick tokeniza y entrega el formData a onSubmit; nuestro
  // backend crea el pago (POST /v1/payments) y redirige según el resultado.
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
            // PSE oculto temporalmente: MP devuelve 9032 (BankTransfers Api fail)
            // con payload correcto e IP pública real, en pruebas y producción.
            // Re-activar (cambiar a "all") cuando MP resuelva el servicio PSE.
            bankTransfer: "none",
            ticket: "all",
            mercadoPago: "all",
          },
        },
        callbacks: {
          onReady: () => {
            console.log("PaymentBrick listo, order:", orderId, "preference:", preferenceId);
            // 📊 Meta Pixel: inició el flujo de pago (funnel).
            fireEvent("InitiateCheckout", { value: amount, currency: "COP" });
          },
          onSubmit: async (formData: unknown, additionalData: unknown) => {
            console.log("PaymentBrick onSubmit, order:", orderId, "data:", formData, "extra:", additionalData);
            setPaymentError("");

            const selected = (formData as { selectedPaymentMethod?: string } | null)
              ?.selectedPaymentMethod;

            // La opción "Mercado Pago" (wallet) abre su propio checkout de MP en una
            // pestaña nueva (window.open con la preferencia); el redirect a back_urls
            // lo maneja MP en esa pestaña. No hay nada que hacer aquí.
            if (selected === "wallet_purchase") {
              console.log("PaymentBrick: flujo wallet, MP redirige en su pestaña.");
              return;
            }

            try {
              const result = await processPayment(orderId, formData);
              console.log("PaymentBrick: resultado del pago:", result);
              if (result.warning) console.warn("PaymentBrick: warning:", result.warning);

              if (!result.success) {
                // Ya hay un pago en proceso para esta intención → aviso rápido centrado.
                if (result.code === "PENDING_PAYMENT") {
                  onToast?.(result.message || "El pago ya está en proceso de confirmación.");
                } else {
                  setPaymentError(result.message || "Ocurrió un error al procesar el pago.");
                }
                return;
              }

              const status = result.status ?? "";
              const query = new URLSearchParams({
                payment_id: result.paymentId ?? "",
                status,
                external_reference: result.orderId ?? orderId,
                amount: String(amount),
              });

              // PSE: MP devuelve la URL del banco (simulado en TEST) para completar
              // la transferencia. Se abre en pestaña nueva; esta pestaña sigue a la
              // página de "Pago en proceso".
              if (result.redirectUrl) {
                window.open(result.redirectUrl, "_blank");
              }

              if (status === "approved") {
                clearOrderId();
                window.location.href = `/checkout/success?${query.toString()}`;
              } else if (status === "pending" || status === "in_process") {
                // PSE / efectivo / pagos diferidos: la página de éxito muestra "Pago en proceso".
                clearOrderId();
                window.location.href = `/checkout/success?${query.toString()}`;
              } else {
                // rejected / cancelled: mostramos el error en línea para reintentar sin recargar.
                setPaymentError(
                  "El pago fue rechazado. Verifica los datos del medio de pago e inténtalo de nuevo."
                );
              }
            } catch (err) {
              console.error("PaymentBrick: error en onSubmit:", err);
              setPaymentError("Ocurrió un error al procesar el pago. Inténtalo de nuevo.");
            }
          },
          onError: (brickError: unknown) => {
            // Contrato del SDK: BrickError.type === "critical" es la única falla
            // terminal. Los errores "non_critical" (p. ej. tarjeta inválida mientras
            // se tipea) los muestra el propio brick con validación inline y se
            // recupera solo. Logueamos TODOS para poder diagnosticar.
            const e = brickError as { type?: string; cause?: string; message?: string };
            if (e?.type === "critical") {
              console.error("PaymentBrick (critical):", brickError);
              setError("Ocurrió un error al mostrar el método de pago.");
            } else {
              console.warn("PaymentBrick (non-critical):", e);
            }
          },
        },
      })
      .catch((err: unknown) => {
        console.error("Error creando PaymentBrick:", err);
        createdRef.current = false; // permitir reintento
        setError("No se pudo iniciar el pago. Inténtalo de nuevo.");
      });
  }, [sdkReady, preferenceId, orderId, amount, retryKey, onToast]);

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

      {/* Error de PAGO (rechazo o fallo al cobrar): NO desmonta el brick; el
          usuario puede corregir los datos y reintentar sin recargar la página. */}
      {paymentError && (
        <div className="flex w-full items-start gap-2 rounded-xl border-2 border-black bg-pink-soft p-3 text-xs font-extrabold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <span className="flex-1">{paymentError}</span>
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
