import Link from "next/link";
import { Logo } from "@/components/Logo";
import { brand, nav, whatsappUrl } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="wrap py-16">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Marka */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="h-7 w-auto text-white" accent />
              <span className="font-display uppercase tracking-[0.22em] text-lg">
                Yiğit Yetişken
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              {brand.tagline} — Fitness ve kişisel antrenörlükte 15 yıllık saha
              deneyimi. Online ve birebir koçluk.
            </p>
          </div>

          {/* Menü */}
          <div className="md:col-span-3">
            <p className="label mb-5">Menü</p>
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-display uppercase tracking-[0.16em] text-sm text-white/80 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div className="md:col-span-4">
            <p className="label mb-5">İletişim</p>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
                  WhatsApp · {brand.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${brand.email}`} className="transition-colors hover:text-accent">
                  {brand.email}
                </a>
              </li>
              <li>
                <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
                  Instagram · @{brand.instagram}
                </a>
              </li>
              <li className="text-muted">{brand.location}</li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-14" />
        <div className="mt-6 flex flex-col gap-4 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {brand.fullName}. Tüm hakları saklıdır.</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/yasal/mesafeli-satis" className="transition-colors hover:text-accent">Mesafeli Satış Sözleşmesi</Link>
            <Link href="/yasal/kvkk" className="transition-colors hover:text-accent">KVKK</Link>
            <Link href="/yasal/iptal-iade" className="transition-colors hover:text-accent">İptal & İade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
