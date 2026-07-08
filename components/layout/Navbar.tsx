"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSiteContent, useToggle } from "@/lib/store";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function Navbar() {
  const content = useSiteContent();
  const { settings, navLinks } = content;
  const sticky = useToggle("sticky-nav");
  const glass = useToggle("glass-nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("top-0 z-50 w-full", sticky ? "sticky" : "relative")}>
      <div className="container-x">
        <nav
          className={cn(
            "mt-4 flex items-center justify-between gap-4 rounded-[var(--radius)] px-4 py-2.5 transition-all duration-300",
            scrolled && "shadow-soft",
          )}
          style={{
            background: glass
              ? "color-mix(in srgb, var(--nav-bg) var(--nav-opacity), transparent)"
              : "var(--nav-bg)",
            backdropFilter: glass ? "blur(var(--nav-blur)) saturate(150%)" : undefined,
            WebkitBackdropFilter: glass ? "blur(var(--nav-blur)) saturate(150%)" : undefined,
            border: `var(--border-width) solid ${scrolled ? "var(--border-strong)" : "var(--nav-border)"}`,
          }}
        >
          {/* brand */}
          <Link href="/" className="group flex items-center gap-2.5" aria-label={settings.name}>
            <span
              className="grid h-9 w-9 place-items-center rounded-[calc(var(--radius)*0.55)] font-display text-sm font-bold text-[var(--primary-fg)] glow"
              style={{ background: "linear-gradient(135deg, var(--brand-from), var(--brand-via), var(--brand-to))" }}
            >
              {settings.initials}
            </span>
            <span className="font-display text-[0.98rem] font-semibold tracking-tight">
              {settings.name}
            </span>
          </Link>

          {/* desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm text-[var(--nav-fg)] transition-colors hover:bg-[color-mix(in_srgb,var(--fg)_7%,transparent)] hover:text-[var(--nav-fg-active)]"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* right actions */}
          <div className="flex items-center gap-2">
            {settings.available && (
              <span className="chip hidden lg:inline-flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success)]" />
                </span>
                Available
              </span>
            )}
            <Link
              href="/admin"
              className="grid h-9 w-9 place-items-center rounded-full text-[var(--nav-fg)] transition-colors hover:bg-[color-mix(in_srgb,var(--fg)_8%,transparent)] hover:text-[var(--nav-fg-active)]"
              aria-label="Admin panel"
              title="Admin panel"
            >
              <Icon name="SlidersHorizontal" size={18} />
            </Link>
            <a href="#contact" className="btn btn-primary hidden sm:inline-flex !px-4 !py-2 text-sm">
              Start a build
              <Icon name="ArrowUpRight" size={16} />
            </a>
            <button
              className="grid h-9 w-9 place-items-center rounded-full text-[var(--fg)] md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <Icon name={open ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </nav>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="container-x md:hidden"
          >
            <div className="glass mt-2 flex flex-col gap-1 rounded-[var(--radius)] p-3">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-[var(--radius-sm)] px-4 py-3 text-sm text-[var(--fg)] transition-colors hover:bg-[color-mix(in_srgb,var(--fg)_7%,transparent)]"
                >
                  {l.label}
                </a>
              ))}
              <a href="#contact" onClick={() => setOpen(false)} className="btn btn-primary mt-1">
                Start a build
                <Icon name="ArrowUpRight" size={16} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
