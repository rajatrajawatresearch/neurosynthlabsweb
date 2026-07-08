"use client";

import { useSiteContent } from "@/lib/store";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading } from "@/components/ui/primitives";
import { Stagger, StaggerItem } from "@/components/ui/motion";

export function Process() {
  const { process } = useSiteContent();

  return (
    <SectionShell id="process">
      <div className="container-x">
        <SectionHeading
          eyebrow="How I work"
          title={
            <>
              A build that stays honest — <span className="gradient-text">no handoffs</span> to hide behind.
            </>
          }
          subtitle="One accountable owner from the first conversation to the final deploy. Here's the shape of a typical engagement."
        />

        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((step, i) => (
            <StaggerItem key={step.id}>
              <div className="card card-hover h-full">
                <div className="flex items-baseline gap-3">
                  <span className="gradient-text font-display text-5xl font-bold leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-[var(--border-strong)]" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--fg-muted)]">{step.blurb}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </SectionShell>
  );
}
