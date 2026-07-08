"use client";

import { useAppStore } from "@/lib/store";
import { PRESETS } from "@/lib/tokens";
import { Icon } from "@/components/ui/Icon";

export function Presets() {
  const activePreset = useAppStore((s) => s.activePreset);
  const applyPreset = useAppStore((s) => s.applyPreset);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Presets</h2>
        <p className="text-sm text-[var(--fg-muted)]">
          One click swaps the entire palette, fonts and mood — feature toggles stay as you set them.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRESETS.map((p) => {
          const active = activePreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className="card card-hover group text-left"
              style={active ? { borderColor: "var(--primary)", boxShadow: "0 0 0 1px var(--primary)" } : undefined}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold">{p.name}</span>
                {active && <Icon name="Check" size={18} className="text-[var(--primary)]" />}
              </div>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">{p.blurb}</p>
              <div className="mt-4 flex gap-1.5">
                {p.swatch.map((c, i) => (
                  <span
                    key={i}
                    className="h-8 flex-1 rounded-md border border-[var(--border)]"
                    style={{ background: c }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
