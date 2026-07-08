import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, authConfigured, checkPassword, createToken, isAuthed } from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Session check — { authed, configured }. */
export async function GET(req: NextRequest) {
  return NextResponse.json({ authed: await isAuthed(req), configured: authConfigured() });
}

/** Log in with the admin password → sets a signed, httpOnly cookie. */
export async function POST(req: NextRequest) {
  if (!authConfigured()) {
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.password || !checkPassword(String(body.password))) {
    return NextResponse.json({ ok: false, error: "invalid password" }, { status: 401 });
  }
  const token = await createToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}

/** Log out — clears the cookie. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
