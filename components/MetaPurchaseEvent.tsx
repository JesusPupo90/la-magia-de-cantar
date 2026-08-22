"use client";

import { useEffect, useRef } from "react";
import { fireEvent } from "@/lib/meta";

interface MetaPurchaseEventProps {
  value: number;
  currency?: string;
  orderId: string;
  status?: string;
}

export default function MetaPurchaseEvent({ value, currency = "COP", orderId, status }: MetaPurchaseEventProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    // Solo compras aprobadas; sin monto o sin orden → no disparamos.
    if (status !== "approved") return;
    if (!Number.isFinite(value)) return;
    if (!orderId) return;

    // Dedupe: una sola vez por orden (sessionStorage).
    try {
      const key = `meta_purchase_${orderId}`;
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // storage bloqueado → disparamos igual
    }

    fired.current = true;
    fireEvent("Purchase", { value, currency });
  }, [value, currency, orderId, status]);

  return null;
}
