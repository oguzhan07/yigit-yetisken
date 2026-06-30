"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { inputClass, labelClass } from "@/lib/ui";
import { DemoBanner } from "@/components/DemoBanner";
import { GoogleButton } from "@/components/auth/GoogleButton";

export function RegisterForm({ configured }: { configured: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!configured) return;
    setError(null);
    setLoading(true);
    const f = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: String(f.get("email")),
      password: String(f.get("password")),
      options: {
        data: { full_name: String(f.get("full_name")) },
        emailRedirectTo: `${location.origin}/auth/callback?next=/panel`,
      },
    });
    setLoading(false);
    if (error) {
      setError(
        /registered|already/i.test(error.message)
          ? "Bu e-posta zaten kayıtlı."
          : "Kayıt başarısız. Bilgileri kontrol et."
      );
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <p className="text-sm leading-relaxed text-white/80">
        Hesabın oluşturuldu. E-postanı doğrulamak için sana gönderdiğimiz
        bağlantıya tıkla. (E-posta doğrulaması kapalıysa doğrudan giriş
        yapabilirsin.)
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {!configured && <DemoBanner />}
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="full_name">Ad Soyad</label>
          <input id="full_name" name="full_name" required disabled={!configured} className={inputClass} placeholder="Adın ve soyadın" />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">E-posta</label>
          <input id="email" name="email" type="email" required disabled={!configured} className={inputClass} placeholder="ornek@eposta.com" />
        </div>
        <div>
          <label className={labelClass} htmlFor="password">Şifre</label>
          <input id="password" name="password" type="password" required minLength={6} disabled={!configured} className={inputClass} placeholder="En az 6 karakter" />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={!configured || loading} className="btn btn-accent w-full disabled:cursor-not-allowed disabled:opacity-40">
          {loading ? "Oluşturuluyor..." : "Hesap Oluştur"}
        </button>
      </form>

      <div className="flex items-center gap-4">
        <span className="hairline" />
        <span className="label">veya</span>
        <span className="hairline" />
      </div>

      <GoogleButton next="/panel" disabled={!configured} />
    </div>
  );
}
