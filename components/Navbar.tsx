"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Logo } from "@/components/Logo";
import { nav, whatsappUrl } from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const solid = scrolled || pathname !== "/";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid ? "bg-ink/90 backdrop-blur-md border-b border-line" : "bg-transparent"
        }`}
      >
        <div className="wrap flex h-20 items-center justify-between">
          <Link href="/" className="group flex items-center gap-3" aria-label="Yiğit Yetişken — Ana Sayfa">
            <Logo className="h-6 w-auto text-white transition-colors group-hover:text-accent" accent />
            <span className="font-display uppercase tracking-[0.22em] text-base leading-none">
              Yiğit Yetişken
            </span>
          </Link>

          {/* Masaüstü menü */}
          <nav className="hidden items-center gap-9 md:flex">
            {nav.map((item, i) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative font-display uppercase tracking-[0.18em] text-sm transition-colors ${
                    active ? "text-accent" : "text-white hover:text-accent"
                  }`}
                >
                  <span className="mr-2 text-[10px] text-muted">0{i + 1}</span>
                  {item.label}
                  <span
                    className={`absolute -bottom-2 left-0 h-px bg-accent transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}

            {/* Hesap */}
            {user ? (
              <div className="flex items-center gap-5">
                <Link href="/panel" className="font-display uppercase tracking-[0.18em] text-sm text-white transition-colors hover:text-accent">
                  Panel
                </Link>
                <button onClick={signOut} className="font-display uppercase tracking-[0.18em] text-sm text-muted transition-colors hover:text-accent">
                  Çıkış
                </button>
              </div>
            ) : (
              <Link href="/giris" className="font-display uppercase tracking-[0.18em] text-sm text-white transition-colors hover:text-accent">
                Giriş
              </Link>
            )}

            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-accent !py-3 !px-6">
              İletişim
            </a>
          </nav>

          {/* Mobil hamburger */}
          <button onClick={() => setOpen(true)} className="flex flex-col gap-1.5 md:hidden" aria-label="Menüyü aç">
            <span className="h-0.5 w-7 bg-white" />
            <span className="h-0.5 w-7 bg-white" />
            <span className="h-0.5 w-5 bg-accent self-end" />
          </button>
        </div>
      </header>

      {/* Mobil tam ekran menü */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-ink transition-transform duration-500 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="wrap flex h-20 items-center justify-between border-b border-line">
          <Logo className="h-6 w-auto text-white" accent />
          <button onClick={() => setOpen(false)} aria-label="Menüyü kapat" className="font-display uppercase tracking-widest text-sm text-accent">
            Kapat ✕
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="group flex items-baseline gap-4 border-b border-line py-5"
            >
              <span className="font-display text-sm text-muted">0{i + 1}</span>
              <span className="h-display text-5xl text-white transition-colors group-hover:text-accent">
                {item.label}
              </span>
            </Link>
          ))}

          {user ? (
            <div className="mt-6 flex items-center justify-between">
              <Link href="/panel" onClick={() => setOpen(false)} className="font-display uppercase tracking-[0.18em] text-lg text-white hover:text-accent">
                Panel
              </Link>
              <button onClick={signOut} className="font-display uppercase tracking-[0.18em] text-lg text-muted hover:text-accent">
                Çıkış
              </button>
            </div>
          ) : (
            <Link href="/giris" onClick={() => setOpen(false)} className="mt-6 font-display uppercase tracking-[0.18em] text-lg text-white hover:text-accent">
              Giriş Yap
            </Link>
          )}

          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="btn btn-accent mt-8 w-full"
          >
            İletişim
          </a>
        </nav>
      </div>
    </>
  );
}
