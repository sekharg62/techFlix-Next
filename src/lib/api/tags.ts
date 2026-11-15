/**
 * Cache tags for on-demand revalidation. The backend calls POST /api/revalidate
 * with these tags after admin changes (see techFlix-backend storefrontRevalidate.middleware.ts).
 */
export const CACHE_TAGS = {
  products: "products",
  product: (slug: string) => `product:${slug}`,
  categories: "categories",
  heroSlides: "hero-slides",
  homeSections: "home-sections",
  reviews: "reviews",
  paymentMethods: "payment-methods",
} as const;

/** Tags the revalidate endpoint accepts (exact or with an allowed prefix). */
export const REVALIDATABLE_TAGS = new Set<string>([
  CACHE_TAGS.products,
  CACHE_TAGS.categories,
  CACHE_TAGS.heroSlides,
  CACHE_TAGS.homeSections,
  CACHE_TAGS.reviews,
  CACHE_TAGS.paymentMethods,
]);

/** How long cached data stays fresh before a background refresh (seconds). */
export const REVALIDATE = {
  products: 900, // 15 min
  product: 1800, // 30 min
  categories: 3600, // 1 h
  heroSlides: 3600, // 1 h
  homeSections: 1800, // 30 min
  reviews: 21600, // 6 h
  paymentMethods: 3600, // 1 h
} as const;
