import type { Plan, Product } from "@/types/catalog";

const bdt = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 2 });

export const formatBDT = (value: number | null | undefined) => `৳${bdt.format(Number(value || 0))}`;

/** Plans the customer can buy right now, in display order. */
export const buyablePlans = (product: Product): Plan[] => {
  if (!product.stock) return [];
  const variantOut = new Set((product.variants ?? []).filter((v) => !v.inStock).map((v) => v.id));
  return product.plans
    .filter((p) => p.inStock && !(p.variantId && variantOut.has(p.variantId)))
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

/** "Mobile · 3 Months" for items bought from a variant, otherwise just the plan name. */
export const itemPlanLabel = (item: { variantName?: string | null; planName: string }) =>
  item.variantName ? `${item.variantName} · ${item.planName}` : item.planName;

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
