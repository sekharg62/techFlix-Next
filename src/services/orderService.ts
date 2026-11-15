import apiClient from "@/lib/api/apiClient";
import type { CheckoutPayload, PaymentMethodType, PlacedOrder, TrackedOrder } from "@/types/catalog";

type Envelope<T> = { success: boolean; message?: string; data: T };

/** Client-side order calls. These are never cached: they are per-customer and change state. */
export const orderService = {
  async checkout(payload: CheckoutPayload): Promise<PlacedOrder> {
    const res = await apiClient.post<Envelope<PlacedOrder>>("/api/orders/checkout", payload);
    return res.data.data;
  },

  async track(orderNumber: string, email: string): Promise<TrackedOrder> {
    const res = await apiClient.get<Envelope<TrackedOrder>>("/api/orders/track", {
      params: { orderNumber: orderNumber.trim(), email: email.trim() },
    });
    return res.data.data;
  },

  async resubmitPayment(
    orderNumber: string,
    email: string,
    payment: { method: PaymentMethodType; senderNumber: string; trxId: string }
  ): Promise<TrackedOrder> {
    const res = await apiClient.post<Envelope<TrackedOrder>>(
      `/api/orders/track/${encodeURIComponent(orderNumber)}/payments`,
      { email, payment }
    );
    return res.data.data;
  },
};

/** Message from the API client's normalised error, or a fallback. */
export const errorMessage = (err: unknown, fallback = "Something went wrong. Please try again.") => {
  if (err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string") {
    const { message, status } = err as { message: string; status?: number };
    if (!status && /network/i.test(message)) return "Cannot reach the server. Check your connection and try again.";
    return message;
  }
  return fallback;
};

// ── Recent orders (this browser only) ─────────────────────

const RECENT_KEY = "techflix_recent_orders";
export interface RecentOrderRef {
  orderNumber: string;
  email: string;
  placedAt: string;
}

let recentRaw: string | null = null;
let recentSnapshot: RecentOrderRef[] = [];
const EMPTY_RECENT: RecentOrderRef[] = [];

export const recentOrders = {
  /** Stable snapshot for useSyncExternalStore (re-parsed only when storage changes). */
  getSnapshot(): RecentOrderRef[] {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(RECENT_KEY);
    } catch {
      return EMPTY_RECENT;
    }
    if (raw !== recentRaw) {
      recentRaw = raw;
      recentSnapshot = recentOrders.list();
    }
    return recentSnapshot;
  },
  getServerSnapshot: (): RecentOrderRef[] => EMPTY_RECENT,
  subscribe(listener: () => void) {
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  },
  list(): RecentOrderRef[] {
    try {
      const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  add(ref: RecentOrderRef) {
    try {
      const next = [ref, ...recentOrders.list().filter((r) => r.orderNumber !== ref.orderNumber)].slice(0, 10);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // storage blocked
    }
  },
};
