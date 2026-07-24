/**
 * Variant pricing and availability.
 *
 * THE ONE RULE: this module is the only place a variant price is calculated,
 * and both the browser and the checkout API import it. If the page showed a
 * price the server did not agree with, a shopper would be charged something
 * other than what they saw — so the arithmetic lives in one function used by
 * both sides. The server still recalculates from Sanity at checkout and never
 * trusts a number sent by the browser; this just guarantees the two agree.
 */

/** One choice on a piece: a gemstone or a size, with its price and stock. */
export interface VariantOption {
  slug: string;
  label: string;
  /** Rupiah added to the base price. Negative makes the option cheaper. */
  priceAdjust: number;
  inStock: boolean;
}

export interface VariantSelection {
  gemstone?: string | null;
  size?: string | null;
}

interface PriceableProduct {
  price: number;
  gemstones: VariantOption[];
  sizeOptions: VariantOption[];
}

/** Find a chosen option, or null when nothing is selected / it no longer exists. */
function find(options: VariantOption[], slug?: string | null): VariantOption | null {
  if (!slug) return null;
  return options.find((option) => option.slug === slug) ?? null;
}

/**
 * Price for one specific gemstone + size choice.
 *
 * Options that no longer exist contribute nothing rather than throwing: a stone
 * the owner deleted should fall back to the base price, not break the page or
 * the checkout. `resolveVariant` is what reports that as unavailable.
 */
export function variantPrice(product: PriceableProduct, selection: VariantSelection): number {
  const gemstone = find(product.gemstones, selection.gemstone);
  const size = find(product.sizeOptions, selection.size);
  const total = product.price + (gemstone?.priceAdjust ?? 0) + (size?.priceAdjust ?? 0);
  // A price change must never be able to drive a piece to zero or below.
  return Math.max(Math.round(total), 0);
}

/** The cheapest currently-buyable combination — the "from" price on a card. */
export function lowestVariantPrice(product: PriceableProduct): number {
  const cheapest = (options: VariantOption[]) => {
    const available = options.filter((option) => option.inStock);
    if (available.length === 0) return 0;
    return Math.min(...available.map((option) => option.priceAdjust));
  };
  return Math.max(
    Math.round(product.price + cheapest(product.gemstones) + cheapest(product.sizeOptions)),
    0
  );
}

/** True when a piece's price depends on which options are chosen. */
export function hasVariantPricing(product: PriceableProduct): boolean {
  const varies = (options: VariantOption[]) =>
    new Set(options.map((option) => option.priceAdjust)).size > 1;
  return varies(product.gemstones) || varies(product.sizeOptions);
}

export interface ResolvedVariant {
  price: number;
  /** False when a chosen option is sold out, or no longer exists at all. */
  available: boolean;
  /** Human-readable reason, for the checkout error and for logging. */
  reason?: 'gemstone-unavailable' | 'size-unavailable' | 'gemstone-missing' | 'size-missing';
  gemstone: VariantOption | null;
  size: VariantOption | null;
}

/**
 * Resolve a selection to a price plus whether it can actually be bought.
 *
 * Used by the checkout API against freshly-read Sanity data, which is what stops
 * a stale browser tab ordering a stone that sold out ten minutes ago.
 */
export function resolveVariant(
  product: PriceableProduct,
  selection: VariantSelection
): ResolvedVariant {
  const gemstone = find(product.gemstones, selection.gemstone);
  const size = find(product.sizeOptions, selection.size);

  // A selection that names an option the piece no longer offers is stale.
  let reason: ResolvedVariant['reason'];
  if (selection.gemstone && !gemstone) reason = 'gemstone-missing';
  else if (selection.size && !size) reason = 'size-missing';
  else if (gemstone && !gemstone.inStock) reason = 'gemstone-unavailable';
  else if (size && !size.inStock) reason = 'size-unavailable';

  // Choosing nothing is valid for a piece with no options, but not for one that
  // has them — the shopper must pick before it can be priced.
  if (!reason) {
    if (product.gemstones.length > 0 && !selection.gemstone) reason = 'gemstone-missing';
    else if (product.sizeOptions.length > 0 && !selection.size) reason = 'size-missing';
  }

  return {
    price: variantPrice(product, selection),
    available: !reason,
    reason,
    gemstone,
    size,
  };
}
