import "server-only";
import { cache } from "react";
import { apiGet, apiGetBody, ApiError, toQuery } from "@/lib/api/server";
import { CACHE_TAGS, REVALIDATE } from "@/lib/api/tags";
import type {
  CategorySummary,
  HeroSlide,
  HomeSection,
  Pagination,
  PaymentMethod,
  Product,
  ProductListQuery,
  Review,
} from "@/types/catalog";

/**
 * Storefront data layer. Every function hits the public backend API through the
 * Next.js Data Cache (time-based + tag-based revalidation), so pages stay fast and
 * the backend only sees a request when the cache refreshes.
 */

/** Log and fall back instead of crashing a whole page when an optional block fails. */
async function withFallback<T>(label: string, promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (err) {
    console.error(`[data] ${label} failed:`, (err as Error).message);
    return fallback;
  }
}

export const getCategories = cache(() =>
  withFallback(
    "categories",
    apiGet<CategorySummary[]>("/api/categories/summary", {
      revalidate: REVALIDATE.categories,
      tags: [CACHE_TAGS.categories],
    }),
    []
  )
);

export const getHeroSlides = cache(async () => {
  const slides = await withFallback(
    "hero slides",
    apiGet<HeroSlide[]>("/api/hero-slides", {
      revalidate: REVALIDATE.heroSlides,
      tags: [CACHE_TAGS.heroSlides],
    }),
    []
  );
  return [...slides].sort((a, b) => a.order - b.order);
});

export const getHomeSections = cache(() =>
  withFallback(
    "home sections",
    apiGet<HomeSection[]>("/api/home-sections/public", {
      revalidate: REVALIDATE.homeSections,
      tags: [CACHE_TAGS.homeSections, CACHE_TAGS.products],
    }),
    []
  )
);

export const getReviews = cache(() =>
  withFallback(
    "reviews",
    apiGet<Review[]>("/api/reviews/public", {
      revalidate: REVALIDATE.reviews,
      tags: [CACHE_TAGS.reviews],
    }),
    []
  )
);

export const getPaymentMethods = cache(() =>
  withFallback(
    "payment methods",
    apiGet<PaymentMethod[]>("/api/payment-methods/public", {
      revalidate: REVALIDATE.paymentMethods,
      tags: [CACHE_TAGS.paymentMethods],
    }),
    []
  )
);

export interface ProductPage {
  products: Product[];
  pagination: Pagination;
}

const EMPTY_PAGE: ProductPage = {
  products: [],
  pagination: { total: 0, page: 1, limit: 12, totalPages: 0, hasNextPage: false, hasPrevPage: false },
};

/** Paginated product listing; category is a category slug. */
export const getProducts = cache(async (query: ProductListQuery = {}): Promise<ProductPage> => {
  const path = `/api/products/public${toQuery({
    page: query.page,
    limit: query.limit ?? 12,
    category: query.category,
    search: query.search,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  })}`;

  return withFallback(
    "products",
    apiGetBody<{ data: Product[]; pagination: Pagination }>(path, {
      revalidate: REVALIDATE.products,
      tags: [CACHE_TAGS.products],
    }).then((body) => ({ products: body.data, pagination: body.pagination })),
    EMPTY_PAGE
  );
});

/** Single product by slug, or null when it doesn't exist. Other errors propagate to error.tsx. */
export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  try {
    return await apiGet<Product>(`/api/products/public/product/${encodeURIComponent(slug)}`, {
      revalidate: REVALIDATE.product,
      tags: [CACHE_TAGS.products, CACHE_TAGS.product(slug)],
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
});

/** Other products from the same category, for the "You may also like" row. */
export const getRelatedProducts = cache(async (product: Product, limit = 4) => {
  if (!product.category) return [];
  const { products } = await getProducts({ category: product.category.slug, limit: limit + 1 });
  return products.filter((p) => p.id !== product.id).slice(0, limit);
});

/** Slugs to prerender at build time (most recent products). */
export async function getProductSlugsForPrerender(limit = 50): Promise<string[]> {
  const { products } = await getProducts({ limit, sortBy: "createdAt", sortOrder: "desc" });
  return products.map((p) => p.slug);
}
