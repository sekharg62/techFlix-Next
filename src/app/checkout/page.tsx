"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  ShoppingBag,
  Zap
} from "lucide-react";
import { siteConfig } from "@/constants/siteConfig";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const cartContext = useCart();
  const cart = cartContext?.cart || [];
  const clearCart = cartContext?.clearCart || (() => {});

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("🇧🇩 Bangladesh");
  const [note, setNote] = useState("");

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "rocket">("bkash");
  const [customerMfsNumber, setCustomerMfsNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [copied, setCopied] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Dynamic MFS Config with actual user images
  const mfsConfig = {
    bkash: {
      name: "bKash",
      number: siteConfig.bkashNumber,
      imageSrc: "/images/bkash.png",
      color: "bg-[#E2136E]",
      borderColor: "border-[#E2136E]",
      bgLight: "bg-pink-50 dark:bg-pink-950/40 text-[#E2136E]",
    },
    nagad: {
      name: "Nagad",
      number: siteConfig.nagadNumber,
      imageSrc: "/images/nagad.png",
      color: "bg-[#F7931E]",
      borderColor: "border-[#F7931E]",
      bgLight: "bg-orange-50 dark:bg-orange-950/40 text-[#F7931E]",
    },
    rocket: {
      name: "Rocket",
      number: siteConfig.rocketNumber,
      imageSrc: "/images/rocket.png",
      color: "bg-[#8C3494]",
      borderColor: "border-[#8C3494]",
      bgLight: "bg-purple-50 dark:bg-purple-950/40 text-[#8C3494]",
    },
  };

  const activeMfs = mfsConfig[paymentMethod];

  // Calculate order total in BDT or fallback
  const totalBDT = cart.reduce((acc: number, item: any) => {
    const bdtVal = parseFloat(item.priceBDT?.replace(/[^0-9.]/g, "") || "0");
    const usdVal = parseFloat(item.price?.replace(/[^0-9.]/g, "") || "0");
    return acc + (bdtVal || usdVal * 120);
  }, 0);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(activeMfs.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !whatsapp || !customerMfsNumber || !trxId) {
      alert("Please fill in all required customer & transaction fields.");
      return;
    }
    setOrderComplete(true);
    clearCart();
  };

  if (orderComplete) {
    return (
      <main className="w-full max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-500 flex items-center justify-center mx-auto shadow-xl">
          <Check className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Order Placed Successfully!</h1>
        <p className="text-neutral-500 text-sm sm:text-base max-w-md mx-auto">
          Thank you <span className="font-bold text-neutral-900 dark:text-white">{fullName}</span>. Your payment transaction (TrxID: <span className="font-mono font-bold text-[var(--color-brand-red)]">{trxId}</span>) is being verified. Your license keys will be dispatched to <span className="font-bold text-neutral-900 dark:text-white">{email}</span> shortly.
        </p>
        <div className="p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] text-xs text-neutral-500 font-semibold">
          Need quick support? WhatsApp us at {siteConfig.phone}
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--color-brand-red)] text-white font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Return to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link 
        href="/products" 
        className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-[var(--color-brand-red)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      {/* Page Title & Subtitle */}
      <div className="mb-8 pb-4 border-b border-[var(--card-border)]">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Checkout
        </h1>
        <p className="text-neutral-500 text-sm mt-1 font-medium">
          Complete your order in a few simple steps
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Steps 1 & 2 */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* STEP 1: Customer Information */}
          <div className="p-6 sm:p-8 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-brand-red)] text-white font-black flex items-center justify-center text-sm">
                1
              </div>
              <h2 className="text-xl font-black tracking-tight">Customer Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-[var(--card-border)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand-red)]"
                  />
                </div>
              </div>

              {/* Delivery Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Delivery Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-[var(--card-border)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand-red)]"
                  />
                </div>
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  WhatsApp Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="01XXXXXXXXX"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-[var(--card-border)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand-red)]"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Country *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-[var(--card-border)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand-red)]"
                  />
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Note (optional)
              </label>
              <textarea
                rows={2}
                placeholder="কোনো অতিরিক্ত তথ্য থাকলে এখানে লিখুন"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-[var(--card-border)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand-red)]"
              />
            </div>
          </div>

          {/* STEP 2: Payment Method */}
          <div className="p-6 sm:p-8 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-brand-red)] text-white font-black flex items-center justify-center text-sm">
                2
              </div>
              <h2 className="text-xl font-black tracking-tight">Payment Method</h2>
            </div>

            {/* MFS Selector Cards with User's Uploaded Brand Images */}
            <div className="grid grid-cols-3 gap-3.5">
              {(["bkash", "nagad", "rocket"] as const).map((method) => {
                const isSelected = paymentMethod === method;
                const config = mfsConfig[method];
                return (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-3.5 px-3 rounded-2xl border-2 font-black text-sm sm:text-base flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? `${config.borderColor} ${config.bgLight} shadow-lg scale-102`
                        : "border-[var(--card-border)] bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300"
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0 bg-white p-1">
                      <Image
                        src={config.imageSrc}
                        alt={config.name}
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                    <span className="font-extrabold text-xs sm:text-sm">{config.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic MFS Details Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-[var(--card-border)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-white p-0.5 border border-[var(--card-border)]">
                    <Image
                      src={activeMfs.imageSrc}
                      alt={activeMfs.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200">
                    Send to {activeMfs.name} number
                  </span>
                </div>
                
                {/* Copyable MFS Number */}
                <div className="flex items-center gap-2 bg-white dark:bg-black px-4 py-2 rounded-xl border border-[var(--card-border)]">
                  <span className="font-mono font-black text-lg text-[var(--color-brand-red)]">
                    {activeMfs.number}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-[var(--color-brand-red)] transition-colors cursor-pointer"
                    title="Copy Number"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Bangla Instructions */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs font-bold text-amber-800 dark:text-amber-300">
                Send Money করে Transaction ID (TrxID) প্রদান করুন।
              </div>

              {/* Transaction Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Your {activeMfs.name} Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="01XXXXXXXXX"
                    value={customerMfsNumber}
                    onChange={(e) => setCustomerMfsNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-black border border-[var(--card-border)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand-red)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Transaction ID (TrxID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 8N9K2L1M"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-black border border-[var(--card-border)] text-sm font-medium focus:outline-none focus:border-[var(--color-brand-red)]"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="space-y-6">
          <div className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl space-y-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-black tracking-tight border-b border-[var(--card-border)] pb-4 flex items-center justify-between">
              <span>Order Summary</span>
              <ShoppingBag className="w-5 h-5 text-[var(--color-brand-red)]" />
            </h2>

            {cart.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-semibold py-1.5 border-b border-[var(--card-border)] last:border-0">
                    <div className="truncate pr-2">
                      <span className="font-bold text-neutral-900 dark:text-white block truncate">{item.name}</span>
                      <span className="text-neutral-400">Qty: {item.quantity || 1}</span>
                    </div>
                    <span className="font-mono font-bold text-[var(--color-brand-red)] shrink-0">
                      {item.priceBDT || item.price}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-neutral-500 font-bold py-2">
                Sample Digital Order: ChatGPT Plus (1x)
              </div>
            )}

            <div className="space-y-2.5 text-sm font-bold border-t border-[var(--card-border)] pt-4">
              <div className="flex justify-between text-neutral-500 text-xs">
                <span>Subtotal</span>
                <span>৳ {totalBDT > 0 ? totalBDT.toLocaleString() : "1,200"}</span>
              </div>
              <div className="flex justify-between text-neutral-500 text-xs">
                <span>Digital Delivery Fee</span>
                <span className="text-emerald-500 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-black text-neutral-900 dark:text-white pt-2 border-t border-[var(--card-border)]">
                <span>Total Amount</span>
                <span className="text-[var(--color-brand-red)]">
                  ৳ {totalBDT > 0 ? totalBDT.toLocaleString() : "1,200"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-black text-base shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-white" />
              Complete Order
            </button>

            <div className="space-y-2 pt-2 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Instant email delivery after verification</span>
              </div>
            </div>
          </div>
        </div>

      </form>
    </main>
  );
}
