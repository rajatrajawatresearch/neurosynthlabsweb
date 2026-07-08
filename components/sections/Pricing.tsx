"use client";

import { useSiteContent } from "@/lib/store";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading } from "@/components/ui/primitives";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function Pricing() {
  const { plans } = useSiteContent();

  return (
    <SectionShell id="pricing">
      <div className="container-x">
        <SectionHeading
          eyebrow="Engagement"
          title={
            <>
              Ways to <span className="gradient-text">work together</span>.
            </>
          }
          subtitle="Flexible engagements sized to the risk — de-risk an idea, ship a product, or keep an accountable builder on call."
        />

        <Stagger className="mt-14 grid items-start gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <StaggerItem key={plan.id} className={cn(plan.highlight && "md:-my-2")}>
              <article
                className={cn(
                  "card card-hover group relative flex h-full flex-col",
                  plan.highlight && "glow-accent md:scale-[1.03]",
                )}
                style={
                  plan.highlight
                    ? { borderColor: "var(--section-accent)" }
                    : undefined
                }
              >
                {plan.highlight && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-[var(--radius-pill)] px-3 py-1 font-mono text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[var(--section-accent)]"
                    style={{
                      background: "color-mix(in srgb, var(--section-accent) 16%, var(--bg-3))",
                      border: "1px solid color-mix(in srgb, var(--section-accent) 40%, transparent)",
                    }}
                  >
                    Most popular
                  </span>
                )}

                <h3 className="text-xl font-semibold">{plan.name}</h3>

                <div className="mt-4 flex items-baseline gap-2">
                  <span
                    className={cn(
                      "font-display text-4xl font-semibold leading-none",
                      plan.highlight && "text-[var(--section-accent)]",
                    )}
                  >
                    {plan.price}
                  </span>
                  <span className="text-sm text-[var(--fg-subtle)]">{plan.period}</span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-[var(--fg-muted)]">{plan.blurb}</p>

                <div className="my-6 hairline" />

                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <span
                        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[var(--radius-sm)] text-[var(--section-accent)]"
                        style={{ background: "color-mix(in srgb, var(--section-accent) 14%, transparent)" }}
                      >
                        <Icon name="Check" size={13} />
                      </span>
                      <span className="text-[var(--fg-muted)]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={cn("btn mt-8 w-full", plan.highlight ? "btn-primary" : "btn-outline")}
                >
                  {plan.cta}
                  <Icon name="ArrowRight" size={16} />
                </a>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </SectionShell>
  );
}
