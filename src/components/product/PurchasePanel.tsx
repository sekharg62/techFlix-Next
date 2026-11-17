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

  // Variants are device types (Phone/PC, TV + Any Device…); their plans are durations.
  // The picker shows one row of plan chips and one row of device chips, and the
  // selected plan is the one in the chosen device that matches the chosen plan label.
  const sortByOrder = (a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder;
  const variantGroups = [...(product.variants ?? [])]
    .filter((v) => v.plans.length > 0)
    .sort(sortByOrder)
    .map((v) => ({ id: v.id, name: v.name, description: v.description, plans: [...v.plans].sort(sortByOrder) }));
  const simplePlans = product.plans.filter((p) => !p.variantId).sort(sortByOrder);
  const hasVariants = variantGroups.length > 0;
  const groups = hasVariants
    ? [...variantGroups, ...(simplePlans.length ? [{ id: "__simple", name: "Other", description: null, plans: simplePlans }] : [])]
    : [{ id: "__simple", name: "", description: null, plans: [...product.plans].sort(sortByOrder) }];

  // Plan names are often just the product name ("Netflix"), so prefer the validity
  // ("30 days") as the label whenever names repeat inside a group.
  const namesRepeat = groups.some((g) => new Set(g.plans.map((p) => p.name.trim().toLowerCase())).size < g.plans.length);
  const planLabel = (p: Plan) =>
    (namesRepeat ? p.validity || (p.durationDays ? `${p.durationDays} days` : null) : null) || p.name;
  const planKey = (p: Plan) => planLabel(p).trim().toLowerCase();

  // Every distinct plan option across devices, shortest duration first.
  const options: { key: string; label: string; days: number; order: number }[] = [];
  groups.forEach((g, gi) =>
    g.plans.forEach((p, pi) => {
      if (!options.some((o) => o.key === planKey(p))) {
        options.push({ key: planKey(p), label: planLabel(p), days: p.durationDays ?? Infinity, order: gi * 1000 + pi });
      }
    })
  );
  options.sort((a, b) => a.days - b.days || a.order - b.order);

  const planIn = (groupId: string, key: string) => groups.find((g) => g.id === groupId)?.plans.find((p) => planKey(p) === key);
  const buyableIn = (groupId: string, key: string) => {
    const p = planIn(groupId, key);
    return p && isBuyable(p) ? p : undefined;
  };

  // Default: cheapest buyable plan of the first device that has stock.
  const initialGroup = groups.find((g) => g.plans.some(isBuyable)) ?? groups[0];
  const initialPlan = cheapest(initialGroup?.plans.filter(isBuyable) ?? []);
  const [groupId, setGroupId] = useState(initialGroup?.id ?? "");
  const [optionKey, setOptionKey] = useState(initialPlan ? planKey(initialPlan) : "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = buyableIn(groupId, optionKey);
  const selectedGroup = groups.find((g) => g.id === groupId);
  const selectedVariant = hasVariants && selectedGroup?.id !== "__simple" ? selectedGroup : undefined;

  // Picking a plan keeps the device if it offers that plan, otherwise moves to the cheapest device that does.
  const choosePlan = (key: string) => {
    setOptionKey(key);
    if (!buyableIn(groupId, key)) {
      const best = cheapest(groups.map((g) => buyableIn(g.id, key)).filter((p): p is Plan => !!p));
      const g = best && groups.find((g) => g.plans.includes(best));
      if (g) setGroupId(g.id);
    }
  };
  // Picking a device keeps the plan if that device offers it, otherwise selects its cheapest plan.
  const chooseDevice = (id: string) => {
    setGroupId(id);
    if (!buyableIn(id, optionKey)) {
      const best = cheapest(groups.find((g) => g.id === id)?.plans.filter(isBuyable) ?? []);
      if (best) setOptionKey(planKey(best));
    }
  };

  const chip = (active: boolean, available: boolean) =>
    `px-4 sm:px-5 py-2.5 rounded-md border-2 text-sm sm:text-base font-bold transition-all ${
      active
        ? "border-[var(--color-brand-red)] bg-red-50 dark:bg-red-950/40 text-neutral-900 dark:text-white"
        : available
          ? "border-[var(--card-border)] bg-[var(--card-bg)] text-neutral-800 dark:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-500"
          : "border-dashed border-[var(--card-border)] text-neutral-400 dark:text-neutral-500 hover:border-neutral-400"
    }`;

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
        planName: selectedVariant ? `${selectedVariant.name} · ${planLabel(selected)}` : planLabel(selected),
        planValidity: selected.validity,
        unitPrice: selected.price,
      },
      quantity
    );
    return true;
  };

  if (plans.length === 0) {
    return (
      <div className="p-5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-[var(--card-border)] space-y-3">
        <p className="font-extrabold">Currently unavailable</p>
        <p className="text-sm text-neutral-500">This product is out of stock. Contact support to be notified when it is back.</p>
        <Link href="/support" className="inline-block px-5 py-2.5 rounded-md bg-[var(--color-brand-red)] text-white font-bold text-sm">
          Contact support
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="text-sm font-bold text-neutral-600 dark:text-neutral-300 mb-2">Plan</legend>
        <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Plan">
          {options.map((o) => {
            const inDevice = !!buyableIn(groupId, o.key);
            const anywhere = groups.some((g) => buyableIn(g.id, o.key));
            const active = o.key === optionKey && !!selected;
            return (
              <button
                key={o.key}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={!anywhere}
                onClick={() => choosePlan(o.key)}
                className={`${chip(active, inDevice)} ${anywhere ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {hasVariants && (
        <fieldset>
          <legend className="text-sm font-bold text-neutral-600 dark:text-neutral-300 mb-2">Device Type</legend>
          <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Device type">
            {groups.map((g) => {
              const offers = buyableIn(g.id, optionKey);
              const anyStock = g.plans.some(isBuyable);
              const active = g.id === groupId;
              return (
                <button
                  key={g.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={!anyStock}
                  onClick={() => chooseDevice(g.id)}
                  className={`${chip(active, !!offers)} ${anyStock ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                >
                  {g.name}
                  {!anyStock && <span className="ml-1.5 text-xs font-semibold">(Out of stock)</span>}
                </button>
              );
            })}
          </div>
          {selectedGroup?.description && <p className="text-xs text-neutral-500 mt-2">{selectedGroup.description}</p>}
        </fieldset>
      )}

      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">Quantity</span>
          <div className="inline-flex items-center rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-2.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40"
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
              className="p-2.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-neutral-500 block">
            {selected ? `${selectedVariant ? `${selectedVariant.name} · ` : ""}${planLabel(selected)} · ` : ""}Total
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
          className="py-4 px-6 rounded-md border-2 border-[var(--color-brand-red)] text-[var(--color-brand-red)] hover:bg-[var(--color-brand-red)] hover:text-white font-extrabold transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          {added ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
          {added ? "Added to cart" : "Add to cart"}
        </button>
        <button
          type="button"
          onClick={() => add() && router.push("/checkout")}
          className="py-4 px-6 rounded-md bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-extrabold transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95"
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
