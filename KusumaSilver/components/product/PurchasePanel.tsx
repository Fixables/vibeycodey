'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface PurchasePanelProps {
  locale: Locale;
  productId: string;
  slug: string;
  category: string;
  sizes: string[];
  inStock: boolean;
  whatsappLink: string;
}

/**
 * Size selection + add-to-bag + WhatsApp fallback for the piece detail page.
 * Owns the selected size so the cart line records the actual choice.
 */
export function PurchasePanel({
  locale,
  productId,
  slug,
  category,
  sizes,
  inStock,
  whatsappLink,
}: PurchasePanelProps) {
  const t = getT(locale);
  const { addItem } = useCart();
  const [selected, setSelected] = useState<string | null>(sizes[0] ?? null);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ productId, slug, category, size: selected });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  return (
    <>
      {sizes.length === 1 && (
        <div className="mt-6 w-full">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink/55">
            {t.pieceV3.sizeLabel}
          </p>
          <p className="mt-2 text-sm text-ink">{sizes[0]}</p>
        </div>
      )}
      {sizes.length > 1 && (
        <fieldset className="mt-6 w-full">
          <legend className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink/55">
            {t.pieceV3.sizeLabel}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelected(size)}
                aria-pressed={selected === size}
                className={`min-h-11 min-w-11 cursor-pointer border border-ink px-4 text-[13px] transition-colors ${
                  selected === size ? 'bg-ink text-paper' : 'bg-transparent text-ink hover:bg-ink/5'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-8 w-full">
        {inStock && (
          <button
            type="button"
            onClick={handleAdd}
            className="flex w-full cursor-pointer items-center justify-center gap-2 bg-ink px-8 py-4 text-xs font-semibold tracking-[0.16em] text-paper transition-colors hover:bg-accent"
          >
            {added ? (
              <>
                <Check size={15} strokeWidth={2} aria-hidden="true" />
                {t.pieceV3.addedToBag.toUpperCase()}
              </>
            ) : (
              t.pieceV3.addToBag
            )}
          </button>
        )}
        <div aria-live="polite" className="sr-only">
          {added ? t.pieceV3.addedToBag : ''}
        </div>
        {added && (
          <Link
            href={`/${locale}/keranjang`}
            className="mt-3 flex w-full items-center justify-center border border-ink px-8 py-3.5 text-xs font-semibold tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {t.pieceV3.viewBag}
          </Link>
        )}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-3 flex w-full items-center justify-center px-8 py-3.5 text-xs font-semibold tracking-[0.16em] transition-colors ${
            inStock
              ? 'border border-ink text-ink hover:border-accent hover:text-accent'
              : 'bg-ink text-paper hover:bg-accent'
          }`}
        >
          {t.pieceV3.orderWhatsApp}
        </a>
        <p className="mt-2 text-[11px] text-ink/45">{t.pieceV3.orderNote}</p>
      </div>
    </>
  );
}
