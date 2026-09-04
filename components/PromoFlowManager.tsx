"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Mic } from "lucide-react";
import PromoModal from "@/components/PromoModal";
import { consentState, subscribeConsent } from "@/lib/meta";

const STICKER_DELAY_MS = 1500;

export default function PromoFlowManager() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isStickerVisible, setIsStickerVisible] = useState(false);
  const consent = useSyncExternalStore(subscribeConsent, () => consentState(), () => null);
  const timerRef = useRef<number | null>(null);
  const timerStartedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const startStickerTimer = useCallback(() => {
    if (timerStartedRef.current) return;
    timerStartedRef.current = true;
    timerRef.current = window.setTimeout(() => {
      setIsStickerVisible(true);
      timerRef.current = null;
    }, STICKER_DELAY_MS);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    if (!isModalOpen && consent !== null) startStickerTimer();
  }, [isModalOpen, consent, startStickerTimer]);

  return (
    <>
      {isModalOpen && <PromoModal onClose={handleCloseModal} />}

      <Link
        href="/prueba-de-voz"
        aria-hidden={!isStickerVisible}
        tabIndex={isStickerVisible ? 0 : -1}
        className={`fixed bottom-6 left-1/2 z-40 inline-flex -translate-x-1/2 items-center whitespace-nowrap gap-1.5 rounded-full border-[3px] border-black bg-pink px-4 py-3.5 font-poppins text-xs font-black uppercase tracking-wide text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-rotate-2 hover:scale-105 sm:gap-2 sm:px-6 sm:py-4 sm:text-sm md:left-6 md:translate-x-0 ${
          isStickerVisible
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-50 opacity-0"
        }`}
      >
        <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
        Prueba de voz IA
      </Link>
    </>
  );
}
