'use client';

import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface CardAddToBagProps {
  locale: Locale;
  productId: string;
  slug: string;
  category: string;
  /** Default size for a quick add from the grid (first size, or null). */
  size: string | null;
}

/** Quick add-to-bag button for a catalogue card. */
export function CardAddToBag({ locale, productId, slug, category, size }: CardAddToBagProps) {
  const t = getT(locale);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function handleAdd() {
    addItem({ productId, slug, category, size });
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="flex w-full cursor-pointer items-center justify-center gap-2 bg-ink px-4 py-3 text-[11px] font-semibold tracking-[0.16em] text-paper transition-colors hover:bg-accent"
    >
      {added ? (
        <>
          <Check size={13} strokeWidth={2} aria-hidden="true" />
          {t.pieceV3.addedToBag.toUpperCase()}
        </>
      ) : (
        t.pieceV3.addToBag
      )}
    </button>
  );
}
