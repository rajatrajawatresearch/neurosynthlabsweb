"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteContent } from "@/lib/store";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading } from "@/components/ui/primitives";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { Icon } from "@/components/ui/Icon";

export function FAQ() {
  const { faqs } = useSiteContent();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SectionShell id="faq">
      <div className="container-x">
        <SectionHeading
          eyebrow="Questions"
          title={
            <>
              The things people <span className="gradient-text">ask first</span>.
            </>
          }
          subtitle="Straight answers before we ever get on a call — how a solo studio works, and what you walk away owning."
        />

        <Stagger className="mx-auto mt-14 flex max-w-3xl flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${faq.id}`;
            const buttonId = `faq-button-${faq.id}`;

            return (
              <StaggerItem key={faq.id}>
                <div
                  className="glass overflow-hidden rounded-[var(--radius)] transition-colors"
                  style={
                    isOpen
                      ? { borderColor: "color-mix(in srgb, var(--section-accent) 45%, transparent)" }
                      : undefined
                  }
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                    >
                      <span
                        className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-[var(--radius-sm)] text-[0.7rem] font-mono transition-colors"
                        style={{
                          color: isOpen ? "var(--section-accent)" : "var(--fg-subtle)",
                          background: isOpen
                            ? "color-mix(in srgb, var(--section-accent) 14%, transparent)"
                            : "color-mix(in srgb, var(--fg) 5%, transparent)",
                        }}
                        aria-hidden
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-base font-semibold leading-snug sm:text-lg">
                        {faq.q}
                      </span>
                      <motion.span
                        className="flex-none text-[var(--fg-muted)]"
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={isOpen ? { color: "var(--section-accent)" } : undefined}
                        aria-hidden
                      >
                        <Icon name="ChevronDown" size={20} />
                      </motion.span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-6 pl-[3.75rem] sm:px-6 sm:pl-[4.25rem]">
                          <p className="text-sm leading-relaxed text-[var(--fg-muted)]">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-[var(--fg-subtle)]">
            Still unsure?{" "}
            <a
              href="#contact"
              className="inline-flex items-center gap-1 font-medium transition-colors"
              style={{ color: "var(--section-accent)" }}
            >
              Send the question
              <Icon name="ArrowRight" size={14} />
            </a>
          </p>
        </Reveal>
      </div>
    </SectionShell>
  );
}
