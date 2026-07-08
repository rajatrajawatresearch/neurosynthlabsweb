"use client";

import { useState } from "react";
import { useSiteContent, useAppStore } from "@/lib/store";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";
import { Icon } from "@/components/ui/Icon";
import { BrandIcon } from "@/components/ui/BrandIcon";

const BUDGETS = ["Not sure yet", "$5k–$15k", "$15k–$40k", "$40k+"];

export function Contact() {
  const { contact, settings } = useSiteContent();
  const addLead = useAppStore((s) => s.addLead);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [budget, setBudget] = useState(BUDGETS[0]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    addLead({ name, email, company, budget, message });
    setSubmitted(true);
    setName("");
    setEmail("");
    setCompany("");
    setBudget(BUDGETS[0]);
    setMessage("");
  }

  // Data-driven heading with a gradient final word.
  const words = contact.heading.trim().split(" ");
  const lastWord = words.pop() ?? "";
  const leadWords = words.join(" ");

  const details = [
    { icon: "Mail", label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: "MapPin", label: "Location", value: settings.location },
    { icon: "Clock", label: "Timezone", value: settings.timezone },
  ];

  return (
    <SectionShell id="contact">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT — pitch + coordinates */}
          <div>
            <SectionHeading
              eyebrow="Get in touch"
              title={
                <>
                  {leadWords ? `${leadWords} ` : ""}
                  <span className="gradient-text">{lastWord}</span>
                </>
              }
              subtitle={contact.blurb}
            />

            {settings.available && (
              <Reveal delay={0.12}>
                <div
                  className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--border)] px-3.5 py-1.5 text-sm"
                  style={{ background: "color-mix(in srgb, var(--success) 12%, transparent)" }}
                >
                  <span className="relative grid h-2 w-2 place-items-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-70" />
                    <span className="inline-flex h-2 w-2 rounded-full bg-[var(--success)]" />
                  </span>
                  <span className="font-medium text-[var(--fg)]">{settings.availabilityNote}</span>
                </div>
              </Reveal>
            )}

            <Reveal delay={0.16}>
              <ul className="mt-10 flex flex-col gap-3">
                {details.map((d) => {
                  const inner = (
                    <>
                      <span
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-sm)] text-[var(--section-accent)]"
                        style={{ background: "color-mix(in srgb, var(--section-accent) 14%, transparent)" }}
                      >
                        <Icon name={d.icon} size={20} />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-mono text-[0.68rem] uppercase tracking-wider text-[var(--fg-subtle)]">
                          {d.label}
                        </span>
                        <span className="block truncate text-[0.95rem] text-[var(--fg)]">{d.value}</span>
                      </span>
                    </>
                  );
                  return (
                    <li key={d.label}>
                      {d.href ? (
                        <a
                          href={d.href}
                          className="card card-hover flex items-center gap-4 !py-3.5"
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className="card flex items-center gap-4 !py-3.5">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            {settings.socials.length > 0 && (
              <Reveal delay={0.2}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {settings.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target={s.url.startsWith("http") ? "_blank" : undefined}
                      rel={s.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={s.label}
                      className="grid h-11 w-11 place-items-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-3)] text-[var(--fg-muted)] transition-colors hover:border-[var(--section-accent)] hover:text-[var(--fg)]"
                    >
                      <BrandIcon name={s.icon} className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* RIGHT — form */}
          <Reveal delay={0.1}>
            <div className="glass glass-card shadow-soft">
              {submitted ? (
                <div className="flex flex-col items-center py-8 text-center" aria-live="polite">
                  <span
                    className="grid h-16 w-16 place-items-center rounded-full text-[var(--section-accent)]"
                    style={{ background: "color-mix(in srgb, var(--section-accent) 16%, transparent)" }}
                  >
                    <Icon name="Check" size={30} />
                  </span>
                  <h3 className="mt-5 text-2xl font-semibold">Message sent</h3>
                  <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-[var(--fg-muted)]">
                    Thanks for reaching out — I&apos;ll get back to you within a day with a real, considered reply.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn btn-outline mt-7"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-[var(--fg)]">
                        Name <span className="text-[var(--section-accent)]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        className="field"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-[var(--fg)]">
                        Email <span className="text-[var(--section-accent)]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        className="field"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-company" className="mb-1.5 block text-sm font-medium text-[var(--fg)]">
                        Company
                      </label>
                      <input
                        id="contact-company"
                        name="company"
                        type="text"
                        className="field"
                        placeholder="Optional"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-budget" className="mb-1.5 block text-sm font-medium text-[var(--fg)]">
                        Budget
                      </label>
                      <select
                        id="contact-budget"
                        name="budget"
                        className="field"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                      >
                        {BUDGETS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-[var(--fg)]">
                      Message <span className="text-[var(--section-accent)]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      className="field resize-none"
                      rows={4}
                      placeholder="What are you trying to ship?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full">
                    Send message
                    <Icon name="Send" size={17} />
                  </button>

                  <p className="text-center text-xs leading-relaxed text-[var(--fg-subtle)]">{contact.note}</p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
