"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy } from "lucide-react";
import type { PaymentMethod, PaymentMethodType } from "@/types/catalog";
import { MFS_STYLE } from "@/components/checkout/mfs";
import { formatBDT } from "@/lib/format";

interface PaymentPickerProps {
  methods: PaymentMethod[];
  method: PaymentMethodType;
  onMethodChange: (method: PaymentMethodType) => void;
  senderNumber: string;
  onSenderNumberChange: (value: string) => void;
  trxId: string;
  onTrxIdChange: (value: string) => void;
  amount?: number;
  errors?: { senderNumber?: string; trxId?: string };
}

/** bKash / Nagad / Rocket selector with the receiving number and TrxID inputs. Reused on the tracking page. */
export function PaymentPicker({
  methods,
  method,
  onMethodChange,
  senderNumber,
  onSenderNumberChange,
  trxId,
  onTrxIdChange,
  amount,
  errors = {},
}: PaymentPickerProps) {
  const [copied, setCopied] = useState(false);
  const active = methods.find((m) => m.method === method) ?? methods[0];
  const style = MFS_STYLE[active.method];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(active.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className="space-y-5">
      <div className={`grid gap-3.5 ${methods.length === 1 ? "grid-cols-1" : methods.length === 2 ? "grid-cols-2" : "grid-cols-3"}`} role="radiogroup" aria-label="Payment method">
        {methods.map((m) => {
          const s = MFS_STYLE[m.method];
          const selected = m.method === active.method;
          return (
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              key={m.method}
              onClick={() => onMethodChange(m.method)}
              className={`py-3.5 px-3 rounded-2xl border-2 font-black flex flex-col items-center justify-center gap-2 transition-all ${
                selected
                  ? `${s.borderColor} ${s.bgLight} shadow-lg`
                  : "border-[var(--card-border)] bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300"
              }`}
            >
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0 bg-white p-1">
                <Image src={s.imageSrc} alt="" fill sizes="48px" className="object-contain p-0.5" />
              </div>
              <span className="font-extrabold text-xs sm:text-sm">{s.name}</span>
            </button>
          );
        })}
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-[var(--card-border)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200">
            Send {amount !== undefined ? <span className="text-[var(--color-brand-red)]">{formatBDT(amount)}</span> : "money"} to this{" "}
            {style.name} {active.accountType.toLowerCase()} number
          </span>
          <div className="flex items-center gap-2 bg-white dark:bg-black px-4 py-2 rounded-xl border border-[var(--card-border)] self-start">
            <span className="font-mono font-black text-lg text-[var(--color-brand-red)]">{active.accountNumber}</span>
            <button
              type="button"
              onClick={copy}
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-[var(--color-brand-red)] transition-colors"
              aria-label="Copy number"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs font-bold text-amber-800 dark:text-amber-300">
          {active.instructions || "Send Money করে Transaction ID (TrxID) প্রদান করুন।"}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <Field label={`Your ${style.name} number *`} error={errors.senderNumber}>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              value={senderNumber}
              onChange={(e) => onSenderNumberChange(e.target.value)}
              aria-invalid={Boolean(errors.senderNumber)}
              className={inputCls(errors.senderNumber)}
            />
          </Field>
          <Field label="Transaction ID (TrxID) *" error={errors.trxId}>
            <input
              type="text"
              placeholder="e.g. 8N9K2L1M"
              autoCapitalize="characters"
              value={trxId}
              onChange={(e) => onTrxIdChange(e.target.value.toUpperCase())}
              aria-invalid={Boolean(errors.trxId)}
              className={`${inputCls(errors.trxId)} font-mono`}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

export const inputCls = (error?: string) =>
  `w-full px-4 py-3 rounded-2xl bg-white dark:bg-black border text-sm font-medium focus:outline-none focus:border-[var(--color-brand-red)] ${
    error ? "border-red-500" : "border-[var(--card-border)]"
  }`;

export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{label}</span>
      {children}
      {error && <span className="block text-xs font-semibold text-red-500">{error}</span>}
    </label>
  );
}

// Same rules as the backend, so most mistakes are caught before submitting
export const PHONE_RE = /^\+?[0-9]{7,15}$/;
export const TRX_RE = /^[A-Za-z0-9]{6,30}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const cleanPhone = (v: string) => v.replace(/[\s-]/g, "");
