"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { Product } from "@/constants/productsData";

interface ProductSectionProps {
  badgeEmoji?: string;
  badgeText?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
}

export function ProductSection({
  badgeEmoji = "🔥",
  badgeText = "POPULAR",
  title,
  subtitle,
  products,
  viewAllLink = "/products",
}: ProductSectionProps) {
  const displayProducts = products.slice(0, 5);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-10">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-[var(--card-border)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/60 text-[var(--color-brand-red)] mb-2">
            <span>{badgeEmoji}</span>
            <span className="uppercase tracking-wider">{badgeText}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
          )}
        </div>

        <Link
          href={viewAllLink}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 hover:bg-[var(--color-brand-red)] hover:text-white font-bold text-sm transition-all duration-200 shadow-sm self-start sm:self-auto group"
        >
          <span>View all</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {displayProducts.map((product) => {
          const productHref = `/product/${product.slug}`;
          return (
            <div
              key={product.id}
              className="group relative flex flex-col justify-between bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--color-brand-red)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Top Image Container */}
              <Link href={productHref} className="block relative w-full h-44 shrink-0 overflow-hidden bg-neutral-900">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                />

                {/* Top Badges */}
                {product.badge && (
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[var(--color-brand-red)] text-white shadow-md z-10">
                    {product.badge}
                  </div>
                )}

                {/* Out of Stock Image Badge Overlay */}
                {!product.inStock && (
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-neutral-900/90 text-red-400 border border-red-500/50 shadow-md z-10">
                    Out of Stock
                  </div>
                )}
              </Link>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  {/* Rating & Stock Status Row */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Stock Status Indicator Text */}
                    {product.inStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        In stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Out of stock
                      </span>
                    )}
                  </div>

                  {/* Product Name */}
                  <Link href={productHref} className="block">
                    <h3 className="font-extrabold text-base leading-snug line-clamp-1 text-neutral-900 dark:text-neutral-100 group-hover:text-[var(--color-brand-red)] transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Category Small Text Below Product Name */}
                  <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {product.category}
                  </div>

                  {/* Tagline */}
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                    {product.tagline}
                  </p>
                </div>

                {/* Price & Action Button */}
                <div className="pt-3 border-t border-[var(--card-border)] flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-neutral-400 line-through">
                      {product.originalPriceBDT || product.originalPrice}
                    </span>
                    <span className="text-lg font-black text-[var(--color-brand-red)]">
                      {product.priceBDT || product.price}
                    </span>
                  </div>

                  {/* View Plan or Unavailable Button */}
                  {product.inStock ? (
                    <Link
                      href={productHref}
                      className="w-full py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl bg-[var(--color-brand-red)] text-white text-center font-black text-sm sm:text-base hover:bg-red-700 transition-all shadow-lg hover:shadow-red-900/40 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer"
                    >
                      <span>View plan</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 text-center font-extrabold text-sm sm:text-base cursor-not-allowed"
                    >
                      Unavailable
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
