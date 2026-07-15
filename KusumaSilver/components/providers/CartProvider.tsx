'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  CART_STORAGE_KEY,
  MAX_QTY_PER_LINE,
  readStoredCart,
  sameLine,
  writeStoredCart,
  type CartItem,
} from '@/lib/commerce/cart';

interface CartContextValue {
  /** Empty during SSR and first paint (hydration-safe); loaded post-mount. */
  items: CartItem[];
  /** Total piece count across lines. */
  count: number;
  addItem: (item: Omit<CartItem, 'addedAt' | 'qty'>, qty?: number) => void;
  setQty: (productId: string, size: string | null, qty: number) => void;
  removeItem: (productId: string, size: string | null) => void;
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

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    if (loaded.current) writeStoredCart(next);
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, 'addedAt' | 'qty'>, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((line) => sameLine(line, item));
        const next = existing
          ? prev.map((line) =>
              sameLine(line, item)
                ? { ...line, qty: Math.min(line.qty + qty, MAX_QTY_PER_LINE) }
                : line
            )
          : [...prev, { ...item, qty: Math.min(qty, MAX_QTY_PER_LINE), addedAt: Date.now() }];
        if (loaded.current) writeStoredCart(next);
        return next;
      });
    },
    []
  );

  const setQty = useCallback((productId: string, size: string | null, qty: number) => {
    setItems((prev) => {
      const next =
        qty <= 0
          ? prev.filter((line) => !sameLine(line, { productId, size }))
          : prev.map((line) =>
              sameLine(line, { productId, size })
                ? { ...line, qty: Math.min(qty, MAX_QTY_PER_LINE) }
                : line
            );
      if (loaded.current) writeStoredCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback(
    (productId: string, size: string | null) => setQty(productId, size, 0),
    [setQty]
  );

  const clear = useCallback(() => persist([]), [persist]);

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
