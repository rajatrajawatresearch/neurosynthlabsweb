"use client";

import { useAppStore } from "@/lib/store";
import type { TokenDef } from "@/lib/tokens";
import { cn } from "@/lib/utils";

/* ---- primitive inputs ---------------------------------------------------- */

export function TextInput({
  label, value, onChange, placeholder, type = "text", id,
}: {
  label?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; id?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {label && <span className="text-[var(--fg-muted)]">{label}</span>}
      <input
        id={id}
        type={type}
        className="field"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function TextArea({
  label, value, onChange, rows = 3,
}: {
  label?: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {label && <span className="text-[var(--fg-muted)]">{label}</span>}
      <textarea className="field resize-y" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function Toggle({
  checked, onChange, label,
}: {
  checked: boolean; onChange: (v: boolean) => void; label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 text-left text-sm"
    >
      {label && <span className="text-[var(--fg)]">{label}</span>}
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-[var(--primary)]" : "bg-[var(--border-strong)]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[1.4rem]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}

/* ---- token-bound control ------------------------------------------------- */

function ColorControl({ token }: { token: TokenDef }) {
  const value = String(useAppStore((s) => s.values[token.key] ?? token.default));
  const setToken = useAppStore((s) => s.setToken);
  const valid = /^#[0-9a-f]{6}$/i.test(value);
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-[var(--fg)]">{token.label}</span>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setToken(token.key, e.target.value)}
          className="w-[5.5rem] rounded-[var(--radius-sm)] border border-[var(--input-border)] bg-[var(--input-bg)] px-2 py-1 font-mono text-xs"
          aria-label={`${token.label} hex`}
        />
        <label className="relative h-8 w-9 cursor-pointer overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)]">
          <span className="absolute inset-0" style={{ background: valid ? value : "var(--bg-3)" }} />
          <input
            type="color"
            value={valid ? value : "#000000"}
            onChange={(e) => setToken(token.key, e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label={token.label}
          />
        </label>
      </div>
    </div>
  );
}

function RangeControl({ token }: { token: TokenDef }) {
  const value = Number(useAppStore((s) => s.values[token.key] ?? token.default));
  const setToken = useAppStore((s) => s.setToken);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--fg)]">{token.label}</span>
        <span className="font-mono text-xs text-[var(--fg-muted)]">
          {value}
          {token.unit}
        </span>
      </div>
      <input
        type="range"
        min={token.min}
        max={token.max}
        step={token.step}
        value={value}
        onChange={(e) => setToken(token.key, Number(e.target.value))}
        className="ns-range"
        aria-label={token.label}
      />
    </div>
  );
}

function SelectControl({ token }: { token: TokenDef }) {
  const value = String(useAppStore((s) => s.values[token.key] ?? token.default));
  const setToken = useAppStore((s) => s.setToken);
  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span className="text-[var(--fg)]">{token.label}</span>
      <select
        value={value}
        onChange={(e) => setToken(token.key, e.target.value)}
        className="field !w-auto min-w-[9rem] !py-1.5 text-sm"
      >
        {token.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleControl({ token }: { token: TokenDef }) {
  const value = Boolean(useAppStore((s) => s.values[token.key] ?? token.default));
  const setToken = useAppStore((s) => s.setToken);
  return <Toggle checked={value} onChange={(v) => setToken(token.key, v)} label={token.label} />;
}

export function ControlField({ token }: { token: TokenDef }) {
  switch (token.type) {
    case "color":
      return <ColorControl token={token} />;
    case "range":
      return <RangeControl token={token} />;
    case "select":
      return <SelectControl token={token} />;
    case "toggle":
      return <ToggleControl token={token} />;
    default:
      return null;
  }
}
