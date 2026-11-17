import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types/catalog";
import { formatBDT, isAvailable, startingPlan } from "@/lib/format";
import { FitImage } from "@/components/product/FitImage";
import { PlanRibbon } from "@/components/product/PlanRibbon";

interface ProductCardProps {
  product: Product;
  /** Eager-load the image for above-the-fold cards. */
  priority?: boolean;
  sizes?: string;
}

/** Server-rendered product card: no client JS needed. */
export function ProductCard({ product, priority, sizes }: ProductCardProps) {
  const href = `/product/${product.slug}`;
  const available = isAvailable(product);
  const from = startingPlan(product);
  const planCount = product.plans.length;

  return (
    <div className="group relative flex flex-col justify-between bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--color-brand-red)]/40 rounded-lg overflow-hidden shadow-sm hover:shadow-[0_18px_60px_-10px_rgba(229,9,20,0.18),0_0_90px_10px_rgba(229,9,20,0.10),0_0_160px_40px_rgba(229,9,20,0.06)] transition-all duration-300 transform hover:-translate-y-1">
      <Link href={href} className="block relative w-full aspect-square shrink-0 overflow-hidden bg-neutral-900">
        <FitImage
          src={product.imgUrl}
          alt={product.name}
          priority={priority}
          className="group-hover:scale-105 transition-transform duration-500"
          sizes={sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
        />
        <PlanRibbon count={planCount} />
        {!available && (
          <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-neutral-900/90 text-red-400 border border-red-500/50 shadow-md z-10">
            Out of Stock
          </div>
        )}
      </Link>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-red-500/10 via-red-500/[0.03] to-transparent"
      />

      <div className="relative p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center justify-between mb-1.5 gap-2">
            {product.category ? (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 hover:text-[var(--color-brand-red)] truncate"
              >
                {product.category.name}
              </Link>
            ) : (
              <span />
            )}
            {available ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                In stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Out of stock
              </span>
            )}
          </div>

          <Link href={href} className="block">
            <h3 className="font-extrabold text-base leading-snug line-clamp-1 text-neutral-900 dark:text-neutral-100 group-hover:text-[var(--color-brand-red)] transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">{product.smallDesc}</p>
        </div>

        <div className="pt-3 border-t border-[var(--card-border)] flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-neutral-400">{from ? (planCount > 1 ? "Starting from" : from.name) : ""}</span>
            <span className="text-lg font-black text-[var(--color-brand-red)]">{from ? formatBDT(from.price) : "—"}</span>
          </div>

          {available ? (
            <Link
              href={href}
              className="w-full py-3 px-4 rounded-md bg-[var(--color-brand-red)] text-white text-center font-black text-sm hover:bg-red-700 transition-all shadow-lg hover:shadow-red-900/40 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>View plans</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href={href}
              className="w-full py-3 px-4 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-500 text-center font-extrabold text-sm"
            >
              Unavailable — view details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-neutral-200 dark:bg-neutral-800" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-10 w-full rounded-md bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  );
}
