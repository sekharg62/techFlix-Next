"use client";

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
  ChevronRight
} from "lucide-react";
import { CATEGORIES } from "@/constants/productsData";

const categoryIconMap: Record<string, React.ReactNode> = {
  "ai-tools": <Bot className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />,
  "video-editing": <Video className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />,
  "design-tools": <Palette className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />,
  "writing-tools": <PenTool className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />,
  "vpn-security": <Shield className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />,
  "streaming": <Tv className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />,
  "microsoft": <AppWindow className="w-5 h-5 text-sky-500 group-hover:scale-110 transition-transform" />,
};

export function CategoryBar() {
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
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--color-brand-red)] hover:shadow-lg transition-all duration-200 cursor-pointer flex-shrink-0"
            >
              <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors">
                {categoryIconMap[category.slug]}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight group-hover:text-[var(--color-brand-red)] transition-colors whitespace-nowrap">
                  {category.name}
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  {category.count}+ items
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
