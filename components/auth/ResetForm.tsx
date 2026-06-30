"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { inputClass, labelClass } from "@/lib/ui";
import { DemoBanner } from "@/components/DemoBanner";

export function ResetForm({ configured }: { configured: boolean }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!configured) return;
    setLoading(true);
    const f = new FormData(e.currentTarget);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(String(f.get("email")), {
      redirectTo: `${location.origin}/auth/callback?next=/sifre-yenile`,
    });
    setLoading(false);
    setDone(true);
  }

  if (done) {
    return (
      <p className="text-sm leading-relaxed text-white/80">
        Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısını gönderdik.
        Gelen kutunu kontrol et.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {!configured && <DemoBanner />}
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="email">E-posta</label>
          <input id="email" name="email" type="email" required disabled={!configured} className={inputClass} placeholder="ornek@eposta.com" />
        </div>
        <button type="submit" disabled={!configured || loading} className="btn btn-accent w-full disabled:cursor-not-allowed disabled:opacity-40">
          {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
        </button>
      </form>
    </div>
  );
}
