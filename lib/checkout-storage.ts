// lib/checkout-storage.ts
// Persistencia en sessionStorage del formulario de checkout y de la intención
// de pago (orderId reutilizable en reintentos). Compartido por CheckoutForm
// (guarda/restaura el borrador) y MpBricks (limpia el orderId tras el éxito).

export const DRAFT_KEY = "lmdc_checkout_draft";
export const ORDER_KEY = "lmdc_checkout_order";

export function loadDraft<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveDraft<T>(value: T) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(value));
  } catch {
    // storage lleno o bloqueado
  }
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // noop
  }
}

export function loadOrderId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(ORDER_KEY);
  } catch {
    return null;
  }
}

export function saveOrderId(orderId: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (orderId) {
      window.sessionStorage.setItem(ORDER_KEY, orderId);
    } else {
      window.sessionStorage.removeItem(ORDER_KEY);
    }
  } catch {
    // noop
  }
}

export function clearOrderId() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(ORDER_KEY);
  } catch {
    // noop
  }
}
