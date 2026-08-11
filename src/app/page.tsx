import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryBar } from "@/components/CategoryBar";
import { ProductSection } from "@/components/ProductSection";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { FaqSection } from "@/components/FaqSection";
import { ALL_PRODUCTS } from "@/constants/productsData";

export default function Home() {
  // Filter product subsets for multiple reusable sections
  const popularProducts = ALL_PRODUCTS.filter((p) => p.popular || p.badge === "🔥 HOT");
  const aiAndVideoProducts = ALL_PRODUCTS.filter(
    (p) => p.category === "AI Tools" || p.category === "Video Editing"
  );
  const vpnAndSecurityProducts = ALL_PRODUCTS.filter(
    (p) => p.category === "VPN & Security" || p.category === "Writing Tools"
  );
  const microsoftProducts = ALL_PRODUCTS.filter(
    (p) => p.category === "Microsoft" || p.category === "Design Tools"
  );

  return (
    <div className="w-full flex flex-col items-center justify-center pb-12">
      
      {/* 1. Hero Carousel Section (4-5 Carousel Items, Mobile & Desktop Responsive) */}
      <HeroCarousel />

      {/* 2. Browse by Category Bar (One-line scrollable bar on Mobile & Desktop) */}
      <CategoryBar />

      {/* 3. Reusable Product Section 1: 🔥 POPULAR */}
      <ProductSection
        badgeEmoji="🔥"
        badgeText="POPULAR"
        title="Popular Products"
        subtitle="Our highest-rated software keys and premium subscriptions this month."
        products={popularProducts.length >= 4 ? popularProducts : ALL_PRODUCTS.slice(0, 5)}
        viewAllLink="/products"
      />

      {/* 4. Reusable Product Section 2: ⚡ TRENDING AI & VIDEO TOOLS */}
      <ProductSection
        badgeEmoji="⚡"
        badgeText="TRENDING"
        title="AI & Video Editing Tools"
        subtitle="Supercharge your workflow with cutting-edge artificial intelligence and rendering software."
        products={aiAndVideoProducts}
        viewAllLink="/products?category=ai-tools"
      />

      {/* 5. Reusable Product Section 3: 🛡️ SECURITY & PRIVACY */}
      <ProductSection
        badgeEmoji="🛡️"
        badgeText="SECURITY & PRIVACY"
        title="VPN & Security Essentials"
        subtitle="Protect your identity, bypass geo-restrictions, and encrypt your digital footprint."
        products={vpnAndSecurityProducts}
        viewAllLink="/products?category=vpn-security"
      />

      {/* 6. Reusable Product Section 4: 💻 MICROSOFT & DESIGN */}
      <ProductSection
        badgeEmoji="💻"
        badgeText="OFFICE & DESIGN"
        title="Microsoft & Design Tools"
        subtitle="Official Windows, Office 365, Canva, and Adobe Creative suites at discounted rates."
        products={microsoftProducts}
        viewAllLink="/products?category=microsoft"
      />

      {/* Additional Trust & Social Proof Sections */}
      <WhyChooseUsSection />
      <ReviewsSection />
      <FaqSection />
    </div>
  );
}
