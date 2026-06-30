import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { saveLegal } from "@/app/admin/actions";
import { inputClass, labelClass } from "@/lib/ui";

export const dynamic = "force-dynamic";

type Row = { slug: string; title: string; content: string | null };

async function getAll(): Promise<Row[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("legal_pages").select("slug,title,content").order("slug");
  return (data as Row[]) ?? [];
}

export default async function AdminLegal() {
  const items = await getAll();
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10">
        <div className="label">İçerik</div>
        <h1 className="h-display mt-3 text-4xl text-white md:text-5xl">Yasal Sayfalar</h1>
      </div>

      {items.length === 0 ? (
        <div className="border border-line bg-surface p-8 text-sm text-white/70">
          Şema kurulduğunda 3 yasal sayfa (Mesafeli Satış, KVKK, İptal/İade) burada
          düzenlenebilir olacak.
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((r) => (
            <form key={r.slug} action={saveLegal} className="space-y-4 border border-line bg-surface p-6">
              <input type="hidden" name="slug" value={r.slug} />
              <div className="flex items-center justify-between">
                <span className="label">/{r.slug}</span>
              </div>
              <div><label className={labelClass}>Başlık</label><input name="title" defaultValue={r.title} className={inputClass} /></div>
              <div><label className={labelClass}>İçerik</label><textarea name="content" rows={8} defaultValue={r.content ?? ""} className={inputClass} /></div>
              <button className="btn btn-accent !py-3">Kaydet</button>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
