import type { Metadata } from "next";
import { Suspense } from "react";
import { BillLookup } from "@/components/bill/BillLookup";

export const metadata: Metadata = {
  title: "Get your bill | TechFlix",
  description: "View, print or download the bill for your TechFlix order using your order number.",
  robots: { index: false },
};

export default function BillPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-4xl mx-auto px-4 py-10 h-96 animate-pulse" />}>
      <BillLookup />
    </Suspense>
  );
}
