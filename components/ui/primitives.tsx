"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

/** Standard section header: mono eyebrow + display title + optional lede. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center mx-auto max-w-2xl",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <span className="eyebrow">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="max-w-3xl">{title}</h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p className={cn("text-[var(--fg-muted)] text-lg leading-relaxed max-w-2xl", align === "center" && "mx-auto")}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/** Pointer-reactive 3D tilt. Disabled via the `enable-tilt` theme toggle. */
export function TiltCard({
  children,
  className,
  intensity = 8,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const enabled = useAppStore((s) => s.values["enable-tilt"] !== false);
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 200, damping: 20 });

  function onMove(e: React.MouseEvent) {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function reset() {
    px.set(0);
    py.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={enabled ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : undefined}
      className={cn("[transform-style:preserve-3d]", className)}
    >
      {children}
    </motion.div>
  );
}

/** Button/link that leans toward the cursor. */
export function MagneticButton({
  children,
  className,
  href,
  onClick,
  strength = 0.4,
  type,
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
  type?: "button" | "submit";
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });

  function onMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  const common = {
    onMouseMove: onMove,
    onMouseLeave: reset,
    className,
    style: { x, y },
  } as const;

  if (href) {
    return (
      <motion.a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} aria-label={ariaLabel} {...common}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type ?? "button"}
      onClick={onClick}
      aria-label={ariaLabel}
      {...common}
    >
      {children}
    </motion.button>
  );
}
