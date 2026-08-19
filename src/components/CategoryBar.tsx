"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Bot, 
  Video, 
  Palette, 
  PenTool, 
  Shield, 
  Tv, 
  AppWindow, 
  Sparkles,
  ChevronRight,
  Code2,
  Layers
} from "lucide-react";
import { CATEGORIES } from "@/constants/productsData";
import { categoryService } from "@/services/categoryService";
import { CategorySummaryItem } from "@/types/category";

function getCategoryIcon(slug: string, name: string) {
  const key = `${slug} ${name}`.toLowerCase();
  
  if (key.includes("dev") || key.includes("code") || key.includes("program")) {
    return <Code2 className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />;
  }
  if (key.includes("design") || key.includes("creativ") || key.includes("art")) {
    return <Palette className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />;
  }
  if (key.includes("stream") || key.includes("ott") || key.includes("tv") || key.includes("movie")) {
    return <Tv className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />;
  }
  if (key.includes("ai") || key.includes("bot") || key.includes("gpt") || key.includes("intel")) {
    return <Bot className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />;
  }
  if (key.includes("video") || key.includes("film") || key.includes("edit")) {
    return <Video className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />;
  }
  if (key.includes("writ") || key.includes("pen") || key.includes("content") || key.includes("doc")) {
    return <PenTool className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />;
  }
  if (key.includes("vpn") || key.includes("sec") || key.includes("guard")) {
    return <Shield className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />;
  }
  if (key.includes("micro") || key.includes("app") || key.includes("soft") || key.includes("office")) {
    return <AppWindow className="w-5 h-5 text-sky-500 group-hover:scale-110 transition-transform" />;
  }
  return <Layers className="w-5 h-5 text-[var(--color-brand-red)] group-hover:scale-110 transition-transform" />;
}

export function CategoryBar() {
  const [categories, setCategories] = useState<CategorySummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      try {
        setIsLoading(true);
        const data = await categoryService.getCategoriesSummary();
        if (isMounted) {
          if (data && data.length > 0) {
            setCategories(data);
          } else {
            // Fallback to static CATEGORIES
            setCategories(
              CATEGORIES.map((c) => ({
                name: c.name,
                slug: c.slug,
                totalProducts: c.count,
              }))
            );
          }
        }
      } catch {
        if (isMounted) {
          setCategories(
            CATEGORIES.map((c) => ({
              name: c.name,
              slug: c.slug,
              totalProducts: c.count,
            }))
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--color-brand-red)]" />
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Browse by Category
          </h2>
        </div>
        <Link 
          href="/products" 
          className="text-xs sm:text-sm font-bold text-[var(--color-brand-red)] hover:underline flex items-center gap-1"
        >
          Explore All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Single Line Scrollable Bar (One line on both mobile and desktop) */}
      <div className="relative w-full overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 py-2">
        <div className="flex items-center gap-3 w-max min-w-full pb-2">
          {isLoading && categories.length === 0 ? (
            // Skeleton Loader Items
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] animate-pulse w-44 flex-shrink-0"
              >
                <div className="w-9 h-9 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
                  <div className="h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : (
            categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--color-brand-red)] hover:shadow-lg transition-all duration-200 cursor-pointer flex-shrink-0"
              >
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors">
                  {getCategoryIcon(category.slug, category.name)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-tight group-hover:text-[var(--color-brand-red)] transition-colors whitespace-nowrap">
                    {category.name}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    {category.totalProducts !== undefined ? `${category.totalProducts}+ items` : "Explore"}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
