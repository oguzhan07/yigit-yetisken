import { getCurrentUser, getCurrentProfile } from "@/lib/auth";
import { getOnboarding } from "@/lib/data/member";
import { ProfileForm } from "@/components/panel/ProfileForm";
import { OnboardingForm } from "@/components/panel/OnboardingForm";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();
  const onboarding = user ? await getOnboarding(user.id) : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10">
        <div className="label">Hesap</div>
        <h1 className="h-display mt-3 text-4xl text-white md:text-5xl">Profil</h1>
      </div>

      <section className="border border-line bg-surface p-8">
        <h2 className="font-display uppercase tracking-[0.18em] text-lg text-white">
          Hesap Bilgileri
        </h2>
        <p className="mt-1 mb-6 text-sm text-muted">
          {profile?.email ?? "—"}
        </p>
        <ProfileForm
          profile={{
            full_name: profile?.full_name ?? "",
            phone: profile?.phone ?? "",
          }}
        />
      </section>

      <section className="mt-6 border border-line bg-surface p-8">
        <h2 className="font-display uppercase tracking-[0.18em] text-lg text-white">
          Hedef & Ölçüler
        </h2>
        <p className="mt-1 mb-6 text-sm text-muted">
          Sana özel program için temel bilgiler.
        </p>
        <OnboardingForm onboarding={onboarding} />
      </section>
    </div>
  );
}
