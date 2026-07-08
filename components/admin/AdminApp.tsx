"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore, useHydrated } from "@/lib/store";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { Dashboard } from "./Dashboard";
import { ThemeStudio } from "./ThemeStudio";
import { Presets } from "./Presets";
import { Leads } from "./Leads";
import { SettingsPanel } from "./SettingsPanel";
import {
  HeroPanel, TypographyPanel, ServicesPanel, ProductsPanel, WorkPanel,
  TestimonialsPanel, PlansPanel, FaqPanel, CapabilitiesPanel,
} from "./ContentPanels";

interface NavItem { id: string; label: string; icon: string; group: string }

const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", group: "Overview" },
  { id: "theme", label: "Theme Studio", icon: "Palette", group: "Design" },
  { id: "presets", label: "Presets", icon: "Sparkles", group: "Design" },
  { id: "typography", label: "Typography", icon: "Type", group: "Design" },
  { id: "hero", label: "Hero", icon: "Zap", group: "Content" },
  { id: "services", label: "Services", icon: "Layers", group: "Content" },
  { id: "products", label: "Products", icon: "Package", group: "Content" },
  { id: "work", label: "Work", icon: "Briefcase", group: "Content" },
  { id: "testimonials", label: "Testimonials", icon: "Quote", group: "Content" },
  { id: "plans", label: "Engagement", icon: "LineChart", group: "Content" },
  { id: "faq", label: "FAQ", icon: "MessageSquare", group: "Content" },
  { id: "capabilities", label: "Capabilities", icon: "Boxes", group: "Content" },
  { id: "leads", label: "Leads", icon: "MessageSquare", group: "Inbox" },
  { id: "settings", label: "Settings", icon: "Settings", group: "System" },
];

const GROUPS = ["Overview", "Design", "Content", "Inbox", "System"];

