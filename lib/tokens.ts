import { DISPLAY_FONTS, BODY_FONTS, MONO_FONTS } from "./fonts";

/**
 * The design-token engine.
 *
 * Every visual property of the site is a token. Colors / ranges / selects are
 * written to CSS custom properties on <html> by the ThemeProvider, so changing
 * one re-skins the whole site instantly. Toggles are read directly by React
 * components (to mount/unmount effects like the 3D field or film grain).
 *
 * The admin "Theme Studio" is generated entirely from this schema — add a token
 * here and a control appears there automatically.
 */

export type TokenType = "color" | "range" | "select" | "toggle";

export interface TokenDef {
  key: string; // becomes CSS var --<key> for color/range/select
  label: string;
  group: string;
  type: TokenType;
  default: string | number | boolean;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string }[];
  help?: string;
}

export type TokenValue = string | number | boolean;
export type ThemeValues = Record<string, TokenValue>;

// ---- terse builders keep this large schema readable ------------------------
const color = (key: string, label: string, group: string, def: string, help?: string): TokenDef => ({
  key, label, group, type: "color", default: def, help,
});
const range = (
  key: string, label: string, group: string, def: number,
  min: number, max: number, step: number, unit = "", help?: string,
): TokenDef => ({ key, label, group, type: "range", default: def, min, max, step, unit, help });
const toggle = (key: string, label: string, group: string, def: boolean, help?: string): TokenDef => ({
  key, label, group, type: "toggle", default: def, help,
});
const select = (
  key: string, label: string, group: string, def: string,
  options: { label: string; value: string }[], help?: string,
): TokenDef => ({ key, label, group, type: "select", default: def, options, help });

// ---- Group order for the admin sidebar -------------------------------------
export const TOKEN_GROUPS = [
  "Foundations",
  "Brand",
  "Aurora & Gradient",
  "Semantic",
  "Typography",
  "Shape & Border",
  "Spacing & Layout",
  "Glass",
  "Glow & Shadow",
  "Background FX",
  "Motion",
  "Cursor",
  "Neural Field (3D)",
  "Navbar",
  "Cards & Inputs",
  "Sections",
] as const;

// ============================================================================
// FOUNDATIONS
// ============================================================================
const foundations: TokenDef[] = [
  color("bg", "Background", "Foundations", "#060814", "Page base color"),
  color("bg-2", "Surface", "Foundations", "#0a0f22"),
  color("bg-3", "Surface elevated", "Foundations", "#0f1631"),
  color("bg-inset", "Inset / wells", "Foundations", "#05070f"),
  color("fg", "Text", "Foundations", "#eaf0ff"),
  color("fg-muted", "Text muted", "Foundations", "#9aa8d4"),
  color("fg-subtle", "Text subtle", "Foundations", "#66739e"),
  color("border", "Border", "Foundations", "#1c2547"),
  color("border-strong", "Border strong", "Foundations", "#2b376b"),
  color("ring", "Focus ring", "Foundations", "#7c5cff"),
  color("selection", "Text selection", "Foundations", "#7c5cff"),
  color("overlay", "Overlay veil", "Foundations", "#04060f"),
];

// ============================================================================
// BRAND
// ============================================================================
const brand: TokenDef[] = [
  color("primary", "Primary", "Brand", "#7c5cff"),
  color("primary-fg", "Primary text", "Brand", "#ffffff"),
  color("primary-hover", "Primary hover", "Brand", "#9377ff"),
  color("secondary", "Secondary", "Brand", "#2fe6d6"),
  color("secondary-fg", "Secondary text", "Brand", "#00201d"),
  color("accent", "Accent", "Brand", "#ff5cad"),
  color("accent-fg", "Accent text", "Brand", "#2a0016"),
  color("accent-hover", "Accent hover", "Brand", "#ff7cc0"),
  color("brand-from", "Brand gradient from", "Brand", "#7c5cff"),
  color("brand-via", "Brand gradient via", "Brand", "#2fe6d6"),
  color("brand-to", "Brand gradient to", "Brand", "#ff5cad"),
];

