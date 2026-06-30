import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Kayıt Ol — Yiğit Yetişken",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Kayıt Ol"
      subtitle="Dönüşüm yolculuğuna başlamak için hesabını oluştur."
      footer={
        <>
          Zaten üye misin?{" "}
          <Link href="/giris" className="text-accent hover:underline">
            Giriş yap
          </Link>
        </>
      }
    >
      <RegisterForm configured={isSupabaseConfigured()} />
    </AuthShell>
  );
}
