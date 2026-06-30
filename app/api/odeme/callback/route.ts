import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { retrieveCheckoutForm } from "@/lib/iyzico";
import { sendEmail, emailLayout } from "@/lib/email";

// iyzico ödeme sonrası buraya POST eder (token form-encoded).
export async function POST(request: Request) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  let token = "";
  try {
    const form = await request.formData();
    token = String(form.get("token") || "");
  } catch {
    /* ignore */
  }
  if (!token) {
    return NextResponse.redirect(`${siteUrl}/panel?odeme=hata`, 303);
  }

  try {
    const result = await retrieveCheckoutForm(token);
    const orderId: string | undefined = result.basketId || result.conversationId;
    const admin = createAdminClient();

    if (
      result.status === "success" &&
      result.paymentStatus === "SUCCESS" &&
      orderId
    ) {
      const { data: order } = await admin
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (order && order.status !== "paid") {
        await admin
          .from("orders")
          .update({
            status: "paid",
            paid_at: new Date().toISOString(),
            iyzico_payment_id: String(result.paymentId || ""),
          })
          .eq("id", orderId);

        const { data: pkg } = await admin
          .from("packages")
          .select("duration_months")
          .eq("id", order.package_id)
          .single();
        const months = pkg?.duration_months || 1;
        const start = new Date();
        const end = new Date();
        end.setMonth(end.getMonth() + months);

        await admin.from("memberships").insert({
          user_id: order.user_id,
          package_id: order.package_id,
          order_id: order.id,
          start_date: start.toISOString().slice(0, 10),
          end_date: end.toISOString().slice(0, 10),
          status: "active",
        });

        await admin.from("notifications").insert({
          user_id: order.user_id,
          title: "Ödemen alındı",
          body: `${order.package_title} üyeliğin aktif edildi. Hadi başlayalım!`,
          type: "payment",
          is_read: false,
        });

        // Makbuz e-postası
        const { data: u } = await admin.auth.admin.getUserById(order.user_id);
        const email = u?.user?.email;
        if (email) {
          await sendEmail({
            to: email,
            subject: "Ödemen alındı — Yiğit Yetişken",
            html: emailLayout(
              "Ödemen alındı ✓",
              `<p><strong>${order.package_title}</strong> üyeliğin aktif edildi.</p>
               <p>Tutar: <strong>${Number(order.amount_try).toLocaleString("tr-TR")} ₺</strong></p>
               <p>Panelinden programını ve ilerlemeni takip edebilirsin.</p>`
            ),
          });
        }
      }
      return NextResponse.redirect(`${siteUrl}/panel?odeme=basarili`, 303);
    }

    if (orderId) {
      await admin.from("orders").update({ status: "failed" }).eq("id", orderId);
    }
    return NextResponse.redirect(`${siteUrl}/panel?odeme=basarisiz`, 303);
  } catch {
    return NextResponse.redirect(`${siteUrl}/panel?odeme=hata`, 303);
  }
}
