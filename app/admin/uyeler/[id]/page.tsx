import { notFound } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProgramUpload } from "@/components/admin/ProgramUpload";

export const dynamic = "force-dynamic";

export default async function MemberDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isSupabaseConfigured()) {
    return <div className="text-sm text-white/70">Veritabanı bağlı değil.</div>;
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!profile) notFound();

  const [onboardingRes, membershipRes, ordersRes, programsRes] = await Promise.all([
    supabase.from("onboarding").select("*").eq("user_id", id).maybeSingle(),
    supabase
      .from("memberships")
      .select("*, packages(title)")
      .eq("user_id", id)
      .eq("status", "active")
      .order("end_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("orders").select("*").eq("user_id", id).order("created_at", { ascending: false }),
    supabase.from("programs").select("*").eq("user_id", id).order("created_at", { ascending: false }),
  ]);

  const onboarding = onboardingRes.data;
  const membership = membershipRes.data as { end_date: string | null; packages: { title: string | null } | null } | null;
  const orders = ordersRes.data ?? [];
  const programs = programsRes.data ?? [];

  let email = "";
  try {
    const admin = createAdminClient();
    const { data: u } = await admin.auth.admin.getUserById(id);
    email = u?.user?.email ?? "";
  } catch {
    /* ignore */
  }

  return (
    <div className="mx-auto max-w-3xl">
      <a href="/admin/uyeler" className="text-sm text-muted hover:text-accent">← Üyeler</a>
      <div className="mb-8 mt-4">
        <div className="label">Üye</div>
        <h1 className="h-display mt-3 text-4xl text-white md:text-5xl">
          {profile.full_name || "(isimsiz)"}
        </h1>
        <p className="mt-2 text-sm text-muted">{email} · {profile.phone || "telefon yok"}</p>
      </div>

      {/* Özet */}
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
        <div className="bg-ink p-6">
          <div className="label mb-2">Aktif Üyelik</div>
          {membership ? (
            <div className="text-white">
              {membership.packages?.title ?? "Üyelik"}
              <div className="mt-1 text-xs text-muted">Bitiş: {membership.end_date}</div>
            </div>
          ) : (
            <div className="text-sm text-muted">Aktif üyelik yok</div>
          )}
        </div>
        <div className="bg-ink p-6">
          <div className="label mb-2">Hedef / Ölçü</div>
          {onboarding ? (
            <div className="text-sm text-white/80">
              {onboarding.goal || "—"} · {onboarding.weight_kg ?? "?"} kg · {onboarding.height_cm ?? "?"} cm
            </div>
          ) : (
            <div className="text-sm text-muted">Onboarding doldurulmadı</div>
          )}
        </div>
      </div>

      {/* Program yükle */}
      <div className="mt-6 border border-line bg-surface p-6 md:p-8">
        <div className="label mb-5">Program Yükle</div>
        <ProgramUpload userId={id} />
      </div>

      {/* Mevcut programlar */}
      {programs.length > 0 && (
        <div className="mt-6">
          <div className="label mb-3">Yüklenen Programlar ({programs.length})</div>
          <div className="border border-line">
            {programs.map((p) => (
              <div key={p.id} className="border-b border-line px-5 py-4 last:border-b-0">
                <div className="font-display uppercase tracking-[0.06em] text-white">{p.title}</div>
                <div className="mt-1 text-xs text-muted">
                  {new Date(p.created_at).toLocaleDateString("tr-TR")}
                  {p.file_path ? " · dosya var" : " · dosya yok"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Siparişler */}
      {orders.length > 0 && (
        <div className="mt-6">
          <div className="label mb-3">Siparişler ({orders.length})</div>
          <div className="border border-line">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between border-b border-line px-5 py-3 last:border-b-0 text-sm">
                <span className="text-white/80">{o.package_title}</span>
                <span className="text-muted">
                  {Number(o.amount_try).toLocaleString("tr-TR")} ₺ · {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
