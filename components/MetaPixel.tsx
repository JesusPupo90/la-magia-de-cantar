"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { metaPixelId, consentState, subscribeConsent } from "@/lib/meta";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function MetaPixel() {
  const pixelId = metaPixelId();
  const consent = useSyncExternalStore(
    subscribeConsent,
    () => consentState() === "accepted",
    () => false
  );
  const pathname = usePathname();
  const initialized = useRef(false);

  // Init + PageView por cambio de ruta (SPA). El PageView inicial lo hace onLoad.
  useEffect(() => {
    if (!pixelId || !consent) return;
    const fbq = window.fbq;
    if (typeof fbq !== "function") return;
    if (!initialized.current) {
      initialized.current = true;
      fbq("init", pixelId);
    }
    fbq("track", "PageView");
  }, [consent, pathname, pixelId]);

  if (!pixelId || !consent) return null;

  return (
    <>
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        src="https://connect.facebook.net/en_US/fbevents.js"
        onLoad={() => {
          const fbq = window.fbq;
          if (typeof fbq !== "function") return;
          if (!initialized.current) {
            initialized.current = true;
            fbq("init", pixelId);
          }
          fbq("track", "PageView");
        }}
      />
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" alt="" />`,
        }}
      />
    </>
  );
}
