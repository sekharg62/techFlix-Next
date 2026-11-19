"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  PackageSearch,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { orderService, errorMessage, recentOrders } from "@/services/orderService";
import type { OrderStatus, PaymentMethod, PaymentMethodType, TrackedOrder } from "@/types/catalog";
import { formatBDT, formatDate, formatDateTime, itemPlanLabel } from "@/lib/format";
import { MFS_STYLE } from "@/components/checkout/mfs";
import { PaymentPicker, Field, inputCls, PHONE_RE, TRX_RE, EMAIL_RE, cleanPhone } from "@/components/checkout/PaymentPicker";
import { siteConfig } from "@/constants/siteConfig";
import { DownloadBillButton } from "@/components/bill/DownloadBillButton";
import { billHref } from "@/lib/invoice/invoiceData";
import { FileText } from "lucide-react";
import { orderPayoutCharge } from "@/lib/pricing";

const STATUS_META: Record<OrderStatus, { label: string; tone: string }> = {
  PENDING: { label: "Awaiting payment check", tone: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  PROCESSING: { label: "Preparing your subscription", tone: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
  DELIVERED: { label: "Delivered", tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  CANCELLED: { label: "Cancelled", tone: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300" },
  REFUNDED: { label: "Refunded", tone: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
};

export function OrderTracker({ paymentMethods }: { paymentMethods: PaymentMethod[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // The URL is the source of truth for which order is shown (shareable, survives refresh)
  const urlNumber = params.get("orderNumber") || "";
  const urlEmail = params.get("email") || "";
  const queryKey = urlNumber && urlEmail ? `${urlNumber}|${urlEmail}` : "";

  const [orderNumber, setOrderNumber] = useState(urlNumber);
  const [email, setEmail] = useState(urlEmail);
  const [formError, setFormError] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);
  const [result, setResult] = useState<{ key: string; order: TrackedOrder | null; error: string } | null>(null);

  // Prefill the form when the URL changes (e.g. clicking a recent order)
  const [syncedKey, setSyncedKey] = useState(queryKey);
  if (queryKey !== syncedKey) {
    setSyncedKey(queryKey);
    setOrderNumber(urlNumber);
    setEmail(urlEmail);
  }

  const requestKey = queryKey ? `${queryKey}#${refreshTick}` : "";

  useEffect(() => {
    if (!queryKey) return;
    let cancelled = false;
    const key = `${queryKey}#${refreshTick}`;
    orderService
      .track(urlNumber, urlEmail)
      .then((order) => !cancelled && setResult({ key, order, error: "" }))
      .catch((err) => !cancelled && setResult({ key, order: null, error: errorMessage(err, "Could not find that order.") }));
    return () => {
      cancelled = true;
    };
  }, [queryKey, refreshTick, urlNumber, urlEmail]);

  const loading = Boolean(requestKey) && result?.key !== requestKey;
  // Keep showing the current order while refreshing it
  const sameQuery = Boolean(result && queryKey && result.key.startsWith(`${queryKey}#`));
  const order = sameQuery ? result!.order : null;
  const error = formError || (sameQuery && !loading ? result!.error : "");

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
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-[var(--color-brand-red)] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="mb-8 pb-4 border-b border-[var(--card-border)]">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
          <PackageSearch className="w-8 h-8 text-[var(--color-brand-red)]" />
          Track your order
        </h1>
        <p className="text-neutral-500 text-sm mt-1">Enter the order number from your confirmation and the email you used.</p>
      </div>

      <form onSubmit={submit} className="p-5 sm:p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_auto] gap-4 items-end">
        <Field label="Order number">
          <input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value.toUpperCase())} placeholder="TF-000123" className={`${inputCls()} font-mono`} />
        </Field>
        <Field label="Email">
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourname@gmail.com" className={inputCls()} />
        </Field>
        <button
          type="submit"
          disabled={loading}
          className="h-[46px] px-6 rounded-lg bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackageSearch className="w-4 h-4" />}
          Track
        </button>
      </form>

      {error && (
        <div role="alert" className="mt-5 flex gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-700 dark:text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {loading && !order && <div className="mt-6 h-64 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse" />}

      {order && (
        <OrderView
          order={order}
          email={urlEmail}
          paymentMethods={paymentMethods}
          onRefresh={() => setRefreshTick((t) => t + 1)}
          onUpdated={(updated) => setResult({ key: requestKey, order: updated, error: "" })}
          refreshing={loading}
        />
      )}

      {!order && recent.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-500 mb-3">Orders placed on this device</h2>
          <ul className="divide-y divide-[var(--card-border)] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg overflow-hidden">
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
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-10 text-center text-xs text-neutral-500">
        Can&apos;t find your order? <Link href="/support" className="font-bold text-[var(--color-brand-red)] hover:underline">Contact support</Link> or
        WhatsApp {siteConfig.phone}.
      </p>
    </main>
  );
}

function OrderView({
  order,
  email,
  paymentMethods,
  onRefresh,
  onUpdated,
  refreshing,
}: {
  order: TrackedOrder;
  email: string;
  paymentMethods: PaymentMethod[];
  onRefresh: () => void;
  onUpdated: (order: TrackedOrder) => void;
  refreshing: boolean;
}) {
  const meta = STATUS_META[order.status];
  const latestPayment = order.payments[0];
  const canResubmit = order.status === "PENDING" && order.paymentStatus === "REJECTED";
  const delivered = order.items.filter((i) => i.deliveredAt).length;

  const steps = [
    { label: "Order placed", done: true, at: order.createdAt },
    {
      label: "Payment verified",
      done: order.paymentStatus === "PAID" || order.paymentStatus === "REFUNDED",
      failed: order.paymentStatus === "REJECTED",
      at: order.statusHistory.find((h) => h.toStatus === "PROCESSING")?.createdAt,
    },
    { label: "Delivered", done: Boolean(order.deliveredAt), at: order.deliveredAt },
  ];

  return (
    <section className="mt-6 space-y-6">
      <div className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-neutral-500">Order</div>
            <div className="font-mono text-2xl font-black">{order.orderNumber}</div>
            <div className="text-xs text-neutral-500 mt-0.5">Placed {formatDateTime(order.createdAt)}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${meta.tone}`}>{meta.label}</span>
            <button onClick={onRefresh} disabled={refreshing} aria-label="Refresh status" className="p-2 rounded-full border border-[var(--card-border)] hover:border-[var(--color-brand-red)]">
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {order.status !== "CANCELLED" && order.status !== "REFUNDED" && (
          <ol className="grid grid-cols-3 gap-2">
            {steps.map((step, i) => (
              <li key={step.label} className="flex flex-col items-center text-center gap-1.5">
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    step.failed
                      ? "bg-red-100 text-red-600 dark:bg-red-950"
                      : step.done
                        ? "bg-emerald-500 text-white"
                        : "bg-neutral-200 text-neutral-500 dark:bg-neutral-800"
                  }`}
                >
                  {step.failed ? <XCircle className="w-5 h-5" /> : step.done ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                </span>
                <span className="text-xs font-bold">{step.failed ? "Payment rejected" : step.label}</span>
                <span className="text-[11px] text-neutral-500">{step.at ? formatDateTime(step.at) : i === 2 && delivered ? `${delivered}/${order.items.length} items` : "—"}</span>
              </li>
            ))}
          </ol>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <DownloadBillButton
            order={order}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-bold text-xs disabled:opacity-60"
          />
          <Link
            href={billHref(order.orderNumber, email)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--card-border)] font-bold text-xs hover:border-[var(--color-brand-red)]"
          >
            <FileText className="w-3.5 h-3.5" />
            View bill
          </Link>
        </div>

        {order.status === "DELIVERED" && (
          <p className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            Your subscription details have been delivered. Check your email and WhatsApp.
          </p>
        )}
        {order.status === "PROCESSING" && (
          <p className="p-3 rounded-md bg-sky-50 dark:bg-sky-950/40 text-sm font-semibold text-sky-700 dark:text-sky-300">
            Payment confirmed. We are preparing your subscription — you will receive it shortly.
          </p>
        )}
      </div>

      <div className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg">
        <h2 className="font-black mb-4">Items</h2>
        <ul className="divide-y divide-[var(--card-border)]">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center gap-4 py-3">
              <div className="relative w-12 h-12 rounded-md overflow-hidden bg-neutral-900 shrink-0">
                {item.productImgUrl && <Image src={item.productImgUrl} alt="" fill sizes="48px" className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.productSlug}`} className="font-bold hover:text-[var(--color-brand-red)] truncate block">
                  {item.productName}
                </Link>
                <div className="text-xs text-neutral-500">
                  {itemPlanLabel(item)} × {item.quantity}
                  {item.deliveredAt ? " · Delivered" : ""}
                </div>
              </div>
              <span className="font-bold">{formatBDT(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        {orderPayoutCharge(order) > 0 && (
          <div className="flex justify-between pt-4 mt-2 border-t border-[var(--card-border)] text-sm text-neutral-500">
            <span>Payout charge (2%)</span>
            <span>{formatBDT(orderPayoutCharge(order))}</span>
          </div>
        )}
        <div className="flex justify-between pt-4 mt-2 border-t border-[var(--card-border)] font-black">
          <span>Total</span>
          <span className="text-[var(--color-brand-red)]">{formatBDT(order.total)}</span>
        </div>
      </div>

      {latestPayment && (
        <div className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg space-y-3">
          <h2 className="font-black">Payment</h2>
          {order.payments.map((p) => (
            <div key={p.trxId} className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span>
                <span className="font-bold">{MFS_STYLE[p.method].name}</span> · <span className="font-mono">{p.trxId}</span> · {formatBDT(p.amount)}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  p.status === "VERIFIED"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : p.status === "REJECTED"
                      ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                }`}
              >
                {p.status === "VERIFIED" ? "Verified" : p.status === "REJECTED" ? "Rejected" : "Checking"}
              </span>
              {p.status === "REJECTED" && p.rejectionReason && (
                <p className="w-full text-xs text-red-600 dark:text-red-400">Reason: {p.rejectionReason}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {canResubmit && <ResubmitPayment order={order} email={email} paymentMethods={paymentMethods} onUpdated={onUpdated} />}
    </section>
  );
}

function ResubmitPayment({
  order,
  email,
  paymentMethods,
  onUpdated,
}: {
  order: TrackedOrder;
  email: string;
  paymentMethods: PaymentMethod[];
  onUpdated: (order: TrackedOrder) => void;
}) {
  const [method, setMethod] = useState<PaymentMethodType>(order.payments[0]?.method ?? paymentMethods[0].method);
  const [senderNumber, setSenderNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [errors, setErrors] = useState<{ senderNumber?: string; trxId?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!PHONE_RE.test(cleanPhone(senderNumber))) next.senderNumber = "Enter the number you paid from";
    if (!TRX_RE.test(trxId.trim())) next.trxId = "TrxID should be 6–30 letters or digits";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    setError("");
    try {
      onUpdated(await orderService.resubmitPayment(order.orderNumber, email, { method, senderNumber: cleanPhone(senderNumber), trxId: trxId.trim() }));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="p-6 bg-[var(--card-bg)] border-2 border-[var(--color-brand-red)] rounded-lg space-y-5">
      <div>
        <h2 className="font-black text-lg">Send your payment again</h2>
        <p className="text-sm text-neutral-500">Your last payment could not be verified. Pay again and enter the new transaction ID.</p>
      </div>
      <PaymentPicker
        methods={paymentMethods}
        method={method}
        onMethodChange={setMethod}
        senderNumber={senderNumber}
        onSenderNumberChange={(v) => {
          setSenderNumber(v);
          setErrors((e) => ({ ...e, senderNumber: undefined }));
        }}
        trxId={trxId}
        onTrxIdChange={(v) => {
          setTrxId(v);
          setErrors((e) => ({ ...e, trxId: undefined }));
        }}
        amount={order.total}
        errors={errors}
      />
      {error && (
        <p role="alert" className="text-sm font-semibold text-red-600">
          {error}
        </p>
      )}
      <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-md bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-black flex items-center justify-center gap-2 disabled:opacity-60">
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        Submit payment
      </button>
    </form>
  );
}
