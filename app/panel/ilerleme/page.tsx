import { getCurrentUser } from "@/lib/auth";
import { getProgressEntries } from "@/lib/data/member";
import { ProgressForm } from "@/components/panel/ProgressForm";

export default async function ProgressPage() {
  const user = await getCurrentUser();
  const entries = user ? await getProgressEntries(user.id) : [];

  const series = entries
    .filter((e) => e.weight_kg != null)
    .map((e) => ({ date: e.entry_date, w: Number(e.weight_kg) }));

  // Basit kilo grafiği (SVG sparkline)
  let path = "";
  if (series.length >= 2) {
    const ws = series.map((s) => s.w);
    const min = Math.min(...ws);
    const max = Math.max(...ws);
    const span = max - min || 1;
    const W = 640;
    const H = 120;
    path = series
      .map((s, i) => {
        const x = (i / (series.length - 1)) * W;
        const y = H - ((s.w - min) / span) * (H - 16) - 8;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10">
        <div className="label">Takip</div>
        <h1 className="h-display mt-3 text-4xl text-white md:text-5xl">İlerleme</h1>
      </div>

      {series.length >= 2 && (
        <div className="mb-6 border border-line bg-surface p-6">
          <div className="label mb-4">Kilo Eğrisi</div>
          <svg viewBox="0 0 640 120" className="h-32 w-full" preserveAspectRatio="none">
            <path d={path} fill="none" stroke="#CCFF00" strokeWidth={2} />
          </svg>
          <div className="mt-2 flex justify-between text-xs text-muted">
            <span>{new Date(series[0].date).toLocaleDateString("tr-TR")}</span>
            <span>{new Date(series[series.length - 1].date).toLocaleDateString("tr-TR")}</span>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-5">
        {/* Form */}
        <div className="md:col-span-2">
          <div className="border border-line bg-surface p-6">
            <div className="label mb-5">Yeni Kayıt</div>
            <ProgressForm />
          </div>
        </div>

        {/* Liste */}
        <div className="md:col-span-3">
          {entries.length === 0 ? (
            <div className="border border-line bg-surface p-10 text-center text-sm text-white/70">
              Henüz kayıt yok. İlk ölçümünü ekleyerek başla.
            </div>
          ) : (
            <div className="border border-line">
              {[...entries].reverse().map((e) => (
                <div key={e.id} className="flex items-center justify-between border-b border-line px-5 py-4 last:border-b-0">
                  <div>
                    <div className="font-display text-sm text-white">
                      {new Date(e.entry_date).toLocaleDateString("tr-TR")}
                    </div>
                    {e.note && <div className="text-xs text-muted">{e.note}</div>}
                  </div>
                  {e.weight_kg != null && (
                    <div className="h-display text-2xl text-accent">{e.weight_kg} kg</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
