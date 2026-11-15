"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import type { Plan, Product } from "@/types/catalog";
import { useCart, MAX_QUANTITY } from "@/context/CartContext";
import { buyablePlans, formatBDT } from "@/lib/format";

/** Plan picker, quantity and cart actions — the only client-side part of the product page. */
export function PurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const plans = buyablePlans(product);
  const isBuyable = (plan: Plan) => plans.some((p) => p.id === plan.id);
  const cheapest = (list: Plan[]) => list.reduce<Plan | undefined>((min, p) => (!min || p.price < min.price ? p : min), undefined);

  // Each variant (Mobile, Premium 4K…) is shown as its own section with its plan list,
  // followed by any plans without a variant.
  const sortByOrder = (a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder;
  const variantGroups = [...(product.variants ?? [])]
    .filter((v) => v.plans.length > 0)
    .sort(sortByOrder)
    .map((v) => ({ id: v.id, name: v.name, description: v.description, plans: [...v.plans].sort(sortByOrder) }));
  const simplePlans = product.plans.filter((p) => !p.variantId).sort(sortByOrder);
  const hasVariants = variantGroups.length > 0;
  const groups = hasVariants
    ? [...variantGroups, ...(simplePlans.length ? [{ id: "__simple", name: "Other plans", description: null, plans: simplePlans }] : [])]
    : [{ id: "__simple", name: "", description: null, plans: [...product.plans].sort(sortByOrder) }];

  // Default: cheapest buyable plan of the first variant that has stock.
  const initialGroup = groups.find((g) => g.plans.some(isBuyable)) ?? groups[0];
  const [planId, setPlanId] = useState(cheapest(initialGroup?.plans.filter(isBuyable) ?? [])?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = plans.find((p) => p.id === planId);
  const selectedGroup = groups.find((g) => g.plans.some((p) => p.id === planId));
  const selectedVariant = hasVariants && selectedGroup?.id !== "__simple" ? selectedGroup : undefined;

  const add = () => {
    if (!selected) return false;
    addItem(
      {
        productId: product.id,
        planId: selected.id,
        slug: product.slug,
        name: product.name,
        imgUrl: product.imgUrl,
        categoryName: product.category?.name ?? null,
        // Display label only — the server re-prices by planId and stores the variant itself.
        planName: selectedVariant ? `${selectedVariant.name} · ${selected.name}` : selected.name,
        planValidity: selected.validity,
        unitPrice: selected.price,
      },
      quantity
    );
    return true;
  };

  if (plans.length === 0) {
    return (
      <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-[var(--card-border)] space-y-3">
        <p className="font-extrabold">Currently unavailable</p>
        <p className="text-sm text-neutral-500">This product is out of stock. Contact support to be notified when it is back.</p>
        <Link href="/support" className="inline-block px-5 py-2.5 rounded-full bg-[var(--color-brand-red)] text-white font-bold text-sm">
          Contact support
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
          {hasVariants ? "Choose your plan" : "Choose a plan"}
        </legend>
        <div className={hasVariants ? "space-y-5" : ""} role="radiogroup">
          {groups.map((g) => {
            const from = cheapest(g.plans.filter(isBuyable));
            const groupActive = selectedGroup?.id === g.id;
            return (
              <section
                key={g.id}
                aria-label={g.name || undefined}
                className={
                  hasVariants
                    ? `p-3 sm:p-4 rounded-2xl border transition-colors ${
                        groupActive ? "border-[var(--color-brand-red)]/50 bg-red-50/40 dark:bg-red-950/10" : "border-[var(--card-border)]"
                      }`
                    : ""
                }
              >
                {hasVariants && (
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-black text-base leading-tight">{g.name}</h3>
                      {g.description && <p className="text-xs text-neutral-500 mt-0.5">{g.description}</p>}
                    </div>
                    <span className="shrink-0 text-[11px] font-bold px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      {from ? `From ${formatBDT(from.price)}` : "Out of stock"}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {g.plans.map((plan) => {
                    const buyable = isBuyable(plan);
                    const isSelected = plan.id === planId;
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${g.name ? `${g.name} · ` : ""}${plan.name}, ${formatBDT(plan.price)}`}
                        disabled={!buyable}
                        onClick={() => setPlanId(plan.id)}
                        className={`relative text-left p-4 rounded-2xl border-2 transition-all ${
                          isSelected
                            ? "border-[var(--color-brand-red)] bg-red-50 dark:bg-red-950/30 shadow-lg"
                            : "border-[var(--card-border)] bg-[var(--card-bg)] hover:border-neutral-400"
                        } ${buyable ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                      >
                        {isSelected && (
                          <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--color-brand-red)] text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <div className="font-extrabold">{plan.name}</div>
                        <div className="text-xs text-neutral-500">{buyable ? plan.validity || "Digital delivery" : "Out of stock"}</div>
                        <div className="text-xl font-black text-[var(--color-brand-red)] mt-1">{formatBDT(plan.price)}</div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </fieldset>

      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Quantity</span>
          <div className="inline-flex items-center rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-extrabold" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
              disabled={quantity >= MAX_QUANTITY}
              className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-neutral-500 block">
            {selected ? `${selectedVariant ? `${selectedVariant.name} · ` : ""}${selected.name} · ` : ""}Total
          </span>
          <span className="text-3xl font-black text-[var(--color-brand-red)]">{formatBDT((selected?.price ?? 0) * quantity)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => {
            if (add()) {
              setAdded(true);
              setTimeout(() => setAdded(false), 2500);
            }
          }}
          className="py-4 px-6 rounded-2xl border-2 border-[var(--color-brand-red)] text-[var(--color-brand-red)] hover:bg-[var(--color-brand-red)] hover:text-white font-extrabold transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          {added ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
          {added ? "Added to cart" : "Add to cart"}
        </button>
        <button
          type="button"
          onClick={() => add() && router.push("/checkout")}
          className="py-4 px-6 rounded-2xl bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-extrabold transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95"
        >
          <Zap className="w-5 h-5 fill-white" />
          Buy now
        </button>
      </div>
      <div role="status" aria-live="polite" className="sr-only">
        {added ? `${product.name} added to cart` : ""}
      </div>
      {added && (
        <Link href="/cart" className="block text-center text-sm font-bold text-[var(--color-brand-red)] hover:underline">
          View cart →
        </Link>
      )}
    </div>
  );
}
