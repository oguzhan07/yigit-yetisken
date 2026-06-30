"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { addProgram } from "@/app/admin/actions";
import { inputClass, labelClass } from "@/lib/ui";

export function ProgramUpload({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const file = fd.get("file") as File | null;

    let filePath = "";
    if (file && file.size > 0) {
      const supabase = createClient();
      const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const path = `${userId}/${Date.now()}-${safe}`;
      const { error } = await supabase.storage.from("programs").upload(path, file);
      if (error) {
        setMsg({ ok: false, text: "Dosya yüklenemedi: " + error.message });
        setLoading(false);
        return;
      }
      filePath = path;
    }

    const out = new FormData();
    out.set("user_id", userId);
    out.set("title", String(fd.get("title") || ""));
    out.set("description", String(fd.get("description") || ""));
    out.set("file_path", filePath);
    await addProgram(out);

    setLoading(false);
    setMsg({ ok: true, text: "Program eklendi ✓" });
    formEl.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="title">Program Başlığı</label>
        <input id="title" name="title" required className={inputClass} placeholder="örn. Hafta 1-4 · Tam Vücut" />
      </div>
      <div>
        <label className={labelClass} htmlFor="description">Açıklama</label>
        <textarea id="description" name="description" rows={2} className={inputClass} placeholder="Kısa not (opsiyonel)" />
      </div>
      <div>
        <label className={labelClass} htmlFor="file">Dosya (PDF vb.)</label>
        <input id="file" name="file" type="file" className="block w-full text-sm text-white/80 file:mr-4 file:border file:border-line file:bg-ink file:px-4 file:py-2 file:font-display file:uppercase file:tracking-[0.14em] file:text-xs file:text-white hover:file:border-accent" />
      </div>
      <div className="flex items-center gap-4">
        <button type="submit" disabled={loading} className="btn btn-accent !py-3 disabled:opacity-40">
          {loading ? "Yükleniyor..." : "Programı Yükle"}
        </button>
        {msg && (
          <span className={`text-sm ${msg.ok ? "text-accent" : "text-red-400"}`}>{msg.text}</span>
        )}
      </div>
    </form>
  );
}
