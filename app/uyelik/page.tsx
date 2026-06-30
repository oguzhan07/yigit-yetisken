import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { MembershipForm } from "@/components/MembershipForm";
import { BuyButton } from "@/components/BuyButton";
import { getPackages } from "@/lib/data/content";
import { whatsappUrl } from "@/lib/content";
import type { Package } from "@/lib/types";

export const metadata: Metadata = {
  title: "Üyelik — Yiğit Yetişken",
  description:
    "Koçluk paketleri: online koçluk, birebir antrenman ve program paketleri. Sana en uygun planı seç, başvurunu bırak.",
};

const typeLabel = (t: Package["type"]) =>
  t === "online" ? "Online" : t === "one_on_one" ? "Birebir" : "Program";

const steps = [
  { no: "01", title: "Başvuru", desc: "Paketini seç veya formu doldur." },
  { no: "02", title: "Değerlendirme", desc: "Hedefini ve mevcut durumunu konuşalım." },
  { no: "03", title: "Program & Başlangıç", desc: "Sana özel planı kurup yola çıkalım." },
];

export default async function MembershipPage() {
  const packages = await getPackages();

  return (
    <>
      {/* BAŞLIK */}
      <section className="border-b border-line bg-ink pt-36 pb-16 md:pt-44 md:pb-20">
        <div className="wrap">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <span className="label">Üyelik · Koçluk</span>
          </div>
          <h1 className="h-display mt-6 text-[clamp(3.5rem,11vw,9rem)] text-white">
            Üyelik
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            Hedefine en uygun çalışma modelini seç. Sorularını WhatsApp'tan
            sorabilir veya aşağıdaki formu doldurabilirsin.
          </p>
        </div>
      </section>

      {/* PAKETLER */}
      <section className="border-b border-line bg-surface py-20 md:py-28">
        <div className="wrap">
          <div className="grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {packages.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08} className="flex flex-col bg-ink p-8">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="label text-muted">
                    {p.duration_months ? `${p.duration_months} Aylık` : typeLabel(p.type)}
                  </span>
                </div>
                <h3 className="h-display mt-8 text-2xl text-white md:text-3xl">{p.title}</h3>
                {p.description && (
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{p.description}</p>
                )}

                {p.features.length > 0 && (
                  <ul className="mt-6 space-y-2 border-t border-line pt-5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-white/80">
                        <span className="mt-1.5 h-px w-4 shrink-0 bg-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-8">
                  {p.price_try > 0 ? (
                    <div className="h-display text-3xl text-white">
                      {p.price_try.toLocaleString("tr-TR")} ₺
                    </div>
                  ) : (
                    <div className="font-display uppercase tracking-[0.12em] text-sm text-muted">
                      İletişime geç
                    </div>
                  )}
                </div>

                {p.price_try > 0 ? (
                  <BuyButton packageId={p.id} label="Satın Al" />
                ) : (
                  <a
                    href={whatsappUrl(`Merhaba, "${p.title}" paketi hakkında bilgi almak istiyorum.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline mt-6 w-full !py-3"
                  >
                    İletişime Geç
                  </a>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SÜREÇ */}
      <section className="border-b border-line bg-ink py-20 md:py-28">
        <div className="wrap">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <span className="label">Nasıl İşliyor</span>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-px border border-line bg-line md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.no} delay={i * 0.1} className="bg-ink p-8 md:p-10">
                <span className="h-display text-5xl text-accent">{s.no}</span>
                <h3 className="h-display mt-6 text-2xl text-white md:text-3xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BAŞVURU FORMU */}
      <section className="bg-ink py-24 md:py-32">
        <div className="wrap grid gap-14 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <span className="label">Başvuru</span>
            </div>
            <h2 className="h-display mt-5 text-4xl text-white md:text-6xl">
              İlk Adımı <br /> At
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70">
              Formu doldur; başvurun anında WhatsApp üzerinden iletilsin. Sana en
              uygun modeli ve süreci birlikte netleştirelim.
            </p>
          </Reveal>
          <div className="md:col-span-7">
            <MembershipForm />
          </div>
        </div>
      </section>
    </>
  );
}
