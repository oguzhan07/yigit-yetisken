"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

const items = [
  { label: "Genel Bakış", href: "/admin" },
  { label: "Paketler", href: "/admin/paketler" },
  { label: "Yorumlar", href: "/admin/yorumlar" },
  { label: "SSS", href: "/admin/sss" },
  { label: "Yasal", href: "/admin/yasal" },
  { label: "Üyeler", href: "/admin/uyeler" },
  { label: "Siparişler", href: "/admin/siparisler" },
  { label: "Analitik", href: "/admin/analitik" },
];

export function AdminShell({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo className="h-5 w-auto text-white" accent />
            <span className="font-display uppercase tracking-[0.22em] text-sm">
              Admin · <span className="text-accent">Yönetim</span>
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <span className="hidden text-sm text-muted sm:inline">{name}</span>
            <Link href="/panel" className="font-display uppercase tracking-[0.16em] text-xs text-white hover:text-accent">
              Üye Paneli
            </Link>
            <Link href="/" className="font-display uppercase tracking-[0.16em] text-xs text-white hover:text-accent">
              Site
            </Link>
            <button onClick={signOut} className="font-display uppercase tracking-[0.16em] text-xs text-muted hover:text-accent">
              Çıkış
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-line px-4 py-2 md:hidden">
          {items.map((it) => {
            const active = pathname === it.href;
            return (
              <Link key={it.href} href={it.href} className={`whitespace-nowrap px-3 py-2 font-display uppercase tracking-[0.12em] text-xs ${active ? "text-accent" : "text-muted"}`}>
                {it.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-line p-6 md:block">
          <nav className="flex flex-col gap-1">
            {items.map((it, i) => {
              const active = pathname === it.href;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`flex items-center gap-3 border-l-2 py-3 pl-4 font-display uppercase tracking-[0.14em] text-sm transition-colors ${
                    active ? "border-accent text-accent" : "border-transparent text-white/70 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span className="text-[10px] text-muted">0{i + 1}</span>
                  {it.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-6 py-10 md:px-10">{children}</main>
      </div>
    </div>
  );
}