// ============================================================================
// AURORA & GRADIENT
// ============================================================================
const aurora: TokenDef[] = [
  color("aurora-1", "Aurora 1", "Aurora & Gradient", "#7c5cff"),
  color("aurora-2", "Aurora 2", "Aurora & Gradient", "#2fe6d6"),
  color("aurora-3", "Aurora 3", "Aurora & Gradient", "#ff5cad"),
  color("aurora-4", "Aurora 4", "Aurora & Gradient", "#4d7cff"),
  color("aurora-5", "Aurora 5", "Aurora & Gradient", "#b45cff"),
  range("aurora-opacity", "Aurora opacity", "Aurora & Gradient", 55, 0, 100, 1, "%"),
  range("aurora-blur", "Aurora blur", "Aurora & Gradient", 90, 0, 200, 1, "px"),
  range("aurora-scale", "Aurora scale", "Aurora & Gradient", 120, 60, 220, 1, "%"),
  range("aurora-speed", "Aurora drift (s)", "Aurora & Gradient", 24, 4, 60, 1, "s"),
];

// ============================================================================
// SEMANTIC
// ============================================================================
const semantic: TokenDef[] = [
  color("success", "Success", "Semantic", "#34d399"),
  color("success-fg", "Success text", "Semantic", "#002417"),
  color("warning", "Warning", "Semantic", "#fbbf24"),
  color("warning-fg", "Warning text", "Semantic", "#231a00"),
  color("danger", "Danger", "Semantic", "#fb7185"),
  color("danger-fg", "Danger text", "Semantic", "#2a0009"),
  color("info", "Info", "Semantic", "#38bdf8"),
  color("info-fg", "Info text", "Semantic", "#001a26"),
];

// ============================================================================
// TYPOGRAPHY
// ============================================================================
const typography: TokenDef[] = [
  select("font-display", "Display font", "Typography", DISPLAY_FONTS[0].value, DISPLAY_FONTS),
  select("font-body", "Body font", "Typography", BODY_FONTS[0].value, BODY_FONTS),
  select("font-mono", "Mono font", "Typography", MONO_FONTS[0].value, MONO_FONTS),
  range("font-size-base", "Body size", "Typography", 16, 14, 20, 0.5, "px"),
  range("display-scale", "Display scale", "Typography", 1, 0.8, 1.4, 0.01, "", "Scales every heading together"),
  range("display-weight", "Display weight", "Typography", 600, 400, 800, 10),
  range("display-tracking", "Display tracking", "Typography", -0.02, -0.06, 0.06, 0.005, "em"),
  range("display-leading", "Display leading", "Typography", 1.02, 0.85, 1.4, 0.01),
  range("body-weight", "Body weight", "Typography", 400, 300, 600, 10),
  range("body-leading", "Body leading", "Typography", 1.65, 1.2, 2, 0.01),
  range("body-tracking", "Body tracking", "Typography", 0, -0.02, 0.06, 0.005, "em"),
  range("eyebrow-size", "Eyebrow size", "Typography", 12, 9, 16, 0.5, "px"),
  range("eyebrow-tracking", "Eyebrow tracking", "Typography", 0.24, 0, 0.5, 0.01, "em"),
  select("heading-transform", "Heading case", "Typography", "none", [
    { label: "As typed", value: "none" },
    { label: "UPPERCASE", value: "uppercase" },
    { label: "lowercase", value: "lowercase" },
    { label: "Capitalize", value: "capitalize" },
  ]),
];

// ============================================================================
// SHAPE & BORDER
// ============================================================================
const shape: TokenDef[] = [
  range("radius", "Radius", "Shape & Border", 18, 0, 40, 1, "px"),
  range("radius-sm", "Radius small", "Shape & Border", 10, 0, 30, 1, "px"),
  range("radius-lg", "Radius large", "Shape & Border", 28, 0, 60, 1, "px"),
  range("radius-pill", "Radius pill", "Shape & Border", 999, 0, 999, 1, "px"),
  range("border-width", "Border width", "Shape & Border", 1, 0, 3, 0.5, "px"),
];

