import Image from "next/image";
import type { TrackedOrder } from "@/types/catalog";
import { formatBDT, formatDate, itemPlanLabel } from "@/lib/format";
import { PAYMENT_NAMES, SELLER, summarizeBill, type BillStatusKey } from "@/lib/invoice/invoiceData";
import { orderPayoutCharge } from "@/lib/pricing";

const STATUS_STYLE: Record<BillStatusKey, string> = {
  PAID: "bg-green-600 text-white",
  PENDING: "bg-amber-500 text-white",
  REJECTED: "bg-red-600 text-white",
  REFUNDED: "bg-violet-600 text-white",
  CANCELLED: "bg-neutral-500 text-white",
};

/**
 * The bill as a printable "sheet of paper": always light, whatever the site theme,
 * so it looks the same on screen, when printed, and next to the PDF.
 */
export function BillDocument({ order }: { order: TrackedOrder }) {
  const bill = summarizeBill(order);

  return (
    <article
      id="bill"
      aria-label={`Bill ${order.orderNumber}`}
      className="bill-sheet relative w-full bg-white text-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 print:shadow-none print:border-0 print:rounded-none"
    >
      <div className="h-1.5 bg-[#E50914]" />
      <div className="p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/images/logo-emblem.png" alt="" width={48} height={42} className="w-12 h-auto" />
            <div>
              <div className="text-2xl font-black tracking-tight leading-none">
                TECH<span className="text-[#E50914]">FLIX</span>
              </div>
              <div className="text-xs text-neutral-500 mt-1">{SELLER.tagline}</div>
            </div>
          </div>
          <div className="sm:text-right">
            <div className="text-3xl font-black tracking-tight">BILL</div>
            <div className="font-mono font-bold text-neutral-700">{order.orderNumber}</div>
            <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${STATUS_STYLE[bill.status]}`}>
              {bill.statusLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-200 text-sm">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Billed to</div>
            <div className="font-bold">{order.customerName}</div>
            <div className="text-neutral-600 break-all">{order.customerEmail}</div>
            <div className="text-neutral-600">{order.customerPhone}</div>
            {order.country && <div className="text-neutral-600">{order.country}</div>}
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">From</div>
            <div className="font-bold">{SELLER.name}</div>
            <div className="text-neutral-600 break-all">{SELLER.email}</div>
            <div className="text-neutral-600">{SELLER.phone}</div>
          </div>
          <dl className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Details</div>
            <Row k="Bill no." v={order.orderNumber} />
            <Row k="Order date" v={formatDate(order.createdAt)} />
            {order.deliveredAt && <Row k="Delivered" v={formatDate(order.deliveredAt)} />}
          </dl>
        </div>

        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="bg-neutral-100 text-[11px] uppercase tracking-wider text-neutral-500">
                <th className="text-left font-bold py-2.5 px-3 w-8">#</th>
                <th className="text-left font-bold py-2.5 px-3">Item</th>
                <th className="text-center font-bold py-2.5 px-3 w-14">Qty</th>
                <th className="text-right font-bold py-2.5 px-3">Unit price</th>
                <th className="text-right font-bold py-2.5 px-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-b border-neutral-200">
                  <td className="py-3 px-3 text-neutral-400">{i + 1}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold">{item.productName}</div>
                    <div className="text-xs text-neutral-500">
                      {itemPlanLabel(item)}
                      {item.planValidity ? ` · ${item.planValidity}` : ""}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">{item.quantity}</td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">{formatBDT(item.unitPrice)}</td>
                  <td className="py-3 px-3 text-right font-bold whitespace-nowrap">{formatBDT(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <dl className="w-full sm:w-72 space-y-2 text-sm">
            <Row k="Subtotal" v={formatBDT(order.subtotal)} />
            {order.discount > 0 && <Row k="Discount" v={`− ${formatBDT(order.discount)}`} />}
            {orderPayoutCharge(order) > 0 && <Row k="Payout charge (2%)" v={formatBDT(orderPayoutCharge(order))} />}
            <Row k="Digital delivery" v="Free" />
            <div className="flex justify-between items-baseline pt-2 border-t border-neutral-200">
              <dt className="font-black">Total</dt>
              <dd className="text-xl font-black text-[#E50914]">{formatBDT(order.total)}</dd>
            </div>
            <Row k="Paid" v={formatBDT(bill.paid)} />
            <div className="flex justify-between font-bold">
              <dt>Balance due</dt>
              <dd className={bill.balanceDue > 0 ? "text-amber-600" : ""}>{formatBDT(bill.balanceDue)}</dd>
            </div>
          </dl>
        </div>

        {bill.payment && (
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <Cell k="Method" v={PAYMENT_NAMES[bill.payment.method]} />
            <Cell k="Transaction ID" v={bill.payment.trxId} mono />
            <Cell k="Amount" v={formatBDT(bill.payment.amount)} />
            <Cell
              k="Status"
              v={bill.payment.status === "VERIFIED" ? "Verified" : bill.payment.status === "REJECTED" ? "Rejected" : "Being verified"}
            />
          </div>
        )}

        <footer className="pt-6 border-t border-neutral-200 text-center space-y-1">
          <p className="font-bold text-sm">Thank you for shopping with TECH FLIX!</p>
          <p className="text-xs text-neutral-500">
            Questions about this bill? {SELLER.email} · WhatsApp {SELLER.phone}
          </p>
          <p className="text-[11px] text-neutral-400">This is a computer-generated bill and does not need a signature.</p>
        </footer>
      </div>
    </article>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-neutral-500">{k}</dt>
      <dd className="font-semibold text-right">{v}</dd>
    </div>
  );
}

function Cell({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs text-neutral-500">{k}</div>
      <div className={`font-bold ${mono ? "font-mono" : ""}`}>{v}</div>
    </div>
  );
}
