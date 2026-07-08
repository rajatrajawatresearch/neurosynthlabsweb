import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";
import {
  DEFAULT_VALUES,
  PRESETS,
  TOKENS,
  type ThemeValues,
  type TokenValue,
} from "./tokens";
import { DEFAULT_CONTENT, type SiteContent } from "./content";

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
  createdAt: number;
  read: boolean;
}

/** Content collections that support add / update / remove / reorder. */
export type Collection =
  | "services"
  | "products"
  | "work"
  | "testimonials"
  | "plans"
  | "faqs"
  | "capabilities";

interface AppState {
  values: ThemeValues;
  content: SiteContent;
  activePreset: string;
  leads: Lead[];

  // --- theme ---
  setToken: (key: string, value: TokenValue) => void;
  setTokens: (patch: ThemeValues) => void;
  applyPreset: (id: string) => void;
  resetTheme: () => void;
  randomizeTheme: () => void;
  importTheme: (values: ThemeValues) => void;

  // --- content ---
  patchContent: (updater: (draft: SiteContent) => void) => void;
  addItem: (collection: Collection, item: Record<string, unknown>) => void;
  updateItem: (collection: Collection, id: string, patch: Record<string, unknown>) => void;
  removeItem: (collection: Collection, id: string) => void;
  moveItem: (collection: Collection, id: string, dir: -1 | 1) => void;
  resetContent: () => void;

  // --- leads ---
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "read">) => void;
  markLead: (id: string, read: boolean) => void;
  deleteLead: (id: string) => void;
  clearLeads: () => void;

  resetAll: () => void;
}

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

const randHex = () => {
  const h = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
  return `#${h}`;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      values: { ...DEFAULT_VALUES },
      content: structuredClone(DEFAULT_CONTENT),
      activePreset: "bioluminescence",
      leads: [],

      setToken: (key, value) =>
        set((s) => ({ values: { ...s.values, [key]: value }, activePreset: "custom" })),

      setTokens: (patch) =>
        set((s) => ({ values: { ...s.values, ...patch }, activePreset: "custom" })),

      applyPreset: (id) => {
        const preset = PRESETS.find((p) => p.id === id);
        if (!preset) return;
        set((s) => ({
          // start from current feature toggles so a preset only reskins visuals
          values: { ...DEFAULT_VALUES, ...preset.values, ...pickToggles(s.values) },
          activePreset: id,
        }));
      },

      resetTheme: () => set({ values: { ...DEFAULT_VALUES }, activePreset: "bioluminescence" }),

      randomizeTheme: () => {
        const colorKeys = [
          "primary", "secondary", "accent", "primary-hover", "accent-hover",
          "aurora-1", "aurora-2", "aurora-3", "aurora-4", "aurora-5",
          "brand-from", "brand-via", "brand-to", "fx-node", "fx-node-2", "fx-link", "ring",
        ];
        const patch: ThemeValues = {};
        colorKeys.forEach((k) => (patch[k] = randHex()));
        set((s) => ({ values: { ...s.values, ...patch }, activePreset: "custom" }));
      },

      importTheme: (values) =>
        set({ values: { ...DEFAULT_VALUES, ...values }, activePreset: "custom" }),

      patchContent: (updater) =>
        set((s) => {
          const draft = structuredClone(s.content);
          updater(draft);
          return { content: draft };
        }),

      addItem: (collection, item) =>
        set((s) => {
          const draft = structuredClone(s.content);
          (draft[collection] as unknown as Record<string, unknown>[]).push({ id: uid(), ...item });
          return { content: draft };
        }),

      updateItem: (collection, id, patch) =>
        set((s) => {
          const draft = structuredClone(s.content);
          const list = draft[collection] as { id: string }[];
          const idx = list.findIndex((x) => x.id === id);
          if (idx >= 0) list[idx] = { ...list[idx], ...patch };
          return { content: draft };
        }),

      removeItem: (collection, id) =>
        set((s) => {
          const draft = structuredClone(s.content);
          draft[collection] = (draft[collection] as { id: string }[]).filter(
            (x) => x.id !== id,
          ) as never;
          return { content: draft };
        }),

      moveItem: (collection, id, dir) =>
        set((s) => {
          const draft = structuredClone(s.content);
          const list = draft[collection] as { id: string }[];
          const i = list.findIndex((x) => x.id === id);
          const j = i + dir;
          if (i < 0 || j < 0 || j >= list.length) return {};
          [list[i], list[j]] = [list[j], list[i]];
          return { content: draft };
        }),

      resetContent: () => set({ content: structuredClone(DEFAULT_CONTENT) }),

      addLead: (lead) =>
        set((s) => ({
          leads: [
            { ...lead, id: uid(), createdAt: Date.now(), read: false },
            ...s.leads,
          ],
        })),

      markLead: (id, read) =>
        set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, read } : l)) })),

      deleteLead: (id) => set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),

      clearLeads: () => set({ leads: [] }),

      resetAll: () =>
        set({
          values: { ...DEFAULT_VALUES },
          content: structuredClone(DEFAULT_CONTENT),
          activePreset: "bioluminescence",
          leads: [],
        }),
    }),
    {
      name: "neurosynth-labs-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        values: s.values,
        content: s.content,
        activePreset: s.activePreset,
        leads: s.leads,
      }),
    },
  ),
);

/** Keep only the feature-toggle tokens from a value map (so presets don't clobber them). */
function pickToggles(values: ThemeValues): ThemeValues {
  const out: ThemeValues = {};
  TOKENS.filter((t) => t.type === "toggle").forEach((t) => {
    if (t.key in values) out[t.key] = values[t.key];
  });
  return out;
}

/** True only after the first client effect — use to avoid SSR/localStorage hydration mismatches. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  // Intentional: flip to true once, on the client, to gate hydration-sensitive UI.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/** Public-site content that is SSR-safe: defaults on the server + first paint, store after hydration. */
export function useSiteContent(): SiteContent {
  const hydrated = useHydrated();
  const content = useAppStore((s) => s.content);
  return hydrated ? content : DEFAULT_CONTENT;
}

/** Read a single feature toggle safely (defaults before hydration). */
export function useToggle(key: string): boolean {
  const hydrated = useHydrated();
  const value = useAppStore((s) => s.values[key]);
  if (!hydrated) return Boolean(DEFAULT_VALUES[key]);
  return Boolean(value);
}
