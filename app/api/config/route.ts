import { NextResponse, type NextRequest } from "next/server";
import { readConfig, writeConfig, blobConfigured } from "@/lib/server/blob";
import { isAuthed } from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public: the current published site config (theme + content), or null. */
export async function GET() {
  if (!blobConfigured()) return NextResponse.json(null);
  const config = await readConfig();
  return NextResponse.json(config, {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=10, stale-while-revalidate=60" },
  });
}

/** Admin only: publish new theme + content so every visitor sees it. */
export async function POST(req: NextRequest) {
  if (!(await isAuthed(req))) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!blobConfigured()) {
    return NextResponse.json({ ok: false, error: "storage not configured" }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || !("values" in body) || !("content" in body)) {
    return NextResponse.json({ ok: false, error: "bad payload" }, { status: 400 });
  }
  await writeConfig({ values: body.values, content: body.content });
  return NextResponse.json({ ok: true });
}
