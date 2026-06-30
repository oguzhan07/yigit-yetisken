import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { upsertPackage, deletePackage } from "@/app/admin/actions";
import { inputClass, labelClass } from "@/lib/ui";
import type { Package } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getAll(): Promise<Package[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("packages").select("*").order("sort_order");
  return (data as Package[]) ?? [];
}

function Editor({ p }: { p?: Package }) {
  return (
    <div className="border border-line bg-surface p-6">
      <form action={upsertPackage} className="space-y-4">
        {p && <input type="hidden" name="id" value={p.id} />}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={labelClass}>Başlık</label><input name="title" defaultValue={p?.title} required className={inputClass} /></div>
          <div><label className={labelClass}>Slug</label><input name="slug" defaultValue={p?.slug} required className={inputClass} /></div>
          <div>
            <label className={labelClass}>Tür</label>
            <select name="type" defaultValue={p?.type ?? "online"} className={inputClass}>
              <option value="online">Online</option>
              <option value="one_on_one">Birebir</option>
              <option value="program">Program</option>
            </select>
          </div>
          <div><label className={labelClass}>Fiyat (₺)</label><input name="price_try" type="number" step="0.01" defaultValue={p?.price_try ?? 0} className={inputClass} /></div>
          <div><label className={labelClass}>Süre (ay)</label><input name="duration_months" type="number" defaultValue={p?.duration_months ?? ""} className={inputClass} /></div>
          <div><label className={labelClass}>Sıra</label><input name="sort_order" type="number" defaultValue={p?.sort_order ?? 0} className={inputClass} /></div>
        </div>
        <div><label className={labelClass}>Açıklama</label><textarea name="description" rows={2} defaultValue={p?.description ?? ""} className={inputClass} /></div>
        <div><label className={labelClass}>Özellikler (her satır bir madde)</label><textarea name="features" rows={3} defaultValue={p?.features?.join("\n") ?? ""} className={inputClass} /></div>
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input type="checkbox" name="is_active" defaultChecked={p?.is_active ?? true} className="h-4 w-4 accent-accent" /> Yayında
        </label>
        <button className="btn btn-accent !py-3">{p ? "Kaydet" : "Ekle"}</button>
      </form>
      {p && (
        <form action={deletePackage} className="mt-3">
          <input type="hidden" name="id" value={p.id} />
          <button className="font-display uppercase tracking-[0.14em] text-xs text-red-400 hover:underline">Sil</button>
        </form>
      )}
    </div>
  );
}

export default async function AdminPackages() {
  const items = await getAll();
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10">
        <div className="label">İçerik</div>
        <h1 className="h-display mt-3 text-4xl text-white md:text-5xl">Paketler</h1>
      </div>
      <div className="space-y-8">
        <div>
          <div className="label mb-3">Yeni Paket</div>
          <Editor />
        </div>
        {items.length > 0 && (
          <div className="space-y-6">
            <div className="label">Mevcut Paketler ({items.length})</div>
            {items.map((p) => <Editor key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
