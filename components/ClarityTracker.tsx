"use client";

import { useEffect, useSyncExternalStore } from "react";
import clarity from "@microsoft/clarity";
import { consentState, subscribeConsent } from "@/lib/meta";

export default function ClarityTracker() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const consent = useSyncExternalStore(
    subscribeConsent,
    () => consentState() === "accepted",
    () => false
  );

  useEffect(() => {
    if (!projectId || !consent) return;
    clarity.init(projectId);
  }, [projectId, consent]);

  return null;
}
