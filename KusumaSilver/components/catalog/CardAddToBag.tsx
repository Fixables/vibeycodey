'use client';

import Link from 'next/link';
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
  /** Default gemstone, same idea. */
  gemstone: string | null;
  /**
   * True when the piece offers a real choice of stone or size. Quick-adding
   * would then put an option in the bag that the shopper never picked — and
   * with per-option pricing that could also be the wrong price — so the button
   * sends them to the piece page to choose instead.
   */
  needsChoice: boolean;
  /** Where to send them when a choice is needed. */
  href: string;
}

/** Quick add-to-bag button for a catalogue card. */
export function CardAddToBag({
  locale,
  productId,
  slug,
  category,
  size,
  gemstone,
  needsChoice,
  href,
}: CardAddToBagProps) {
  const t = getT(locale);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function handleAdd() {
    addItem({ productId, slug, category, size, gemstone });
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 2000);
  }

  // A piece with options is chosen on its own page, not guessed at from a card.
  if (needsChoice) {
    return (
      <Link href={href} className="flex w-full cursor-pointer items-center justify-center gap-2 bg-ink px-4 py-3 text-[11px] font-semibold tracking-[0.16em] text-paper transition-colors hover:bg-accent">
        {t.pieceV3.chooseOptions}
      </Link>
    );
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
