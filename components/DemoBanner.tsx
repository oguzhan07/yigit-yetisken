/**
 * Supabase bağlı değilken gösterilen uyarı.
 * Ekranların hazır olduğunu, bağlanınca aktifleşeceğini belirtir.
 */
export function DemoBanner({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 border border-accent/40 bg-accent/[0.06] px-5 py-4 text-sm leading-relaxed text-white/80 ${
        className ?? ""
      }`}
    >
      <span className="draft-badge shrink-0">Demo</span>
      <span>
        Veritabanı henüz bağlı değil. Bu ekran hazır; Supabase bağlanınca tam
        işlevsel hale gelecek.
      </span>
    </div>
  );
}
