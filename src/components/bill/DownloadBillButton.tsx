"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type { TrackedOrder } from "@/types/catalog";
import { orderService, errorMessage } from "@/services/orderService";

type Props = {
  className?: string;
  label?: string;
} & ({ order: TrackedOrder } | { orderNumber: string; email: string });

/** Downloads the bill as a PDF. Pass a loaded order, or an order number + email to fetch it first. */
export function DownloadBillButton(props: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const download = async () => {
    setBusy(true);
    setError("");
    try {
      const order = "order" in props ? props.order : await orderService.track(props.orderNumber, props.email);
      const { downloadBillPdf } = await import("@/lib/invoice/downloadBillPdf");
      await downloadBillPdf(order);
    } catch (err) {
      setError(errorMessage(err, "Could not create the bill. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="inline-flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={download}
        disabled={busy}
        className={
          props.className ||
          "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-bold text-sm disabled:opacity-60 transition-colors"
        }
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {busy ? "Preparing PDF…" : props.label || "Download bill (PDF)"}
      </button>
      {error && (
        <span role="alert" className="text-xs font-semibold text-red-500">
          {error}
        </span>
      )}
    </span>
  );
}
