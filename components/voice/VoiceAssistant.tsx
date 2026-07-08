"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore, useToggle } from "@/lib/store";
import { PRESETS } from "@/lib/tokens";
import { Icon } from "@/components/ui/Icon";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Status = "idle" | "listening" | "unsupported";

const SECTION_WORDS: Record<string, string> = {
  service: "services", work: "work", product: "products", process: "process",
  contact: "contact", price: "pricing", pricing: "pricing", testimonial: "testimonials",
  capabilit: "capabilities", faq: "faq", top: "hero", home: "hero", hero: "hero",
};

export function VoiceAssistant() {
  const enabled = useToggle("enable-voice");
  const router = useRouter();
  const applyPreset = useAppStore((s) => s.applyPreset);
  const randomizeTheme = useAppStore((s) => s.randomizeTheme);
  const resetTheme = useAppStore((s) => s.resetTheme);

  const [status, setStatus] = useState<Status>("idle");
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("Try “surprise me”, “theme synthwave”, or “go to work”.");
  const recRef = useRef<any>(null);

  const speak = useCallback((text: string) => {
    setCaption(text);
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.02;
      u.pitch = 1;
      synth.speak(u);
    } catch {
      /* no-op */
    }
  }, []);

  const handle = useCallback(
    (raw: string) => {
      const t = raw.toLowerCase().trim();
      setCaption(`“${raw}”`);

      // theme: random
      if (/(surprise|random|shuffle|remix)/.test(t)) {
        randomizeTheme();
        speak("Here's a fresh look for you.");
        return;
      }
      // theme: reset
      if (/(reset|default|original)/.test(t)) {
        resetTheme();
        speak("Back to the signature theme.");
        return;
      }
      // theme: preset by name
      const preset = PRESETS.find(
        (p) => t.includes(p.name.toLowerCase()) || t.includes(p.id.replace(/-/g, " ")),
      );
      if (preset && /(theme|look|preset|switch|change|apply|make it)/.test(t + " theme")) {
        applyPreset(preset.id);
        speak(`Switching to ${preset.name}.`);
        return;
      }
      // admin
      if (/(admin|dashboard|control|panel|studio)/.test(t)) {
        speak("Opening the admin panel.");
        router.push("/admin");
        return;
      }
      // navigation
      for (const [word, id] of Object.entries(SECTION_WORDS)) {
        if (t.includes(word)) {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            speak(`Scrolling to ${id}.`);
            return;
          }
        }
      }
      speak("I didn't catch a command. Try a theme name, “surprise me”, or “go to work”.");
    },
    [applyPreset, randomizeTheme, resetTheme, router, speak],
  );

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      // Feature-detect the Web Speech API on the client only.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("unsupported");
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => handle(e.results[0][0].transcript);
    rec.onend = () => setStatus("idle");
    rec.onerror = () => {
      setStatus("idle");
      setCaption("Mic error — check permissions and try again.");
    };
    recRef.current = rec;
    return () => {
      try {
        rec.abort();
      } catch {
        /* no-op */
      }
    };
  }, [handle]);

  if (!enabled) return null;

  const listen = () => {
    setOpen(true);
    if (status === "unsupported") {
      speak("Voice isn't supported in this browser. Try Chrome.");
      return;
    }
    if (status === "listening") {
      recRef.current?.stop();
      setStatus("idle");
      return;
    }
    try {
      recRef.current?.start();
      setStatus("listening");
      setCaption("Listening…");
    } catch {
      /* start() can throw if already started */
    }
  };

  const active = status === "listening";

  return (
    <div className="fixed bottom-5 right-5 z-[75] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            className="glass max-w-[15rem] rounded-[var(--radius)] px-4 py-3 text-sm shadow-soft"
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="eyebrow !text-[var(--primary)]">Voice</span>
              <button aria-label="Close" onClick={() => setOpen(false)} className="text-[var(--fg-subtle)] hover:text-[var(--fg)]">
                <Icon name="X" size={14} />
              </button>
            </div>
            <p className="leading-relaxed text-[var(--fg-muted)]">{caption}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={listen}
        aria-label="Voice assistant"
        whileTap={{ scale: 0.92 }}
        className="relative grid h-14 w-14 place-items-center rounded-full text-[var(--primary-fg)] shadow-soft"
        style={{ background: "linear-gradient(135deg, var(--brand-from), var(--brand-via), var(--brand-to))" }}
      >
        {active && (
          <>
            <span className="absolute inset-0 animate-ping rounded-full bg-[var(--primary)] opacity-40" />
            <span className="absolute -inset-2 rounded-full border border-[var(--primary)] opacity-30" />
          </>
        )}
        <Icon name={active ? "Mic" : status === "unsupported" ? "MicOff" : "Mic"} size={22} />
      </motion.button>
    </div>
  );
}
