"use client";

import React, { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

export const MAX_QUANTITY = 10;
const STORAGE_KEY = "techflix_cart_v2";

/** One cart line per product plan. Prices are for display only — the server re-prices at checkout. */
export interface CartItem {
  productId: string;
  planId: string;
  slug: string;
  name: string;
  imgUrl: string;
  categoryName: string | null;
  planName: string;
  planValidity: string | null;
  unitPrice: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  /** False during SSR / first paint, true once the saved cart has been read. */
  hydrated: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (planId: string, quantity: number) => void;
  removeItem: (planId: string) => void;
  clearCart: () => void;
}

const clampQty = (q: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.floor(q) || 1));

// ── localStorage-backed store (works with useSyncExternalStore) ──────────

const EMPTY: CartItem[] = [];
const listeners = new Set<() => void>();
let snapshot: CartItem[] | null = null;

const readStorage = (): CartItem[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((i): i is CartItem => i && typeof i.planId === "string" && typeof i.productId === "string")
      : EMPTY;
  } catch {
    return EMPTY;
  }
};

const getSnapshot = () => (snapshot ??= readStorage());
const getServerSnapshot = () => EMPTY;

const setCart = (update: (prev: CartItem[]) => CartItem[]) => {
  snapshot = update(getSnapshot());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // storage full or blocked — the cart still works for this page view
  }
  listeners.forEach((l) => l());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  // Keep other tabs in sync
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      snapshot = readStorage();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

const noopSubscribe = () => () => {};

// ── Provider ─────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.planId === item.planId);
      if (existing) {
        return prev.map((i) => (i.planId === item.planId ? { ...i, ...item, quantity: clampQty(i.quantity + quantity) } : i));
      }
      return [...prev, { ...item, quantity: clampQty(quantity) }];
    });
  }, []);

  const updateQuantity = useCallback((planId: string, quantity: number) => {
    setCart((prev) => prev.map((i) => (i.planId === planId ? { ...i, quantity: clampQty(quantity) } : i)));
  }, []);

  const removeItem = useCallback((planId: string) => {
    setCart((prev) => prev.filter((i) => i.planId !== planId));
  }, []);

  const clearCart = useCallback(() => setCart(() => EMPTY), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      hydrated,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, hydrated, addItem, updateQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
