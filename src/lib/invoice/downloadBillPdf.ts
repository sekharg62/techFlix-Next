import type { TrackedOrder } from "@/types/catalog";
import { PAYMENT_NAMES, SELLER, billFileName, summarizeBill, type BillStatusKey } from "@/lib/invoice/invoiceData";
import { orderPayoutCharge } from "@/lib/pricing";

// Built-in PDF fonts have no "৳" glyph, so amounts are written as "BDT 1,197.00"
const money = (n: number) =>
  `BDT ${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const date = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

type RGB = [number, number, number];
const BRAND: RGB = [229, 9, 20];
const INK: RGB = [23, 23, 23];
const MUTED: RGB = [115, 115, 115];
const LINE: RGB = [229, 229, 229];

const STATUS_COLOR: Record<BillStatusKey, RGB> = {
  PAID: [22, 163, 74],
  PENDING: [217, 119, 6],
  REJECTED: [220, 38, 38],
  REFUNDED: [124, 58, 237],
  CANCELLED: [115, 115, 115],
};

async function loadImage(src: string): Promise<string | null> {
  try {
    const blob = await (await fetch(src)).blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null; // logo is optional
  }
}

/**
 * Builds an A4 PDF bill in the browser and downloads it.
 * The PDF libraries are loaded on demand so they never weigh down normal page loads.
 */
export async function downloadBillPdf(order: TrackedOrder) {
  const [{ jsPDF }, { default: autoTable }, logo] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
    loadImage("/images/logo-emblem.png"),
  ]);

  const bill = summarizeBill(order);
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 16;

  doc.setProperties({
    title: `Bill ${order.orderNumber}`,
    subject: "TECH FLIX order bill",
    author: SELLER.name,
    creator: SELLER.name,
  });

  // ── Brand bar + header ─────────────────────────────────
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, W, 4, "F");

  let x = M;
  if (logo) {
    doc.addImage(logo, "PNG", M, 12, 13, 11.3);
    x = M + 16;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...INK);
  doc.text("TECH", x, 20.5);
  doc.setTextColor(...BRAND);
  doc.text("FLIX", x + doc.getTextWidth("TECH"), 20.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text(SELLER.tagline, x, 25.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...INK);
  doc.text("BILL", W - M, 19, { align: "right" });
  doc.setFontSize(10);
  doc.text(order.orderNumber, W - M, 25.5, { align: "right" });

  // Status pill
  const label = bill.statusLabel.toUpperCase();
  doc.setFontSize(8);
  const pillW = doc.getTextWidth(label) + 8;
  doc.setFillColor(...STATUS_COLOR[bill.status]);
  doc.roundedRect(W - M - pillW, 29, pillW, 6, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.text(label, W - M - pillW / 2, 33, { align: "center" });

  // ── Parties & dates ────────────────────────────────────
  let y = 46;
  doc.setDrawColor(...LINE);
  doc.line(M, y - 5, W - M, y - 5);

  const col2 = M + 66;
  const col3 = W - M - 52;
  const heading = (t: string, cx: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(t, cx, y);
  };
  const lines = (rows: string[], cx: number, firstBold = true) => {
    rows.filter(Boolean).forEach((r, i) => {
      doc.setFont("helvetica", i === 0 && firstBold ? "bold" : "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...INK);
      doc.text(r, cx, y + 5.5 + i * 5);
    });
  };

  heading("BILLED TO", M);
  lines([order.customerName, order.customerEmail, order.customerPhone, order.country || ""], M);
  heading("FROM", col2);
  lines([SELLER.name, SELLER.email, SELLER.phone, SELLER.website], col2);
  heading("DETAILS", col3);
  doc.setFontSize(9.5);
  [
    ["Bill no.", order.orderNumber],
    ["Order date", date(order.createdAt)],
    ["Issued", date(new Date().toISOString())],
    ...(order.deliveredAt ? [["Delivered", date(order.deliveredAt)]] : []),
  ].forEach(([k, v], i) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(k, col3, y + 5.5 + i * 5);
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.text(v, W - M, y + 5.5 + i * 5, { align: "right" });
  });

  // ── Items table ────────────────────────────────────────
  autoTable(doc, {
    startY: y + 30,
    margin: { left: M, right: M },
    head: [["#", "Item", "Qty", "Unit price", "Amount"]],
    body: order.items.map((item, i) => [
      String(i + 1),
      `${item.productName}\n${item.planName}${item.planValidity ? ` · ${item.planValidity}` : ""}`,
      String(item.quantity),
      money(item.unitPrice),
      money(item.lineTotal),
    ]),
    theme: "plain",
    styles: { font: "helvetica", fontSize: 9.5, textColor: INK, cellPadding: { top: 3.2, bottom: 3.2, left: 2.5, right: 2.5 } },
    headStyles: { fillColor: [245, 245, 245], textColor: MUTED, fontStyle: "bold", fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 9, textColor: MUTED },
      2: { cellWidth: 14, halign: "center" },
      3: { cellWidth: 32, halign: "right" },
      4: { cellWidth: 34, halign: "right", fontStyle: "bold" },
    },
    didParseCell: (data) => {
      if (data.section === "head" && data.column.index >= 3) data.cell.styles.halign = "right";
      if (data.section === "head" && data.column.index === 2) data.cell.styles.halign = "center";
    },
    didDrawCell: (data) => {
      if (data.section === "body") {
        doc.setDrawColor(...LINE);
        doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
      }
    },
  });

  // ── Totals ─────────────────────────────────────────────
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
  const tx = W - M - 72;
  const totalRow = (k: string, v: string, opts: { bold?: boolean; color?: RGB; size?: number } = {}) => {
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(opts.size ?? 9.5);
    doc.setTextColor(...(opts.bold ? INK : MUTED));
    doc.text(k, tx, y);
    doc.setTextColor(...(opts.color ?? INK));
    doc.text(v, W - M, y, { align: "right" });
    y += opts.size ? opts.size * 0.6 : 6;
  };
  totalRow("Subtotal", money(order.subtotal));
  if (order.discount > 0) totalRow("Discount", `- ${money(order.discount)}`);
  const payoutCharge = orderPayoutCharge(order);
  if (payoutCharge > 0) totalRow("Payout charge (2%)", money(payoutCharge));
  totalRow("Digital delivery", "Free");
  doc.setDrawColor(...LINE);
  doc.line(tx, y - 2.5, W - M, y - 2.5);
  y += 2;
  totalRow("Total", money(order.total), { bold: true, size: 12, color: BRAND });
  y += 1;
  totalRow("Paid", money(bill.paid));
  totalRow("Balance due", money(bill.balanceDue), { bold: true, color: bill.balanceDue > 0 ? STATUS_COLOR.PENDING : INK });

  // ── Payment details ────────────────────────────────────
  if (bill.payment) {
    y += 6;
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(...LINE);
    doc.roundedRect(M, y, W - 2 * M, 20, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text("PAYMENT", M + 5, y + 6.5);
    const p = bill.payment;
    const cells: [string, string][] = [
      ["Method", PAYMENT_NAMES[p.method]],
      ["Transaction ID", p.trxId],
      ["Amount", money(p.amount)],
      ["Status", p.status === "VERIFIED" ? "Verified" : p.status === "REJECTED" ? "Rejected" : "Being verified"],
    ];
    const cw = (W - 2 * M - 10) / cells.length;
    cells.forEach(([k, v], i) => {
      const cx = M + 5 + i * cw;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      doc.text(k, cx, y + 12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...INK);
      doc.text(v, cx, y + 17);
    });
    y += 20;
  }

  // ── Footer ─────────────────────────────────────────────
  doc.setDrawColor(...LINE);
  doc.line(M, H - 24, W - M, H - 24);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...INK);
  doc.text("Thank you for shopping with TECH FLIX!", W / 2, H - 17, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    `Questions about this bill? ${SELLER.email}  ·  WhatsApp ${SELLER.phone}`,
    W / 2,
    H - 12,
    { align: "center" }
  );
  doc.text("This is a computer-generated bill and does not need a signature.", W / 2, H - 7.5, { align: "center" });

  doc.save(billFileName(order.orderNumber));
}
