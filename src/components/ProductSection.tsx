import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types/catalog";
import { ProductCard } from "@/components/ProductCard";

interface ProductSectionProps {
  badgeText?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
  /** Eager-load images (use for the first section on the page). */
  priority?: boolean;
}

export function ProductSection({ badgeText, title, subtitle, products, viewAllLink = "/products", priority }: ProductSectionProps) {
  if (products.length === 0) return null;
  const displayProducts = products.slice(0, 5);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-[var(--card-border)]">
        <div>
          {badgeText && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/60 text-[var(--color-brand-red)] mb-2">
              <span className="uppercase tracking-wider">{badgeText}</span>
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
        </div>

        <Link
          href={viewAllLink}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 hover:bg-[var(--color-brand-red)] hover:text-white font-bold text-sm transition-all duration-200 shadow-sm self-start sm:self-auto group"
        >
          <span>View all</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {displayProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={priority && index < 2} />
        ))}
      </div>
    </section>
  );
}