// ============================================================================
// SPACING & LAYOUT
// ============================================================================
const spacing: TokenDef[] = [
  range("section-gap", "Section rhythm", "Spacing & Layout", 128, 48, 220, 4, "px"),
  range("container-width", "Container width", "Spacing & Layout", 1200, 960, 1600, 20, "px"),
  range("content-gap", "Content gap", "Spacing & Layout", 24, 8, 48, 2, "px"),
  range("card-pad", "Card padding", "Spacing & Layout", 28, 12, 56, 2, "px"),
];

// ============================================================================
// GLASS
// ============================================================================
const glass: TokenDef[] = [
  range("glass-blur", "Glass blur", "Glass", 18, 0, 48, 1, "px"),
  range("glass-opacity", "Glass fill", "Glass", 6, 0, 40, 1, "%"),
  range("glass-saturation", "Glass saturation", "Glass", 140, 100, 220, 1, "%"),
  range("glass-border", "Glass edge", "Glass", 12, 0, 60, 1, "%"),
  range("glass-highlight", "Glass highlight", "Glass", 10, 0, 40, 1, "%"),
];

// ============================================================================
// GLOW & SHADOW
// ============================================================================
const glow: TokenDef[] = [
  range("glow-strength", "Glow strength", "Glow & Shadow", 45, 0, 100, 1, "%"),
  range("glow-size", "Glow size", "Glow & Shadow", 40, 0, 120, 1, "px"),
  range("shadow-strength", "Shadow strength", "Glow & Shadow", 40, 0, 100, 1, "%"),
  range("shadow-y", "Shadow offset", "Glow & Shadow", 24, 0, 60, 1, "px"),
  range("shadow-blur", "Shadow blur", "Glow & Shadow", 48, 0, 120, 1, "px"),
];

// ============================================================================
// BACKGROUND FX
// ============================================================================
const bgfx: TokenDef[] = [
  select("bg-style", "Background style", "Background FX", "aurora", [
    { label: "Aurora", value: "aurora" },
    { label: "Mesh", value: "mesh" },
    { label: "Grid", value: "grid" },
    { label: "Dots", value: "dots" },
    { label: "Plain", value: "plain" },
  ]),
  range("grid-opacity", "Grid opacity", "Background FX", 24, 0, 100, 1, "%"),
  range("grid-size", "Grid size", "Background FX", 44, 16, 120, 1, "px"),
  range("grid-thickness", "Grid line", "Background FX", 1, 0.5, 3, 0.5, "px"),
  range("grain-opacity", "Film grain", "Background FX", 6, 0, 30, 1, "%"),
  range("vignette", "Vignette", "Background FX", 40, 0, 100, 1, "%"),
];

// ============================================================================
// MOTION
// ============================================================================
const motion: TokenDef[] = [
  range("motion-speed", "Motion speed", "Motion", 1, 0.2, 2.5, 0.05, "×", "Global animation speed multiplier"),
  range("motion-distance", "Reveal distance", "Motion", 26, 0, 80, 1, "px"),
  range("motion-stagger", "Stagger", "Motion", 60, 0, 200, 5, "ms"),
  range("hover-lift", "Hover lift", "Motion", 6, 0, 20, 1, "px"),
  range("hover-scale", "Hover scale", "Motion", 1.02, 1, 1.1, 0.005, "×"),
  range("marquee-speed", "Marquee speed", "Motion", 32, 8, 80, 1, "s"),
];

// ============================================================================
// CURSOR
// ============================================================================
const cursor: TokenDef[] = [
  select("cursor-style", "Cursor style", "Cursor", "glow", [
    { label: "Glow trail", value: "glow" },
    { label: "Ring", value: "ring" },
    { label: "Dot", value: "dot" },
    { label: "System", value: "system" },
  ]),
  range("cursor-size", "Cursor size", "Cursor", 28, 8, 60, 1, "px"),
  range("cursor-glow", "Cursor glow", "Cursor", 320, 80, 600, 10, "px"),
];

