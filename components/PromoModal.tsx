"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const DEFAULT_SRC = "/assets/modal-banner.webp";
const DEFAULT_ALT = "Promoción La Magia de Cantar";
const DEFAULT_ASPECT_CLASS = "aspect-[2970/3713]";

interface PromoModalProps {
  src?: string;
  alt?: string;
  aspectClassName?: string;
  onClose?: () => void;
}

export default function PromoModal({
  src = DEFAULT_SRC,
  alt = DEFAULT_ALT,
  aspectClassName = DEFAULT_ASPECT_CLASS,
  onClose,
}: PromoModalProps) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  const close = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
    >
      <div className="w-full max-w-[min(88vw,27rem)] rounded-2xl border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className={`relative w-full overflow-hidden rounded-xl ${aspectClassName}`}>
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(max-width: 768px) 88vw, 432px"
            className="object-cover"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="absolute right-2 top-2 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-[3px] border-black bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
          >
            <X className="h-5 w-5" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
