"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { consentState, declareConsent, subscribeConsent } from "@/lib/meta";

export default function CookieNotice() {
  const state = useSyncExternalStore(subscribeConsent, () => consentState(), () => null);
  const [dismissed, setDismissed] = useState(false);

  // The notice only shows if the user hasn't decided yet (neither accepted nor rejected).
  if (dismissed || state !== null) return null;

  const decide = (value: "accepted" | "rejected") => {
    declareConsent(value);
    if (value === "accepted") {
      // We reload so the Pixel loads clean with the consent.
      window.location.reload();
    } else {
      setDismissed(true);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border-[3px] border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="font-poppins text-xs font-black uppercase tracking-wide text-black">
            Aviso de cookies
          </p>
          <p className="mt-1 font-jakarta text-xs leading-relaxed text-gray-700">
            Usamos cookies propias y de terceros para medir y mejorar tu experiencia en el sitio.
            Puedes aceptarlas, rechazarlas o consultar nuestra{" "}
            <Link href="/politica-de-privacidad" className="font-bold text-purple underline">
              política de privacidad
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-xl border-2 border-black bg-yellow px-4 py-2 font-poppins text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
          >
            Aceptar
          </button>
          <button
            type="button"
            onClick={() => decide("rejected")}
            className="rounded-xl border-2 border-black bg-white px-4 py-2 font-poppins text-xs font-black uppercase text-black transition-transform hover:-translate-y-0.5"
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
  );
}
