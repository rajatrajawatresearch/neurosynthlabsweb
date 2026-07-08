import {
  Space_Grotesk,
  Syne,
  Sora,
  Unbounded,
  Bricolage_Grotesque,
  Outfit,
  Inter,
  Manrope,
  Instrument_Sans,
  JetBrains_Mono,
  IBM_Plex_Mono,
} from "next/font/google";

/**
 * A curated set of variable fonts. Each exposes a CSS variable so the theme
 * engine can swap the active display/body/mono face at runtime with zero
 * network cost or layout flash. All are attached to <html> once.
 */

const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });
const syne = Syne({ variable: "--font-syne", subsets: ["latin"], display: "swap" });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap" });
const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin"], display: "swap" });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], display: "swap" });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], display: "swap" });

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const instrument = Instrument_Sans({ variable: "--font-instrument", subsets: ["latin"], display: "swap" });

const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], display: "swap" });
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/** Space-joined className of every font variable — spread onto <html>. */
export const fontVariables = [
  spaceGrotesk.variable,
  syne.variable,
  sora.variable,
  unbounded.variable,
  bricolage.variable,
  outfit.variable,
  inter.variable,
  manrope.variable,
  instrument.variable,
  jetbrains.variable,
  plexMono.variable,
].join(" ");

/** Options surfaced in the admin Typography panel. Values are CSS var references. */
export const DISPLAY_FONTS = [
  { label: "Space Grotesk", value: "var(--font-space-grotesk)" },
  { label: "Syne", value: "var(--font-syne)" },
  { label: "Sora", value: "var(--font-sora)" },
  { label: "Unbounded", value: "var(--font-unbounded)" },
  { label: "Bricolage Grotesque", value: "var(--font-bricolage)" },
  { label: "Outfit", value: "var(--font-outfit)" },
];

export const BODY_FONTS = [
  { label: "Inter", value: "var(--font-inter)" },
  { label: "Manrope", value: "var(--font-manrope)" },
  { label: "Instrument Sans", value: "var(--font-instrument)" },
  { label: "Outfit", value: "var(--font-outfit)" },
  { label: "Sora", value: "var(--font-sora)" },
];

export const MONO_FONTS = [
  { label: "JetBrains Mono", value: "var(--font-jetbrains)" },
  { label: "IBM Plex Mono", value: "var(--font-plex-mono)" },
];
