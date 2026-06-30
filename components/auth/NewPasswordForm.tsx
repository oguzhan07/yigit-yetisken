"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { inputClass, labelClass } from "@/lib/ui";
import { DemoBanner } from "@/components/DemoBanner";

export function NewPasswordForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!configured) return;
    setError(null);
    const f = new FormData(e.currentTarget);
    const password = String(f.get("password"));
    if (password !== String(f.get("password2"))) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError("Şifre güncellenemedi. Bağlantı geçersiz olabilir.");
      return;
    }
    router.push("/giris");
  }

  return (
    <div className="space-y-6">
      {!configured && <DemoBanner />}
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="password">Yeni Şifre</label>
          <input id="password" name="password" type="password" required minLength={6} disabled={!configured} className={inputClass} placeholder="En az 6 karakter" />
        </div>
        <div>
          <label className={labelClass} htmlFor="password2">Yeni Şifre (Tekrar)</label>
          <input id="password2" name="password2" type="password" required minLength={6} disabled={!configured} className={inputClass} placeholder="••••••••" />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={!configured || loading} className="btn btn-accent w-full disabled:cursor-not-allowed disabled:opacity-40">
          {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
        </button>
      </form>
    </div>
  );
}
