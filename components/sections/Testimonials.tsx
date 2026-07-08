"use client";

import { useSiteContent } from "@/lib/store";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading, TiltCard } from "@/components/ui/primitives";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { Icon } from "@/components/ui/Icon";

export function Testimonials() {
  const { testimonials } = useSiteContent();

  return (
    <SectionShell id="testimonials">
      <div className="container-x">
        <SectionHeading
          eyebrow="Signal"
          title={
            <>
              Proof it holds up <span className="gradient-text">in production</span>.
            </>
          }
          subtitle="The people who bet on a solo builder — and what they got back once the work was live."
        />

        <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.id}>
              <TiltCard className="h-full">
                <figure className="card card-hover group flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <Icon
                      name="Quote"
                      size={30}
                      className="text-[var(--section-accent)]"
                    />
                    <div
                      className="flex items-center gap-0.5"
                      aria-label="5 out of 5"
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={14}
                          className="fill-[var(--section-accent)] text-[var(--section-accent)]"
                        />
                      ))}
                    </div>
                  </div>

                  <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-[var(--fg)]">
                    “{t.quote}”
                  </blockquote>

                  <figcaption className="mt-7 flex items-center gap-3 border-t border-[var(--border)] pt-5">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-pill)] font-display text-sm font-semibold text-[var(--section-accent)]"
                      style={{
                        background:
                          "color-mix(in srgb, var(--section-accent) 14%, transparent)",
                      }}
                      aria-hidden
                    >
                      {t.name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold leading-tight">{t.name}</span>
                      <span className="block truncate text-sm text-[var(--fg-muted)]">
                        {t.role} · {t.company}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </SectionShell>
  );
}
