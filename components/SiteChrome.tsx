"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

// Bu yolların kendi düzeni var; genel site çerçevesi (navbar/footer) gizlenir.
const BARE_PREFIXES = [
  "/giris",
  "/kayit",
  "/sifre-sifirla",
  "/sifre-yenile",
  "/panel",
  "/admin",
];

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const bare = BARE_PREFIXES.some((p) => pathname.startsWith(p));

  if (bare) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
