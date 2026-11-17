import { ProductCardSkeleton } from "@/components/ProductCard";

export default function Loading() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10" aria-busy="true">
      <div className="h-4 w-28 rounded bg-neutral-200 dark:bg-neutral-800 mb-6 animate-pulse" />
      <div className="mb-8 pb-6 border-b border-[var(--card-border)] space-y-3 animate-pulse">
        <div className="h-9 w-72 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-56 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="flex gap-2 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
