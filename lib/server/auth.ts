import "server-only";
import type { NextRequest } from "next/server";

/**
 * Minimal stateless admin auth: a signed, expiring cookie token.
 * Secret comes from ADMIN_SECRET; the login password from ADMIN_PASSWORD.
 */
export const ADMIN_COOKIE = "ns_admin";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function secret() {
  return process.env.ADMIN_SECRET || "insecure-dev-secret-change-me";
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Buffer.from(sig).toString("base64url");
}

/** Is server-side auth even configured? (If not, callers fall back to demo mode.) */
export function authConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && password === expected;
}

export async function createToken(): Promise<string> {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TTL_MS })).toString("base64url");
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = await hmac(payload);
  if (sig !== expected) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAuthed(req: NextRequest): Promise<boolean> {
  return verifyToken(req.cookies.get(ADMIN_COOKIE)?.value);
}
