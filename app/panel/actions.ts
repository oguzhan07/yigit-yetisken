"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";

function num(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

async function getUserId() {
  if (!isSupabaseConfigured()) return { supabase: null, userId: null };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, userId: user?.id ?? null };
}

export async function updateProfile(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase, userId } = await getUserId();
  if (!supabase || !userId) return { ok: false, message: "Oturum bulunamadı." };
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: String(formData.get("full_name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
    })
    .eq("id", userId);
  if (error) return { ok: false, message: "Kaydedilemedi." };
  revalidatePath("/panel/profil");
  return { ok: true, message: "Profil güncellendi." };
}

export async function saveOnboarding(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase, userId } = await getUserId();
  if (!supabase || !userId) return { ok: false, message: "Oturum bulunamadı." };
  const { error } = await supabase.from("onboarding").upsert(
    {
      user_id: userId,
      goal: String(formData.get("goal") ?? "") || null,
      birth_date: String(formData.get("birth_date") ?? "") || null,
      height_cm: num(formData.get("height_cm")),
      weight_kg: num(formData.get("weight_kg")),
      experience_level: String(formData.get("experience_level") ?? "") || null,
      training_days_per_week: num(formData.get("training_days_per_week")),
      health_notes: String(formData.get("health_notes") ?? "") || null,
    },
    { onConflict: "user_id" }
  );
  if (error) return { ok: false, message: "Kaydedilemedi." };
  revalidatePath("/panel/profil");
  revalidatePath("/panel");
  return { ok: true, message: "Bilgilerin kaydedildi." };
}

export async function addProgressEntry(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase, userId } = await getUserId();
  if (!supabase || !userId) return { ok: false, message: "Oturum bulunamadı." };
  const { error } = await supabase.from("progress_entries").insert({
    user_id: userId,
    entry_date:
      String(formData.get("entry_date") ?? "") ||
      new Date().toISOString().slice(0, 10),
    weight_kg: num(formData.get("weight_kg")),
    note: String(formData.get("note") ?? "") || null,
  });
  if (error) return { ok: false, message: "Eklenemedi." };
  revalidatePath("/panel/ilerleme");
  return { ok: true, message: "Kayıt eklendi." };
}

export async function markNotificationsRead(): Promise<void> {
  const { supabase, userId } = await getUserId();
  if (!supabase || !userId) return;
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);
  revalidatePath("/panel/bildirimler");
}
