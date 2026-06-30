import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetForm } from "@/components/auth/ResetForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Şifre Sıfırla — Yiğit Yetişken",
  robots: { index: false, follow: false },
};

export default function ResetPage() {
  return (
    <AuthShell
      title="Şifre Sıfırla"
      subtitle="E-postanı gir, sana sıfırlama bağlantısı gönderelim."
      footer={
        <Link href="/giris" className="text-accent hover:underline">
          Girişe dön
        </Link>
      }
    >
      <ResetForm configured={isSupabaseConfigured()} />
    </AuthShell>
  );
}
