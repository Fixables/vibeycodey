'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  isCurrency,
  type Currency,
} from '@/lib/commerce/config';

interface CurrencyContextValue {
  /** Display currency. Always DEFAULT_CURRENCY during SSR and first paint (hydration-safe). */
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
});

function readCookie(name: string): string | undefined {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match?.split('=')[1];
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);

  // Read persisted preference after mount so SSR output (IDR) never mismatches.
  // Deliberate one-time post-hydration sync from an external store (cookie);
  // must not run during render or SSR/client HTML would diverge.
  useEffect(() => {
    const saved = readCookie(CURRENCY_COOKIE);
    if (isCurrency(saved) && saved !== DEFAULT_CURRENCY) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrencyState(saved);
    }
  }, []);

  function setCurrency(next: Currency) {
    setCurrencyState(next);
    document.cookie = `${CURRENCY_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
