import { Reveal } from "@/components/Reveal";
import { stats } from "@/lib/content";

export function StatsBar() {
  return (
    <section className="border-b border-line bg-ink">
      <div className="wrap grid grid-cols-2 divide-x divide-line border-x border-line md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="px-6 py-10 md:py-14">
            <div className="h-display text-5xl text-white md:text-6xl">{s.value}</div>
            <div className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">
              {s.label}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
