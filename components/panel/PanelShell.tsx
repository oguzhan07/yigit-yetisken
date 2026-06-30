"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

const items = [
  { label: "Genel Bakış", href: "/panel" },
  { label: "Programım", href: "/panel/program" },
  { label: "İlerleme", href: "/panel/ilerleme" },
  { label: "Siparişler", href: "/panel/siparisler" },
  { label: "Bildirimler", href: "/panel/bildirimler" },
  { label: "Profil", href: "/panel/profil" },
];

export function PanelShell({
  name,
  admin,
  children,
}: {
  name: string;
  admin?: boolean;
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
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/panel" className="flex items-center gap-3">
            <Logo className="h-5 w-auto text-white" accent />
            <span className="font-display uppercase tracking-[0.22em] text-sm">
              Üye Paneli
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <span className="hidden text-sm text-muted sm:inline">{name}</span>
            <Link href="/" className="font-display uppercase tracking-[0.16em] text-xs text-white transition-colors hover:text-accent">
              Siteye Dön
            </Link>
            <button onClick={signOut} className="font-display uppercase tracking-[0.16em] text-xs text-muted transition-colors hover:text-accent">
              Çıkış
            </button>
          </div>
        </div>
        {/* Mobil yatay menü */}
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
        {/* Sidebar (md+) */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-line p-6 md:block">
          <nav className="flex flex-col gap-1">
            {items.map((it, i) => {
              const active = pathname === it.href;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`group flex items-center gap-3 border-l-2 py-3 pl-4 font-display uppercase tracking-[0.14em] text-sm transition-colors ${
                    active
                      ? "border-accent text-accent"
                      : "border-transparent text-white/70 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <span className="text-[10px] text-muted">0{i + 1}</span>
                  {it.label}
                </Link>
              );
            })}
            {admin && (
              <Link href="/admin" className="mt-4 border-l-2 border-transparent py-3 pl-4 font-display uppercase tracking-[0.14em] text-sm text-white/70 transition-colors hover:border-accent hover:text-accent">
                ⚙ Admin
              </Link>
            )}
          </nav>
        </aside>

        {/* İçerik */}
        <main className="min-w-0 flex-1 px-6 py-10 md:px-10">{children}</main>
      </div>
    </div>
  );
}
