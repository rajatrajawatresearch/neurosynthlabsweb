"use client";

import { useEffect, useState } from "react";
import { useAppStore, type Lead } from "@/lib/store";
import { Icon } from "@/components/ui/Icon";

export function Leads() {
  const localLeads = useAppStore((s) => s.leads);
  const localMark = useAppStore((s) => s.markLead);
  const localDelete = useAppStore((s) => s.deleteLead);
  const localClear = useAppStore((s) => s.clearLeads);

  // serverLeads === null => backend unavailable, fall back to local store
  const [serverLeads, setServerLeads] = useState<Lead[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/leads")
      .then(async (r) => {
        if (!active) return;
        if (r.ok) {
          const d = await r.json();
          setServerLeads(Array.isArray(d.leads) ? d.leads : []);
        } else {
          setServerLeads(null);
        }
      })
      .catch(() => active && setServerLeads(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const serverMode = serverLeads !== null;
  const leads = serverMode ? (serverLeads as Lead[]) : localLeads;

  async function mark(id: string, read: boolean) {
    if (serverMode) {
      setServerLeads((prev) => (prev ? prev.map((l) => (l.id === id ? { ...l, read } : l)) : prev));
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read }),
      }).catch(() => {});
    } else {
      localMark(id, read);
    }
  }

  async function remove(id: string) {
    if (serverMode) {
      setServerLeads((prev) => (prev ? prev.filter((l) => l.id !== id) : prev));
      await fetch(`/api/leads?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
    } else {
      localDelete(id);
    }
  }

  async function clearAll() {
    if (!confirm("Delete all leads?")) return;
    if (serverMode) {
      const ids = leads.map((l) => l.id);
      setServerLeads([]);
      await Promise.all(
        ids.map((id) => fetch(`/api/leads?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {})),
      );
    } else {
      localClear();
    }
  }

  if (loading) {
    return (
      <div className="grid place-items-center py-24">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Leads</h2>
          <p className="text-sm text-[var(--fg-muted)]">
            {serverMode ? "Contact-form submissions (stored on the server)." : "Contact-form submissions (stored in this browser)."}
          </p>
        </div>
        {leads.length > 0 && (
          <button onClick={clearAll} className="btn btn-ghost !py-2 text-sm">
            <Icon name="Trash2" size={15} /> Clear all
          </button>
        )}
      </div>

      {leads.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-[var(--primary)]">
            <Icon name="MessageSquare" size={22} />
          </span>
          <p className="text-[var(--fg-muted)]">No leads yet. Try the contact form on the site.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {leads.map((l) => {
            const open = openId === l.id;
            return (
              <div key={l.id} className="card">
                <button
                  className="flex w-full items-center justify-between gap-4 text-left"
                  onClick={() => {
                    setOpenId(open ? null : l.id);
                    if (!l.read) mark(l.id, true);
                  }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {!l.read && <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" />}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">{l.name}</span>
                        {l.budget && <span className="chip text-[0.68rem]">{l.budget}</span>}
                      </div>
                      <span className="truncate text-sm text-[var(--fg-subtle)]">
                        {l.email}
                        {l.company ? ` · ${l.company}` : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-[var(--fg-subtle)]">{new Date(l.createdAt).toLocaleString()}</span>
                    <Icon name="ChevronDown" size={16} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
                  </div>
                </button>

                {open && (
                  <div className="mt-4 border-t border-[var(--border)] pt-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--fg-muted)]">{l.message}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a href={`mailto:${l.email}`} className="btn btn-primary !py-2 text-sm">
                        <Icon name="Mail" size={15} /> Reply
                      </a>
                      <button onClick={() => mark(l.id, !l.read)} className="btn btn-outline !py-2 text-sm">
                        <Icon name={l.read ? "EyeOff" : "Eye"} size={15} /> Mark {l.read ? "unread" : "read"}
                      </button>
                      <button onClick={() => remove(l.id)} className="btn btn-ghost !py-2 text-sm text-[var(--danger)]">
                        <Icon name="Trash2" size={15} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
