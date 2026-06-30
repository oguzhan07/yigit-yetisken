import { Logo } from "@/components/Logo";

const DEFAULT_ITEMS = [
  "FİTNESS",
  "KİŞİSEL ANTRENÖRLÜK",
  "FUTBOL",
  "TENİS",
  "YÜZME",
  "PERFORMANS",
  "DİSİPLİN",
];

/** Sonsuz kayan şerit — disiplin/anahtar kelimeler. */
export function Marquee({ items = DEFAULT_ITEMS }: { items?: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="border-y border-line bg-surface py-5 overflow-hidden">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display uppercase tracking-[0.2em] text-2xl text-white/70">
              {item}
            </span>
            <Logo className="h-4 w-auto text-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
