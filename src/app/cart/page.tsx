"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Clock, Minus, Plus, X } from "lucide-react";
import { useCart, MAX_QUANTITY } from "@/context/CartContext";
import { formatBDT } from "@/lib/format";
import { priceBreakdown, PAYOUT_CHARGE_PERCENT } from "@/lib/pricing";
import { OrderSteps } from "@/components/checkout/OrderSteps";

const PAYMENTS = [
  { src: "/images/bkash.png", alt: "bKash" },
  { src: "/images/nagad.png", alt: "Nagad" },
  { src: "/images/rocket.png", alt: "Rocket" },
];

export default function CartPage() {
  const { items, hydrated, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { payoutCharge, total } = priceBreakdown(subtotal);

  // "Clear cart" asks for a second tap before emptying the cart; the prompt resets after a few seconds.
  const [confirmClear, setConfirmClear] = useState(false);
  useEffect(() => {
    if (!confirmClear) return;
    const t = setTimeout(() => setConfirmClear(false), 4000);
    return () => clearTimeout(t);
  }, [confirmClear]);

  if (!hydrated) {
    return (
      <main className="w-full max-w-site mx-auto px-4 sm:px-6 py-8 sm:py-10 animate-pulse" aria-busy="true">
        <div className="h-4 w-36 rounded bg-neutral-200 dark:bg-neutral-800 mb-6" />
        <div className="h-9 w-56 rounded bg-neutral-200 dark:bg-neutral-800 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-8">
          <div className="space-y-3">
            <div className="h-28 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-28 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          </div>
          <div className="h-80 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-site mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-[var(--color-brand-red)] transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue shopping
        </Link>
        {items.length > 0 && <OrderSteps current={1} />}
      </div>

      <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-[var(--card-border)]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Your <span className="text-[var(--color-brand-red)]">Cart</span>
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            {itemCount === 0 ? "No items yet" : itemCount === 1 ? "1 item" : `${itemCount} items`}
          </p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => (confirmClear ? (clearCart(), setConfirmClear(false)) : setConfirmClear(true))}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold transition-colors ${
              confirmClear
                ? "bg-red-600 text-white hover:bg-red-700"
                : "text-neutral-500 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            {confirmClear ? "Tap again to clear" : "Clear cart"}
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-8 items-start">
          {/* Items */}
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.planId}
                className="group relative flex gap-4 p-3 sm:p-4 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--color-brand-red)]/30 transition-colors"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-neutral-900 shrink-0 border border-[var(--card-border)]"
                >
                  <Image src={item.imgUrl} alt={item.name} fill sizes="96px" className="object-cover" />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {item.categoryName && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-red)]">
                          {item.categoryName}
                        </span>
                      )}
                      <Link
                        href={`/product/${item.slug}`}
                        className="block font-extrabold text-base sm:text-lg leading-snug hover:text-[var(--color-brand-red)] transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200">
                          {item.planName}
                        </span>
                        {item.planValidity && item.planValidity !== item.planName && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                            {item.planValidity}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.planId)}
                      className="shrink-0 p-2 -m-1 rounded-md text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-md border border-[var(--card-border)] bg-neutral-50 dark:bg-neutral-900/60">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.planId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 rounded-l-md hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-transparent"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm font-extrabold tabular-nums" aria-live="polite">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.planId, item.quantity + 1)}
                        disabled={item.quantity >= MAX_QUANTITY}
                        className="p-2 rounded-r-md hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-transparent"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-black text-[var(--color-brand-red)] tabular-nums leading-none">
                        {formatBDT(item.unitPrice * item.quantity)}
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-[11px] text-neutral-500 mt-1">{formatBDT(item.unitPrice)} each</div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] shadow-[0_18px_60px_-20px_rgba(229,9,20,0.25)] overflow-hidden">
            <div className="p-5 sm:p-6 space-y-5">
              <h2 className="text-lg font-black tracking-tight">Order Summary</h2>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</dt>
                  <dd className="font-semibold tabular-nums">{formatBDT(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Payout charge ({PAYOUT_CHARGE_PERCENT}%)</dt>
                  <dd className="font-semibold tabular-nums">{formatBDT(payoutCharge)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Digital delivery</dt>
                  <dd className="font-bold text-emerald-500">FREE</dd>
                </div>
              </dl>

              <div className="flex items-end justify-between pt-4 border-t border-dashed border-[var(--card-border)]">
                <span className="font-bold">Total</span>
                <span className="text-3xl font-black text-[var(--color-brand-red)] tabular-nums leading-none">{formatBDT(total)}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full py-3.5 rounded-md bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-[0_10px_30px_-10px_rgba(229,9,20,0.7)] transition-colors active:scale-[0.99]"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>

              <ul className="space-y-2 text-xs text-neutral-500">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  100% genuine subscriptions
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  Usually delivered in 5–10 minutes after payment check
                </li>
              </ul>
            </div>

            <div className="px-5 sm:px-6 py-4 bg-neutral-50 dark:bg-neutral-900/60 border-t border-[var(--card-border)] flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-neutral-500">Pay with</span>
              <div className="flex items-center gap-2">
                {PAYMENTS.map((p) => (
                  <span key={p.alt} className="h-8 px-2 rounded bg-white flex items-center justify-center border border-[var(--card-border)]">
                    <Image src={p.src} alt={p.alt} width={40} height={24} className="h-5 w-auto object-contain" />
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <div className="relative text-center py-16 sm:py-20 px-6 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] max-w-xl mx-auto overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-48 rounded-full bg-[var(--color-brand-red)]/15 blur-3xl" />
          <div className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-[var(--color-brand-red)] to-red-800 text-white flex items-center justify-center mx-auto mb-5 shadow-[0_10px_30px_-10px_rgba(229,9,20,0.7)]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="relative text-2xl font-black mb-2">Your cart is empty</h2>
          <p className="relative text-neutral-500 text-sm mb-7">Explore AI tools, streaming and software subscriptions at the best price.</p>
          <Link
            href="/products"
            className="relative inline-flex items-center gap-2 px-7 py-3 rounded-md bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-bold text-sm transition-colors shadow-[0_10px_30px_-10px_rgba(229,9,20,0.7)]"
          >
            Browse products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </main>
  );
}
