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

export function fireEvent(name: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!metaPixelId() || !hasConsent()) return;
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq !== "function") return;
  if (data) fbq("track", name, data);
  else fbq("track", name);
}
