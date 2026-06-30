import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/** Oturum açmış kullanıcı (yoksa / demo modunda null). */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Kullanıcı + profil (rol dahil). */
export async function getCurrentProfile() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile ? { ...profile, email: user.email } : null;
}

/** Kullanıcı admin mi? */
export async function isCurrentUserAdmin() {
  const profile = await getCurrentProfile();
  return profile?.role === "admin";
}
