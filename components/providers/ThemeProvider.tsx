"use client";

import { useEffect, useLayoutEffect } from "react";
import { useAppStore } from "@/lib/store";
import { buildRootVars } from "@/lib/css";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Rough perceived luminance of a #rrggbb color, 0 (black) → 1 (white). */
function luminance(hex: string): number {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return 0;
  const [r, g, b] = [m[1], m[2], m[3]].map((h) => parseInt(h, 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Writes every design token to CSS custom properties on <html> and keeps them
 * in sync as the store changes. Runs in a layout effect so the correct theme
 * is painted on the first client frame (localStorage rehydration is sync).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const values = useAppStore((s) => s.values);

  // Pull the published config from the server once (no-op if backend absent).
  useEffect(() => {
    useAppStore.getState().hydrateFromServer();
  }, []);

  useIsoLayoutEffect(() => {
    const root = document.documentElement;
    const vars = buildRootVars(values);
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);

    // Match native form controls / UA scrollbars to the theme.
    const bg = String(values["bg"] ?? "#060814");
    root.style.colorScheme = luminance(bg) > 0.5 ? "light" : "dark";

    // Force-reduced-motion toggle.
    root.classList.toggle("force-reduce", Boolean(values["reduce-motion"]));
  }, [values]);

  return <>{children}</>;
}
