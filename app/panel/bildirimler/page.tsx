import { getCurrentUser } from "@/lib/auth";
import { getNotifications } from "@/lib/data/member";
import { markNotificationsRead } from "@/app/panel/actions";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  const items = user ? await getNotifications(user.id) : [];
  const hasUnread = items.some((i) => !i.is_read);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <div className="label">Güncel</div>
          <h1 className="h-display mt-3 text-4xl text-white md:text-5xl">Bildirimler</h1>
        </div>
        {hasUnread && (
          <form action={markNotificationsRead}>
            <button type="submit" className="btn btn-outline !py-2.5 !px-5 text-xs">
              Tümünü Okundu İşaretle
            </button>
          </form>
        )}
      </div>

      {items.length === 0 ? (
        <div className="border border-line bg-surface p-10 text-center text-sm text-white/70">
          Henüz bildirimin yok.
        </div>
      ) : (
        <div className="border border-line">
          {items.map((n) => (
            <div key={n.id} className={`flex gap-4 border-b border-line px-5 py-5 last:border-b-0 ${n.is_read ? "" : "bg-surface"}`}>
              <span className={`mt-1.5 h-2 w-2 shrink-0 ${n.is_read ? "bg-line" : "bg-accent"}`} />
              <div>
                <div className="font-display uppercase tracking-[0.06em] text-white">
                  {n.title}
                </div>
                {n.body && <p className="mt-1 text-sm text-white/70">{n.body}</p>}
                <p className="mt-1 text-xs text-muted">
                  {new Date(n.created_at).toLocaleDateString("tr-TR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
