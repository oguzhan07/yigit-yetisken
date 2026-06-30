"use client";

import { useActionState } from "react";
import { addProgressEntry } from "@/app/panel/actions";
import { inputClass, labelClass } from "@/lib/ui";
import type { ActionState } from "@/lib/types";

export function ProgressForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    addProgressEntry,
    null
  );

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="entry_date">Tarih</label>
          <input id="entry_date" name="entry_date" type="date" className={inputClass} defaultValue={new Date().toISOString().slice(0, 10)} />
        </div>
        <div>
          <label className={labelClass} htmlFor="weight_kg">Kilo (kg)</label>
          <input id="weight_kg" name="weight_kg" type="number" step="0.1" className={inputClass} placeholder="örn. 78.5" />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="note">Not</label>
        <input id="note" name="note" className={inputClass} placeholder="Kısa not (opsiyonel)" />
      </div>
      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="btn btn-accent !py-3 disabled:opacity-40">
          {pending ? "Ekleniyor..." : "Kayıt Ekle"}
        </button>
        {state && (
          <span className={`text-sm ${state.ok ? "text-accent" : "text-red-400"}`}>
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
