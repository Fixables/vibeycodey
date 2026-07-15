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
  /** Chosen size chip, or null for pieces without sizes. */
  size: string | null;
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
    return items.filter(isCartItem);
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

/** Two lines are the same when product and size match. */
export function sameLine(a: Pick<CartItem, 'productId' | 'size'>, b: Pick<CartItem, 'productId' | 'size'>): boolean {
  return a.productId === b.productId && a.size === b.size;
}
