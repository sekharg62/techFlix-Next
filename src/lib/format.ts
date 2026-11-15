import type { Plan, Product } from "@/types/catalog";

const bdt = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 2 });

export const formatBDT = (value: number | null | undefined) => `৳${bdt.format(Number(value || 0))}`;

/** Plans the customer can buy right now, in display order. */
export const buyablePlans = (product: Product): Plan[] =>
  product.stock ? product.plans.filter((p) => p.inStock).sort((a, b) => a.sortOrder - b.sortOrder) : [];

/** Cheapest buyable plan (falls back to any plan for out-of-stock products). */
export const startingPlan = (product: Product): Plan | null => {
  const plans = buyablePlans(product).length ? buyablePlans(product) : product.plans;
  if (!plans.length) return null;
  return plans.reduce((min, p) => (p.price < min.price ? p : min), plans[0]);
};

export const isAvailable = (product: Product) => buyablePlans(product).length > 0;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
