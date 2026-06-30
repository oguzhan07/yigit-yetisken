import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type PV = {
  path: string;
  referrer: string | null;
  session_id: string | null;
  device: string | null;
  created_at: string;
};

export default async function AdminAnalytics() {
  let rows: PV[] = [];
  if (isSupabaseConfigured()) {
    const admin = createAdminClient();
    const since = new Date(Date.now() - 30 * 86400000).toISOString();
    const { data } = await admin
      .from("page_views")
      .select("path,referrer,session_id,device,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(10000);
    rows = (data as PV[]) ?? [];
  }

  const total = rows.length;
  const uniqueSessions = new Set(rows.map((r) => r.session_id).filter(Boolean)).size;
  const mobile = rows.filter((r) => r.device === "mobile").length;
  const mobilePct = total ? Math.round((mobile / total) * 100) : 0;

  // Son 14 gün
  const days = [...Array(14)].map((_, i) =>
    new Date(Date.now() - (13 - i) * 86400000).toISOString().slice(0, 10)
  );
  const byDay: Record<string, number> = Object.fromEntries(days.map((d) => [d, 0]));
  for (const r of rows) {
    const d = r.created_at.slice(0, 10);
    if (d in byDay) byDay[d]++;
  }
  const maxDay = Math.max(1, ...Object.values(byDay));

  // En çok görüntülenen sayfalar
  const pageCounts: Record<string, number> = {};
  for (const r of rows) pageCounts[r.path] = (pageCounts[r.path] || 0) + 1;
  const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // Kaynaklar
  const refCounts: Record<string, number> = {};
  for (const r of rows) {
    let host = "Doğrudan";
    if (r.referrer) {
      try {
        host = new URL(r.referrer).hostname.replace(/^www\./, "");
      } catch {
        host = "Diğer";
      }
    }
    refCounts[host] = (refCounts[host] || 0) + 1;
  }
  const topRefs = Object.entries(refCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const stats = [
    { label: "Görüntülenme (30g)", value: total },
    { label: "Tekil Ziyaretçi", value: uniqueSessions },
    { label: "Mobil", value: `%${mobilePct}` },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-10">
        <div className="label">Yönetim</div>
        <h1 className="h-display mt-3 text-4xl text-white md:text-5xl">Analitik</h1>
        <p className="mt-2 text-sm text-muted">Son 30 günün trafiği.</p>
      </div>

      {/* İstatistik kartları */}
      <div className="grid grid-cols-3 gap-px border border-line bg-line">
        {stats.map((s) => (
          <div key={s.label} className="bg-ink p-6 md:p-8">
            <div className="h-display text-4xl text-accent md:text-5xl">{s.value}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 14 günlük grafik */}
      <div className="mt-6 border border-line bg-surface p-6 md:p-8">
        <div className="label mb-6">Son 14 Gün</div>
        <div className="flex h-40 items-end gap-1.5">
          {days.map((d) => (
            <div key={d} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full bg-accent/80 transition-all hover:bg-accent"
                style={{ height: `${(byDay[d] / maxDay) * 100}%` }}
                title={`${d}: ${byDay[d]}`}
              />
              <span className="text-[9px] text-muted">{d.slice(8)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sayfalar + kaynaklar */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="border border-line bg-surface p-6 md:p-8">
          <div className="label mb-5">En Çok Görüntülenen</div>
          {topPages.length === 0 ? (
            <p className="text-sm text-muted">Henüz veri yok.</p>
          ) : (
            <ul className="space-y-3">
              {topPages.map(([path, count]) => (
                <li key={path} className="flex items-center justify-between text-sm">
                  <span className="truncate text-white/80">{path}</span>
                  <span className="font-display text-accent">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border border-line bg-surface p-6 md:p-8">
          <div className="label mb-5">Kaynaklar</div>
          {topRefs.length === 0 ? (
            <p className="text-sm text-muted">Henüz veri yok.</p>
          ) : (
            <ul className="space-y-3">
              {topRefs.map(([host, count]) => (
                <li key={host} className="flex items-center justify-between text-sm">
                  <span className="truncate text-white/80">{host}</span>
                  <span className="font-display text-accent">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
