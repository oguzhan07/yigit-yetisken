import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type {
  Membership,
  Order,
  ProgramItem,
  ProgressEntry,
  NotificationItem,
  Onboarding,
} from "@/lib/types";

// Tüm fonksiyonlar Supabase yoksa / tablo henüz yoksa güvenli boş değer döner.

export async function getActiveMembership(
  userId: string
): Promise<Membership | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("memberships")
    .select("*, packages(title)")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("end_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as Membership) ?? null;
}

export async function getPrograms(userId: string): Promise<ProgramItem[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("programs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data as ProgramItem[]) ?? [];
}

export async function getOrders(userId: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data as Order[]) ?? [];
}

export async function getProgressEntries(
  userId: string
): Promise<ProgressEntry[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("progress_entries")
    .select("*")
    .eq("user_id", userId)
    .order("entry_date", { ascending: true });
  return (data as ProgressEntry[]) ?? [];
}

export async function getNotifications(
  userId: string
): Promise<NotificationItem[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  return (data as NotificationItem[]) ?? [];
}

export async function getOnboarding(
  userId: string
): Promise<Onboarding | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("onboarding")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return (data as Onboarding) ?? null;
}
