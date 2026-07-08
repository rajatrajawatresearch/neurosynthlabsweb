"use client";

import Link from "next/link";
import { useSiteContent } from "@/lib/store";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  const { settings, navLinks } = useSiteContent();

  return (
    <footer className="relative mt-10 border-t border-[var(--border)]">
      <div className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span
                className="grid h-9 w-9 place-items-center rounded-[calc(var(--radius)*0.55)] font-display text-sm font-bold text-[var(--primary-fg)]"
                style={{ background: "linear-gradient(135deg, var(--brand-from), var(--brand-via), var(--brand-to))" }}
              >
                {settings.initials}
              </span>
              <span className="font-display text-lg font-semibold">{settings.name}</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--fg-muted)]">
              {settings.description}
            </p>
            <div className="flex items-center gap-2">
              {settings.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--fg-muted)] transition-colors hover:border-[var(--primary)] hover:text-[var(--fg)]"
                >
                  <BrandIcon name={s.icon} className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* nav */}
          <div className="flex flex-col gap-3">
            <p className="eyebrow">Explore</p>
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]">
                {l.label}
              </a>
            ))}
            <Link href="/admin" className="text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]">
              Admin panel
            </Link>
          </div>

          {/* contact */}
          <div className="flex flex-col gap-3">
            <p className="eyebrow">Get in touch</p>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]">
              <Icon name="Mail" size={15} /> {settings.email}
            </a>
            <span className="flex items-center gap-2 text-sm text-[var(--fg-muted)]">
              <Icon name="MapPin" size={15} /> {settings.location}
            </span>
            <span className="flex items-center gap-2 text-sm text-[var(--fg-muted)]">
              <Icon name="Clock" size={15} /> {settings.timezone}
            </span>
          </div>
        </div>

        {/* giant wordmark */}
        <div className="mt-14 select-none overflow-hidden">
          <div
            className="gradient-text font-display text-[18vw] font-bold leading-[0.8] tracking-tighter opacity-[0.09] md:text-[15vw]"
          >
            {settings.name}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] pt-6 text-xs text-[var(--fg-subtle)] sm:flex-row">
          <span>© {new Date().getFullYear()} {settings.name}. Built end to end.</span>
          <span className="flex items-center gap-1.5">
            Crafted with <Icon name="Sparkles" size={13} className="text-[var(--primary)]" /> and a live theme engine
          </span>
        </div>
      </div>
    </footer>
  );
}
