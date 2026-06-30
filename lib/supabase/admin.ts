import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Servis-rol istemcisi: RLS'i atlar. SADECE sunucu tarafında
 * (webhook, admin işlemleri) kullanılır. Asla client'a import etme.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
