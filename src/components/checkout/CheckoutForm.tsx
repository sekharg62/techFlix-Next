"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Loader2, ShieldCheck, ShoppingBag, Lock, AlertCircle, PackageSearch, FileText, ArrowRight } from "lucide-react";
import { DownloadBillButton } from "@/components/bill/DownloadBillButton";
import { billHref } from "@/lib/invoice/invoiceData";
import { siteConfig } from "@/constants/siteConfig";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { useCart } from "@/context/CartContext";
import { formatBDT } from "@/lib/format";
import { priceBreakdown, PAYOUT_CHARGE_PERCENT } from "@/lib/pricing";
import { OrderSteps } from "@/components/checkout/OrderSteps";
import { orderService, errorMessage, recentOrders } from "@/services/orderService";
import type { PaymentMethod, PaymentMethodType, PlacedOrder } from "@/types/catalog";
import { PaymentPicker, Field, inputCls, PHONE_RE, TRX_RE, EMAIL_RE, cleanPhone } from "@/components/checkout/PaymentPicker";

type Errors = Partial<Record<"fullName" | "email" | "whatsapp" | "senderNumber" | "trxId", string>>;

export function CheckoutForm({ paymentMethods }: { paymentMethods: PaymentMethod[] }) {
  const { items, hydrated, subtotal, clearCart } = useCart();
  const { payoutCharge, total } = priceBreakdown(subtotal);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [note, setNote] = useState("");
  const [method, setMethod] = useState<PaymentMethodType>(paymentMethods[0]?.method ?? "BKASH");
  const [senderNumber, setSenderNumber] = useState("");
  const [trxId, setTrxId] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);

  /** Update a field and clear its error as soon as the customer edits it. */
  const edit = (field: keyof Errors, setter: (v: string) => void) => (v: string) => {
    setter(v);
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!fullName.trim()) e.fullName = "Enter your full name";
    if (!EMAIL_RE.test(email.trim())) e.email = "Enter a valid email — your order details are sent here";
    if (!PHONE_RE.test(cleanPhone(whatsapp))) e.whatsapp = "Enter a valid WhatsApp number";
    if (!PHONE_RE.test(cleanPhone(senderNumber))) e.senderNumber = "Enter the number you paid from";
    if (!TRX_RE.test(trxId.trim())) e.trxId = "TrxID should be 6–30 letters or digits";
    return e;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError("");
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const order = await orderService.checkout({
        fullName: fullName.trim(),
        email: email.trim(),
        whatsapp: cleanPhone(whatsapp),
        country: country.trim() || undefined,
        note: note.trim() || undefined,
        items: items.map((i) => ({ productId: i.productId, planId: i.planId, quantity: i.quantity })),
        payment: { method, senderNumber: cleanPhone(senderNumber), trxId: trxId.trim() },
      });
      recentOrders.add({ orderNumber: order.orderNumber, email: order.customerEmail, placedAt: new Date().toISOString() });
      setPlaced(order);
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const message = errorMessage(err);
      if (/transaction id/i.test(message)) setErrors((prev) => ({ ...prev, trxId: message }));
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (placed) {
    const trackHref = `/orders?orderNumber=${encodeURIComponent(placed.orderNumber)}&email=${encodeURIComponent(placed.customerEmail)}`;
    const whatsappText = [
      "Hello TECH FLIX, I just placed an order.",
      `Order number: ${placed.orderNumber}`,
      `Name: ${fullName.trim()}`,
      `Amount: ${formatBDT(placed.total)}`,
      `TrxID: ${trxId.trim()}`,
      `Email: ${placed.customerEmail}`,
    ].join("\n");
    const whatsappHref = `${siteConfig.whatsapp}?text=${encodeURIComponent(whatsappText)}`;
    const firstName = fullName.trim().split(/\s+/)[0];
    const secondaryBtn =
      "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] font-bold text-sm hover:border-[var(--color-brand-red)] hover:text-[var(--color-brand-red)] transition-colors";

    return (
      <main className="relative w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex justify-center mb-10">
          <OrderSteps current={3} />
        </div>

        {/* Success header */}
        <div className="relative text-center mb-8">
          <div aria-hidden="true" className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-48 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-5 shadow-[0_0_0_8px_rgba(16,185,129,0.15),0_14px_40px_-10px_rgba(16,185,129,0.6)]">
            <Check className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={3} />
          </div>
          <h1 className="relative text-3xl sm:text-4xl font-black tracking-tight">Order placed!</h1>
          <p className="relative mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Thank you{firstName ? `, ${firstName}` : ""}. We&apos;re verifying your payment now.
          </p>
        </div>

        {/* Receipt */}
        <section aria-label="Order details" className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden mb-5">
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-dashed border-[var(--card-border)]">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Order number</div>
              <div className="font-mono text-xl sm:text-2xl font-black text-[var(--color-brand-red)]">{placed.orderNumber}</div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Verifying payment
            </span>
          </div>
          <dl className="px-5 py-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Amount</dt>
              <dd className="font-black tabular-nums">{formatBDT(placed.total)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Transaction ID</dt>
              <dd className="font-mono font-bold">{trxId.trim()}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500 shrink-0">Delivery email</dt>
              <dd className="font-bold truncate">{placed.customerEmail}</dd>
            </div>
          </dl>
          <p className="px-5 py-3 text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-900/60 border-t border-[var(--card-border)]">
            Your subscription details will be sent to your email, usually within 5–10 minutes after the payment check.
          </p>
        </section>

        {/* Next step: WhatsApp */}
        {siteConfig.whatsapp && (
          <section className="rounded-lg border-2 border-[#25D366]/70 bg-[#25D366]/10 p-5 mb-5">
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-md bg-[#25D366] text-white flex items-center justify-center shrink-0">
                <WhatsAppIcon className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#1ea952] dark:text-[#25D366]">Next step · Required</div>
                <h2 className="font-black text-base sm:text-lg leading-snug">Send your order on WhatsApp</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                  This confirms your order and gets your subscription to you faster. The message is already filled in.
                </p>
              </div>
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold text-sm shadow-[0_10px_30px_-10px_rgba(37,211,102,0.7)] transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Send order on WhatsApp
            </a>
            <p className="mt-2 text-center text-xs text-neutral-500">WhatsApp: {siteConfig.phone}</p>
          </section>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href={trackHref}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-bold text-sm transition-colors shadow-[0_10px_30px_-10px_rgba(229,9,20,0.7)]"
          >
            <PackageSearch className="w-4 h-4" />
            Track this order
          </Link>
          <DownloadBillButton
            orderNumber={placed.orderNumber}
            email={placed.customerEmail}
            wrapperClassName="flex flex-col gap-1"
            className={`${secondaryBtn} disabled:opacity-60`}
          />
          <Link href={billHref(placed.orderNumber, placed.customerEmail)} className={secondaryBtn}>
            <FileText className="w-4 h-4" />
            View bill
          </Link>
          <Link href="/" className={secondaryBtn}>
            Back to home
          </Link>
        </div>
        <p className="mt-4 text-center text-xs text-neutral-500">
          You can get your bill any time from <span className="font-bold">Get Bill</span> using your order number.
        </p>
      </main>
    );
  }

  if (hydrated && items.length === 0) {
    return (
      <main className="w-full max-w-site mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="relative text-center py-16 px-6 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] max-w-xl mx-auto overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-48 rounded-full bg-[var(--color-brand-red)]/15 blur-3xl" />
          <div className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-[var(--color-brand-red)] to-red-800 text-white flex items-center justify-center mx-auto mb-5 shadow-[0_10px_30px_-10px_rgba(229,9,20,0.7)]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="relative text-2xl font-black mb-2">Your cart is empty</h1>
          <p className="relative text-sm text-neutral-500 mb-7">Add a plan to your cart before checking out.</p>
          <Link
            href="/products"
            className="relative inline-flex items-center gap-2 px-7 py-3 rounded-md bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-bold text-sm transition-colors shadow-[0_10px_30px_-10px_rgba(229,9,20,0.7)]"
          >
            Browse products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-site mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-[var(--color-brand-red)] transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to cart
        </Link>
        <OrderSteps current={2} />
      </div>

      <div className="mb-6 sm:mb-8 pb-5 border-b border-[var(--card-border)]">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          <span className="text-[var(--color-brand-red)]">Checkout</span>
        </h1>
        <p className="text-neutral-500 text-sm mt-1">Complete your order in two simple steps</p>
      </div>

      <form onSubmit={submit} noValidate className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-6 lg:gap-8 items-start">
        <div className="space-y-6">
          <section className="p-5 sm:p-7 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg space-y-6">
            <StepTitle n={1} title="Your details" subtitle="Where we send your subscription" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Full name *" error={errors.fullName}>
                <input autoComplete="name" value={fullName} onChange={(e) => edit("fullName", setFullName)(e.target.value)} aria-invalid={Boolean(errors.fullName)} className={inputCls(errors.fullName)} placeholder="Enter your full name" />
              </Field>
              <Field label="Delivery email *" error={errors.email}>
                <input type="email" autoComplete="email" value={email} onChange={(e) => edit("email", setEmail)(e.target.value)} aria-invalid={Boolean(errors.email)} className={inputCls(errors.email)} placeholder="yourname@gmail.com" />
              </Field>
              <Field label="WhatsApp number *" error={errors.whatsapp}>
                <input type="tel" inputMode="tel" autoComplete="tel" value={whatsapp} onChange={(e) => edit("whatsapp", setWhatsapp)(e.target.value)} aria-invalid={Boolean(errors.whatsapp)} className={inputCls(errors.whatsapp)} placeholder="01XXXXXXXXX" />
              </Field>
              <Field label="Country">
                <input autoComplete="country-name" value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls()} />
              </Field>
            </div>
            <Field label="Note (optional)">
              <textarea rows={2} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} className={inputCls()} placeholder="কোনো অতিরিক্ত তথ্য থাকলে এখানে লিখুন" />
            </Field>
          </section>

          <section className="p-5 sm:p-7 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg space-y-6">
            <StepTitle n={2} title="Payment" subtitle="Send Money, then enter your number and TrxID" />
            <PaymentPicker
              methods={paymentMethods}
              method={method}
              onMethodChange={setMethod}
              senderNumber={senderNumber}
              onSenderNumberChange={edit("senderNumber", setSenderNumber)}
              trxId={trxId}
              onTrxIdChange={edit("trxId", setTrxId)}
              amount={total}
              errors={errors}
            />
          </section>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="p-5 sm:p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg space-y-5 shadow-[0_18px_60px_-20px_rgba(229,9,20,0.25)]">
            <h2 className="text-lg font-black tracking-tight flex items-center justify-between">
              <span>Order Summary</span>
              <Link href="/cart" className="text-xs font-bold text-neutral-500 hover:text-[var(--color-brand-red)] transition-colors">
                Edit cart
              </Link>
            </h2>

            {!hydrated ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-10 rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-10 rounded bg-neutral-200 dark:bg-neutral-800" />
              </div>
            ) : (
              <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.planId} className="flex items-center gap-3 text-xs font-semibold pb-3 border-b border-[var(--card-border)] last:border-0 last:pb-0">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-neutral-900 shrink-0 border border-[var(--card-border)]">
                      <Image src={item.imgUrl} alt="" fill sizes="48px" className="object-cover" />
                      {item.quantity > 1 && (
                        <span className="absolute top-0 right-0 min-w-5 h-5 px-1 rounded-bl-md bg-[var(--color-brand-red)] text-white text-[10px] font-black flex items-center justify-center">
                          {item.quantity}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-sm text-neutral-900 dark:text-white block truncate">{item.name}</span>
                      <span className="text-neutral-500 block truncate">
                        {item.planName}
                        {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                      </span>
                    </div>
                    <span className="font-black text-sm text-neutral-900 dark:text-white shrink-0 tabular-nums">{formatBDT(item.unitPrice * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            )}

            <dl className="space-y-3 text-sm border-t border-[var(--card-border)] pt-4">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Subtotal</dt>
                <dd className="font-semibold tabular-nums">{formatBDT(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Payout charge ({PAYOUT_CHARGE_PERCENT}%)</dt>
                <dd className="font-semibold tabular-nums">{formatBDT(payoutCharge)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Digital delivery</dt>
                <dd className="font-bold text-emerald-500">FREE</dd>
              </div>
            </dl>
            <div className="flex items-end justify-between pt-4 border-t border-dashed border-[var(--card-border)]">
              <span className="font-bold">Total</span>
              <span className="text-3xl font-black text-[var(--color-brand-red)] tabular-nums leading-none">{formatBDT(total)}</span>
            </div>

            {submitError && (
              <div role="alert" className="flex gap-2 p-3 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs font-semibold text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  {submitError}
                  {/refresh your cart|out of stock/i.test(submitError) && (
                    <>
                      {" "}
                      <Link href="/cart" className="underline">
                        Review cart
                      </Link>
                    </>
                  )}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !hydrated || items.length === 0}
              className="w-full py-3.5 rounded-md bg-[var(--color-brand-red)] hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold text-base shadow-[0_10px_30px_-10px_rgba(229,9,20,0.7)] transition-colors active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-4 h-4" />}
              {submitting ? "Placing order…" : `Complete order · ${formatBDT(total)}`}
            </button>

            <div className="flex items-start gap-2 text-xs text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Prices are confirmed by our server when you order. Delivery usually takes 5–10 minutes after payment check.</span>
            </div>
          </div>
        </aside>
      </form>
    </main>
  );
}

function StepTitle({ n, title, subtitle }: { n: number; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-4">
      <div className="w-9 h-9 rounded-md bg-gradient-to-br from-[var(--color-brand-red)] to-red-800 text-white font-black flex items-center justify-center text-sm shadow-[0_6px_16px_-6px_rgba(229,9,20,0.6)]">
        {n}
      </div>
      <div>
        <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
