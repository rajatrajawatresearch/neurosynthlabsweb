"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { useMotionConfig } from "./motion";

/**
 * Animates the numeric part of a value string from 0 → target when scrolled
 * into view, preserving any non-numeric prefix/suffix (e.g. "<1", "−30", "99.9").
 */
export function Counter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const { reduce, duration } = useMotionConfig();

  const match = /^(\D*)(\d+(?:\.\d+)?)(\D*)$/.exec(value.trim());
  const prefix = match?.[1] ?? "";
  const target = match ? parseFloat(match[2]) : NaN;
  const trailing = match?.[3] ?? "";
  const decimals = match?.[2].includes(".") ? match[2].split(".")[1].length : 0;

  const [display, setDisplay] = useState(() =>
    isNaN(target) ? value : `${prefix}0${trailing}`,
  );

  useEffect(() => {
    // Syncs the rendered number to scroll/inView + the animation loop.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (isNaN(target)) {
      setDisplay(value);
      return;
    }
    if (!inView) return;
    if (reduce) {
      setDisplay(`${prefix}${target.toFixed(decimals)}${trailing}`);
      return;
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    const controls = animate(0, target, {
      duration: Math.max(0.6, duration + 0.4),
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${prefix}${v.toFixed(decimals)}${trailing}`),
    });
    return () => controls.stop();
  }, [inView, target, reduce, duration, decimals, prefix, trailing, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
