import "server-only";
import { isSupabaseConfigured, storagePublicUrl } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import * as fb from "@/lib/content";
import type {
  Package,
  Testimonial,
  Transformation,
  FaqItem,
  LegalPage,
} from "@/lib/types";

// Supabase varsa DB'den, yoksa statik içerikten (fallback) besler.

export async function getPackages(): Promise<Package[]> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (!error && data && data.length) return data as Package[];
  }
  return fb.packagesPreview.map((p, i) => ({
    id: `static-${i}`,
    slug: `paket-${i}`,
    title: p.title,
    type: "online",
    description: p.desc,
    features: [],
    price_try: 0,
    duration_months: null,
    is_active: true,
    sort_order: i,
  }));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order");
    if (!error && data && data.length)
      return data.map((t) => ({
        id: t.id,
        name: t.name,
        quote: t.quote,
        result: t.result,
        image_url: storagePublicUrl("testimonials", t.image_path),
      }));
  }
  // Gerçek yorum yoksa public'te placeholder gösterme
  return [];
}

export async function getTransformations(): Promise<Transformation[]> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("transformations")
      .select("*")
      .eq("is_published", true)
      .order("sort_order");
    if (!error && data && data.length)
      return data.map((t) => ({
        id: t.id,
        title: t.title,
        before_url: storagePublicUrl("transformations", t.before_path),
        after_url: storagePublicUrl("transformations", t.after_path),
        caption: t.caption,
      }));
  }
  // Gerçek dönüşüm görseli yoksa public'te placeholder gösterme
  return [];
}

export async function getFaqs(): Promise<FaqItem[]> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_published", true)
      .order("sort_order");
    if (!error && data && data.length)
      return data.map((f) => ({ id: f.id, question: f.question, answer: f.answer }));
  }
  return fb.faq.map((f, i) => ({ id: `static-${i}`, question: f.q, answer: f.a }));
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("legal_pages")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (data) return data as LegalPage;
  }
  return null;
}

export async function getLegalPages(): Promise<{ slug: string; title: string }[]> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("legal_pages")
      .select("slug,title")
      .order("slug");
    if (data && data.length) return data;
  }
  return [
    { slug: "mesafeli-satis", title: "Mesafeli Satış Sözleşmesi" },
    { slug: "kvkk", title: "KVKK Aydınlatma Metni" },
    { slug: "iptal-iade", title: "İptal ve İade Koşulları" },
  ];
}
