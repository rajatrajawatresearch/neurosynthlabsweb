"use client";

import { useAppStore } from "@/lib/store";
import { TOKEN_COUNT, PRESETS, SECTIONS } from "@/lib/tokens";
import { Icon } from "@/components/ui/Icon";

function StatCard({ icon, label, value, accent }: { icon: string; label: string; value: string; accent?: string }) {
  return (
    <div className="card">
      <div
        className="mb-3 grid h-10 w-10 place-items-center rounded-[var(--radius-sm)]"
        style={{ background: `color-mix(in srgb, ${accent ?? "var(--primary)"} 16%, transparent)`, color: accent ?? "var(--primary)" }}
      >
        <Icon name={icon} size={20} />
      </div>
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="text-sm text-[var(--fg-muted)]">{label}</div>
    </div>
  );
}

export function Dashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const content = useAppStore((s) => s.content);
  const values = useAppStore((s) => s.values);
  const leads = useAppStore((s) => s.leads);
  const activePreset = useAppStore((s) => s.activePreset);
  const randomizeTheme = useAppStore((s) => s.randomizeTheme);

  const unread = leads.filter((l) => !l.read).length;
  const visibleSections = SECTIONS.filter((s) => values[`sec-${s.id}-on`] !== false).length;
  const presetName = activePreset === "custom" ? "Custom" : PRESETS.find((p) => p.id === activePreset)?.name ?? "Custom";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-[var(--fg-muted)]">Your studio at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="MessageSquare" label={`Leads (${unread} unread)`} value={String(leads.length)} accent="var(--secondary)" />
        <StatCard icon="Palette" label="Design tokens" value={String(TOKEN_COUNT)} accent="var(--primary)" />
        <StatCard icon="Package" label="Products" value={String(content.products.length)} accent="var(--accent)" />
        <StatCard icon="LayoutDashboard" label="Sections visible" value={`${visibleSections}/${SECTIONS.length}`} accent="var(--info)" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* quick actions */}
        <div className="card">
          <p className="eyebrow mb-4">Quick actions</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onNavigate("theme")} className="btn btn-primary !py-2 text-sm">
              <Icon name="Palette" size={15} /> Theme Studio
            </button>
            <button onClick={() => onNavigate("presets")} className="btn btn-outline !py-2 text-sm">
              <Icon name="Sparkles" size={15} /> Presets
            </button>
            <button onClick={randomizeTheme} className="btn btn-outline !py-2 text-sm">
              <Icon name="Shuffle" size={15} /> Randomize
            </button>
            <button onClick={() => onNavigate("hero")} className="btn btn-outline !py-2 text-sm">
              <Icon name="Type" size={15} /> Edit hero
            </button>
            <button onClick={() => onNavigate("leads")} className="btn btn-ghost !py-2 text-sm">
              <Icon name="MessageSquare" size={15} /> View leads
            </button>
          </div>
          <div className="hairline my-5" />
          <p className="text-sm text-[var(--fg-muted)]">
            Active theme: <span className="text-[var(--primary)]">{presetName}</span>. Everything you change is saved
            to this browser instantly — refresh the site to see it persist.
          </p>
        </div>

        {/* recent leads */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <p className="eyebrow">Recent leads</p>
            <button onClick={() => onNavigate("leads")} className="text-xs text-[var(--primary)]">
              View all
            </button>
          </div>
          {leads.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">No leads yet. Submissions from the contact form land here.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {leads.slice(0, 4).map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!l.read && <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" />}
                      <span className="truncate text-sm font-medium">{l.name}</span>
                    </div>
                    <span className="truncate text-xs text-[var(--fg-subtle)]">{l.email}</span>
                  </div>
                  <span className="shrink-0 text-xs text-[var(--fg-subtle)]">
                    {new Date(l.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
