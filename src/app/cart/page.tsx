"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const cartContext = useCart();
  const cart = cartContext?.cart || [];
  const removeFromCart = cartContext?.removeFromCart || (() => {});
  const clearCart = cartContext?.clearCart || (() => {});

  // Calculate total price string sum
  const total = cart.reduce((acc: number, item: any) => {
    const val = parseFloat(item.price?.replace(/[^0-9.]/g, "") || "0");
    return acc + val;
  }, 0);

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
            Your Shopping Cart
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            {cart.length === 1 ? "1 item in your cart" : `${cart.length} items in your cart`}
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Cart
          </button>
        )}
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item: any, index: number) => (
              <div
                key={`${item.id}-${index}`}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-neutral-900 overflow-hidden relative shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-[var(--color-brand-red)]">
                      {item.category}
                    </span>
                    <h3 className="font-extrabold text-base mt-1">{item.name}</h3>
                    <p className="text-xs text-neutral-500 line-clamp-1">{item.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-[var(--card-border)]">
                  <span className="text-lg font-black text-[var(--color-brand-red)]">
                    {item.price}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Order Summary Card */}
          <div className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl h-fit space-y-6 shadow-md">
            <h2 className="text-xl font-black tracking-tight border-b border-[var(--card-border)] pb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Digital Delivery</span>
                <span className="text-emerald-500 font-bold">FREE (Instant)</span>
              </div>
              <div className="flex justify-between text-base font-black border-t border-[var(--card-border)] pt-3">
                <span>Total Amount</span>
                <span className="text-[var(--color-brand-red)]">${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full py-4 rounded-full bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95">
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="space-y-2 pt-2 text-xs text-neutral-500 border-t border-[var(--card-border)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Genuine Digital License Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Automated Email Key Delivery in seconds</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 text-[var(--color-brand-red)] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black mb-2">Your Cart is Currently Empty</h2>
          <p className="text-neutral-500 text-sm mb-6">
            Explore our wide range of AI subscriptions, streaming passes, and software licenses.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--color-brand-red)] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md"
          >
            Browse All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </main>
  );
}
