import { Hero } from "@/components/home/Hero";
import { ComparisonSection } from "@/components/home/ComparisonSection";
import { GallerySection } from "@/components/home/GallerySection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { PricingSection } from "@/components/home/PricingSection";
import { FaqSection } from "@/components/home/FaqSection";
import { ClosingCta } from "@/components/home/ClosingCta";
import { buildStructuredData, serializeStructuredData } from "@/lib/structured-data";

export default function HomePage() {
  const structuredData = buildStructuredData();
  return (
    <main id="main-content" className="content-main" tabIndex={-1}>
      {structuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(structuredData) }} />}
      <Hero />
      <ComparisonSection />
      <GallerySection />
      <ProcessSection />
      <ReviewsSection />
      <PricingSection />
      <FaqSection />
      <ClosingCta />
    </main>
  );
}
