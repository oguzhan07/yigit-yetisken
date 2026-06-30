"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { inputClass, labelClass } from "@/lib/ui";
import { DemoBanner } from "@/components/DemoBanner";
import { GoogleButton } from "@/components/auth/GoogleButton";

export function LoginForm({ next, configured }: { next: string; configured: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!configured) return;
    setError(null);
    setLoading(true);
    const f = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(f.get("email")),
      password: String(f.get("password")),
    });
    setLoading(false);
    if (error) {
      setError("E-posta veya şifre hatalı.");
      return;
    }
    router.push(next || "/panel");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {!configured && <DemoBanner />}
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="email">E-posta</label>
          <input id="email" name="email" type="email" required disabled={!configured} className={inputClass} placeholder="ornek@eposta.com" />
        </div>
        <div>
          <label className={labelClass} htmlFor="password">Şifre</label>
          <input id="password" name="password" type="password" required disabled={!configured} className={inputClass} placeholder="••••••••" />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={!configured || loading} className="btn btn-accent w-full disabled:cursor-not-allowed disabled:opacity-40">
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      <div className="flex items-center gap-4">
        <span className="hairline" />
        <span className="label">veya</span>
        <span className="hairline" />
      </div>

      <GoogleButton next={next} disabled={!configured} />

      <div className="text-center">
        <Link href="/sifre-sifirla" className="text-sm text-muted transition-colors hover:text-accent">
          Şifreni mi unuttun?
        </Link>
      </div>
    </div>
  );
}
