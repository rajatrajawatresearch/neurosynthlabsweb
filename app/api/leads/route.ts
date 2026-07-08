import { NextResponse, type NextRequest } from "next/server";
import { addLead, listLeads, updateLead, deleteLead, blobConfigured } from "@/lib/server/blob";
import { isAuthed } from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public: submit a contact-form lead. */
export async function POST(req: NextRequest) {
  if (!blobConfigured()) {
    return NextResponse.json({ ok: false, error: "storage not configured" }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }
  const lead = await addLead({
    name: String(body.name).slice(0, 200),
    email: String(body.email).slice(0, 200),
    company: String(body.company ?? "").slice(0, 200),
    budget: String(body.budget ?? "").slice(0, 100),
    message: String(body.message).slice(0, 5000),
  });
  return NextResponse.json({ ok: true, id: lead.id });
}

/** Admin only: list all leads. */
export async function GET(req: NextRequest) {
  if (!(await isAuthed(req))) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const leads = await listLeads();
  return NextResponse.json({ ok: true, leads });
}

/** Admin only: mark read/unread. */
export async function PATCH(req: NextRequest) {
  if (!(await isAuthed(req))) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });
  await updateLead(String(body.id), { read: Boolean(body.read) });
  return NextResponse.json({ ok: true });
}

/** Admin only: delete a lead. */
export async function DELETE(req: NextRequest) {
  if (!(await isAuthed(req))) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });
  await deleteLead(id);
  return NextResponse.json({ ok: true });
}
