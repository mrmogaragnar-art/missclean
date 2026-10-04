"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";

type BatteryInfo = {
  level: number | null;
  charging: boolean | null;
};

async function readBattery(): Promise<BatteryInfo> {
  try {
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<{
        level: number;
        charging: boolean;
      }>;
    };
    if (!nav.getBattery) return { level: null, charging: null };
    const battery = await nav.getBattery();
    return {
      level: Math.round(battery.level * 100),
      charging: battery.charging,
    };
  } catch {
    return { level: null, charging: null };
  }
}

function detectDeviceKind(): "phone" | "tablet" | "desktop" {
  const ua = navigator.userAgent;
  const touch = navigator.maxTouchPoints > 0;
  const width = Math.min(window.screen.width, window.innerWidth);

  if (/iPad|Tablet/i.test(ua) || (touch && width >= 768 && width <= 1024)) {
    return "tablet";
  }
  if (/Mobi|Android|iPhone|iPod/i.test(ua) || (touch && width < 768)) {
    return "phone";
  }
  return "desktop";
}

function connectionLabel(): string | null {
  const conn = (
    navigator as Navigator & {
      connection?: { effectiveType?: string; downlink?: number; rtt?: number };
    }
  ).connection;
  if (!conn) return null;
  const parts = [
    conn.effectiveType,
    conn.downlink != null ? `${conn.downlink} Mbps` : null,
    conn.rtt != null ? `rtt ${conn.rtt} ms` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

export function VisitTracker() {
  const { locale, ready } = useI18n();
  const sent = useRef(false);

  useEffect(() => {
    if (!ready || sent.current) return;
    sent.current = true;

    void (async () => {
      const battery = await readBattery();
      const deviceKind = detectDeviceKind();

      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          path: window.location.pathname + window.location.hash,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          deviceKind,
          platform: navigator.platform || "",
          language: navigator.language || "",
          screen: `${window.screen.width}×${window.screen.height}`,
          viewport: `${window.innerWidth}×${window.innerHeight}`,
          pixelRatio: window.devicePixelRatio || 1,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
          batteryLevel: battery.level,
          batteryCharging: battery.charging,
          connection: connectionLabel(),
          touchPoints: navigator.maxTouchPoints || 0,
        }),
      }).catch(() => {
        /* ignore tracking errors */
      });
    })();
  }, [locale, ready]);

  return null;
}
