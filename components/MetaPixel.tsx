"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { metaPixelId, consentState, subscribeConsent, flushPending } from "@/lib/meta";

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

  // PageView por cambio de ruta (SPA). El PageView inicial lo emite el snippet base.
  useEffect(() => {
    if (!pixelId || !consent) return;
    if (initialized.current) {
      window.fbq?.("track", "PageView");
    } else {
      initialized.current = true;
    }
  }, [pathname, pixelId, consent]);

  if (!pixelId || !consent) return null;

  return (
    <>
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
        onLoad={() => flushPending()}
      />
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" alt="" />`,
        }}
      />
    </>
  );
}
