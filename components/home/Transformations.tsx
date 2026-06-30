import { Reveal } from "@/components/Reveal";
import type { Transformation } from "@/lib/types";

export function Transformations({ items }: { items: Transformation[] }) {
  return (
    <section className="border-b border-line bg-ink py-24 md:py-32">
      <div className="wrap">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <span className="label">Dönüşümler</span>
          </div>
          <h2 className="h-display mt-5 text-5xl text-white md:text-7xl">
            Sonuçlar <br /> Konuşur
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.1}>
              <div className="group relative aspect-[3/4] overflow-hidden border border-line bg-surface">
                {t.after_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.after_url} alt={t.title ?? "Dönüşüm"} className="grayscale-media h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display uppercase tracking-[0.2em] text-sm text-white/40">
                      {t.title ?? "Dönüşüm"}
                    </span>
                  </div>
                )}
                {t.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-5">
                    <span className="text-xs text-white/80">{t.caption}</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-px bg-accent/40 transition-all duration-500 group-hover:h-1 group-hover:bg-accent" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
