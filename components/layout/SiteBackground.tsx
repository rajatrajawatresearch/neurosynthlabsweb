"use client";

import { useAppStore, useToggle } from "@/lib/store";

const BLOBS = [
  { v: "--aurora-1", top: "-10%", left: "-5%", size: "44vw" },
  { v: "--aurora-2", top: "20%", left: "62%", size: "40vw" },
  { v: "--aurora-3", top: "58%", left: "8%", size: "38vw" },
  { v: "--aurora-4", top: "72%", left: "70%", size: "36vw" },
  { v: "--aurora-5", top: "34%", left: "34%", size: "30vw" },
];

export function SiteBackground() {
  const style = useAppStore((s) => String(s.values["bg-style"] ?? "aurora"));
  const aurora = useToggle("enable-aurora");
  const grid = useToggle("enable-grid");
  const grain = useToggle("enable-grain");
  const vignette = useToggle("enable-vignette");

  const showAurora = aurora && style !== "plain";
  const showGrid = grid && (style === "grid" || style === "mesh");
  const showDots = style === "dots" && grid;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${grain ? "grain" : ""} ${vignette ? "vignette" : ""}`}
    >
      {/* base wash */}
      <div className="absolute inset-0 bg-[var(--bg)]" />

      {/* aurora field */}
      {showAurora &&
        BLOBS.map((b, i) => (
          <div
            key={i}
            className="aurora-blob"
            style={{
              top: b.top,
              left: b.left,
              width: b.size,
              height: b.size,
              background: `var(${b.v})`,
              animationDelay: `${i * -3.5}s`,
            }}
          />
        ))}

      {/* structured overlays */}
      {showGrid && <div className="absolute inset-0 bg-grid opacity-90" />}
      {showDots && <div className="absolute inset-0 bg-dots opacity-90" />}

      {/* top + bottom fades to anchor content */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--bg)] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--bg)] to-transparent" />
    </div>
  );
}
