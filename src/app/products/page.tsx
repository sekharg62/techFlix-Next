"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { ALL_PRODUCTS, CATEGORIES } from "@/constants/productsData";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.category.toLowerCase().replace(/\s+/g, "-").includes(selectedCategory) ||
        (selectedCategory === "vpn-security" && product.category === "VPN & Security") ||
        (selectedCategory === "ai-tools" && product.category === "AI Tools") ||
        (selectedCategory === "video-editing" && product.category === "Video Editing") ||
        (selectedCategory === "design-tools" && product.category === "Design Tools") ||
        (selectedCategory === "writing-tools" && product.category === "Writing Tools") ||
        (selectedCategory === "streaming" && product.category === "Streaming") ||
        (selectedCategory === "microsoft" && product.category === "Microsoft");

      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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
            Explore All Tech & Software Tools
          </h1>
          <p className="text-neutral-500 text-sm sm:text-base">
            Browse verified licenses, subscriptions, and AI productivity suites.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search tools, VPN, AI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand-red)] transition-colors"
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === "all"
              ? "bg-[var(--color-brand-red)] text-white shadow-md"
              : "bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          All Products ({ALL_PRODUCTS.length})
        </button>

        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[var(--color-brand-red)] text-white shadow-md"
                  : "bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Grid Listing */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const productHref = `/product/${product.slug}`;
            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--color-brand-red)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image */}
                <Link href={productHref} className="relative w-full h-48 shrink-0 bg-neutral-900 overflow-hidden block">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {product.badge && (
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[var(--color-brand-red)] text-white shadow-md z-10">
                      {product.badge}
                    </div>
                  )}

                  {!product.inStock && (
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-neutral-900/90 text-red-400 border border-red-500/50 shadow-md z-10">
                      Out of Stock
                    </div>
                  )}
                </Link>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold">{product.rating.toFixed(1)}</span>
                      </div>

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

                    <Link href={productHref} className="block">
                      <h3 className="font-extrabold text-lg leading-snug group-hover:text-[var(--color-brand-red)] transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Small category text below product name */}
                    <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {product.category}
                    </div>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--card-border)] flex flex-col gap-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-neutral-400 line-through">
                        {product.originalPriceBDT || product.originalPrice}
                      </span>
                      <span className="text-xl font-black text-[var(--color-brand-red)]">
                        {product.priceBDT || product.price}
                      </span>
                    </div>

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
      ) : (
        <div className="text-center py-20 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8">
          <p className="text-lg font-bold text-neutral-500">No products found matching your filter criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-4 px-6 py-2.5 rounded-full bg-[var(--color-brand-red)] text-white font-bold text-sm"
          >
            Reset Filters
          </button>
        </div>
      )}
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
