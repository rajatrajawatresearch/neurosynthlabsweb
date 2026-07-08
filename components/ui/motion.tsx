"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useAppStore } from "@/lib/store";

/** Read motion tuning from the theme store (falls back to sane defaults pre-hydration). */
export function useMotionConfig() {
  const speed = useAppStore((s) => Number(s.values["motion-speed"]) || 1);
  const distance = useAppStore((s) => Number(s.values["motion-distance"]) ?? 26);
  const stagger = useAppStore((s) => Number(s.values["motion-stagger"]) || 60);
  const forced = useAppStore((s) => Boolean(s.values["reduce-motion"]));
  const system = useReducedMotion();
  const reduce = forced || Boolean(system);
  return {
    reduce,
    duration: reduce ? 0 : 0.7 / speed,
    distance: reduce ? 0 : distance,
    stagger: reduce ? 0 : stagger / 1000,
  };
}

/** A single element that fades + rises into view. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  y,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "span" | "li" | "section";
  y?: number;
  }) {
  const { duration, distance, reduce } = useMotionConfig();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : (y ?? distance) }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}

/** Container that staggers its <StaggerItem> children. */
export function Stagger({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { stagger, reduce } = useMotionConfig();
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay } },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const { duration, distance } = useMotionConfig();
  const variants: Variants = {
    hidden: { opacity: 0, y: distance },
    show: { opacity: 1, y: 0, transition: { duration, ease: [0.22, 1, 0.36, 1] } },
  };
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
