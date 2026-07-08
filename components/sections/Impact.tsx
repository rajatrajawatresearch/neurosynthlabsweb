"use client";

import { useSiteContent } from "@/lib/store";
import { SectionShell } from "@/components/ui/SectionShell";
import { Reveal } from "@/components/ui/motion";
import { Counter } from "@/components/ui/Counter";

export function Impact() {
  const { impact } = useSiteContent();

  return (
    <SectionShell id="impact">
      <div className="container-x">
        <Reveal>
          <div
            className="glass relative overflow-hidden rounded-[var(--radius-lg)] px-6 py-12 md:px-12"
            style={{ boxShadow: "0 0 80px -30px color-mix(in srgb, var(--section-accent) 60%, transparent)" }}
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30 blur-[80px]"
              style={{ background: "var(--section-accent)" }}
            />
            <p className="eyebrow relative">Impact in production</p>
            <div className="relative mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
              {impact.map((s, i) => (
                <div key={i} className="flex flex-col">
                  <span className="gradient-text font-display text-4xl font-bold md:text-5xl">
                    <Counter value={s.value} suffix={s.suffix} />
                  </span>
                  <span className="mt-1.5 text-sm text-[var(--fg-muted)]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
