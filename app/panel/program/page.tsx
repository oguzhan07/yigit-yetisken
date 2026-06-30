import { getCurrentUser } from "@/lib/auth";
import { getPrograms } from "@/lib/data/member";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export default async function ProgramPage() {
  const user = await getCurrentUser();
  const programs = user ? await getPrograms(user.id) : [];

  const links: Record<string, string> = {};
  if (isSupabaseConfigured() && programs.length) {
    const supabase = await createClient();
    await Promise.all(
      programs.map(async (p) => {
        if (p.file_path) {
          const { data } = await supabase.storage
            .from("programs")
            .createSignedUrl(p.file_path, 3600);
          if (data?.signedUrl) links[p.id] = data.signedUrl;
        }
      })
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10">
        <div className="label">Antrenman & Beslenme</div>
        <h1 className="h-display mt-3 text-4xl text-white md:text-5xl">Programım</h1>
      </div>

      {programs.length === 0 ? (
        <div className="border border-line bg-surface p-10 text-center">
          <p className="text-sm leading-relaxed text-white/70">
            Henüz bir program yüklenmedi. Koçun sana özel planı hazırladığında
            burada görünecek ve indirebileceksin.
          </p>
        </div>
      ) : (
        <div className="grid gap-px border border-line bg-line">
          {programs.map((p) => (
            <div key={p.id} className="flex flex-col gap-4 bg-ink p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-display uppercase tracking-[0.06em] text-lg text-white">
                  {p.title}
                </div>
                {p.description && (
                  <p className="mt-1 text-sm text-muted">{p.description}</p>
                )}
                <p className="mt-1 text-xs text-muted">
                  {new Date(p.created_at).toLocaleDateString("tr-TR")}
                </p>
              </div>
              {links[p.id] ? (
                <a href={links[p.id]} target="_blank" rel="noopener noreferrer" className="btn btn-accent !py-3 !px-6 shrink-0">
                  İndir
                </a>
              ) : (
                <span className="text-xs text-muted">Dosya yok</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
