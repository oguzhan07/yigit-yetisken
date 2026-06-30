import { brand } from "@/lib/content";

/** Yapısal veri (Schema.org) — yerel işletme + kişi. SEO için. */
export function JsonLd() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${base}/#business`,
    name: brand.name,
    description:
      "Fitness ve kişisel antrenörlük; online ve birebir koçluk. Disiplin, performans, ölçülebilir dönüşüm.",
    url: base,
    image: `${base}/portrait.png`,
    telephone: `+${brand.phoneIntl}`,
    priceRange: "₺₺",
    areaServed: ["Kütahya", "Türkiye"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kütahya",
      addressCountry: "TR",
    },
    founder: {
      "@type": "Person",
      name: brand.fullName,
      jobTitle: "Fitness & Kişisel Antrenör",
    },
    sameAs: [brand.instagramUrl],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
