"use client";

import { useActionState } from "react";
import { saveOnboarding } from "@/app/panel/actions";
import { inputClass, labelClass } from "@/lib/ui";
import type { ActionState, Onboarding } from "@/lib/types";

const goals = ["Yağ Yakımı", "Kas & Form", "Performans", "Genel Sağlık"];
const levels = ["Başlangıç", "Orta", "İleri"];

export function OnboardingForm({ onboarding }: { onboarding: Onboarding | null }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    saveOnboarding,
    null
  );

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="goal">Hedef</label>
          <select id="goal" name="goal" defaultValue={onboarding?.goal ?? ""} className={inputClass}>
            <option value="">Seç</option>
            {goals.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="experience_level">Deneyim Seviyesi</label>
          <select id="experience_level" name="experience_level" defaultValue={onboarding?.experience_level ?? ""} className={inputClass}>
            <option value="">Seç</option>
            {levels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="birth_date">Doğum Tarihi</label>
          <input id="birth_date" name="birth_date" type="date" defaultValue={onboarding?.birth_date ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="training_days_per_week">Haftalık Antrenman Günü</label>
          <input id="training_days_per_week" name="training_days_per_week" type="number" min={0} max={7} defaultValue={onboarding?.training_days_per_week ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="height_cm">Boy (cm)</label>
          <input id="height_cm" name="height_cm" type="number" defaultValue={onboarding?.height_cm ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="weight_kg">Kilo (kg)</label>
          <input id="weight_kg" name="weight_kg" type="number" step="0.1" defaultValue={onboarding?.weight_kg ?? ""} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="health_notes">Sağlık Notları</label>
        <textarea id="health_notes" name="health_notes" rows={3} defaultValue={onboarding?.health_notes ?? ""} className={inputClass} placeholder="Sakatlık, kronik rahatsızlık vb." />
      </div>
      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="btn btn-accent !py-3 disabled:opacity-40">
          {pending ? "Kaydediliyor..." : "Bilgileri Kaydet"}
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
