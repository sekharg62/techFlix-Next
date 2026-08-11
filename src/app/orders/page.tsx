import Link from "next/link";
import { ArrowLeft, PackageCheck, Clock, ShieldCheck, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-[var(--color-brand-red)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--card-border)]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <PackageCheck className="w-8 h-8 text-[var(--color-brand-red)]" />
            My Orders & Subscriptions
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Track your license activations, keys, and past purchases.
          </p>
        </div>
      </div>

      {/* Sample Active Order */}
      <div className="space-y-6">
        <div className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[var(--card-border)]">
            <div>
              <span className="text-xs font-bold text-neutral-400">Order ID: #TFX-884920</span>
              <div className="text-xs text-neutral-500 mt-0.5">Purchased on August 10, 2026</div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 w-fit">
              <ShieldCheck className="w-4 h-4" />
              Active & Delivered
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-neutral-900 overflow-hidden relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=300&auto=format&fit=crop"
                alt="ChatGPT Plus"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-base">ChatGPT Plus 1-Month Access</h3>
              <p className="text-xs text-neutral-500">Official license key delivered via email</p>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-[var(--color-brand-red)]">$9.99</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-[var(--card-border)] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-mono text-neutral-600 dark:text-neutral-300">
              Key: <span className="font-bold text-[var(--color-brand-red)]">GPT4O-PASS-9981-X77A</span>
            </span>
            <button className="px-3 py-1 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] font-bold text-xs hover:border-[var(--color-brand-red)]">
              Copy Activation Key
            </button>
          </div>
        </div>

        <div className="text-center py-10 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6">
          <Clock className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold">Need help with an older order?</h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 mb-4">
            If you cannot locate your license key email, contact our 24/7 support team with your order reference.
          </p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--color-brand-red)] text-white font-bold text-xs"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </main>
  );
}
