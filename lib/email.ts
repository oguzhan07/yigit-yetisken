import "server-only";
import { Resend } from "resend";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!isEmailConfigured()) return;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: process.env.RESEND_FROM || "Yiğit Yetişken <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
  } catch {
    // E-posta gönderimi kritik değil; sessizce geç.
  }
}

/** Basit, markaya uygun e-posta şablonu (siyah/neon). */
export function emailLayout(title: string, body: string): string {
  return `<div style="background:#050505;color:#fff;font-family:Arial,sans-serif;padding:32px">
    <div style="max-width:520px;margin:0 auto;border:1px solid #222;background:#0c0c0c;padding:32px">
      <div style="font-size:20px;letter-spacing:3px;text-transform:uppercase;color:#fff">YİĞİT YETİŞKEN</div>
      <div style="height:2px;width:40px;background:#CCFF00;margin:16px 0"></div>
      <h1 style="font-size:24px;color:#fff;margin:0 0 16px">${title}</h1>
      <div style="font-size:14px;line-height:1.6;color:#cfcfcf">${body}</div>
      <p style="font-size:12px;color:#8a8a8a;margin-top:32px">Yiğit Yetişken · Fitness & Kişisel Antrenör</p>
    </div>
  </div>`;
}
