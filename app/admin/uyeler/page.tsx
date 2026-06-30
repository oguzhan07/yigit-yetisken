import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  full_name: string | null;
  role: string;
  phone: string | null;
  created_at: string;
};

export default async function AdminMembers() {
  let members: Row[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id,full_name,role,phone,created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    members = (data as Row[]) ?? [];
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10">
        <div className="label">Yönetim</div>
        <h1 className="h-display mt-3 text-4xl text-white md:text-5xl">Üyeler</h1>
        <p className="mt-2 text-sm text-muted">{members.length} kayıtlı üye</p>
      </div>

      {members.length === 0 ? (
        <div className="border border-line bg-surface p-10 text-center text-sm text-white/70">
          Henüz üye yok.
        </div>
      ) : (
        <div className="border border-line">
          {members.map((m) => (
            <Link
              key={m.id}
              href={`/admin/uyeler/${m.id}`}
              className="flex items-center justify-between border-b border-line px-5 py-4 transition-colors last:border-b-0 hover:bg-surface"
            >
              <div>
                <div className="font-display uppercase tracking-[0.06em] text-white">
                  {m.full_name || "(isimsiz)"}
                </div>
                <div className="mt-1 text-xs text-muted">
                  {m.phone || "—"} · {new Date(m.created_at).toLocaleDateString("tr-TR")}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {m.role === "admin" && (
                  <span className="border border-accent/50 px-2 py-1 font-display uppercase tracking-[0.14em] text-[10px] text-accent">
                    Admin
                  </span>
                )}
                <span className="text-muted">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
