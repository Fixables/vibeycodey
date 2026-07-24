'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Check, Minus, Plus } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { MAX_QTY_PER_LINE } from '@/lib/commerce/cart';
import { resolveVariant } from '@/lib/commerce/variants';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { OptionPicker } from './OptionPicker';
import { getT } from '@/lib/i18n';
import type { Locale, SizeTerm, TaxonomyTerm } from '@/types';

interface PurchasePanelProps {
  locale: Locale;
  productId: string;
  slug: string;
  category: string;
  /** Base price before any option price changes. */
  basePrice: number;
  gemstones: TaxonomyTerm[];
  sizes: SizeTerm[];
  inStock: boolean;
  whatsappLink: string;
}

/** First option a shopper can actually buy, so the page never opens sold out. */
function firstAvailable(options: TaxonomyTerm[]): string | null {
  return options.find((option) => option.inStock)?.slug ?? options[0]?.slug ?? null;
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
  basePrice,
  gemstones,
  sizes,
  inStock,
  whatsappLink,
}: PurchasePanelProps) {
  const t = getT(locale);
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(() => firstAvailable(sizes));
  const [selectedGemstone, setSelectedGemstone] = useState<string | null>(() =>
    firstAvailable(gemstones)
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  // Bumped on each add so the aria-live region re-announces even on a repeat
  // add within the confirmation window.
  const [addCount, setAddCount] = useState(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  // The exact combination the shopper is looking at. The checkout recalculates
  // this server-side from Sanity and never trusts a price from the browser —
  // this is only what to display, using the same function so the two agree.
  const variant = resolveVariant(
    { price: basePrice, gemstones, sizeOptions: sizes },
    { gemstone: selectedGemstone, size: selectedSize }
  );
  const canBuy = inStock && variant.available;

  function addToCart() {
    addItem(
      { productId, slug, category, size: selectedSize, gemstone: selectedGemstone },
      qty
    );
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
      <OptionPicker
        label={t.pieceV3.specStone}
        options={gemstones}
        selected={selectedGemstone}
        onSelect={setSelectedGemstone}
        soldOutLabel={t.pieceV3.soldOut}
      />
      <OptionPicker
        label={t.pieceV3.sizeLabel}
        options={sizes}
        selected={selectedSize}
        onSelect={setSelectedSize}
        soldOutLabel={t.pieceV3.soldOut}
      />

      {/* The price for the chosen combination, so it is never a surprise at
          checkout. aria-live because it changes as options are picked. */}
      <div className="mt-6 w-full" aria-live="polite">
        <PriceDisplay amountIdr={variant.price} className="font-heading text-[26px] text-ink" />
      </div>

      {canBuy ? (
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
