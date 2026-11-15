import type { Metadata } from "next";
import { Suspense } from "react";
import { getPaymentMethods } from "@/lib/data";
import { resolvePaymentMethods } from "@/components/checkout/mfs";
import { OrderTracker } from "@/components/orders/OrderTracker";

export const metadata: Metadata = {
  title: "Track your order | TECH FLIX",
  description: "Check the status of your TECH FLIX order with your order number and email.",
  robots: { index: false },
};

export const revalidate = 3600;

export default async function OrdersPage() {
  const paymentMethods = resolvePaymentMethods(await getPaymentMethods());
  return (
    <Suspense fallback={<div className="w-full max-w-4xl mx-auto px-4 py-10 h-96 animate-pulse" />}>
      <OrderTracker paymentMethods={paymentMethods} />
    </Suspense>
  );
}
