'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Check, Minus, Plus } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { MAX_QTY_PER_LINE } from '@/lib/commerce/cart';
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
 * Size + quantity selection, add-to-bag, buy-now, and a WhatsApp fallback for
 * the piece detail page. Owns the selected size and quantity so the cart line
 * records the actual choice.
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
  const router = useRouter();
  const { addItem } = useCart();
  const [selected, setSelected] = useState<string | null>(sizes[0] ?? null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  // Bumped on each add so the aria-live region re-announces even on a repeat
  // add within the confirmation window.
  const [addCount, setAddCount] = useState(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  function addToCart() {
    addItem({ productId, slug, category, size: selected }, qty);
  }

  function handleAdd() {
    addToCart();
    setAdded(true);
    setAddCount((n) => n + 1);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setAdded(false), 2500);
  }

  function handleBuyNow() {
    addToCart();
    router.push(`/${locale}/checkout`);
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

      {inStock ? (
        <div className="mt-8 w-full">
          {/* Quantity stepper + add to bag, side by side. */}
          <div className="flex gap-3">
            <div
              className="flex shrink-0 items-center border border-ink"
              role="group"
              aria-label={t.pieceV3.quantityLabel}
            >
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label={t.bag.decrease}
                className="flex h-[52px] w-11 cursor-pointer items-center justify-center text-ink transition-colors hover:bg-ink/5 disabled:cursor-default disabled:opacity-30"
              >
                <Minus size={14} strokeWidth={1.5} aria-hidden="true" />
              </button>
              <span className="w-9 text-center text-sm font-medium tabular-nums text-ink">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(MAX_QTY_PER_LINE, q + 1))}
                disabled={qty >= MAX_QTY_PER_LINE}
                aria-label={t.bag.increase}
                className="flex h-[52px] w-11 cursor-pointer items-center justify-center text-ink transition-colors hover:bg-ink/5 disabled:cursor-default disabled:opacity-30"
              >
                <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 bg-ink px-6 text-xs font-semibold tracking-[0.16em] text-paper transition-colors hover:bg-accent"
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
          </div>

          <button
            type="button"
            onClick={handleBuyNow}
            className="mt-3 flex w-full cursor-pointer items-center justify-center border border-ink px-8 py-4 text-xs font-semibold tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {t.pieceV3.buyNow}
          </button>

          <div aria-live="polite" className="sr-only">
            {added ? `${t.pieceV3.addedToBag}${addCount > 1 ? ` (${addCount})` : ''}` : ''}
          </div>
          {added && (
            <Link
              href={`/${locale}/keranjang`}
              className="mt-3 flex w-full items-center justify-center text-[11px] font-medium uppercase tracking-[0.12em] text-ink/60 underline decoration-ink/30 underline-offset-4 transition-colors hover:text-accent"
            >
              {t.pieceV3.viewBag}
            </Link>
          )}
          <p className="mt-4 text-[11px] leading-relaxed text-ink/45">
            {t.pieceV3.orderNote}{' '}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline decoration-ink/30 underline-offset-2 transition-colors hover:text-accent"
            >
              {t.pieceV3.orderWhatsApp}
            </a>
          </p>
        </div>
      ) : (
        <div className="mt-8 w-full">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center bg-ink px-8 py-4 text-xs font-semibold tracking-[0.16em] text-paper transition-colors hover:bg-accent"
          >
            {t.pieceV3.orderWhatsApp}
          </a>
          <p className="mt-2 text-[11px] text-ink/45">{t.pieceV3.orderNote}</p>
        </div>
      )}
    </>
  );
}
