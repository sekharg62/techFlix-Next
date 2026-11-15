"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Loader2, ShieldCheck, ShoppingBag, Zap, AlertCircle, PackageSearch, FileText } from "lucide-react";
import { DownloadBillButton } from "@/components/bill/DownloadBillButton";
import { billHref } from "@/lib/invoice/invoiceData";
import { siteConfig } from "@/constants/siteConfig";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { useCart } from "@/context/CartContext";
import { formatBDT } from "@/lib/format";
import { priceBreakdown } from "@/lib/pricing";
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
    return (
      <main className="w-full max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center mx-auto shadow-xl">
          <Check className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Order placed!</h1>
        <div className="inline-flex flex-col items-center gap-1 px-6 py-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Order number</span>
          <span className="font-mono text-2xl font-black text-[var(--color-brand-red)]">{placed.orderNumber}</span>
          <span className="text-sm font-bold">{formatBDT(placed.total)}</span>
        </div>
        <p className="text-neutral-500 text-sm sm:text-base max-w-md mx-auto">
          Thank you, <span className="font-bold text-neutral-900 dark:text-white">{fullName}</span>. We are verifying your payment
          (TrxID <span className="font-mono font-bold">{trxId.trim()}</span>). Your subscription details will be sent to{" "}
          <span className="font-bold text-neutral-900 dark:text-white">{placed.customerEmail}</span>.
        </p>
        {siteConfig.whatsapp && (
          <div className="p-5 sm:p-6 rounded-2xl border-2 border-[#25D366] bg-[#25D366]/10 space-y-3">
            <div className="flex items-center justify-center gap-2 font-black text-lg">
              <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
              Important: message us on WhatsApp
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto">
              To confirm your order and get your subscription faster, you <span className="font-bold">must</span> send us a
              WhatsApp message with your order number. Tap the button below — the message is already filled in for you.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold text-sm shadow-lg transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Send order on WhatsApp
            </a>
            <p className="text-xs text-neutral-500">WhatsApp: {siteConfig.phone}</p>
          </div>
        )}
        <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center justify-center gap-2 font-black">
            <FileText className="w-5 h-5 text-[var(--color-brand-red)]" />
            Your bill is ready
          </div>
          <p className="text-xs text-neutral-500">
            Save it for your records. You can also get it any time from <span className="font-bold">Get Bill</span> with your order number.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <DownloadBillButton orderNumber={placed.orderNumber} email={placed.customerEmail} />
            <Link
              href={billHref(placed.orderNumber, placed.customerEmail)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[var(--card-border)] font-bold text-sm hover:border-[var(--color-brand-red)]"
            >
              <FileText className="w-4 h-4" />
              View bill
            </Link>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={trackHref}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[var(--color-brand-red)] text-white font-bold text-sm hover:opacity-90"
          >
            <PackageSearch className="w-4 h-4" />
            Track this order
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-[var(--card-border)] font-bold text-sm hover:border-[var(--color-brand-red)]"
          >
            Back to home
          </Link>
        </div>
        <p className="text-xs text-neutral-500">Need help? WhatsApp us at {siteConfig.phone}</p>
      </main>
    );
  }

  if (hydrated && items.length === 0) {
    return (
      <main className="w-full max-w-xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-12 h-12 mx-auto text-[var(--color-brand-red)] mb-4" />
        <h1 className="text-2xl font-black mb-2">Your cart is empty</h1>
        <p className="text-sm text-neutral-500 mb-6">Add a plan to your cart before checking out.</p>
        <Link href="/products" className="inline-block px-8 py-3.5 rounded-full bg-[var(--color-brand-red)] text-white font-bold text-sm">
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-[var(--color-brand-red)] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to cart
      </Link>

      <div className="mb-8 pb-4 border-b border-[var(--card-border)]">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Checkout</h1>
        <p className="text-neutral-500 text-sm mt-1 font-medium">Complete your order in two simple steps</p>
      </div>

      <form onSubmit={submit} noValidate className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="p-6 sm:p-8 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl space-y-6 shadow-sm">
            <StepTitle n={1} title="Your details" />
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

          <section className="p-6 sm:p-8 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl space-y-6 shadow-sm">
            <StepTitle n={2} title="Payment" />
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

        <aside className="space-y-6">
          <div className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl space-y-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-black tracking-tight border-b border-[var(--card-border)] pb-4 flex items-center justify-between">
              <span>Order summary</span>
              <ShoppingBag className="w-5 h-5 text-[var(--color-brand-red)]" />
            </h2>

            {!hydrated ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-10 rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-10 rounded bg-neutral-200 dark:bg-neutral-800" />
              </div>
            ) : (
              <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.planId} className="flex items-center gap-3 text-xs font-semibold py-1.5 border-b border-[var(--card-border)] last:border-0">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                      <Image src={item.imgUrl} alt="" fill sizes="40px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-neutral-900 dark:text-white block truncate">{item.name}</span>
                      <span className="text-neutral-400">
                        {item.planName} × {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-[var(--color-brand-red)] shrink-0">{formatBDT(item.unitPrice * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-2.5 text-sm font-bold border-t border-[var(--card-border)] pt-4">
              <div className="flex justify-between text-neutral-500 text-xs">
                <span>Subtotal</span>
                <span>{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-500 text-xs">
                <span>Payout charge (2%)</span>
                <span>{formatBDT(payoutCharge)}</span>
              </div>
              <div className="flex justify-between text-neutral-500 text-xs">
                <span>Digital delivery</span>
                <span className="text-emerald-500">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-black text-neutral-900 dark:text-white pt-2 border-t border-[var(--card-border)]">
                <span>Total</span>
                <span className="text-[var(--color-brand-red)]">{formatBDT(total)}</span>
              </div>
            </div>

            {submitError && (
              <div role="alert" className="flex gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs font-semibold text-red-700 dark:text-red-300">
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
              className="w-full py-4 rounded-full bg-[var(--color-brand-red)] hover:bg-red-700 disabled:opacity-60 disabled:hover:scale-100 text-white font-black text-base shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-white" />}
              {submitting ? "Placing order…" : "Complete order"}
            </button>

            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Prices are confirmed by our server when you order.</span>
            </div>
          </div>
        </aside>
      </form>
    </main>
  );
}

function StepTitle({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-4">
      <div className="w-8 h-8 rounded-full bg-[var(--color-brand-red)] text-white font-black flex items-center justify-center text-sm">{n}</div>
      <h2 className="text-xl font-black tracking-tight">{title}</h2>
    </div>
  );
}
