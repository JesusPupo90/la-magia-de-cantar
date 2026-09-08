// lib/meta.ts
// Helper for the Meta Pixel (fbq) on the client side. No-op if there's no
// NEXT_PUBLIC_META_PIXEL_ID configured or the user hasn't accepted cookies.

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

const consentListeners = new Set<() => void>();

function emitConsent() {
  consentListeners.forEach((cb) => cb());
}

// Declares consent in localStorage and notifies subscribers in the
// same tab (the 'storage' event only reaches other tabs).
export function declareConsent(value: Exclude<ConsentState, null>) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // noop
  }
  emitConsent();
}

// Subscription for useSyncExternalStore. Listens to the 'storage' event (other
// tabs) and the local emission from declareConsent (same tab).
export function subscribeConsent(cb: () => void): () => void {
  consentListeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    consentListeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

// Buffer for events that arrive before window.fbq exists (Meta's base snippet
// is injected with afterInteractive). They're drained in flushPending() after
// the Pixel init, so we don't lose ViewContent/InitiateCheckout/etc. by timing.
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
