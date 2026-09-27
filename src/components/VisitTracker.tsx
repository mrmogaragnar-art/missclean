"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";

export function VisitTracker() {
  const { locale, ready } = useI18n();
  const sent = useRef(false);

  useEffect(() => {
    if (!ready || sent.current) return;
    sent.current = true;

    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        path: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {
      /* ignore tracking errors */
    });
  }, [locale, ready]);

  return null;
}
