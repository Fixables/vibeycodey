/**
 * Shipping rule — PLACEHOLDER approved 2026-07-15 pending the final business
 * decision. One authoritative IDR rule, identical regardless of the display
 * currency (USD is display-only and converts these same amounts).
 */

export const FREE_SHIPPING_THRESHOLD_IDR = 2_000_000;
export const FLAT_SHIPPING_IDR = 45_000;

export function shippingForSubtotalIdr(subtotalIdr: number): number {
  if (subtotalIdr <= 0) return 0;
  return subtotalIdr >= FREE_SHIPPING_THRESHOLD_IDR ? 0 : FLAT_SHIPPING_IDR;
}
