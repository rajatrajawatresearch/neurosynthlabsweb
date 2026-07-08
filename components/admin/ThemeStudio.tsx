"use client";

import { useMemo, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import { TOKENS, TOKEN_GROUPS, TOKEN_COUNT, PRESETS, type ThemeValues } from "@/lib/tokens";
import { ControlField } from "./controls";
import { Icon } from "@/components/ui/Icon";

function LivePreview() {
  return (
    <div className="card overflow-hidden">
      <p className="eyebrow mb-3">Live preview</p>
      <h3 className="gradient-text text-2xl font-bold">Bioluminescent computation</h3>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">
        Every control below rewrites CSS variables in real time — the whole site, and this panel, reskins instantly.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button className="btn btn-primary !py-2 text-sm">Primary</button>
        <button className="btn btn-outline !py-2 text-sm">Outline</button>
        <span className="chip">chip</span>
        <span className="chip font-mono">mono</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {["--primary", "--secondary", "--accent", "--success", "--warning", "--danger"].map((v) => (
          <div key={v} className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-md border border-[var(--border)]" style={{ background: `var(${v})` }} />
            <span className="font-mono text-[0.65rem] text-[var(--fg-subtle)]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThemeStudio() {
  const values = useAppStore((s) => s.values);
  const activePreset = useAppStore((s) => s.activePreset);
  const randomizeTheme = useAppStore((s) => s.randomizeTheme);
  const resetTheme = useAppStore((s) => s.resetTheme);
  const importTheme = useAppStore((s) => s.importTheme);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () => (q ? TOKENS.filter((t) => t.label.toLowerCase().includes(q) || t.group.toLowerCase().includes(q) || t.key.includes(q)) : null),
    [q],
  );

  const presetName =
    activePreset === "custom"
      ? "Custom"
      : PRESETS.find((p) => p.id === activePreset)?.name ?? "Custom";

  function exportJson() {
    const data = JSON.stringify(values, null, 2);
    navigator.clipboard?.writeText(data).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "neurosynth-theme.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJson(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as ThemeValues;
        importTheme(parsed);
      } catch {
        alert("That file isn't valid theme JSON.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Theme Studio</h2>
          <p className="text-sm text-[var(--fg-muted)]">
            {TOKEN_COUNT} live design tokens · active theme:{" "}
            <span className="text-[var(--primary)]">{presetName}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={randomizeTheme} className="btn btn-outline !py-2 text-sm">
            <Icon name="Shuffle" size={15} /> Randomize
          </button>
          <button onClick={exportJson} className="btn btn-outline !py-2 text-sm">
            <Icon name={copied ? "Check" : "Download"} size={15} /> {copied ? "Copied" : "Export"}
          </button>
          <button onClick={() => fileRef.current?.click()} className="btn btn-outline !py-2 text-sm">
            <Icon name="Upload" size={15} /> Import
          </button>
          <button onClick={resetTheme} className="btn btn-ghost !py-2 text-sm">
            <Icon name="RefreshCw" size={15} /> Reset
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* controls */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Icon name="Search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-subtle)]" />
            <input
              className="field !pl-9"
              placeholder="Search tokens… (e.g. glow, aurora, radius)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {filtered ? (
            <div className="card grid gap-4 md:grid-cols-2">
              {filtered.length === 0 && <p className="text-sm text-[var(--fg-muted)]">No tokens match “{query}”.</p>}
              {filtered.map((t) => (
                <ControlField key={t.key} token={t} />
              ))}
            </div>
          ) : (
            TOKEN_GROUPS.map((group) => {
              const items = TOKENS.filter((t) => t.group === group);
              if (!items.length) return null;
              return (
                <details key={group} open className="card group">
                  <summary className="flex cursor-pointer list-none items-center justify-between">
                    <span className="font-display text-base font-semibold">{group}</span>
                    <span className="flex items-center gap-2 text-xs text-[var(--fg-subtle)]">
                      {items.length}
                      <Icon name="ChevronDown" size={16} className="transition-transform group-open:rotate-180" />
                    </span>
                  </summary>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {items.map((t) => (
                      <ControlField key={t.key} token={t} />
                    ))}
                  </div>
                </details>
              );
            })
          )}
        </div>

        {/* sticky preview */}
        <div className="lg:sticky lg:top-6 lg:h-fit">
          <LivePreview />
        </div>
      </div>
    </div>
  );
}
