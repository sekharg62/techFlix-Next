"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, ChevronRight, FileText, Loader2, PackageSearch, Printer, Search } from "lucide-react";
import type { TrackedOrder } from "@/types/catalog";
import { orderService, errorMessage, recentOrders } from "@/services/orderService";
import { Field, inputCls, EMAIL_RE } from "@/components/checkout/PaymentPicker";
import { BillDocument } from "@/components/bill/BillDocument";
import { DownloadBillButton } from "@/components/bill/DownloadBillButton";
import { formatDate } from "@/lib/format";

/** "Get bill" section: look up an order by number + email, then view, print or download its bill. */
export function BillLookup() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const urlNumber = params.get("orderNumber") || "";
  const urlEmail = params.get("email") || "";
  const queryKey = urlNumber && urlEmail ? `${urlNumber}|${urlEmail}` : "";

  const [orderNumber, setOrderNumber] = useState(urlNumber);
  const [email, setEmail] = useState(urlEmail);
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState<{ key: string; order: TrackedOrder | null; error: string } | null>(null);

  // Prefill the form when the URL changes (e.g. a recent order link)
  const [syncedKey, setSyncedKey] = useState(queryKey);
  if (queryKey !== syncedKey) {
    setSyncedKey(queryKey);
    setOrderNumber(urlNumber);
    setEmail(urlEmail);
  }

  useEffect(() => {
    if (!queryKey) return;
    let cancelled = false;
    orderService
      .track(urlNumber, urlEmail)
      .then((order) => !cancelled && setResult({ key: queryKey, order, error: "" }))
      .catch((err) => !cancelled && setResult({ key: queryKey, order: null, error: errorMessage(err, "Could not find that order.") }));
    return () => {
      cancelled = true;
    };
  }, [queryKey, urlNumber, urlEmail]);

  const loading = Boolean(queryKey) && result?.key !== queryKey;
  const current = result?.key === queryKey ? result : null;
  const order = current?.order ?? null;
  const error = formError || current?.error || "";

  const recent = useSyncExternalStore(recentOrders.subscribe, recentOrders.getSnapshot, recentOrders.getServerSnapshot);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !EMAIL_RE.test(email.trim())) {
      setFormError("Enter your order number and the email you used at checkout.");
      return;
    }
    setFormError("");
    const qs = new URLSearchParams({ orderNumber: orderNumber.trim().toUpperCase(), email: email.trim() });
    router.replace(`${pathname}?${qs}`, { scroll: false });
  };

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 print:p-0 print:max-w-none">
      <div data-print-hide>
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-[var(--color-brand-red)] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="mb-8 pb-4 border-b border-[var(--card-border)]">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-[var(--color-brand-red)]" />
            Get your bill
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Enter your order number and email to view, print or download your bill.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="p-5 sm:p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_auto] gap-4 items-end"
        >
          <Field label="Order number">
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="TF-000123"
              className={`${inputCls()} font-mono`}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@gmail.com"
              className={inputCls()}
            />
          </Field>
          <button
            type="submit"
            disabled={loading}
            className="h-[46px] px-6 rounded-2xl bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Get bill
          </button>
        </form>

        {error && (
          <div role="alert" className="mt-5 flex gap-2 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-700 dark:text-red-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {loading && !order && <div data-print-hide className="mt-6 h-[520px] rounded-2xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />}

      {order && (
        <section className="mt-8 print:mt-0">
          <div data-print-hide className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-black">Bill {order.orderNumber}</h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/orders?${new URLSearchParams({ orderNumber: order.orderNumber, email: urlEmail })}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--card-border)] font-bold text-sm hover:border-[var(--color-brand-red)]"
              >
                <PackageSearch className="w-4 h-4" />
                Track order
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--card-border)] font-bold text-sm hover:border-[var(--color-brand-red)]"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <DownloadBillButton
                order={order}
                label="Download PDF"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-bold text-sm disabled:opacity-60"
              />
            </div>
          </div>
          <BillDocument order={order} />
        </section>
      )}

      {!queryKey && recent.length > 0 && (
        <section data-print-hide className="mt-8">
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-500 mb-3">Orders placed on this device</h2>
          <ul className="divide-y divide-[var(--card-border)] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden">
            {recent.map((r) => (
              <li key={r.orderNumber}>
                <Link
                  href={`${pathname}?${new URLSearchParams({ orderNumber: r.orderNumber, email: r.email })}`}
                  replace
                  scroll={false}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                >
                  <span>
                    <span className="font-mono font-black">{r.orderNumber}</span>
                    <span className="text-xs text-neutral-500 ml-3">{formatDate(r.placedAt)}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-brand-red)]">
                    View bill <ChevronRight className="w-4 h-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
