"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function sessionId(): string | null {
  try {
    let s = sessionStorage.getItem("yy_sid");
    if (!s) {
      s = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("yy_sid", s);
    }
    return s;
  } catch {
    return null;
  }
}

/** Sayfa görüntülemelerini kaydeder (admin/panel hariç). */
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/panel")) return;

    const device = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
      ? "mobile"
      : "desktop";
    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer || null,
      sessionId: sessionId(),
      device,
    });

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        });
      }
    } catch {
      /* sessiz geç */
    }
  }, [pathname]);

  return null;
}