// ============================================================================
// NEURAL FIELD (3D)
// ============================================================================
const field3d: TokenDef[] = [
  color("fx-node", "Node color", "Neural Field (3D)", "#8b6bff"),
  color("fx-node-2", "Node color 2", "Neural Field (3D)", "#2fe6d6"),
  color("fx-link", "Link color", "Neural Field (3D)", "#4d7cff"),
  range("fx-particles", "Node count", "Neural Field (3D)", 900, 100, 2600, 20),
  range("fx-node-size", "Node size", "Neural Field (3D)", 3.2, 1, 8, 0.1),
  range("fx-link-distance", "Link distance", "Neural Field (3D)", 1.5, 0.4, 3, 0.05),
  range("fx-link-opacity", "Link opacity", "Neural Field (3D)", 22, 0, 80, 1, "%"),
  range("fx-speed", "Field speed", "Neural Field (3D)", 1, 0, 3, 0.05, "×"),
  range("fx-parallax", "Cursor parallax", "Neural Field (3D)", 0.4, 0, 1.5, 0.05),
  range("fx-depth", "Field depth", "Neural Field (3D)", 6, 2, 12, 0.5),
];

// ============================================================================
// NAVBAR
// ============================================================================
const navbar: TokenDef[] = [
  color("nav-bg", "Nav background", "Navbar", "#080b18"),
  color("nav-border", "Nav border", "Navbar", "#1c2547"),
  color("nav-fg", "Nav link", "Navbar", "#c3cdf0"),
  color("nav-fg-active", "Nav link active", "Navbar", "#ffffff"),
  range("nav-blur", "Nav blur", "Navbar", 20, 0, 48, 1, "px"),
  range("nav-opacity", "Nav fill", "Navbar", 60, 0, 100, 1, "%"),
];

// ============================================================================
// CARDS & INPUTS
// ============================================================================
const surfaces: TokenDef[] = [
  color("card-bg", "Card background", "Cards & Inputs", "#0c1226"),
  color("card-border", "Card border", "Cards & Inputs", "#20294f"),
  color("card-hover", "Card hover edge", "Cards & Inputs", "#7c5cff"),
  color("input-bg", "Input background", "Cards & Inputs", "#0a0f22"),
  color("input-border", "Input border", "Cards & Inputs", "#242e57"),
  color("input-fg", "Input text", "Cards & Inputs", "#eaf0ff"),
  color("input-focus", "Input focus", "Cards & Inputs", "#7c5cff"),
];

// ============================================================================
// SECTIONS — per-section enable toggle + accent color
// ============================================================================
export const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "marquee", label: "Tech marquee" },
  { id: "services", label: "Services" },
  { id: "capabilities", label: "Capabilities" },
  { id: "process", label: "Process" },
  { id: "products", label: "Products" },
  { id: "work", label: "Work" },
  { id: "impact", label: "Impact / stats" },
  { id: "testimonials", label: "Testimonials" },
  { id: "pricing", label: "Engagement" },
  { id: "faq", label: "FAQ" },
  { id: "cta", label: "Call to action" },
  { id: "contact", label: "Contact" },
] as const;

const sectionAccentDefaults: Record<string, string> = {
  hero: "#7c5cff", marquee: "#2fe6d6", services: "#7c5cff", capabilities: "#2fe6d6",
  process: "#ff5cad", products: "#b45cff", work: "#4d7cff", impact: "#2fe6d6",
  testimonials: "#ff5cad", pricing: "#7c5cff", faq: "#4d7cff", cta: "#7c5cff", contact: "#2fe6d6",
};

const sections: TokenDef[] = SECTIONS.flatMap((s) => [
  toggle(`sec-${s.id}-on`, `${s.label} — visible`, "Sections", s.id !== "pricing"),
  color(`sec-${s.id}-accent`, `${s.label} — accent`, "Sections", sectionAccentDefaults[s.id]),
]);

