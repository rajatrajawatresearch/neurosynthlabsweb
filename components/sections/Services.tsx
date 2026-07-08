"use client";

import { useSiteContent } from "@/lib/store";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading, TiltCard } from "@/components/ui/primitives";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { Icon } from "@/components/ui/Icon";

export function Services() {
  const { services } = useSiteContent();

  return (
    <SectionShell id="services">
      <div className="container-x">
        <SectionHeading
          eyebrow="What I do"
          title={
            <>
              One builder across the <span className="gradient-text">whole stack</span> of thinking.
            </>
          }
          subtitle="From the model to the interface to the roadmap — the pieces most teams split across five people, handled by one accountable owner."
        />

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc) => (
            <StaggerItem key={svc.id}>
              <TiltCard className="h-full">
                <article className="card card-hover group h-full">
                  <div
                    className="mb-5 grid h-12 w-12 place-items-center rounded-[var(--radius-sm)] text-[var(--section-accent)]"
                    style={{ background: "color-mix(in srgb, var(--section-accent) 14%, transparent)" }}
                  >
                    <Icon name={svc.icon} size={24} />
                  </div>
                  <h3 className="text-xl font-semibold">{svc.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--fg-muted)]">{svc.blurb}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {svc.tags.map((t) => (
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
