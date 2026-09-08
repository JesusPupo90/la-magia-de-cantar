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

  // Initialize the brick once the SDK is loaded.
  // With preferenceId the "Mercado Pago" (wallet) option is enabled. For cards
  // and other methods, the brick tokenizes and hands the formData to onSubmit;
  // our backend creates the payment (POST /v1/payments) and redirects based on the result.
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
            // PSE hidden: bankTransfer is not included (MP rejects "none" with 422).
            // Re-enable (bankTransfer: "all") only when MP/Wompi has PSE operational.
            ticket: "all",
            mercadoPago: "all",
          },
        },
        callbacks: {
          onReady: () => {
            console.log("PaymentBrick listo, order:", orderId, "preference:", preferenceId);
            // Meta Pixel: payment flow started (funnel).
            fireEvent("InitiateCheckout", { value: amount, currency: "COP" });
          },
          onSubmit: async (formData: unknown, additionalData: unknown) => {
            console.log("PaymentBrick onSubmit, order:", orderId, "data:", formData, "extra:", additionalData);
            setPaymentError("");

            const selected = (formData as { selectedPaymentMethod?: string } | null)
              ?.selectedPaymentMethod;

            // The "Mercado Pago" (wallet) option opens its own MP checkout in a
            // new tab (window.open with the preference); the redirect to back_urls
            // is handled by MP in that tab. Nothing to do here.
            if (selected === "wallet_purchase") {
              console.log("PaymentBrick: flujo wallet, MP redirige en su pestaña.");
              return;
            }

            try {
              const result = await processPayment(orderId, formData);
              console.log("PaymentBrick: resultado del pago:", result);
              if (result.warning) console.warn("PaymentBrick: warning:", result.warning);

              if (!result.success) {
                // There's already a payment in progress for this intent → quick centered notice.
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

              // PSE: MP returns the bank URL (simulated in TEST) to complete
              // the transfer. It opens in a new tab; this tab goes to the
              // "Payment in progress" page.
              if (result.redirectUrl) {
                window.open(result.redirectUrl, "_blank");
              }

              if (status === "approved") {
                clearOrderId();
                window.location.href = `/checkout/success?${query.toString()}`;
              } else if (status === "pending" || status === "in_process") {
                // PSE / cash / deferred payments: the success page shows "Payment in progress".
                clearOrderId();
                window.location.href = `/checkout/success?${query.toString()}`;
              } else {
                // rejected / cancelled: we show the inline error so the user can retry without reloading.
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
            // SDK contract: BrickError.type === "critical" is the only terminal
            // failure. "non_critical" errors (e.g. invalid card while
            // typing) are shown by the brick itself with inline validation and
            // recover on their own. We log ALL of them to diagnose.
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
        createdRef.current = false; // allow retry
        setError("No se pudo iniciar el pago. Inténtalo de nuevo.");
      });
  }, [sdkReady, preferenceId, orderId, amount, retryKey, onToast]);

  const mpMissing = sdkReady && typeof window !== "undefined" && !window.MercadoPago;

  const handleRetry = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""; // clean up orphaned DOM from the previous brick
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

      {/* Error banner ONLY for critical failures. Lives in a separate slot, ABOVE
          the brick: it never replaces or shares the MP container, so it can't
          shrink or move the form. */}
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

      {/* PAYMENT error (rejection or charge failure): does NOT unmount the brick;
          the user can fix the data and retry without reloading the page. */}
      {paymentError && (
        <div className="flex w-full items-start gap-2 rounded-xl border-2 border-black bg-pink-soft p-3 text-xs font-extrabold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <span className="flex-1">{paymentError}</span>
        </div>
      )}

      {/* Once the SDK is ready, the brick container renders unconditionally and is
          NEVER unmounted or swapped for another node.
          (mpMissing / !sdkReady are pre-mount states: there's no brick yet.) */}
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
