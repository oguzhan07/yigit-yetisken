"use server";

import { headers } from "next/headers";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isIyzicoConfigured, initCheckoutForm } from "@/lib/iyzico";

export async function startCheckout(
  packageId: string
): Promise<{ url?: string; error?: string }> {
  if (!isSupabaseConfigured()) return { error: "Sistem hazır değil." };
  if (!isIyzicoConfigured()) return { error: "Ödeme altyapısı yapılandırılmamış." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "login" };

  const { data: pkg } = await supabase
    .from("packages")
    .select("*")
    .eq("id", packageId)
    .eq("is_active", true)
    .single();
  if (!pkg) return { error: "Paket bulunamadı." };
  if (!pkg.price_try || pkg.price_try <= 0)
    return { error: "Bu paket için iletişime geçin." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const admin = createAdminClient();
  const { data: order, error: oerr } = await admin
    .from("orders")
    .insert({
      user_id: user.id,
      package_id: pkg.id,
      package_title: pkg.title,
      amount_try: pkg.price_try,
      status: "pending",
    })
    .select()
    .single();
  if (oerr || !order) return { error: "Sipariş oluşturulamadı." };

  const hdrs = await headers();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || `https://${hdrs.get("host")}`;
  const price = Number(pkg.price_try).toFixed(2);
  const fullName = (profile?.full_name || "Değerli Üye").trim();
  const [name, ...rest] = fullName.split(" ");
  const surname = rest.join(" ") || name;
  const gsmDigits = (profile?.phone || "").replace(/\D/g, "");
  const gsmNumber =
    gsmDigits.length >= 10 ? "+90" + gsmDigits.slice(-10) : "+905350000000";
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "85.34.78.112";

  const req = {
    locale: "tr",
    conversationId: order.id,
    price,
    paidPrice: price,
    currency: "TRY",
    basketId: order.id,
    paymentGroup: "PRODUCT",
    callbackUrl: `${siteUrl}/api/odeme/callback`,
    enabledInstallments: [1, 2, 3, 6],
    buyer: {
      id: user.id,
      name,
      surname,
      email: user.email || "uye@yigityetisken.com",
      gsmNumber,
      identityNumber: "11111111111",
      registrationAddress: "Online üyelik",
      city: "Istanbul",
      country: "Turkey",
      ip,
    },
    shippingAddress: {
      contactName: fullName,
      city: "Istanbul",
      country: "Turkey",
      address: "Online üyelik",
    },
    billingAddress: {
      contactName: fullName,
      city: "Istanbul",
      country: "Turkey",
      address: "Online üyelik",
    },
    basketItems: [
      {
        id: pkg.id,
        name: pkg.title,
        category1: "Koçluk",
        itemType: "VIRTUAL",
        price,
      },
    ],
  };

  try {
    const result = await initCheckoutForm(req);
    if (result.status !== "success" || !result.paymentPageUrl) {
      return { error: result.errorMessage || "Ödeme başlatılamadı." };
    }
    await admin
      .from("orders")
      .update({ iyzico_conversation_id: result.token })
      .eq("id", order.id);
    return { url: result.paymentPageUrl };
  } catch {
    return { error: "Ödeme servisine ulaşılamadı." };
  }
}
