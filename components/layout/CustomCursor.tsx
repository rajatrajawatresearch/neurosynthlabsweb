"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useAppStore, useToggle } from "@/lib/store";

/** A trailing glow + ring that accents the native cursor on fine-pointer devices. */
export function CustomCursor() {
  const enabled = useToggle("enable-cursor");
  const style = useAppStore((s) => String(s.values["cursor-style"] ?? "glow"));
  const size = useAppStore((s) => Number(s.values["cursor-size"]) || 28);
  const glow = useAppStore((s) => Number(s.values["cursor-glow"]) || 320);

  const [fine, setFine] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 30, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 380, damping: 30, mass: 0.4 });
  const glowX = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 });
  const glowY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    // Detect a fine pointer on the client only (avoids SSR mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", d);
      window.removeEventListener("pointerup", u);
    };
  }, [x, y]);

  if (!enabled || !fine || style === "system") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden>
      {style === "glow" && (
        <motion.div
          className="absolute rounded-full"
          style={{
            x: glowX,
            y: glowY,
            width: glow,
            height: glow,
            translateX: "-50%",
            translateY: "-50%",
            background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 22%, transparent), transparent 68%)",
          }}
        />
      )}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: ringX,
          y: ringY,
          width: down ? size * 0.7 : size,
          height: down ? size * 0.7 : size,
          translateX: "-50%",
          translateY: "-50%",
          border: style === "dot" ? "none" : "1.5px solid color-mix(in srgb, var(--primary) 70%, transparent)",
          background:
            style === "dot"
              ? "var(--primary)"
              : "radial-gradient(circle, color-mix(in srgb, var(--primary) 30%, transparent), transparent 60%)",
          transition: "width .15s ease, height .15s ease",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
