/**
 * Central commerce configuration.
 * IDR is the authoritative currency for all stored prices and (later) payments.
 * USD is display-only, converted at a single configurable rate.
 */

export type Currency = 'idr' | 'usd';

export const SUPPORTED_CURRENCIES: Currency[] = ['idr', 'usd'];
export const DEFAULT_CURRENCY: Currency = 'idr';

/** 1 USD in IDR. Overridable via env so production can adjust without a deploy. */
export const EXCHANGE_RATE_IDR_PER_USD: number = Number(
  process.env.NEXT_PUBLIC_EXCHANGE_RATE_IDR_PER_USD ?? 16000
);

export const CURRENCY_COOKIE = 'ks_currency';

export function isCurrency(value: unknown): value is Currency {
  return value === 'idr' || value === 'usd';
}

export function formatIdr(amountIdr: number): string {
  return 'Rp ' + Math.round(amountIdr).toLocaleString('id-ID');
}

export function formatUsd(amountIdr: number): string {
  return '$' + Math.round(amountIdr / EXCHANGE_RATE_IDR_PER_USD).toLocaleString('en-US');
}

/** Format an authoritative IDR amount in the requested display currency. */
export function formatDisplayPrice(amountIdr: number, currency: Currency): string {
  return currency === 'usd' ? formatUsd(amountIdr) : formatIdr(amountIdr);
}
