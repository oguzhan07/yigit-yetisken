import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: false });
  try {
    const body = await request.json();
    const path = String(body.path || "").slice(0, 300);
    // Yönetim/üye alanları ve api izlenmez
    if (!path || path.startsWith("/admin") || path.startsWith("/panel") || path.startsWith("/api")) {
      return NextResponse.json({ ok: true });
    }
    const admin = createAdminClient();
    await admin.from("page_views").insert({
      path,
      referrer: body.referrer ? String(body.referrer).slice(0, 300) : null,
      session_id: body.sessionId ? String(body.sessionId).slice(0, 64) : null,
      device: body.device ? String(body.device).slice(0, 20) : null,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
