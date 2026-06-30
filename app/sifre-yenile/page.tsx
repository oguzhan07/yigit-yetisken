import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { NewPasswordForm } from "@/components/auth/NewPasswordForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Yeni Şifre — Yiğit Yetişken",
  robots: { index: false, follow: false },
};

export default function NewPasswordPage() {
  return (
    <AuthShell title="Yeni Şifre" subtitle="Hesabın için yeni bir şifre belirle.">
      <NewPasswordForm configured={isSupabaseConfigured()} />
    </AuthShell>
  );
}
