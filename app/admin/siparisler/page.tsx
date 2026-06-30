import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "Bekliyor", cls: "text-muted border-line" },
  paid: { label: "Ödendi", cls: "text-accent border-accent/50" },
  failed: { label: "Başarısız", cls: "text-red-400 border-red-400/40" },
  cancelled: { label: "İptal", cls: "text-muted border-line" },
  refunded: { label: "İade", cls: "text-white/70 border-line" },
};

type Row = {
  id: string;
  package_title: string | null;
  amount_try: number;
  status: string;
  created_at: string;
  profiles: { full_name: string | null } | { full_name: string | null }[] | null;
};

export default async function AdminOrders() {
  let orders: Row[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("orders")
      .select("id,package_title,amount_try,status,created_at,profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(200);
    orders = (data as Row[]) ?? [];
  }
  const name = (p: Row["profiles"]) =>
    (Array.isArray(p) ? p[0]?.full_name : p?.full_name) || "—";
  const paidTotal = orders
    .filter((o) => o.status === "paid")
    .reduce((s, o) => s + Number(o.amount_try), 0);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10">
        <div className="label">Yönetim</div>
        <h1 className="h-display mt-3 text-4xl text-white md:text-5xl">Siparişler</h1>
        <p className="mt-2 text-sm text-muted">
          Toplam tahsilat: <span className="text-accent">{paidTotal.toLocaleString("tr-TR")} ₺</span> · {orders.length} kayıt
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="border border-line bg-surface p-10 text-center text-sm text-white/70">
          Henüz sipariş yok.
        </div>
      ) : (
        <div className="border border-line">
          {orders.map((o) => {
            const s = STATUS[o.status] ?? STATUS.pending;
            return (
              <div key={o.id} className="flex items-center justify-between border-b border-line px-5 py-4 last:border-b-0">
                <div>
                  <div className="font-display uppercase tracking-[0.06em] text-white">
                    {o.package_title ?? "Paket"}
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    {name(o.profiles)} · {new Date(o.created_at).toLocaleString("tr-TR")}
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <span className="h-display text-xl text-white">
                    {Number(o.amount_try).toLocaleString("tr-TR")} ₺
                  </span>
                  <span className={`border px-3 py-1 font-display uppercase tracking-[0.14em] text-[10px] ${s.cls}`}>
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
