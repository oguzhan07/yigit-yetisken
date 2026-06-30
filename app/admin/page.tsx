import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

async function count(table: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  const supabase = await createClient();
  const { count } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminHome() {
  const [packages, testimonials, faqs, orders, members] = await Promise.all([
    count("packages"),
    count("testimonials"),
    count("faqs"),
    count("orders"),
    count("profiles"),
  ]);

  const cards = [
    { label: "Paketler", value: packages, href: "/admin/paketler" },
    { label: "Yorumlar", value: testimonials, href: "/admin/yorumlar" },
    { label: "SSS", value: faqs, href: "/admin/sss" },
    { label: "Siparişler", value: orders, href: "/admin" },
    { label: "Üyeler", value: members, href: "/admin" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-10">
        <div className="label">Yönetim</div>
        <h1 className="h-display mt-3 text-4xl text-white md:text-5xl">
          Genel Bakış
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="group bg-ink p-8 transition-colors hover:bg-surface">
            <div className="h-display text-5xl text-accent">{c.value}</div>
            <div className="mt-3 font-display uppercase tracking-[0.16em] text-sm text-white/70 group-hover:text-white">
              {c.label}
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted">
        İçerikleri sol menüden yönet. Değişiklikler anında sitede yayınlanır.
      </p>
    </div>
  );
}
