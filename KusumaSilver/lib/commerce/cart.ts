/**
 * Client-side cart persistence. Deliberately minimal: product IDs, chosen
 * size, quantities, and timestamps ONLY — never prices, names, or any
 * customer data. Display data is fetched fresh from the catalogue, and all
 * totals are recomputed server-side at checkout.
 */

export interface CartItem {
  productId: string;
  slug: string;
  /** Category slug, needed to build the product URL. */
  category: string;
  /** Chosen size, by slug — or null for pieces without sizes. */
  size: string | null;
  /**
   * Chosen gemstone, by slug — or null for pieces without stones.
   * Part of the line identity: the same ring in Amethyst and in Garnet are two
   * different lines, and may be two different prices.
   */
  gemstone: string | null;
  qty: number;
  addedAt: number;
}

export const CART_STORAGE_KEY = 'ks_cart';
export const MAX_QTY_PER_LINE = 10;

interface StoredCart {
  v: 1;
  items: CartItem[];
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.productId === 'string' &&
    typeof item.slug === 'string' &&
    typeof item.category === 'string' &&
    (typeof item.size === 'string' || item.size === null) &&
    // Carts saved before variants existed have no gemstone at all; treat that
    // as "no stone chosen" rather than discarding the shopper's whole cart.
    (typeof item.gemstone === 'string' || item.gemstone === null || item.gemstone === undefined) &&
    typeof item.qty === 'number' &&
    item.qty > 0 &&
    typeof item.addedAt === 'number'
  );
}

export function readStoredCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    const items = (parsed as StoredCart)?.items;
    if (!Array.isArray(items)) return [];
    return items.filter(isCartItem).map((item) => ({ ...item, gemstone: item.gemstone ?? null }));
  } catch {
    return [];
  }
}

export function writeStoredCart(items: CartItem[]): void {
  try {
    const stored: StoredCart = { v: 1, items };
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage unavailable (private mode, quota) — cart lives in memory only.
  }
}

/** Identity of a cart line: the same piece in a different stone or size is a
 * different line, because it is a different thing to buy at a different price. */
export type LineKey = Pick<CartItem, 'productId' | 'size' | 'gemstone'>;

export function sameLine(a: LineKey, b: LineKey): boolean {
  return (
    a.productId === b.productId &&
    a.size === b.size &&
    (a.gemstone ?? null) === (b.gemstone ?? null)
  );
}
