import type { Metadata } from "next";
import { Saira_Condensed, Inter } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { Analytics } from "@/components/Analytics";

const display = Saira_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Yiğit Yetişken — Fitness & Kişisel Antrenör",
    template: "%s",
  },
  description:
    "15 yıllık saha deneyimiyle fitness ve kişisel antrenörlük. Online ve birebir koçluk; disiplin, performans, ölçülebilir dönüşüm.",
  keywords: [
    "kişisel antrenör",
    "fitness koçu",
    "online koçluk",
    "personal trainer",
    "Yiğit Yetişken",
    "Kütahya fitness",
    "online fitness antrenörü",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "Yiğit Yetişken",
    title: "Yiğit Yetişken — Fitness & Kişisel Antrenör",
    description:
      "Online ve birebir koçluk; disiplin, performans, ölçülebilir dönüşüm.",
    images: [{ url: "/portrait.png", width: 800, height: 1000, alt: "Yiğit Yetişken" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yiğit Yetişken — Fitness & Kişisel Antrenör",
    description:
      "Online ve birebir koçluk; disiplin, performans, ölçülebilir dönüşüm.",
    images: ["/portrait.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${display.variable} ${sans.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
