'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  CART_STORAGE_KEY,
  MAX_QTY_PER_LINE,
  readStoredCart,
  sameLine,
  writeStoredCart,
  type CartItem,
  type LineKey,
} from '@/lib/commerce/cart';

interface CartContextValue {
  /** Empty during SSR and first paint (hydration-safe); loaded post-mount. */
  items: CartItem[];
  /** Total piece count across lines. */
  count: number;
  addItem: (item: Omit<CartItem, 'addedAt' | 'qty'>, qty?: number) => void;
  setQty: (line: LineKey, qty: number) => void;
  removeItem: (line: LineKey) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue>({
  items: [],
  count: 0,
  addItem: () => {},
  setQty: () => {},
  removeItem: () => {},
  clear: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const loaded = useRef(false);

  // One-time post-hydration load from localStorage, same pattern as
  // CurrencyProvider — must not run during render or SSR HTML would diverge.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readStoredCart());
    loaded.current = true;

    // Keep multiple tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) setItems(readStoredCart());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Persist as a pure effect of state — never inside a setState updater (which
  // would double-run under StrictMode). Skipped until the initial load so the
  // empty SSR state can't clobber a stored cart before it's read.
  useEffect(() => {
    if (loaded.current) writeStoredCart(items);
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, 'addedAt' | 'qty'>, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((line) => sameLine(line, item));
      return existing
        ? prev.map((line) =>
            sameLine(line, item)
              ? { ...line, qty: Math.min(line.qty + qty, MAX_QTY_PER_LINE) }
              : line
          )
        : [...prev, { ...item, qty: Math.min(qty, MAX_QTY_PER_LINE), addedAt: Date.now() }];
    });
  }, []);

  const setQty = useCallback((line: LineKey, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((existing) => !sameLine(existing, line))
        : prev.map((existing) =>
            sameLine(existing, line)
              ? { ...existing, qty: Math.min(qty, MAX_QTY_PER_LINE) }
              : existing
          )
    );
  }, []);

  const removeItem = useCallback(
    (line: LineKey) => setQty(line, 0),
    [setQty]
  );

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((sum, line) => sum + line.qty, 0);

  return (
    <CartContext.Provider value={{ items, count, addItem, setQty, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
