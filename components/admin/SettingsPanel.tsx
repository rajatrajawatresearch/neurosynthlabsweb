"use client";

import { useAppStore } from "@/lib/store";
import { TextInput, TextArea, Toggle } from "./controls";
import { Icon } from "@/components/ui/Icon";
import { BrandIcon } from "@/components/ui/BrandIcon";

const SOCIAL_ICONS = ["Github", "Twitter", "Linkedin", "Mail"];

export function SettingsPanel() {
  const settings = useAppStore((s) => s.content.settings);
  const patch = useAppStore((s) => s.patchContent);
  const resetContent = useAppStore((s) => s.resetContent);
  const resetTheme = useAppStore((s) => s.resetTheme);
  const resetAll = useAppStore((s) => s.resetAll);

  const set = (k: keyof typeof settings) => (v: string) => patch((d) => { (d.settings[k] as unknown) = v; });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-[var(--fg-muted)]">Identity, contact, SEO and data.</p>
      </div>

      {/* identity */}
      <div className="card grid gap-4 md:grid-cols-2">
        <p className="eyebrow md:col-span-2">Identity</p>
        <TextInput label="Studio name" value={settings.name} onChange={set("name")} />
        <TextInput label="Initials / logo mark" value={settings.initials} onChange={set("initials")} />
        <TextInput label="Role" value={settings.role} onChange={set("role")} />
        <TextInput label="Tagline" value={settings.tagline} onChange={set("tagline")} />
        <div className="md:col-span-2">
          <TextArea label="Description" value={settings.description} onChange={set("description")} />
        </div>
      </div>

      {/* contact */}
      <div className="card grid gap-4 md:grid-cols-2">
        <p className="eyebrow md:col-span-2">Contact</p>
        <TextInput label="Email" value={settings.email} onChange={set("email")} />
        <TextInput label="Phone" value={settings.phone} onChange={set("phone")} />
        <TextInput label="Location" value={settings.location} onChange={set("location")} />
        <TextInput label="Timezone" value={settings.timezone} onChange={set("timezone")} />
        <TextInput label="Booking link" value={settings.bookingUrl} onChange={set("bookingUrl")} />
        <TextInput label="Availability note" value={settings.availabilityNote} onChange={set("availabilityNote")} />
        <div className="md:col-span-2">
          <Toggle label="Available for work" checked={settings.available} onChange={(v) => patch((d) => { d.settings.available = v; })} />
        </div>
      </div>

      {/* socials */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Social links</p>
          <button
            onClick={() => patch((d) => { d.settings.socials.push({ label: "New", url: "https://", icon: "Mail" }); })}
            className="btn btn-outline !py-1.5 text-sm"
          >
            <Icon name="Plus" size={14} /> Add
          </button>
        </div>
        {settings.socials.map((soc, i) => (
          <div key={i} className="grid items-end gap-3 sm:grid-cols-[auto_1fr_1fr_auto]">
            <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--fg-muted)]">
              <BrandIcon name={soc.icon} className="h-[18px] w-[18px]" />
            </span>
            <TextInput label="Label" value={soc.label} onChange={(v) => patch((d) => { d.settings.socials[i].label = v; })} />
            <TextInput label="URL" value={soc.url} onChange={(v) => patch((d) => { d.settings.socials[i].url = v; })} />
            <div className="flex items-end gap-2">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-[var(--fg-muted)]">Icon</span>
                <select className="field !py-1.5" value={soc.icon} onChange={(e) => patch((d) => { d.settings.socials[i].icon = e.target.value; })}>
                  {SOCIAL_ICONS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
              <button
                onClick={() => patch((d) => { d.settings.socials.splice(i, 1); })}
                className="grid h-9 w-9 place-items-center rounded-full text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_12%,transparent)]"
                aria-label="Remove social"
              >
                <Icon name="Trash2" size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* seo */}
      <div className="card grid gap-4">
        <p className="eyebrow">SEO</p>
        <TextInput label="Meta title" value={settings.seoTitle} onChange={set("seoTitle")} />
        <TextArea label="Meta description" value={settings.seoDescription} onChange={set("seoDescription")} />
      </div>

      {/* security */}
      <div className="card grid gap-4">
        <p className="eyebrow">Admin access</p>
        <TextInput label="Admin passcode (demo gate)" value={settings.adminPasscode} onChange={set("adminPasscode")} />
        <p className="text-xs text-[var(--fg-subtle)]">
          Note: this is a client-side demo gate stored in your browser — not real authentication. Wire it to a server before going live.
        </p>
      </div>

      {/* danger */}
      <div className="card border-[color-mix(in_srgb,var(--danger)_40%,var(--border))]">
        <p className="eyebrow !text-[var(--danger)]">Danger zone</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => confirm("Reset theme to defaults?") && resetTheme()} className="btn btn-outline !py-2 text-sm">
            Reset theme
          </button>
          <button onClick={() => confirm("Reset all content to defaults? This can't be undone.") && resetContent()} className="btn btn-outline !py-2 text-sm">
            Reset content
          </button>
          <button
            onClick={() => confirm("Reset EVERYTHING (theme, content, leads)?") && resetAll()}
            className="btn !py-2 text-sm"
            style={{ background: "var(--danger)", color: "var(--danger-fg)" }}
          >
            <Icon name="Trash2" size={15} /> Reset everything
          </button>
        </div>
      </div>
    </div>
  );
}
