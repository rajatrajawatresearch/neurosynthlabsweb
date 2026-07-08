"use client";

import { useAppStore, useToggle } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Wraps a landing section. Reads the section's visibility toggle and accent
 * color from the theme store, exposing the accent as `--section-accent` to the
 * subtree. Returns null when the section is toggled off in the admin panel.
 */
export function SectionShell({
  id,
  children,
  className,
  full = false,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  full?: boolean;
}) {
  const on = useToggle(`sec-${id}-on`);
  const accent = useAppStore((s) => String(s.values[`sec-${id}-accent`] ?? "var(--primary)"));

  if (!on) return null;

  return (
    <section
      id={id}
      className={cn(full ? "relative" : "section", className)}
      style={{ ["--section-accent" as string]: accent } as React.CSSProperties}
    >
      {children}
    </section>
  );
}
