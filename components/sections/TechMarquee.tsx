"use client";

import { useSiteContent, useToggle } from "@/lib/store";
import { SectionShell } from "@/components/ui/SectionShell";
import { Reveal } from "@/components/ui/motion";
import { Icon } from "@/components/ui/Icon";

export function TechMarquee() {
  const { capabilities } = useSiteContent();
  const animate = useToggle("enable-marquee");

  // Flatten every capability group into a single, de-duplicated list of tools.
  const tools = Array.from(new Set(capabilities.flatMap((cap) => cap.items)));

  const chip = (tool: string) => (
    <li key={tool} className="chip font-mono text-[0.72rem] whitespace-nowrap">
      <Icon name="Zap" size={13} className="text-[var(--section-accent)]" />
      {tool}
    </li>
  );

  return (
    <SectionShell id="marquee" className="!py-10">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow justify-center text-center">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--section-accent)" }}
            />
            The stack I build with
          </p>
        </Reveal>
      </div>

      {animate ? (
        <Reveal delay={0.1} className="edge-fade relative mt-7 w-full overflow-hidden">
          <div className="marquee-track gap-3">
            <ul className="flex items-center gap-3 pr-3" aria-label="Tools and technologies">
              {tools.map(chip)}
            </ul>
            <ul className="flex items-center gap-3 pr-3" aria-hidden>
              {tools.map((tool) => (
                <li key={`dup-${tool}`} className="chip font-mono text-[0.72rem] whitespace-nowrap">
                  <Icon name="Zap" size={13} className="text-[var(--section-accent)]" />
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ) : (
        <div className="container-x">
          <Reveal delay={0.1}>
            <ul
              className="mt-7 flex flex-wrap items-center justify-center gap-2.5"
              aria-label="Tools and technologies"
            >
              {tools.map(chip)}
            </ul>
          </Reveal>
        </div>
      )}
    </SectionShell>
  );
}
