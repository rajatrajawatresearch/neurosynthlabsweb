"use client";

import { useSiteContent } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading, TiltCard } from "@/components/ui/primitives";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { Icon } from "@/components/ui/Icon";

/** Status → semantic token color, used with color-mix for the badge chrome. */
const STATUS_COLOR: Record<string, string> = {
  Live: "var(--success)",
  Beta: "var(--info)",
  Building: "var(--warning)",
  Concept: "var(--fg-subtle)",
};

export function Products() {
  const { products } = useSiteContent();

  return (
    <SectionShell id="products">
      <div className="container-x">
        <SectionHeading
          eyebrow="Products in the lab"
          title={
            <>
              What I&apos;m building <span className="gradient-text">next</span> — agentic AI you can trust.
            </>
          }
          subtitle="The services fund the studio; these are the products it exists to ship. Claude-Code-grade agents, taken from concept to production."
        />

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const color = STATUS_COLOR[p.status] ?? "var(--primary)";
            return (
              <StaggerItem key={p.id}>
                <TiltCard className="h-full">
                  <article className="card card-hover group relative flex h-full flex-col overflow-hidden">
                    {/* Faint accent gradient hairline along the top edge */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, color-mix(in srgb, var(--section-accent) 70%, transparent), transparent)",
                      }}
                    />

                    <div className="flex items-start justify-between gap-3">
                      <div
                        className="grid h-12 w-12 place-items-center rounded-[var(--radius-sm)] text-[var(--section-accent)]"
                        style={{ background: "color-mix(in srgb, var(--section-accent) 14%, transparent)" }}
                      >
                        <Icon name={p.icon} size={24} />
                      </div>

                      <span
                        className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border px-2.5 py-1 font-mono text-[0.64rem] font-medium uppercase tracking-wider"
                        style={{
                          color,
                          borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
                          background: `color-mix(in srgb, ${color} 12%, transparent)`,
                        }}
                      >
                        <span
                          className={cn("h-1.5 w-1.5 rounded-full", p.status === "Live" && "animate-pulse")}
                          style={{ background: color }}
                        />
                        {p.status}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-semibold">{p.name}</h3>
                    <p className="mt-1.5 text-sm font-medium text-[var(--fg-muted)]">{p.tagline}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)]">{p.description}</p>

                    <ul className="mt-5 space-y-2.5">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm">
                          <span
                            className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[var(--section-accent)]"
                            style={{ background: "color-mix(in srgb, var(--section-accent) 16%, transparent)" }}
                          >
                            <Icon name="Check" size={11} strokeWidth={2.5} />
                          </span>
                          <span className="text-[var(--fg-muted)]">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href="#contact"
                      className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-[var(--fg-subtle)] transition-colors hover:text-[var(--section-accent)]"
                    >
                      {p.status === "Live" ? "Get access" : "Get early access"}
                      <Icon
                        name="ArrowRight"
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    </a>
                  </article>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </SectionShell>
  );
}
