import { Reveal } from "@/components/Reveal";
import type { Testimonial } from "@/lib/types";

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <section className="border-b border-line bg-surface py-24 md:py-32">
      <div className="wrap">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <span className="label">Danışan Yorumları</span>
          </div>
          <h2 className="h-display mt-5 text-5xl text-white md:text-7xl">
            Onların <br /> Sözleriyle
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.1}>
              <figure className="flex h-full flex-col border border-line bg-ink p-8 md:p-10">
                <span className="h-display text-6xl leading-none text-accent">”</span>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-white/80">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8 border-t border-line pt-5">
                  <div className="font-display uppercase tracking-[0.16em] text-sm text-white">
                    {t.name}
                  </div>
                  {t.result && <div className="mt-1 text-xs text-muted">{t.result}</div>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
