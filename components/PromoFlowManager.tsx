"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mic } from "lucide-react";
import PromoModal from "@/components/PromoModal";

const STICKER_DELAY_MS = 1500;

export default function PromoFlowManager() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isStickerVisible, setIsStickerVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    timerRef.current = window.setTimeout(() => {
      setIsStickerVisible(true);
      timerRef.current = null;
    }, STICKER_DELAY_MS);
  }, []);

  return (
    <>
      {isModalOpen && <PromoModal onClose={handleCloseModal} />}

      <Link
        href="/prueba-de-voz"
        aria-hidden={!isStickerVisible}
        tabIndex={isStickerVisible ? 0 : -1}
        className={`fixed bottom-6 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border-[3px] border-black bg-pink px-6 py-4 font-poppins text-sm font-black uppercase tracking-wide text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-rotate-2 hover:scale-105 md:left-6 md:translate-x-0 ${
          isStickerVisible
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-50 opacity-0"
        }`}
      >
        <Mic className="h-5 w-5" />
        Prueba de voz IA
      </Link>
    </>
  );
}
