import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { getCategories, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { ProductsToolbar } from "@/components/products/ProductsToolbar";
import type { ProductListQuery } from "@/types/catalog";

const PAGE_SIZE = 12;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || "";

const SORTS: Record<string, Pick<ProductListQuery, "sortBy" | "sortOrder">> = {
  newest: { sortBy: "createdAt", sortOrder: "desc" },
  oldest: { sortBy: "createdAt", sortOrder: "asc" },
  "name-asc": { sortBy: "name", sortOrder: "asc" },
  "name-desc": { sortBy: "name", sortOrder: "desc" },
};

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const params = await searchParams;
  const categorySlug = one(params.category);
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);
  const title = category ? `${category.name} subscriptions` : "All products";
  return {
    title: `${title} | TechFlix`,
    description: category
      ? `Buy ${category.name} subscriptions and licenses in Bangladesh. Pay with bKash, Nagad or Rocket.`
      : "Browse premium subscriptions, AI tools, streaming passes and software licenses.",
    alternates: { canonical: category ? `/products?category=${category.slug}` : "/products" },
  };
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const categorySlug = one(params.category);
  const search = one(params.q).trim();
  const sort = SORTS[one(params.sort)] ? one(params.sort) : "newest";
  const page = Math.max(1, Number(one(params.page)) || 1);

  const [categories, { products, pagination }] = await Promise.all([
    getCategories(),
    getProducts({ page, limit: PAGE_SIZE, category: categorySlug || undefined, search: search || undefined, ...SORTS[sort] }),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const allCount = categories.reduce((sum, c) => sum + c.totalProducts, 0);

  const hrefWith = (changes: Record<string, string | number | null>) => {
    const next = new URLSearchParams();
    if (categorySlug) next.set("category", categorySlug);
    if (search) next.set("q", search);
    if (sort !== "newest") next.set("sort", sort);
    Object.entries(changes).forEach(([k, v]) => (v === null || v === "" ? next.delete(k) : next.set(k, String(v))));
    const qs = next.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-[var(--color-brand-red)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-[var(--card-border)]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            {activeCategory ? activeCategory.name : "Explore All Products"}
          </h1>
          <p className="text-neutral-500 text-sm sm:text-base">
            {search
              ? `${pagination.total} result${pagination.total === 1 ? "" : "s"} for “${search}”`
              : `${pagination.total} product${pagination.total === 1 ? "" : "s"} · verified subscriptions and licenses`}
          </p>
        </div>
        <ProductsToolbar initialSearch={search} sort={sort} />
      </div>

      {/* Category filter: plain links, so each category is a cacheable, shareable URL */}
      <nav aria-label="Categories" className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
        <CategoryPill href={hrefWith({ category: null, page: null })} active={!categorySlug} label={`All (${allCount})`} />
        {categories.map((cat) => (
          <CategoryPill
            key={cat.slug}
            href={hrefWith({ category: cat.slug, page: null })}
            active={cat.slug === categorySlug}
            label={`${cat.name} (${cat.totalProducts})`}
          />
        ))}
      </nav>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 4}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-10">
              <PageLink href={hrefWith({ page: page - 1 > 1 ? page - 1 : null })} disabled={!pagination.hasPrevPage} label="Previous">
                <ChevronLeft className="w-4 h-4" />
              </PageLink>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                .map((p, i, arr) => (
                  <span key={p} className="flex items-center gap-2">
                    {i > 0 && p - arr[i - 1] > 1 && <span className="text-neutral-400">…</span>}
                    <Link
                      href={hrefWith({ page: p > 1 ? p : null })}
                      aria-current={p === page ? "page" : undefined}
                      className={`min-w-10 h-10 px-3 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        p === page
                          ? "bg-[var(--color-brand-red)] text-white"
                          : "bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--color-brand-red)]"
                      }`}
                    >
                      {p}
                    </Link>
                  </span>
                ))}
              <PageLink href={hrefWith({ page: page + 1 })} disabled={!pagination.hasNextPage} label="Next">
                <ChevronRight className="w-4 h-4" />
              </PageLink>
            </nav>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8">
          <SearchX className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
          <p className="text-lg font-bold">No products found</p>
          <p className="text-sm text-neutral-500 mt-1">Try a different search or category.</p>
          <Link
            href="/products"
            className="inline-block mt-5 px-6 py-2.5 rounded-full bg-[var(--color-brand-red)] text-white font-bold text-sm"
          >
            Reset filters
          </Link>
        </div>
      )}
    </main>
  );
}

function CategoryPill({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
        active
          ? "bg-[var(--color-brand-red)] text-white shadow-md"
          : "bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-neutral-100 dark:hover:bg-neutral-800"
      }`}
    >
      {label}
    </Link>
  );
}

function PageLink({ href, disabled, label, children }: { href: string; disabled: boolean; label: string; children: React.ReactNode }) {
  const cls = "w-10 h-10 rounded-full flex items-center justify-center border border-[var(--card-border)]";
  if (disabled) {
    return (
      <span aria-disabled className={`${cls} opacity-40`} aria-label={label}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} aria-label={label} className={`${cls} bg-[var(--card-bg)] hover:border-[var(--color-brand-red)]`}>
      {children}
    </Link>
  );
}
