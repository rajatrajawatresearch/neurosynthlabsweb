@AGENTS.md

# NeuroSynth Labs — project notes

Solo-proprietor studio site (project management + AI/ML + fullstack). Offers **services now**
and **agentic-AI products next** (Claude / Claude Code energy). Next.js 16 (App Router, Turbopack) ·
React 19 · Tailwind v4 · Zustand · Framer Motion · React Three Fiber.

## The one big idea: a live theme engine
Every visual property is a **design token**. The whole site — and the admin panel itself — is
re-skinnable at runtime from `/admin`, with everything persisted to `localStorage`.

- `lib/tokens.ts` — the **single source of truth**. `TOKENS` is a data-driven schema
  (color / range / select / toggle). Colors, ranges and selects become CSS variables `--<key>`;
  toggles are React-only flags. Add a token here → a control auto-appears in the admin Theme Studio.
  Also holds `PRESETS` (one-click full re-skins) and `SECTIONS` (per-section visibility + accent).
- `components/providers/ThemeProvider.tsx` — writes token values to `document.documentElement`
  as CSS vars in a layout effect (no flash; localStorage rehydration is sync).
- `app/globals.css` — consumes the vars. `:root` holds fallback defaults so SSR paints correctly.
  Utility classes: `container-x`, `section`, `card`/`card-hover`, `glass`, `glow`, `chip`, `btn*`,
  `field`, `gradient-text`, `eyebrow`, `bg-grid`, `aurora-blob`, `marquee-track`, `ns-range`.
- `lib/store.ts` — Zustand (persist). Holds `values` (tokens), `content`, `leads`, `activePreset`.
  Hooks: `useHydrated`, `useSiteContent` (SSR-safe), `useToggle`. Never read persisted content
  during render without going through these (avoids hydration mismatches).

## Content
- `lib/content.ts` — `DEFAULT_CONTENT` + types. All copy lives here and is editable from `/admin`.

## Structure
- `components/sections/*` — landing sections. Each wraps in `<SectionShell id="…">` which gates
  visibility (`sec-<id>-on`) and exposes `--section-accent` (`sec-<id>-accent`).
- `components/admin/*` — the control panel. `ThemeStudio` auto-generates controls from `TOKENS`.
  Admin auth is a **client-side demo passcode** (`settings.adminPasscode`, default `neuro`) — NOT
  real auth. Wire to a server before production.
- `components/three/NeuralField.tsx` — the signature 3D hero field (dynamic import, `ssr:false`).
- `components/voice/VoiceAssistant.tsx` — Web Speech API commands (theme / navigation).

## Conventions
- New section: create `components/sections/X.tsx` (`"use client"`), wrap in `SectionShell`, read
  data via `useSiteContent()`, add it to `app/page.tsx`, and add a `SECTIONS` entry in `lib/tokens.ts`.
- Persistence is `localStorage` only (per-browser). To make edits global, swap the Zustand storage
  for an API + DB (Neon/Upstash via Vercel Marketplace) — the store shape stays the same.
- Verify with: `npx tsc --noEmit`, `npm run build`, `npm run lint`.
