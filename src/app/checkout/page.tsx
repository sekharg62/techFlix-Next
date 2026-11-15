import type { Metadata } from "next";
import { getPaymentMethods } from "@/lib/data";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { resolvePaymentMethods } from "@/components/checkout/mfs";

export const metadata: Metadata = {
  title: "Checkout | TechFlix",
  robots: { index: false },
};

// Payment accounts are cached (1 h, or until an admin changes them)
export const revalidate = 3600;

export default async function CheckoutPage() {
  const paymentMethods = resolvePaymentMethods(await getPaymentMethods());
  return <CheckoutForm paymentMethods={paymentMethods} />;
}
