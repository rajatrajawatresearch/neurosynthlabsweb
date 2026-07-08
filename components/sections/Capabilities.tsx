"use client";

import { useSiteContent } from "@/lib/store";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading, TiltCard } from "@/components/ui/primitives";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { Icon } from "@/components/ui/Icon";

export function Capabilities() {
  const { capabilities } = useSiteContent();

  return (
    <SectionShell id="capabilities">
      <div className="container-x">
        <SectionHeading
          eyebrow="Capabilities"
          title={
            <>
              The toolbox for <span className="gradient-text">any stack the problem needs</span>.
            </>
          }
          subtitle="No single-framework religion. One builder fluent across the AI, product and platform layers — picking the tool that fits the job, not the habit."
        />

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((group, i) => (
            <StaggerItem key={group.id}>
              <TiltCard className="h-full">
                <article className="card card-hover group h-full">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div
                      className="grid h-12 w-12 place-items-center rounded-[var(--radius-sm)] text-[var(--section-accent)]"
                      style={{ background: "color-mix(in srgb, var(--section-accent) 14%, transparent)" }}
                    >
                      <Icon name={group.icon} size={24} />
                    </div>
                    <span className="font-mono text-[0.7rem] tabular-nums text-[var(--fg-subtle)]">
                      {String(i + 1).padStart(2, "0")} / {String(group.items.length).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold">{group.category}</h3>

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="chip font-mono text-[0.68rem] transition-colors group-hover:border-[color:color-mix(in_srgb,var(--section-accent)_35%,var(--border))]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </SectionShell>
  );
}
