"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/panel/actions";
import { inputClass, labelClass } from "@/lib/ui";
import type { ActionState } from "@/lib/types";

export function ProfileForm({
  profile,
}: {
  profile: { full_name: string; phone: string };
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    updateProfile,
    null
  );

  return (
    <form action={action} className="space-y-5">
      <div>
        <label className={labelClass} htmlFor="full_name">Ad Soyad</label>
        <input id="full_name" name="full_name" defaultValue={profile.full_name} className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="phone">Telefon</label>
        <input id="phone" name="phone" defaultValue={profile.phone} className={inputClass} placeholder="05xx xxx xx xx" />
      </div>
      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="btn btn-accent !py-3 disabled:opacity-40">
          {pending ? "Kaydediliyor..." : "Kaydet"}
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
