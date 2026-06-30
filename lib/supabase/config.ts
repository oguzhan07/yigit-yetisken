/**
 * Supabase yapılandırılmış mı? (env anahtarları mevcut mu)
 * Demo modunda (false) site statik yedekle çalışır, gated alanlar uyarı gösterir.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Public storage kovasındaki bir dosyanın tam URL'i. */
export function storagePublicUrl(
  bucket: string,
  path: string | null | undefined
): string | null {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}
