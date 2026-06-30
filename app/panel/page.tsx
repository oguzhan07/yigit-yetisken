import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import {
  getActiveMembership,
  getOnboarding,
  getNotifications,
} from "@/lib/data/member";

export default async function PanelHome({
  searchParams,
}: {
  searchParams: Promise<{ odeme?: string }>;
}) {
  const { odeme } = await searchParams;
  const user = await getCurrentUser();
  const userId = user?.id;

  const [membership, onboarding, notifications] = userId
    ? await Promise.all([
        getActiveMembership(userId),
        getOnboarding(userId),
        getNotifications(userId),
      ])
    : [null, null, []];

  const end = membership?.end_date ? new Date(membership.end_date) : null;
  const days = end
    ? Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86400000))
    : null;
  const needsOnboarding = !onboarding || !onboarding.goal;
  const unread = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="mx-auto max-w-5xl">
      {odeme === "basarili" && (
        <div className="mb-8 border border-accent bg-accent/10 px-5 py-4 text-sm text-accent">
          Ödemen alındı, üyeliğin aktif edildi. Hoş geldin! 💪
        </div>
      )}
      {(odeme === "basarisiz" || odeme === "hata") && (
        <div className="mb-8 border border-red-400/40 bg-red-400/10 px-5 py-4 text-sm text-red-300">
          Ödeme tamamlanamadı. Tekrar deneyebilir ya da bizimle iletişime geçebilirsin.
        </div>
      )}
      <div className="mb-10">
        <div className="label">Üye Paneli</div>
        <h1 className="h-display mt-3 text-4xl text-white md:text-5xl">
          Genel Bakış
        </h1>
      </div>

      {/* Aktif üyelik */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="border border-line bg-surface p-8">
          <div className="label mb-4">Aktif Üyelik</div>
          {membership ? (
            <>
              <div className="h-display text-3xl text-white">
                {membership.packages?.title ?? "Üyelik"}
              </div>
              <div className="mt-4 flex items-end gap-2">
                <span className="h-display text-5xl text-accent">{days ?? "—"}</span>
                <span className="mb-1 text-sm text-muted">gün kaldı</span>
              </div>
              {end && (
                <p className="mt-2 text-xs text-muted">
                  Bitiş: {end.toLocaleDateString("tr-TR")}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-sm leading-relaxed text-white/70">
                Şu an aktif bir üyeliğin yok. Hedefine uygun paketi seçerek başla.
              </p>
              <Link href="/uyelik" className="btn btn-accent mt-6 !py-3 !px-6">
                Paketleri Gör
              </Link>
            </>
          )}
        </div>

        {/* Onboarding durumu */}
        <div className="border border-line bg-surface p-8">
          <div className="label mb-4">Profil Durumu</div>
          {needsOnboarding ? (
            <>
              <p className="text-sm leading-relaxed text-white/70">
                Sana en doğru programı kurabilmem için hedef ve ölçü bilgilerini
                tamamla.
              </p>
              <Link href="/panel/profil" className="btn btn-outline mt-6 !py-3 !px-6">
                Bilgileri Tamamla
              </Link>
            </>
          ) : (
            <>
              <div className="h-display text-3xl text-white">Tamamlandı</div>
              <p className="mt-3 text-sm text-white/70">
                Hedefin: <span className="text-accent">{onboarding?.goal}</span>
              </p>
              <Link href="/panel/profil" className="mt-4 inline-block text-sm text-muted hover:text-accent">
                Düzenle →
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Hızlı kartlar */}
      <div className="mt-6 grid gap-px border border-line bg-line md:grid-cols-3">
        {[
          { href: "/panel/program", label: "Programım", desc: "Koçun yüklediği planlar" },
          { href: "/panel/ilerleme", label: "İlerleme", desc: "Ölçü ve kilo takibi" },
          { href: "/panel/bildirimler", label: "Bildirimler", desc: unread ? `${unread} okunmamış` : "Güncel" },
        ].map((c) => (
          <Link key={c.href} href={c.href} className="group bg-ink p-8 transition-colors hover:bg-surface">
            <div className="h-display text-2xl text-white transition-colors group-hover:text-accent">
              {c.label}
            </div>
            <p className="mt-2 text-sm text-muted">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