export function AdminApp() {
  const hydrated = useHydrated();
  const settings = useAppStore((s) => s.content.settings);
  const leads = useAppStore((s) => s.leads);
  const unread = leads.filter((l) => !l.read).length;

  const [authed, setAuthed] = useState(false);
  const [entry, setEntry] = useState("");
  const [err, setErr] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    // Restore the session auth flag once on mount (sessionStorage is client-only).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (sessionStorage.getItem("ns-admin-authed") === "1") setAuthed(true);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (entry === settings.adminPasscode) {
      setAuthed(true);
      sessionStorage.setItem("ns-admin-authed", "1");
    } else {
      setErr(true);
    }
  }

  function logout() {
    setAuthed(false);
    sessionStorage.removeItem("ns-admin-authed");
  }

  function go(id: string) {
    setTab(id);
    setDrawer(false);
  }

  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]" />
      </div>
    );
  }

  /* ---- login gate ---- */
  if (!authed) {
    return (
      <div className="relative grid min-h-screen place-items-center px-4">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[var(--bg)]">
          <div className="aurora-blob" style={{ top: "-10%", left: "20%", width: "40vw", height: "40vw", background: "var(--aurora-1)" }} />
          <div className="aurora-blob" style={{ top: "40%", left: "55%", width: "36vw", height: "36vw", background: "var(--aurora-3)" }} />
        </div>
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass w-full max-w-sm rounded-[var(--radius-lg)] p-8 text-center shadow-soft"
        >
          <span
            className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-[var(--radius)] font-display text-base font-bold text-[var(--primary-fg)] glow"
            style={{ background: "linear-gradient(135deg, var(--brand-from), var(--brand-via), var(--brand-to))" }}
          >
            {settings.initials}
          </span>
          <h1 className="text-2xl font-bold">Admin access</h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">Enter the passcode to open the control panel.</p>
          <input
            type="password"
            autoFocus
            value={entry}
            onChange={(e) => {
              setEntry(e.target.value);
              setErr(false);
            }}
            placeholder="Passcode"
            className="field mt-6 text-center"
          />
          {err && <p className="mt-2 text-sm text-[var(--danger)]">Wrong passcode. Hint: “{settings.adminPasscode}”.</p>}
          <button type="submit" className="btn btn-primary mt-4 w-full">
            <Icon name="Lock" size={16} /> Unlock
          </button>
          <Link href="/" className="mt-4 inline-block text-xs text-[var(--fg-subtle)] hover:text-[var(--fg)]">
            ← Back to site
          </Link>
        </motion.form>
      </div>
    );
  }

  /* ---- panel switch ---- */
  const panel = (() => {
    switch (tab) {
      case "dashboard": return <Dashboard onNavigate={go} />;
      case "theme": return <ThemeStudio />;
      case "presets": return <Presets />;
      case "typography": return <TypographyPanel />;
      case "hero": return <HeroPanel />;
      case "services": return <ServicesPanel />;
      case "products": return <ProductsPanel />;
      case "work": return <WorkPanel />;
      case "testimonials": return <TestimonialsPanel />;
      case "plans": return <PlansPanel />;
      case "faq": return <FaqPanel />;
      case "capabilities": return <CapabilitiesPanel />;
      case "leads": return <Leads />;
      case "settings": return <SettingsPanel />;
      default: return <Dashboard onNavigate={go} />;
    }
  })();

  const SidebarInner = (
    <div className="flex h-full flex-col gap-6">
      <Link href="/" className="flex items-center gap-2.5">
        <span
          className="grid h-9 w-9 place-items-center rounded-[calc(var(--radius)*0.55)] font-display text-sm font-bold text-[var(--primary-fg)]"
          style={{ background: "linear-gradient(135deg, var(--brand-from), var(--brand-via), var(--brand-to))" }}
        >
          {settings.initials}
        </span>
        <div className="leading-tight">
          <div className="font-display text-sm font-semibold">{settings.name}</div>
          <div className="text-[0.68rem] text-[var(--fg-subtle)]">Control panel</div>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto no-scrollbar">
        {GROUPS.map((group) => (
          <div key={group} className="flex flex-col gap-1">
            <span className="px-3 text-[0.65rem] font-medium uppercase tracking-widerer text-[var(--fg-subtle)]" style={{ letterSpacing: "0.12em" }}>
              {group}
            </span>
            {NAV.filter((n) => n.group === group).map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-colors",
                  tab === n.id
                    ? "bg-[color-mix(in_srgb,var(--primary)_16%,transparent)] text-[var(--fg)]"
                    : "text-[var(--fg-muted)] hover:bg-[color-mix(in_srgb,var(--fg)_6%,transparent)] hover:text-[var(--fg)]",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <Icon name={n.icon} size={17} />
                  {n.label}
                </span>
                {n.id === "leads" && unread > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--primary)] px-1 text-[0.65rem] font-bold text-[var(--primary-fg)]">
                    {unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <button onClick={logout} className="btn btn-outline !py-2 text-sm">
        <Icon name="LogOut" size={15} /> Log out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto flex max-w-[1500px]">
        {/* desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-[var(--border)] bg-[var(--bg-2)] p-5 lg:block">
          {SidebarInner}
        </aside>

        {/* mobile drawer */}
        <AnimatePresence>
          {drawer && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawer(false)}
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "tween", duration: 0.25 }}
                className="fixed inset-y-0 left-0 z-50 w-72 border-r border-[var(--border)] bg-[var(--bg-2)] p-5 lg:hidden"
              >
                {SidebarInner}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* main */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] px-5 py-3 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button onClick={() => setDrawer(true)} className="grid h-9 w-9 place-items-center rounded-full lg:hidden" aria-label="Open menu">
                <Icon name="Menu" size={20} />
              </button>
              <span className="font-display text-sm font-semibold capitalize">{NAV.find((n) => n.id === tab)?.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" target="_blank" className="btn btn-outline !py-1.5 text-sm">
                <Icon name="ExternalLink" size={14} /> <span className="hidden sm:inline">View site</span>
              </Link>
            </div>
          </header>

          <main className="p-5 md:p-8">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              {panel}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
