"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";

/** Debounced search + sort that update the URL; the server page re-renders from cached data. */
export function ProductsToolbar({ initialSearch, sort }: { initialSearch: string; sort: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialSearch);
  // Last search we pushed to the URL, so its echo back as `initialSearch` doesn't overwrite newer typing
  const [pushed, setPushed] = useState(initialSearch);
  const [syncedFrom, setSyncedFrom] = useState(initialSearch);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Mobile nav links to /products?focus=search
  useEffect(() => {
    if (searchParams.get("focus") === "search") inputRef.current?.focus();
  }, [searchParams]);

  // URL changed by something other than our own typing (back/forward, links) → show it
  if (initialSearch !== syncedFrom) {
    setSyncedFrom(initialSearch);
    if (initialSearch !== pushed) {
      setValue(initialSearch);
      setPushed(initialSearch);
    }
  }

  const push = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("page");
    next.delete("focus");
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  // Debounce typing
  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed === initialSearch) return;
    const timer = setTimeout(() => {
      setPushed(trimmed);
      push({ q: trimmed || null });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          ref={inputRef}
          type="search"
          placeholder="Search Netflix, VPN, AI…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Search products"
          className="w-full pl-10 pr-10 py-2.5 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand-red)] transition-colors [&::-webkit-search-cancel-button]:hidden"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {pending ? (
            <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
          ) : value ? (
            <button type="button" onClick={() => setValue("")} aria-label="Clear search" className="text-neutral-400 hover:text-neutral-600">
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </span>
      </div>
      <select
        value={sort}
        onChange={(e) => push({ sort: e.target.value === "newest" ? null : e.target.value })}
        aria-label="Sort products"
        className="px-4 py-2.5 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-sm font-bold focus:outline-none focus:border-[var(--color-brand-red)] cursor-pointer"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="name-asc">Name A–Z</option>
        <option value="name-desc">Name Z–A</option>
      </select>
    </div>
  );
}
