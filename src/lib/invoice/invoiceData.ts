import type { TrackedOrder } from "@/types/catalog";
import { siteConfig } from "@/constants/siteConfig";

export type BillStatusKey = "PAID" | "PENDING" | "REJECTED" | "REFUNDED" | "CANCELLED";

export interface BillSummary {
  status: BillStatusKey;
  statusLabel: string;
  /** Amount confirmed as received. */
  paid: number;
  /** What the customer still owes (0 for paid, refunded or cancelled orders). */
  balanceDue: number;
  /** The payment shown on the bill: the verified one, else the latest submission. */
  payment: TrackedOrder["payments"][number] | null;
}

export const SELLER = {
  name: "TECH FLIX",
  tagline: "Premium digital subscriptions",
  email: siteConfig.email,
  phone: siteConfig.phone,
  website: (process.env.NEXT_PUBLIC_SITE_URL || "techflix").replace(/^https?:\/\//, ""),
};

export const PAYMENT_NAMES = { BKASH: "bKash", NAGAD: "Nagad", ROCKET: "Rocket" } as const;

/** Single source of truth for what the bill says — used by the on-screen bill and the PDF. */
export function summarizeBill(order: TrackedOrder): BillSummary {
  const verified = order.payments.find((p) => p.status === "VERIFIED") ?? null;
  const payment = verified ?? order.payments[0] ?? null;

  if (order.status === "CANCELLED") {
    return { status: "CANCELLED", statusLabel: "Cancelled", paid: 0, balanceDue: 0, payment };
  }
  if (order.paymentStatus === "REFUNDED" || order.status === "REFUNDED") {
    return { status: "REFUNDED", statusLabel: "Refunded", paid: 0, balanceDue: 0, payment };
  }
  if (order.paymentStatus === "PAID") {
    return { status: "PAID", statusLabel: "Paid", paid: order.total, balanceDue: 0, payment };
  }
  if (order.paymentStatus === "REJECTED") {
    return { status: "REJECTED", statusLabel: "Payment rejected", paid: 0, balanceDue: order.total, payment };
  }
  return { status: "PENDING", statusLabel: "Payment pending", paid: 0, balanceDue: order.total, payment };
}

export const billFileName = (orderNumber: string) => `TechFlix-Bill-${orderNumber}.pdf`;

/** Link to view this order's bill. */
export const billHref = (orderNumber: string, email: string) =>
  `/bill?${new URLSearchParams({ orderNumber, email })}`;
