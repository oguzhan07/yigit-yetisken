import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import type { Package } from "@/lib/types";

const typeLabel = (t: Package["type"]) =>
  t === "online" ? "Online" : t === "one_on_one" ? "Birebir" : "Program";

export function PackagesPreview({ packages }: { packages: Package[] }) {
  const items = packages.slice(0, 3);

  return (
    <section id="paketler" className="scroll-mt-24 border-b border-line bg-ink py-24 md:py-32">
      <div className="wrap">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <span className="label">Üyelik · Koçluk Paketleri</span>
            </div>
            <h2 className="h-display mt-5 text-5xl text-white md:text-7xl">
              Hedefine Göre <br /> Çalışma Modeli
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Sana en uygun paketi seç; detaylar ve başvuru için üyelik sayfasına geç.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px border border-line bg-line md:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1} className="group flex flex-col bg-ink p-8 transition-colors duration-300 hover:bg-surface md:p-10">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="label text-muted">
                  {p.duration_months ? `${p.duration_months} Aylık` : typeLabel(p.type)}
                </span>
              </div>
              <h3 className="h-display mt-8 text-3xl text-white transition-colors group-hover:text-accent md:text-4xl">
                {p.title}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70">
                {p.description}
              </p>
              {p.price_try > 0 && (
                <div className="mt-6 h-display text-2xl text-white">
                  {p.price_try.toLocaleString("tr-TR")} ₺
                </div>
              )}
              <Link
                href="/uyelik"
                className="mt-6 inline-flex items-center gap-2 font-display uppercase tracking-[0.16em] text-sm text-white transition-colors group-hover:text-accent"
              >
                Detaylar
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
