import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { closingCta, whatsappUrl } from "@/lib/content";

export function ClosingCta() {
  return (
    <section className="relative overflow-hidden bg-ink py-28 md:py-40">
      {/* Dev arka plan yazısı */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="h-display select-none text-[28vw] leading-none text-white/[0.03]">
          YY
        </span>
      </div>

      <div className="wrap relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="label">{closingCta.kicker}</span>
          <h2 className="h-display mt-6 text-[clamp(3rem,11vw,9rem)] text-white">
            {closingCta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/70">
            {closingCta.desc}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-accent">
              WhatsApp ile Başla
            </a>
            <Link href="/uyelik" className="btn btn-outline">
              Başvuru Formu
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
