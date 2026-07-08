"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useSiteContent, useToggle } from "@/lib/store";
import { Counter } from "@/components/ui/Counter";
import { Icon } from "@/components/ui/Icon";
import { MagneticButton } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";

const NeuralField = dynamic(() => import("@/components/three/NeuralField"), { ssr: false });

export function Hero() {
  const { hero, settings } = useSiteContent();
  const show3d = useToggle("enable-3d");

  return (
    <section id="hero" className="relative flex min-h-[92vh] items-center overflow-hidden pt-10">
      {/* 3D neural field */}
      {show3d && (
        <div
          className="absolute inset-0 -z-[1]"
          style={{
            maskImage: "radial-gradient(ellipse 75% 70% at 50% 45%, #000 55%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 50% 45%, #000 55%, transparent 100%)",
          }}
        >
          <NeuralField />
        </div>
      )}

      <div className="container-x relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Reveal>
            <span className="chip mb-6 !border-[color-mix(in_srgb,var(--primary)_35%,var(--border))] !text-[var(--fg)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--primary)]" />
              </span>
              {hero.eyebrow}
            </span>
          </Reveal>

          <h1 className="text-balance">
            {hero.titleLines.map((line, i) => (
              <Reveal as="span" key={i} delay={0.05 * i} className="block">
                {line}
              </Reveal>
            ))}
            <Reveal as="span" delay={0.05 * hero.titleLines.length} className="block">
              <span className="gradient-text text-glow">{hero.highlight}</span>
            </Reveal>
          </h1>

          <Reveal delay={0.25}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[var(--fg-muted)] md:text-xl">
              {hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.35}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <MagneticButton href={hero.primaryCta.href} className="btn btn-primary text-base">
                {hero.primaryCta.label}
                <Icon name="ArrowRight" size={18} />
              </MagneticButton>
              <MagneticButton href={hero.secondaryCta.href} className="btn btn-outline text-base">
                {hero.secondaryCta.label}
                <Icon name="Play" size={16} />
              </MagneticButton>
            </div>
          </Reveal>

          <Reveal delay={0.45}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {hero.badges.map((b) => (
                <span key={b} className="chip font-mono text-[0.72rem]">
                  {b}
                </span>
              ))}
            </div>
          </Reveal>

          {/* stat strip */}
          <Reveal delay={0.55}>
            <div className="glass mt-14 grid grid-cols-3 gap-6 rounded-[var(--radius-lg)] px-8 py-6 sm:gap-12">
              {hero.stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center">
                  <span className="gradient-text font-display text-3xl font-bold sm:text-4xl">
                    <Counter value={s.value} suffix={s.suffix} />
                  </span>
                  <span className="mt-1 text-xs text-[var(--fg-muted)]">{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#services"
        aria-label="Scroll to content"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[var(--fg-subtle)]"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon name="ChevronDown" size={22} />
      </motion.a>

      <span className="sr-only">{settings.tagline}</span>
    </section>
  );
}
