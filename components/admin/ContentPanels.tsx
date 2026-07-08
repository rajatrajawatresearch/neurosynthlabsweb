"use client";

import { useAppStore, type Collection } from "@/lib/store";
import { CONTENT_ICONS, Icon } from "@/components/ui/Icon";
import { TextInput, TextArea, Toggle } from "./controls";
import { TOKENS } from "@/lib/tokens";
import { ControlField } from "./controls";

/* ---- field schema for the generic collection editor ---------------------- */
type FieldType = "text" | "textarea" | "select" | "list" | "toggle" | "icon";
interface FieldSpec {
  key: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  full?: boolean;
}

function ListField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <TextArea
      label={`${label} (one per line)`}
      rows={Math.max(3, value.length)}
      value={value.join("\n")}
      onChange={(v) => onChange(v.split("\n").map((s) => s.trimStart()).filter((s) => s.length > 0))}
    />
  );
}

function IconField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-[var(--fg-muted)]">Icon</span>
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--primary)]">
          <Icon name={value} size={18} />
        </span>
        <select className="field" value={value} onChange={(e) => onChange(e.target.value)}>
          {CONTENT_ICONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

function Field({
  spec,
  value,
  onChange,
}: {
  spec: FieldSpec;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  switch (spec.type) {
    case "text":
      return <TextInput label={spec.label} value={String(value ?? "")} onChange={onChange} />;
    case "textarea":
      return <TextArea label={spec.label} value={String(value ?? "")} onChange={onChange} />;
    case "list":
      return <ListField label={spec.label} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />;
    case "toggle":
      return <Toggle label={spec.label} checked={Boolean(value)} onChange={onChange} />;
    case "icon":
      return <IconField value={String(value ?? "Sparkles")} onChange={onChange} />;
    case "select":
      return (
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-[var(--fg-muted)]">{spec.label}</span>
          <select className="field" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
            {spec.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      );
    default:
      return null;
  }
}

function CollectionEditor({
  collection,
  title,
  description,
  fields,
  template,
}: {
  collection: Collection;
  title: string;
  description: string;
  fields: FieldSpec[];
  template: Record<string, unknown>;
}) {
  const items = useAppStore(
    (s) => s.content[collection] as unknown as Array<{ id: string } & Record<string, unknown>>,
  );
  const addItem = useAppStore((s) => s.addItem);
  const updateItem = useAppStore((s) => s.updateItem);
  const removeItem = useAppStore((s) => s.removeItem);
  const moveItem = useAppStore((s) => s.moveItem);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-sm text-[var(--fg-muted)]">{description}</p>
        </div>
        <button onClick={() => addItem(collection, template)} className="btn btn-primary !py-2 text-sm">
          <Icon name="Plus" size={16} /> Add
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {items.length === 0 && (
          <div className="card text-center text-sm text-[var(--fg-muted)]">
            Nothing here yet. Click “Add” to create the first entry.
          </div>
        )}
        {items.map((item, i) => (
          <div key={item.id} className="card">
            <div className="mb-4 flex items-center justify-between">
              <span className="chip font-mono text-xs">#{i + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveItem(collection, item.id, -1)}
                  disabled={i === 0}
                  className="grid h-8 w-8 place-items-center rounded-full text-[var(--fg-muted)] hover:bg-[color-mix(in_srgb,var(--fg)_8%,transparent)] disabled:opacity-30"
                  aria-label="Move up"
                >
                  <Icon name="MoveUp" size={15} />
                </button>
                <button
                  onClick={() => moveItem(collection, item.id, 1)}
                  disabled={i === items.length - 1}
                  className="grid h-8 w-8 place-items-center rounded-full text-[var(--fg-muted)] hover:bg-[color-mix(in_srgb,var(--fg)_8%,transparent)] disabled:opacity-30"
                  aria-label="Move down"
                >
                  <Icon name="MoveDown" size={15} />
                </button>
                <button
                  onClick={() => removeItem(collection, item.id)}
                  className="grid h-8 w-8 place-items-center rounded-full text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_12%,transparent)]"
                  aria-label="Delete"
                >
                  <Icon name="Trash2" size={15} />
                </button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className={f.full || f.type === "textarea" || f.type === "list" ? "md:col-span-2" : ""}>
                  <Field
                    spec={f}
                    value={item[f.key]}
                    onChange={(v) => updateItem(collection, item.id, { [f.key]: v })}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- concrete collection panels ------------------------------------------ */

export function ServicesPanel() {
  return (
    <CollectionEditor
      collection="services"
      title="Services"
      description="What you offer. Shown in the Services grid."
      fields={[
        { key: "icon", label: "Icon", type: "icon" },
        { key: "title", label: "Title", type: "text" },
        { key: "blurb", label: "Description", type: "textarea" },
        { key: "tags", label: "Tags", type: "list" },
      ]}
      template={{ icon: "Sparkles", title: "New service", blurb: "Describe it.", tags: ["Tag"] }}
    />
  );
}

export function ProductsPanel() {
  return (
    <CollectionEditor
      collection="products"
      title="Products"
      description="Agentic-AI products in the lab. Shown in the Products section."
      fields={[
        { key: "name", label: "Name", type: "text" },
        {
          key: "status", label: "Status", type: "select",
          options: [
            { label: "Live", value: "Live" }, { label: "Beta", value: "Beta" },
            { label: "Building", value: "Building" }, { label: "Concept", value: "Concept" },
          ],
        },
        { key: "icon", label: "Icon", type: "icon" },
        { key: "tagline", label: "Tagline", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "features", label: "Features", type: "list" },
      ]}
      template={{ name: "New product", status: "Concept", icon: "Rocket", tagline: "A tagline.", description: "Describe it.", features: ["Feature"] }}
    />
  );
}

export function WorkPanel() {
  return (
    <CollectionEditor
      collection="work"
      title="Work"
      description="Selected case studies. (Metrics are edited in code.)"
      fields={[
        { key: "title", label: "Title", type: "text" },
        { key: "category", label: "Category", type: "text" },
        { key: "year", label: "Year", type: "text" },
        { key: "blurb", label: "Description", type: "textarea" },
        { key: "tags", label: "Tags", type: "list" },
      ]}
      template={{ title: "New project", category: "AI / ML", year: "2025", blurb: "Describe it.", metrics: [], tags: ["Tag"] }}
    />
  );
}

export function TestimonialsPanel() {
  return (
    <CollectionEditor
      collection="testimonials"
      title="Testimonials"
      description="Social proof from clients."
      fields={[
        { key: "quote", label: "Quote", type: "textarea" },
        { key: "name", label: "Name", type: "text" },
        { key: "role", label: "Role", type: "text" },
        { key: "company", label: "Company", type: "text" },
      ]}
      template={{ quote: "They shipped fast.", name: "Name", role: "Role", company: "Company" }}
    />
  );
}

export function PlansPanel() {
  return (
    <CollectionEditor
      collection="plans"
      title="Engagement"
      description="Ways to work together."
      fields={[
        { key: "name", label: "Name", type: "text" },
        { key: "price", label: "Price", type: "text" },
        { key: "period", label: "Period", type: "text" },
        { key: "blurb", label: "Blurb", type: "textarea" },
        { key: "features", label: "Features", type: "list" },
        { key: "cta", label: "CTA label", type: "text" },
        { key: "highlight", label: "Highlight this plan", type: "toggle" },
      ]}
      template={{ name: "New plan", price: "Fixed", period: "1 week", blurb: "Describe it.", features: ["Feature"], highlight: false, cta: "Get started" }}
    />
  );
}

export function FaqPanel() {
  return (
    <CollectionEditor
      collection="faqs"
      title="FAQ"
      description="Answer common questions."
      fields={[
        { key: "q", label: "Question", type: "text", full: true },
        { key: "a", label: "Answer", type: "textarea" },
      ]}
      template={{ q: "A question?", a: "An answer." }}
    />
  );
}

export function CapabilitiesPanel() {
  return (
    <CollectionEditor
      collection="capabilities"
      title="Capabilities"
      description="Your technology matrix."
      fields={[
        { key: "category", label: "Category", type: "text" },
        { key: "icon", label: "Icon", type: "icon" },
        { key: "items", label: "Items", type: "list" },
      ]}
      template={{ category: "New category", icon: "Boxes", items: ["Tool"] }}
    />
  );
}

/* ---- Hero editor --------------------------------------------------------- */

export function HeroPanel() {
  const hero = useAppStore((s) => s.content.hero);
  const patch = useAppStore((s) => s.patchContent);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Hero</h2>
        <p className="text-sm text-[var(--fg-muted)]">The first thing visitors see.</p>
      </div>

      <div className="card grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <TextInput label="Eyebrow" value={hero.eyebrow} onChange={(v) => patch((d) => { d.hero.eyebrow = v; })} />
        </div>
        <div className="md:col-span-2">
          <TextArea
            label="Title lines (one per line)"
            rows={3}
            value={hero.titleLines.join("\n")}
            onChange={(v) => patch((d) => { d.hero.titleLines = v.split("\n").filter(Boolean); })}
          />
        </div>
        <TextInput label="Highlight (gradient) line" value={hero.highlight} onChange={(v) => patch((d) => { d.hero.highlight = v; })} />
        <div />
        <div className="md:col-span-2">
          <TextArea label="Subtitle" value={hero.subtitle} onChange={(v) => patch((d) => { d.hero.subtitle = v; })} />
        </div>
        <TextInput label="Primary button label" value={hero.primaryCta.label} onChange={(v) => patch((d) => { d.hero.primaryCta.label = v; })} />
        <TextInput label="Primary button link" value={hero.primaryCta.href} onChange={(v) => patch((d) => { d.hero.primaryCta.href = v; })} />
        <TextInput label="Secondary button label" value={hero.secondaryCta.label} onChange={(v) => patch((d) => { d.hero.secondaryCta.label = v; })} />
        <TextInput label="Secondary button link" value={hero.secondaryCta.href} onChange={(v) => patch((d) => { d.hero.secondaryCta.href = v; })} />
        <div className="md:col-span-2">
          <TextArea
            label="Badges (one per line)"
            rows={3}
            value={hero.badges.join("\n")}
            onChange={(v) => patch((d) => { d.hero.badges = v.split("\n").map((s) => s.trim()).filter(Boolean); })}
          />
        </div>
      </div>

      <div className="card">
        <p className="eyebrow mb-4">Hero stats</p>
        <div className="flex flex-col gap-4">
          {hero.stats.map((st, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-3">
              <TextInput label="Value" value={st.value} onChange={(v) => patch((d) => { d.hero.stats[i].value = v; })} />
              <TextInput label="Suffix" value={st.suffix ?? ""} onChange={(v) => patch((d) => { d.hero.stats[i].suffix = v; })} />
              <TextInput label="Label" value={st.label} onChange={(v) => patch((d) => { d.hero.stats[i].label = v; })} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Typography panel ---------------------------------------------------- */

export function TypographyPanel() {
  const typo = TOKENS.filter((t) => t.group === "Typography");
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Typography</h2>
        <p className="text-sm text-[var(--fg-muted)]">Swap fonts and dial in the type system.</p>
      </div>
      <div className="card">
        <p className="font-display text-4xl font-bold">The quick synapse fires.</p>
        <p className="mt-2 text-[var(--fg-muted)]">
          A body paragraph rendered in the active body font. 0123456789 — the crux of good typography is rhythm and contrast.
        </p>
        <p className="mt-2 font-mono text-sm text-[var(--fg-subtle)]">const mono = &quot;monospace utility&quot;;</p>
      </div>
      <div className="card grid gap-4 md:grid-cols-2">
        {typo.map((t) => (
          <ControlField key={t.key} token={t} />
        ))}
      </div>
    </div>
  );
}
