/**
 * Payout charge added on top of every order (mobile-banking cash-out fee).
 * Must match PAYOUT_CHARGE_PERCENT in techFlix-backend/src/modules/orders/orders.service.ts —
 * the backend is the source of truth for the amount actually charged.
 */
export const PAYOUT_CHARGE_PERCENT = 2;

/** 2% of the amount, rounded up to the next whole taka (integer maths avoids float drift). */
export const payoutChargeFor = (amount: number) =>
  amount > 0 ? Math.ceil((Math.round(amount * 100) * PAYOUT_CHARGE_PERCENT) / 10000) : 0;

/** Cart / checkout totals before the order exists. */
export const priceBreakdown = (subtotal: number) => {
  const payoutCharge = payoutChargeFor(subtotal);
  return { subtotal, payoutCharge, total: subtotal + payoutCharge };
};

/** Charge already included in a placed order's total (0 for orders placed before the charge existed). */
export const orderPayoutCharge = (order: { subtotal: number; discount: number; total: number }) =>
  Math.max(0, Math.round((order.total - order.subtotal + order.discount) * 100) / 100);
