import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";
import type { CategorySummary } from "@/types/catalog";
import { CategoryIcon } from "@/components/CategoryIcon";

/** Server-rendered category strip (data passed from the cached page fetch). */
export function CategoryBar({ categories: all }: { categories: CategorySummary[] }) {
  // Empty categories would only lead to an empty page, so they are left out.
  const categories = all.filter((c) => c.totalProducts > 0);
  if (categories.length === 0) return null;
  // 3 desktop columns keep rows even for small sets (3, 6, 9); otherwise 4.
  const desktopCols = categories.length % 3 === 0 && categories.length % 4 !== 0 ? "lg:grid-cols-3" : "lg:grid-cols-4";

  return (
    <section className="w-full max-w-site mx-auto px-4 sm:px-6 my-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--color-brand-red)]" />
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">Browse by Category</h2>
        </div>
        <Link
          href="/products"
          className="text-xs sm:text-sm font-bold text-[var(--color-brand-red)] hover:underline flex items-center gap-1"
        >
          Explore All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className={`grid grid-cols-2 sm:grid-cols-3 ${desktopCols} gap-3 sm:gap-4`}>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${encodeURIComponent(category.slug)}`}
            className="group flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--color-brand-red)] hover:shadow-lg transition-all duration-200 min-w-0"
          >
            <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-md bg-neutral-100 dark:bg-neutral-800/80 group-hover:bg-red-50 dark:group-hover:bg-red-950/40 flex items-center justify-center transition-colors">
              <CategoryIcon slug={category.slug} name={category.name} className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm sm:text-base font-bold tracking-tight leading-snug line-clamp-2 break-words group-hover:text-[var(--color-brand-red)] transition-colors">
                {category.name}
              </span>
              <span className="text-xs text-neutral-500 font-medium">
                {category.totalProducts} {category.totalProducts === 1 ? "product" : "products"}
              </span>
            </div>
            <ChevronRight className="hidden sm:block w-4 h-4 shrink-0 text-neutral-400 group-hover:text-[var(--color-brand-red)] group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </section>
  );
}
