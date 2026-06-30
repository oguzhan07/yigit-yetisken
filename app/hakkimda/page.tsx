import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import {
  about,
  brand,
  certifications,
  disciplines,
  education,
  experience,
  languages,
  whatsappUrl,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Hakkımda — Yiğit Yetişken",
  description:
    "Yiğitcan Yetişken — 15 yıllık spor ve antrenörlük geçmişi: fitness, futbol, tenis ve yüzme. Deneyim, eğitim ve sertifikalar.",
};

export default function AboutPage() {
  return (
    <>
      {/* GİRİŞ */}
      <section className="border-b border-line bg-ink pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="wrap grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <span className="label">Hakkımda</span>
            </div>
            <h1 className="h-display mt-6 text-[clamp(3.5rem,11vw,9rem)] text-white">
              Yiğitcan
              <br />
              Yetişken
            </h1>
            <p className="mt-6 font-display uppercase tracking-[0.2em] text-sm text-accent">
              {brand.role} · Beden Eğitimi Öğretmeni
            </p>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/80">
              {about.lead}
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/portrait.png"
                alt="Yiğitcan Yetişken"
                className="grayscale-media h-full w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 bg-accent px-4 py-2 font-display uppercase tracking-[0.18em] text-xs text-black">
                Kütahya · Online
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HİKÂYE */}
      <section className="border-b border-line bg-surface py-24 md:py-32">
        <div className="wrap grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <span className="font-display text-sm text-muted">01 — Hikâye</span>
            <h2 className="h-display mt-4 text-4xl text-white md:text-5xl">
              Sahadan
              <br />
              Antrenörlüğe
            </h2>
          </Reveal>
          <div className="space-y-6 md:col-span-8">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-base leading-relaxed text-white/75 md:text-lg">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DİSİPLİNLER */}
      <section className="border-b border-line bg-ink py-24 md:py-32">
        <div className="wrap">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <span className="label">Uzmanlık Alanları</span>
            </div>
            <h2 className="h-display mt-5 text-5xl text-white md:text-7xl">
              Dört Disiplin,
              <br />
              Tek Disiplin Anlayışı
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-px border border-line bg-line md:grid-cols-2">
            {disciplines.map((d, i) => (
              <Reveal key={d.no} delay={i * 0.08} className="bg-ink p-8 md:p-10">
                <div className="flex items-start justify-between">
                  <span className="font-display text-sm text-accent">{d.no}</span>
                  <div className="flex flex-wrap justify-end gap-2">
                    {d.tags.map((t) => (
                      <span key={t} className="border border-line px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="h-display mt-8 text-3xl text-white md:text-4xl">{d.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/70">{d.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DENEYİM */}
      <section className="border-b border-line bg-surface py-24 md:py-32">
        <div className="wrap grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <span className="font-display text-sm text-muted">02 — Deneyim</span>
            <h2 className="h-display mt-4 text-4xl text-white md:text-5xl">
              Profesyonel
              <br />
              Yolculuk
            </h2>
          </Reveal>
          <div className="md:col-span-8">
            {experience.map((e, i) => (
              <Reveal key={i} delay={Math.min(i * 0.05, 0.3)}>
                <div className="grid grid-cols-1 gap-2 border-t border-line py-6 md:grid-cols-12 md:gap-6">
                  <div className="flex items-center gap-3 md:col-span-4">
                    {e.current && <span className="h-2 w-2 bg-accent" />}
                    <span className={`font-display uppercase tracking-[0.12em] text-sm ${e.current ? "text-accent" : "text-white/60"}`}>
                      {e.period}
                    </span>
                  </div>
                  <div className="md:col-span-8">
                    <div className="font-display uppercase tracking-[0.04em] text-lg text-white md:text-xl">
                      {e.role}
                    </div>
                    <div className="mt-1 text-sm text-muted">
                      {e.org} · {e.place}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
            <div className="border-t border-line" />
          </div>
        </div>
      </section>

      {/* EĞİTİM & SERTİFİKALAR */}
      <section className="border-b border-line bg-ink py-24 md:py-32">
        <div className="wrap grid gap-16 md:grid-cols-2">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <span className="label">Eğitim</span>
            </div>
            <div className="mt-10 space-y-8">
              {education.map((ed, i) => (
                <div key={i} className="border-l border-line pl-6">
                  <div className="font-display uppercase tracking-[0.1em] text-xs text-accent">
                    {ed.period}
                  </div>
                  <div className="mt-2 font-display uppercase text-lg text-white">{ed.title}</div>
                  <div className="mt-1 text-sm text-muted">{ed.org}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <span className="label">Sertifikalar</span>
            </div>
            <div className="mt-10 space-y-8">
              {certifications.map((c, i) => (
                <div key={i} className="border-l border-line pl-6">
                  <div className="font-display uppercase tracking-[0.1em] text-xs text-accent">
                    {c.year}
                  </div>
                  <div className="mt-2 font-display uppercase text-lg text-white">{c.title}</div>
                  <div className="mt-1 text-sm text-muted">{c.org}</div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <span className="label">Diller</span>
            </div>
            <div className="mt-6 flex gap-4">
              {languages.map((l) => (
                <div key={l.lang} className="border border-line px-5 py-3">
                  <span className="font-display uppercase tracking-[0.12em] text-sm text-white">
                    {l.lang}
                  </span>
                  <span className="ml-2 text-sm text-accent">{l.level}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink py-24 md:py-32">
        <div className="wrap flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <h2 className="h-display text-4xl text-white md:text-6xl">
            Birlikte çalışmaya <br /> hazır mısın?
          </h2>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-accent">
              WhatsApp ile Yaz
            </a>
            <Link href="/uyelik" className="btn btn-outline">
              Paketleri Gör
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
