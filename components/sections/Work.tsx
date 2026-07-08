"use client";

import { useSiteContent } from "@/lib/store";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading, TiltCard } from "@/components/ui/primitives";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { Counter } from "@/components/ui/Counter";
import { Icon } from "@/components/ui/Icon";

export function Work() {
  const { work } = useSiteContent();

  return (
    <SectionShell id="work">
      <div className="container-x">
        <SectionHeading
          eyebrow="Selected work"
          title={
            <>
              Outcomes, not <span className="gradient-text">demos.</span>
            </>
          }
          subtitle="A few systems that shipped and held up in production — measured by what changed for the people who use them."
        />

        <Stagger className="mt-14 grid gap-5 md:grid-cols-2">
          {work.map((item) => (
            <StaggerItem key={item.id}>
              <TiltCard className="h-full" intensity={5}>
                <article className="card card-hover group h-full">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-[var(--section-accent)]">
                      {item.category}
                    </span>
                    <span className="font-mono text-xs text-[var(--fg-subtle)]">{item.year}</span>
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-3">
                    <h3 className="text-2xl font-semibold">{item.title}</h3>
                    <Icon
                      name="ArrowUpRight"
                      size={20}
                      className="mt-1 shrink-0 text-[var(--fg-subtle)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--section-accent)]"
                    />
                  </div>

                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--fg-muted)]">{item.blurb}</p>

                  {item.metrics.length > 0 && (
                    <div className="mt-6 flex gap-8 border-t border-[var(--border)] pt-5">
                      {item.metrics.map((m, i) => (
                        <div key={i}>
                          <div className="gradient-text font-display text-2xl font-bold">
                            <Counter value={m.value} suffix={m.suffix} />
                          </div>
                          <div className="mt-0.5 text-xs text-[var(--fg-muted)]">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {item.tags.map((t) => (
                      <span key={t} className="chip font-mono text-[0.68rem]">
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </SectionShell>
  );
}
