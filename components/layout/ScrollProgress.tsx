"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useToggle } from "@/lib/store";

/** Thin gradient progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const enabled = useToggle("enable-scrollbar");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, var(--brand-from), var(--brand-via), var(--brand-to))",
        boxShadow: "0 0 18px color-mix(in srgb, var(--primary) 60%, transparent)",
      }}
    />
  );
}