// ============================================================================
// GLOBAL FEATURE TOGGLES (read by React, not CSS)
// ============================================================================
const features: TokenDef[] = [
  toggle("enable-3d", "3D neural field", "Background FX", true),
  toggle("enable-aurora", "Aurora glow", "Background FX", true),
  toggle("enable-grid", "Grid overlay", "Background FX", true),
  toggle("enable-grain", "Film grain", "Background FX", true),
  toggle("enable-vignette", "Vignette", "Background FX", true),
  toggle("enable-glow", "Neon glow", "Glow & Shadow", true),
  toggle("enable-cursor", "Custom cursor", "Cursor", true),
  toggle("enable-marquee", "Tech marquee", "Motion", true),
  toggle("enable-tilt", "Card tilt", "Motion", true),
  toggle("enable-scrollbar", "Scroll progress", "Motion", true),
  toggle("enable-voice", "Voice assistant", "Motion", true),
  toggle("sticky-nav", "Sticky navbar", "Navbar", true),
  toggle("glass-nav", "Glass navbar", "Navbar", true),
  toggle("reduce-motion", "Force reduced motion", "Motion", false),
];

// ---- assembled schema ------------------------------------------------------
export const TOKENS: TokenDef[] = [
  ...foundations, ...brand, ...aurora, ...semantic, ...typography, ...shape,
  ...spacing, ...glass, ...glow, ...bgfx, ...motion, ...cursor, ...field3d,
  ...navbar, ...surfaces, ...sections, ...features,
];

/** Fast lookup of a token definition by key. */
export const TOKEN_MAP: Record<string, TokenDef> = Object.fromEntries(
  TOKENS.map((t) => [t.key, t]),
);

/** The default value map (used server-side and as reset target). */
export const DEFAULT_VALUES: ThemeValues = Object.fromEntries(
  TOKENS.map((t) => [t.key, t.default]),
);

/** Tokens that produce CSS variables (everything except plain feature toggles that React reads). */
export const CSS_TOKENS = TOKENS.filter((t) => t.type !== "toggle");

/** Count of live controls, surfaced in the UI. */
export const TOKEN_COUNT = TOKENS.length;

// ============================================================================
// PRESETS — one click re-skins the entire site
// ============================================================================
export interface Preset {
  id: string;
  name: string;
  blurb: string;
  swatch: string[];
  values: ThemeValues;
}

