import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegalPage } from "@/lib/data/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLegalPage(slug);
  return {
    title: page ? `${page.title} — Yiğit Yetişken` : "Yasal — Yiğit Yetişken",
    robots: { index: true, follow: true },
  };
}

export default async function LegalPageView({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getLegalPage(slug);
  if (!page) notFound();

  return (
    <section className="bg-ink pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="wrap max-w-3xl">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-accent" />
          <span className="label">Yasal</span>
        </div>
        <h1 className="h-display mt-6 text-4xl text-white md:text-6xl">{page.title}</h1>
        <div className="mt-10 whitespace-pre-wrap text-sm leading-relaxed text-white/75">
          {page.content?.trim() || "İçerik yakında eklenecek."}
        </div>
        {page.updated_at && (
          <p className="mt-12 border-t border-line pt-6 text-xs text-muted">
            Son güncelleme: {new Date(page.updated_at).toLocaleDateString("tr-TR")}
          </p>
        )}
      </div>
    </section>
  );
}
