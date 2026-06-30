import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const routes = [
    { path: "", priority: 1 },
    { path: "/hakkimda", priority: 0.8 },
    { path: "/uyelik", priority: 0.9 },
    { path: "/yasal/mesafeli-satis", priority: 0.3 },
    { path: "/yasal/kvkk", priority: 0.3 },
    { path: "/yasal/iptal-iade", priority: 0.3 },
  ];
  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: r.priority,
  }));
}
