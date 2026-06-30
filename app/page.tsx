import { Hero } from "@/components/home/Hero";
import { StatsBar } from "@/components/home/StatsBar";
import { Marquee } from "@/components/Marquee";
import { PackagesPreview } from "@/components/home/PackagesPreview";
import { Transformations } from "@/components/home/Transformations";
import { Testimonials } from "@/components/home/Testimonials";
import { Faq } from "@/components/home/Faq";
import { ClosingCta } from "@/components/home/ClosingCta";
import { JsonLd } from "@/components/JsonLd";
import {
  getPackages,
  getTestimonials,
  getTransformations,
  getFaqs,
} from "@/lib/data/content";

export default async function HomePage() {
  const [packages, testimonials, transformations, faqs] = await Promise.all([
    getPackages(),
    getTestimonials(),
    getTransformations(),
    getFaqs(),
  ]);

  return (
    <>
      <JsonLd />
      <Hero />
      <StatsBar />
      <Marquee />
      <PackagesPreview packages={packages} />
      {transformations.length > 0 && <Transformations items={transformations} />}
      {testimonials.length > 0 && <Testimonials items={testimonials} />}
      <Faq faqs={faqs} />
      <ClosingCta />
    </>
  );
}
