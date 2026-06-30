import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser, getCurrentProfile } from "@/lib/auth";
import { PanelShell } from "@/components/panel/PanelShell";
import { DemoBanner } from "@/components/DemoBanner";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const configured = isSupabaseConfigured();

  let displayName = "Üye";
  let isAdmin = false;

  if (configured) {
    const user = await getCurrentUser();
    if (!user) redirect("/giris?next=/panel");
    const profile = await getCurrentProfile();
    displayName = profile?.full_name || user.email || "Üye";
    isAdmin = profile?.role === "admin";
  }

  return (
    <PanelShell name={displayName} admin={isAdmin}>
      {!configured && <DemoBanner className="mb-8" />}
      {children}
    </PanelShell>
  );
}
