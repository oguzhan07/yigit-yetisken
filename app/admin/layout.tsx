import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser, getCurrentProfile } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { DemoBanner } from "@/components/DemoBanner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const configured = isSupabaseConfigured();
  let displayName = "Yönetici";

  if (configured) {
    const user = await getCurrentUser();
    if (!user) redirect("/giris?next=/admin");
    const profile = await getCurrentProfile();
    if (profile?.role !== "admin") redirect("/panel");
    displayName = profile.full_name || user.email || "Yönetici";
  }

  return (
    <AdminShell name={displayName}>
      {!configured && <DemoBanner className="mb-8" />}
      {children}
    </AdminShell>
  );
}
