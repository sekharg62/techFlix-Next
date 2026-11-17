import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Check, ShieldCheck, Clock } from "lucide-react";
import { getProductBySlug, getProductSlugsForPrerender, getRelatedProducts } from "@/lib/data";
import { formatBDT, isAvailable, startingPlan } from "@/lib/format";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { ProductSection } from "@/components/ProductSection";
import { FitImage } from "@/components/product/FitImage";
import { PlanRibbon } from "@/components/product/PlanRibbon";

type Params = Promise<{ productslug: string }>;

// ISR: prerender popular products at build, render others on first visit, refresh every 30 min
export const revalidate = 1800;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    return (await getProductSlugsForPrerender(50)).map((productslug) => ({ productslug }));
  } catch {
    return []; // backend unavailable at build time → render on demand
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { productslug } = await params;
  const product = await getProductBySlug(productslug);
  if (!product) return { title: "Product not found | TECH FLIX" };

  const from = startingPlan(product);
  const description = `${product.smallDesc}${from ? ` From ${formatBDT(from.price)}.` : ""} Pay with bKash, Nagad or Rocket.`;
  return {
    title: `${product.name} | TECH FLIX`,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { title: product.name, description, images: [{ url: product.imgUrl }] },
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { productslug } = await params;
  const product = await getProductBySlug(productslug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const available = isAvailable(product);
  const features = Array.isArray(product.features) ? product.features.filter((f) => typeof f === "string") : [];

  // Structured data for rich search results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.smallDesc,
    image: product.imgUrl,
    category: product.category?.name,
    offers: product.plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: plan.price,
      priceCurrency: "BDT",
      availability: product.stock && plan.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    })),
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-500 mb-8 overflow-x-auto pb-1">
        <Link href="/" className="hover:text-[var(--color-brand-red)] transition-colors whitespace-nowrap">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
        {product.category ? (
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:text-[var(--color-brand-red)] transition-colors whitespace-nowrap"
          >
            {product.category.name}
          </Link>
        ) : (
          <Link href="/products" className="hover:text-[var(--color-brand-red)] transition-colors whitespace-nowrap">
            Products
          </Link>
        )}
        <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
        <span aria-current="page" className="text-neutral-900 dark:text-neutral-100 font-bold truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Mobile order: image → plans → features. Desktop: image + features left, plans right. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[auto_1fr] gap-x-14 gap-y-8 lg:items-start">
        <div className="lg:col-start-1 lg:row-start-1">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-950 border border-[var(--color-brand-red)]/25 shadow-[0_20px_70px_-12px_rgba(229,9,20,0.16),0_0_110px_14px_rgba(229,9,20,0.08),0_0_180px_44px_rgba(229,9,20,0.05)]">
            <FitImage src={product.imgUrl} alt={product.name} priority sizes="(max-width: 1024px) 100vw, 50vw" />
            <PlanRibbon count={product.plans.length} size="lg" />
            {!available && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <span className="px-6 py-2.5 rounded-md bg-red-600 text-white font-black text-lg tracking-wider shadow-2xl">
                  OUT OF STOCK
                </span>
              </div>
            )}
          </div>
        </div>

        {features.length > 0 && (
          <div className="order-last lg:order-none lg:col-start-1 lg:row-start-2">
            <div className="p-5 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)]">
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-500 mb-3">What you get</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm font-medium">
                    <Check className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="space-y-6 lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <div className="space-y-3">
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="inline-block px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-[var(--color-brand-red)]"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
              {product.name}
            </h1>
            <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">{product.smallDesc}</p>
          </div>

          <PurchasePanel product={product} />

          <div className="grid grid-cols-2 gap-3 pt-4 text-xs font-semibold text-neutral-500 border-t border-[var(--card-border)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% genuine subscription</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Delivered after payment check</span>
            </div>
          </div>

          {product.longDesc && (
            <div className="pt-2">
              <h2 className="text-lg font-black mb-2">About {product.name}</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">{product.longDesc}</p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <ProductSection
          badgeText="MORE LIKE THIS"
          title={`More in ${product.category?.name ?? "this category"}`}
          products={related}
          flush
          viewAllLink={product.category ? `/products?category=${product.category.slug}` : "/products"}
        />
      )}
    </main>
  );
}
