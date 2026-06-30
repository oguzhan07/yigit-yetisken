"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/** Admin oturumu doğrula; değilse null döner (RLS de ayrıca korur). */
async function adminClient() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return null;
  return supabase;
}

function num(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function lines(v: FormDataEntryValue | null): string[] {
  return String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function refreshPublic() {
  revalidatePath("/");
  revalidatePath("/uyelik");
}

// ---------- PAKETLER ----------
export async function upsertPackage(formData: FormData) {
  const supabase = await adminClient();
  if (!supabase) return;
  const id = String(formData.get("id") ?? "");
  const row = {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    type: String(formData.get("type") ?? "online"),
    description: String(formData.get("description") ?? "").trim() || null,
    price_try: num(formData.get("price_try")) ?? 0,
    duration_months: num(formData.get("duration_months")),
    features: lines(formData.get("features")),
    is_active: formData.get("is_active") === "on",
    sort_order: num(formData.get("sort_order")) ?? 0,
  };
  if (id) await supabase.from("packages").update(row).eq("id", id);
  else await supabase.from("packages").insert(row);
  revalidatePath("/admin/paketler");
  refreshPublic();
}

export async function deletePackage(formData: FormData) {
  const supabase = await adminClient();
  if (!supabase) return;
  await supabase.from("packages").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin/paketler");
  refreshPublic();
}

// ---------- YORUMLAR ----------
export async function upsertTestimonial(formData: FormData) {
  const supabase = await adminClient();
  if (!supabase) return;
  const id = String(formData.get("id") ?? "");
  const row = {
    name: String(formData.get("name") ?? "").trim(),
    quote: String(formData.get("quote") ?? "").trim(),
    result: String(formData.get("result") ?? "").trim() || null,
    is_published: formData.get("is_published") === "on",
    sort_order: num(formData.get("sort_order")) ?? 0,
  };
  if (id) await supabase.from("testimonials").update(row).eq("id", id);
  else await supabase.from("testimonials").insert(row);
  revalidatePath("/admin/yorumlar");
  refreshPublic();
}

export async function deleteTestimonial(formData: FormData) {
  const supabase = await adminClient();
  if (!supabase) return;
  await supabase.from("testimonials").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin/yorumlar");
  refreshPublic();
}

// ---------- SSS ----------
export async function upsertFaq(formData: FormData) {
  const supabase = await adminClient();
  if (!supabase) return;
  const id = String(formData.get("id") ?? "");
  const row = {
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
    is_published: formData.get("is_published") === "on",
    sort_order: num(formData.get("sort_order")) ?? 0,
  };
  if (id) await supabase.from("faqs").update(row).eq("id", id);
  else await supabase.from("faqs").insert(row);
  revalidatePath("/admin/sss");
  refreshPublic();
}

export async function deleteFaq(formData: FormData) {
  const supabase = await adminClient();
  if (!supabase) return;
  await supabase.from("faqs").delete().eq("id", String(formData.get("id")));
  revalidatePath("/admin/sss");
  refreshPublic();
}

// ---------- YASAL ----------
export async function saveLegal(formData: FormData) {
  const supabase = await adminClient();
  if (!supabase) return;
  await supabase
    .from("legal_pages")
    .update({
      title: String(formData.get("title") ?? "").trim(),
      content: String(formData.get("content") ?? ""),
    })
    .eq("slug", String(formData.get("slug")));
  revalidatePath("/admin/yasal");
  revalidatePath(`/yasal/${String(formData.get("slug"))}`);
}

// ---------- PROGRAM YÜKLEME (koç → üye) ----------
export async function addProgram(formData: FormData) {
  const supabase = await adminClient();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = String(formData.get("user_id") ?? "");
  if (!userId) return;
  const filePath = String(formData.get("file_path") ?? "").trim() || null;

  await supabase.from("programs").insert({
    user_id: userId,
    title: String(formData.get("title") ?? "").trim() || "Program",
    description: String(formData.get("description") ?? "").trim() || null,
    file_path: filePath,
    uploaded_by: user?.id ?? null,
  });
  await supabase.from("notifications").insert({
    user_id: userId,
    title: "Yeni programın hazır",
    body: String(formData.get("title") ?? "Antrenman programın panelinde."),
    type: "program",
    is_read: false,
  });
  revalidatePath(`/admin/uyeler/${userId}`);
}
