import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Giriş Yap — Yiğit Yetişken",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next ?? "/panel";

  return (
    <AuthShell
      title="Giriş Yap"
      subtitle="Üye paneline eriş, programını ve ilerlemeni gör."
      footer={
        <>
          Hesabın yok mu?{" "}
          <Link href="/kayit" className="text-accent hover:underline">
            Kayıt ol
          </Link>
        </>
      }
    >
      <LoginForm next={next} configured={isSupabaseConfigured()} />
    </AuthShell>
  );
}
