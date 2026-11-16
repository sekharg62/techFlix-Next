import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryBar } from "@/components/CategoryBar";
import { TrustBadges } from "@/components/TrustBadges";
import { ProductSection } from "@/components/ProductSection";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { FaqSection } from "@/components/FaqSection";
import { getCategories, getHeroSlides, getHomeSections, getProducts, getReviews } from "@/lib/data";

// Static page, refreshed in the background at most every 30 min
// (admin changes revalidate it immediately via /api/revalidate).
export const revalidate = 1800;

export default async function Home() {
  // All requests run in parallel and are served from the Data Cache
  const [slides, categories, sections, reviews] = await Promise.all([
    getHeroSlides(),
    getCategories(),
    getHomeSections(),
    getReviews(),
  ]);

  // No sections configured yet → show the newest products so the page is never empty
  const fallback = sections.length === 0 ? (await getProducts({ limit: 10 })).products : [];

  return (
    <div className="w-full flex flex-col items-center justify-center pb-12">
      <HeroCarousel slides={slides} />
      <TrustBadges />
      <CategoryBar categories={categories} />

      {sections.map((section, index) => (
        <ProductSection
          key={section.id}
          badgeText={section.tag}
          title={section.title}
          subtitle={section.desc}
          products={section.products}
          viewAllLink="/products"
          priority={index === 0 && slides.length === 0}
        />
      ))}

      {fallback.length > 0 && (
        <ProductSection badgeText="NEW" title="Latest Products" products={fallback} viewAllLink="/products" />
      )}

      <WhyChooseUsSection />
      <ReviewsSection reviews={reviews} />
      <FaqSection />
    </div>
  );
}
