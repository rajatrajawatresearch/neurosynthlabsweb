"use client";

import { useSiteContent } from "@/lib/store";
import { SectionShell } from "@/components/ui/SectionShell";
import { Reveal } from "@/components/ui/motion";
import { MagneticButton } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";

export function CTA() {
  const { contact } = useSiteContent();

  return (
    <SectionShell id="cta">
      <div className="container-x">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[var(--radius-lg)] px-6 py-16 text-center md:px-12 md:py-20">
            {/* decorative blobs */}
            <div
              className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full opacity-40 blur-[90px]"
              style={{ background: "var(--section-accent)" }}
            />
            <div
              className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full opacity-30 blur-[90px]"
              style={{ background: "var(--accent)" }}
            />

            <p className="eyebrow relative justify-center">Ready when you are</p>
            <h2 className="relative mx-auto mt-4 max-w-3xl">
              <span className="gradient-text text-glow">{contact.heading}</span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-lg text-[var(--fg-muted)]">
              {contact.blurb}
            </p>
            <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
              <MagneticButton href="#contact" className="btn btn-primary text-base">
                Start a build <Icon name="ArrowRight" size={18} />
              </MagneticButton>
              <MagneticButton href="#work" className="btn btn-outline text-base">
                See the work
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
