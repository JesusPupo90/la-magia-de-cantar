// lib/meta.ts
// Helper del Meta Pixel (fbq) para el lado cliente. No-op si no hay
// NEXT_PUBLIC_META_PIXEL_ID configurado o si el usuario no aceptó cookies.

export const CONSENT_KEY = "lmdc_cookie_consent";

export function metaPixelId(): string | undefined {
  return process.env.NEXT_PUBLIC_META_PIXEL_ID;
}

export type ConsentState = "accepted" | "rejected" | null;

export function consentState(): ConsentState {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

export function hasConsent(): boolean {
  return consentState() === "accepted";
}

// Suscripción para useSyncExternalStore (el evento 'storage' cubre otras
// pestañas; en la misma pestaña recargamos tras aceptar).
export function subscribeConsent(cb: () => void): () => void {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

// Buffer de eventos que llegan antes de que window.fbq exista (el snippet base
// de Meta se inyecta con afterInteractive). Se drenan en flushPending() tras el
// init del Pixel, para no perder ViewContent/InitiateCheckout/etc. por timing.
interface QueuedEvent {
  name: string;
  data?: Record<string, unknown>;
}
const pending: QueuedEvent[] = [];

function getFbq(): ((...args: unknown[]) => void) | undefined {
  return (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
}

export function flushPending() {
  if (typeof window === "undefined") return;
  const fbq = getFbq();
  if (typeof fbq !== "function") return;
  while (pending.length) {
    const e = pending.shift()!;
    if (e.data) fbq("track", e.name, e.data);
    else fbq("track", e.name);
  }
}

export function fireEvent(name: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!metaPixelId() || !hasConsent()) return;
  const fbq = getFbq();
  if (typeof fbq !== "function") {
    pending.push({ name, data });
    return;
  }
  if (data) fbq("track", name, data);
  else fbq("track", name);
}