export const PRESETS: Preset[] = [
  {
    id: "bioluminescence",
    name: "Bioluminescence",
    blurb: "Iridescent synapses on deep indigo — the signature look.",
    swatch: ["#7c5cff", "#2fe6d6", "#ff5cad", "#060814"],
    values: {}, // defaults
  },
  {
    id: "solar-flare",
    name: "Solar Flare",
    blurb: "Molten amber and vermilion over charcoal.",
    swatch: ["#ff9d2f", "#ff5230", "#ffd166", "#0d0906"],
    values: {
      bg: "#0d0906", "bg-2": "#150d07", "bg-3": "#1e130a", fg: "#fff3e6", "fg-muted": "#d6b79a",
      "fg-subtle": "#9c7c5f", border: "#2c1c0e", "border-strong": "#43290f",
      primary: "#ff9d2f", "primary-hover": "#ffb257", secondary: "#ff5230", accent: "#ffd166",
      "brand-from": "#ff9d2f", "brand-via": "#ff5230", "brand-to": "#ffd166",
      "aurora-1": "#ff9d2f", "aurora-2": "#ff5230", "aurora-3": "#ffd166", "aurora-4": "#c2410c", "aurora-5": "#f97316",
      "fx-node": "#ff9d2f", "fx-node-2": "#ffd166", "fx-link": "#ff5230",
      "font-display": "var(--font-unbounded)", ring: "#ff9d2f", "nav-bg": "#100a06", "card-bg": "#160d07",
    },
  },
  {
    id: "arctic-glass",
    name: "Arctic Glass",
    blurb: "A luminous light theme — frosted glass on pale sky.",
    swatch: ["#3b5bff", "#00b8d4", "#f5f7ff", "#0b1020"],
    values: {
      bg: "#eef2fb", "bg-2": "#ffffff", "bg-3": "#f5f8ff", "bg-inset": "#e3e9f7",
      fg: "#0b1020", "fg-muted": "#465072", "fg-subtle": "#8a93b2",
      border: "#d7def0", "border-strong": "#b9c4e0",
      primary: "#3b5bff", "primary-hover": "#5a74ff", secondary: "#00b8d4", accent: "#7c3aed", "accent-fg": "#ffffff",
      "brand-from": "#3b5bff", "brand-via": "#00b8d4", "brand-to": "#7c3aed",
      "aurora-1": "#3b5bff", "aurora-2": "#00b8d4", "aurora-3": "#a78bfa", "aurora-4": "#60a5fa", "aurora-5": "#22d3ee",
      "aurora-opacity": 32, overlay: "#dfe6f6", "nav-bg": "#ffffff", "nav-fg": "#465072", "nav-fg-active": "#0b1020",
      "card-bg": "#ffffff", "card-border": "#e2e8f7", "input-bg": "#ffffff", "input-border": "#d7def0", "input-fg": "#0b1020",
      "fx-node": "#3b5bff", "fx-node-2": "#00b8d4", "fx-link": "#7c3aed",
      "grain-opacity": 0, vignette: 12, "grid-opacity": 14,
    },
  },
  {
    id: "synthwave",
    name: "Synthwave",
    blurb: "Hot magenta and cyan against a violet horizon.",
    swatch: ["#ff2fb9", "#00e5ff", "#b026ff", "#160029"],
    values: {
      bg: "#120024", "bg-2": "#1b0636", "bg-3": "#260a4a", fg: "#ffe9fb", "fg-muted": "#c79ade", "fg-subtle": "#8a63b0",
      border: "#3a1466", "border-strong": "#551f94",
      primary: "#ff2fb9", secondary: "#00e5ff", accent: "#b026ff",
      "brand-from": "#ff2fb9", "brand-via": "#b026ff", "brand-to": "#00e5ff",
      "aurora-1": "#ff2fb9", "aurora-2": "#00e5ff", "aurora-3": "#b026ff", "aurora-4": "#ff6ec7", "aurora-5": "#7c3aed",
      "fx-node": "#ff2fb9", "fx-node-2": "#00e5ff", "fx-link": "#b026ff",
      "font-display": "var(--font-unbounded)", ring: "#ff2fb9", "glow-strength": 70, "aurora-opacity": 65,
    },
  },
  {
    id: "quantum-lime",
    name: "Quantum Lime",
    blurb: "Phosphor lime and teal on gunmetal slate.",
    swatch: ["#c6ff2f", "#22d3ee", "#0f172a", "#050a12"],
    values: {
      bg: "#060b12", "bg-2": "#0b1220", "bg-3": "#111c2f", fg: "#eafff2", "fg-muted": "#93b8ad", "fg-subtle": "#5d7d76",
      border: "#152437", "border-strong": "#20364f",
      primary: "#c6ff2f", "primary-fg": "#0b1a00", secondary: "#22d3ee", accent: "#34d399", "accent-fg": "#00241a",
      "brand-from": "#c6ff2f", "brand-via": "#22d3ee", "brand-to": "#34d399",
      "aurora-1": "#c6ff2f", "aurora-2": "#22d3ee", "aurora-3": "#34d399", "aurora-4": "#84cc16", "aurora-5": "#06b6d4",
      "fx-node": "#c6ff2f", "fx-node-2": "#22d3ee", "fx-link": "#34d399", ring: "#c6ff2f",
    },
  },
  {
    id: "mono-noir",
    name: "Mono Noir",
    blurb: "Restrained monochrome — precision over color.",
    swatch: ["#f4f4f5", "#a1a1aa", "#0a0a0b", "#18181b"],
    values: {
      bg: "#0a0a0b", "bg-2": "#111113", "bg-3": "#18181b", fg: "#fafafa", "fg-muted": "#a1a1aa", "fg-subtle": "#71717a",
      border: "#26262a", "border-strong": "#3f3f46",
      primary: "#fafafa", "primary-fg": "#0a0a0b", "primary-hover": "#e4e4e7", secondary: "#a1a1aa", accent: "#d4d4d8", "accent-fg": "#0a0a0b",
      "brand-from": "#fafafa", "brand-via": "#a1a1aa", "brand-to": "#52525b",
      "aurora-1": "#3f3f46", "aurora-2": "#52525b", "aurora-3": "#27272a", "aurora-4": "#71717a", "aurora-5": "#18181b",
      "fx-node": "#e4e4e7", "fx-node-2": "#a1a1aa", "fx-link": "#52525b",
      "aurora-opacity": 20, "glow-strength": 10, "grain-opacity": 10, ring: "#fafafa",
      "font-display": "var(--font-bricolage)",
    },
  },
  {
    id: "terra",
    name: "Terra",
    blurb: "Warm cream and terracotta with an editorial serif.",
    swatch: ["#c65f3d", "#1c1a17", "#f4f1ea", "#3a352d"],
    values: {
      bg: "#f4f1ea", "bg-2": "#faf8f2", "bg-3": "#ffffff", "bg-inset": "#ebe6db",
      fg: "#1c1a17", "fg-muted": "#5b544a", "fg-subtle": "#8f877a",
      border: "#e0d9cb", "border-strong": "#cabfab",
      primary: "#c65f3d", "primary-fg": "#fff8f4", secondary: "#3a352d", "secondary-fg": "#f4f1ea", accent: "#d99a4e", "accent-fg": "#241a0a",
      "brand-from": "#c65f3d", "brand-via": "#d99a4e", "brand-to": "#8a5a3b",
      "aurora-1": "#c65f3d", "aurora-2": "#d99a4e", "aurora-3": "#e8c39a", "aurora-4": "#b0724a", "aurora-5": "#efd9b8",
      "aurora-opacity": 26, overlay: "#e6dfd1", "nav-bg": "#faf8f2", "nav-fg": "#5b544a", "nav-fg-active": "#1c1a17",
      "card-bg": "#ffffff", "card-border": "#e6ded0", "input-bg": "#ffffff", "input-border": "#e0d9cb", "input-fg": "#1c1a17",
      "fx-node": "#c65f3d", "fx-node-2": "#d99a4e", "fx-link": "#b0724a",
      "font-display": "var(--font-bricolage)", "grain-opacity": 8, vignette: 10, ring: "#c65f3d",
    },
  },
  {
    id: "nebula",
    name: "Nebula",
    blurb: "Indigo dust with a coral supernova.",
    swatch: ["#6366f1", "#fb7185", "#22d3ee", "#0b0a1f"],
    values: {
      bg: "#0b0a1f", "bg-2": "#12112e", "bg-3": "#1a1842", fg: "#eef0ff", "fg-muted": "#a2a4d8", "fg-subtle": "#6b6ca6",
      border: "#242254", "border-strong": "#343178",
      primary: "#6366f1", secondary: "#22d3ee", accent: "#fb7185",
      "brand-from": "#6366f1", "brand-via": "#22d3ee", "brand-to": "#fb7185",
      "aurora-1": "#6366f1", "aurora-2": "#22d3ee", "aurora-3": "#fb7185", "aurora-4": "#818cf8", "aurora-5": "#f472b6",
      "fx-node": "#818cf8", "fx-node-2": "#22d3ee", "fx-link": "#fb7185", ring: "#6366f1",
    },
  },
  {
    id: "cyber-gold",
    name: "Cyber Gold",
    blurb: "Obsidian and liquid gold — luxe machine.",
    swatch: ["#e8b04b", "#f5d98b", "#0a0a0a", "#141310"],
    values: {
      bg: "#0a0a08", "bg-2": "#121108", "bg-3": "#1b1810", fg: "#fbf3df", "fg-muted": "#bfae86", "fg-subtle": "#847756",
      border: "#241f12", "border-strong": "#3a3119",
      primary: "#e8b04b", "primary-fg": "#1a1200", "primary-hover": "#f2c569", secondary: "#f5d98b", "secondary-fg": "#1a1200", accent: "#c9962f", "accent-fg": "#150e00",
      "brand-from": "#e8b04b", "brand-via": "#f5d98b", "brand-to": "#a8791f",
      "aurora-1": "#e8b04b", "aurora-2": "#f5d98b", "aurora-3": "#a8791f", "aurora-4": "#c9962f", "aurora-5": "#7a5a15",
      "fx-node": "#e8b04b", "fx-node-2": "#f5d98b", "fx-link": "#a8791f",
      "font-display": "var(--font-syne)", ring: "#e8b04b", "glow-strength": 55,
    },
  },
  {
    id: "deep-sea",
    name: "Deep Sea",
    blurb: "Abyssal teal with bioluminescent aqua.",
    swatch: ["#2dd4bf", "#38bdf8", "#042f2e", "#03181c"],
    values: {
      bg: "#03181c", "bg-2": "#052429", "bg-3": "#08343b", fg: "#e0fbfc", "fg-muted": "#8fc2c8", "fg-subtle": "#557f85",
      border: "#0d3b42", "border-strong": "#13525c",
      primary: "#2dd4bf", "primary-fg": "#00201d", secondary: "#38bdf8", accent: "#5eead4", "accent-fg": "#00201d",
      "brand-from": "#2dd4bf", "brand-via": "#38bdf8", "brand-to": "#5eead4",
      "aurora-1": "#2dd4bf", "aurora-2": "#38bdf8", "aurora-3": "#5eead4", "aurora-4": "#0ea5e9", "aurora-5": "#14b8a6",
      "fx-node": "#2dd4bf", "fx-node-2": "#38bdf8", "fx-link": "#5eead4", ring: "#2dd4bf",
    },
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    blurb: "Soft pastel light theme with a rosé glow.",
    swatch: ["#e0518a", "#a855f7", "#fff1f6", "#2b0f1c"],
    values: {
      bg: "#fff1f6", "bg-2": "#ffffff", "bg-3": "#fff7fa", "bg-inset": "#ffe3ee",
      fg: "#2b0f1c", "fg-muted": "#7a4a60", "fg-subtle": "#b08396",
      border: "#f6d5e2", "border-strong": "#efb7cd",
      primary: "#e0518a", "primary-fg": "#ffffff", secondary: "#a855f7", accent: "#fb7185", "accent-fg": "#ffffff",
      "brand-from": "#e0518a", "brand-via": "#fb7185", "brand-to": "#a855f7",
      "aurora-1": "#e0518a", "aurora-2": "#a855f7", "aurora-3": "#fbb6ce", "aurora-4": "#f472b6", "aurora-5": "#c084fc",
      "aurora-opacity": 34, overlay: "#ffe0ec", "nav-bg": "#ffffff", "nav-fg": "#7a4a60", "nav-fg-active": "#2b0f1c",
      "card-bg": "#ffffff", "card-border": "#f7dbe6", "input-bg": "#ffffff", "input-border": "#f6d5e2", "input-fg": "#2b0f1c",
      "fx-node": "#e0518a", "fx-node-2": "#a855f7", "fx-link": "#fb7185",
      "grain-opacity": 0, vignette: 8, ring: "#e0518a",
    },
  },
  {
    id: "matrix",
    name: "Matrix",
    blurb: "Phosphor green rain on absolute black.",
    swatch: ["#22ff88", "#00d47a", "#000000", "#031007"],
    values: {
      bg: "#020604", "bg-2": "#04120a", "bg-3": "#061d0f", fg: "#c7ffe0", "fg-muted": "#5fbf88", "fg-subtle": "#357a53",
      border: "#0c2c1a", "border-strong": "#134026",
      primary: "#22ff88", "primary-fg": "#001a0c", secondary: "#00d47a", accent: "#7dff5e", "accent-fg": "#00200a",
      "brand-from": "#22ff88", "brand-via": "#00d47a", "brand-to": "#7dff5e",
      "aurora-1": "#22ff88", "aurora-2": "#00d47a", "aurora-3": "#7dff5e", "aurora-4": "#16a34a", "aurora-5": "#065f46",
      "fx-node": "#22ff88", "fx-node-2": "#7dff5e", "fx-link": "#00d47a",
      "font-display": "var(--font-jetbrains)", "font-body": "var(--font-jetbrains)", ring: "#22ff88", "glow-strength": 60,
    },
  },
];
