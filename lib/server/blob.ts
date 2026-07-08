import "server-only";
import { put, get, list, del } from "@vercel/blob";
import type { Lead } from "@/lib/store";

/**
 * Vercel Blob-backed persistence. If BLOB_READ_WRITE_TOKEN is absent (local dev
 * without a store), every function no-ops / returns empty so the app degrades to
 * localStorage-only behavior.
 */

const CONFIG_PATH = "site/config.json";
const LEADS_PREFIX = "leads/";

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readJson<T>(pathname: string): Promise<T | null> {
  try {
    const res = await get(pathname, { access: "private", useCache: false });
    if (!res || !res.stream) return null;
    const text = await new Response(res.stream as ReadableStream).text();
    return JSON.parse(text) as T;
  } catch {
    return null; // not found / parse error
  }
}

export interface SiteConfig {
  values: Record<string, unknown>;
  content: unknown;
  updatedAt: number;
}

export async function readConfig(): Promise<SiteConfig | null> {
  if (!blobConfigured()) return null;
  return readJson<SiteConfig>(CONFIG_PATH);
}

export async function writeConfig(data: { values: unknown; content: unknown }): Promise<void> {
  await put(CONFIG_PATH, JSON.stringify({ ...data, updatedAt: Date.now() }), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function addLead(input: Omit<Lead, "id" | "createdAt" | "read">): Promise<Lead> {
  const lead: Lead = { ...input, id: crypto.randomUUID(), createdAt: Date.now(), read: false };
  await put(`${LEADS_PREFIX}${lead.id}.json`, JSON.stringify(lead), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json",
  });
  return lead;
}

export async function listLeads(): Promise<Lead[]> {
  if (!blobConfigured()) return [];
  const { blobs } = await list({ prefix: LEADS_PREFIX });
  const leads = await Promise.all(blobs.map((b) => readJson<Lead>(b.pathname)));
  return leads.filter((l): l is Lead => Boolean(l)).sort((a, b) => b.createdAt - a.createdAt);
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<void> {
  const existing = await readJson<Lead>(`${LEADS_PREFIX}${id}.json`);
  if (!existing) return;
  await put(`${LEADS_PREFIX}${id}.json`, JSON.stringify({ ...existing, ...patch, id }), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function deleteLead(id: string): Promise<void> {
  try {
    await del(`${LEADS_PREFIX}${id}.json`);
  } catch {
    /* already gone */
  }
}
