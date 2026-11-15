"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Zap, Minus, Plus } from "lucide-react";
import { useCart, MAX_QUANTITY } from "@/context/CartContext";
import { formatBDT } from "@/lib/format";

export default function CartPage() {
  const { items, hydrated, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  if (!hydrated) {
    return (
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-pulse" aria-busy="true">
        <div className="h-9 w-72 rounded bg-neutral-200 dark:bg-neutral-800 mb-8" />
        <div className="space-y-4">
          <div className="h-24 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-24 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-[var(--color-brand-red)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Continue Shopping
      </Link>

      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--card-border)]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-[var(--color-brand-red)]" />
            Your Cart
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            {itemCount === 1 ? "1 item" : `${itemCount} items`}
          </p>
        </div>
        {items.length > 0 && (
          <button onClick={clearCart} className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1">
            <Trash2 className="w-3.5 h-3.5" />
            Clear cart
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ul className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <li
                key={item.planId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <Link href={`/product/${item.slug}`} className="w-16 h-16 rounded-xl bg-neutral-900 overflow-hidden relative shrink-0">
                    <Image src={item.imgUrl} alt={item.name} fill sizes="64px" className="object-cover" />
                  </Link>
                  <div className="min-w-0">
                    {item.categoryName && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-[var(--color-brand-red)]">
                        {item.categoryName}
                      </span>
                    )}
                    <Link href={`/product/${item.slug}`} className="block font-extrabold text-base mt-1 hover:text-[var(--color-brand-red)] truncate">
                      {item.name}
                    </Link>
                    <p className="text-xs text-neutral-500">
                      {item.planName}
                      {item.planValidity ? ` · ${item.planValidity}` : ""} · {formatBDT(item.unitPrice)} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-0 border-[var(--card-border)]">
                  <div className="inline-flex items-center rounded-xl border border-[var(--card-border)] p-0.5">
                    <button
                      onClick={() => updateQuantity(item.planId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40"
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-extrabold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.planId, item.quantity + 1)}
                      disabled={item.quantity >= MAX_QUANTITY}
                      className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40"
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-lg font-black text-[var(--color-brand-red)] w-24 text-right">
                    {formatBDT(item.unitPrice * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.planId)}
                    className="p-2 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl h-fit space-y-6 shadow-md lg:sticky lg:top-24">
            <h2 className="text-xl font-black tracking-tight border-b border-[var(--card-border)] pb-4">Order Summary</h2>
            <div className="space-y-3 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Digital delivery</span>
                <span className="text-emerald-500 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-base font-black border-t border-[var(--card-border)] pt-3">
                <span>Total</span>
                <span className="text-[var(--color-brand-red)]">{formatBDT(subtotal)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="w-full py-4 rounded-full bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="space-y-2 pt-2 text-xs text-neutral-500 border-t border-[var(--card-border)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% genuine subscriptions</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Pay with bKash, Nagad or Rocket</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 text-[var(--color-brand-red)] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black mb-2">Your cart is empty</h2>
          <p className="text-neutral-500 text-sm mb-6">Explore AI tools, streaming passes and software subscriptions.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--color-brand-red)] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md"
          >
            Browse products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </main>
  );
}
