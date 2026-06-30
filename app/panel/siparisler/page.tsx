import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getOrders } from "@/lib/data/member";

const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "Bekliyor", cls: "text-muted border-line" },
  paid: { label: "Ödendi", cls: "text-accent border-accent/50" },
  failed: { label: "Başarısız", cls: "text-red-400 border-red-400/40" },
  cancelled: { label: "İptal", cls: "text-muted border-line" },
  refunded: { label: "İade", cls: "text-white/70 border-line" },
};

export default async function OrdersPage() {
  const user = await getCurrentUser();
  const orders = user ? await getOrders(user.id) : [];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10">
        <div className="label">Geçmiş</div>
        <h1 className="h-display mt-3 text-4xl text-white md:text-5xl">Siparişler</h1>
      </div>

      {orders.length === 0 ? (
        <div className="border border-line bg-surface p-10 text-center">
          <p className="text-sm text-white/70">Henüz bir siparişin yok.</p>
          <Link href="/uyelik" className="btn btn-outline mt-6 !py-3 !px-6">
            Paketlere Göz At
          </Link>
        </div>
      ) : (
        <div className="border border-line">
          {orders.map((o) => {
            const s = STATUS[o.status] ?? STATUS.pending;
            return (
              <div key={o.id} className="flex items-center justify-between border-b border-line px-5 py-5 last:border-b-0">
                <div>
                  <div className="font-display uppercase tracking-[0.06em] text-white">
                    {o.package_title ?? "Paket"}
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    {new Date(o.created_at).toLocaleDateString("tr-TR")}
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <span className="h-display text-xl text-white">
                    {o.amount_try.toLocaleString("tr-TR")} ₺
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
