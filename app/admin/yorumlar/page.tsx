import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { upsertTestimonial, deleteTestimonial } from "@/app/admin/actions";
import { inputClass, labelClass } from "@/lib/ui";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  name: string;
  quote: string;
  result: string | null;
  is_published: boolean;
  sort_order: number;
};

async function getAll(): Promise<Row[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").order("sort_order");
  return (data as Row[]) ?? [];
}

function Editor({ r }: { r?: Row }) {
  return (
    <div className="border border-line bg-surface p-6">
      <form action={upsertTestimonial} className="space-y-4">
        {r && <input type="hidden" name="id" value={r.id} />}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={labelClass}>Danışan Adı</label><input name="name" defaultValue={r?.name} required className={inputClass} /></div>
          <div><label className={labelClass}>Sonuç / Süre</label><input name="result" defaultValue={r?.result ?? ""} className={inputClass} placeholder="örn. 6 ayda -12 kg" /></div>
        </div>
        <div><label className={labelClass}>Yorum</label><textarea name="quote" rows={3} defaultValue={r?.quote} required className={inputClass} /></div>
        <div className="flex items-center gap-6">
          <div className="w-28"><label className={labelClass}>Sıra</label><input name="sort_order" type="number" defaultValue={r?.sort_order ?? 0} className={inputClass} /></div>
          <label className="mt-6 flex items-center gap-2 text-sm text-white/80">
            <input type="checkbox" name="is_published" defaultChecked={r?.is_published ?? true} className="h-4 w-4 accent-accent" /> Yayında
          </label>
        </div>
        <button className="btn btn-accent !py-3">{r ? "Kaydet" : "Ekle"}</button>
      </form>
      {r && (
        <form action={deleteTestimonial} className="mt-3">
          <input type="hidden" name="id" value={r.id} />
          <button className="font-display uppercase tracking-[0.14em] text-xs text-red-400 hover:underline">Sil</button>
        </form>
      )}
    </div>
  );
}

export default async function AdminTestimonials() {
  const items = await getAll();
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10">
        <div className="label">İçerik</div>
        <h1 className="h-display mt-3 text-4xl text-white md:text-5xl">Yorumlar</h1>
      </div>
      <div className="space-y-8">
        <div>
          <div className="label mb-3">Yeni Yorum</div>
          <Editor />
        </div>
        {items.length > 0 && (
          <div className="space-y-6">
            <div className="label">Mevcut ({items.length})</div>
            {items.map((r) => <Editor key={r.id} r={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}
