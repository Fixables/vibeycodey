'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { MAX_QTY_PER_LINE } from '@/lib/commerce/cart';
import { shippingForSubtotalIdr } from '@/lib/commerce/shipping';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

export interface CartProductInfo {
  id: string;
  slug: string;
  category: string;
  name: string;
  nameEn: string;
  priceIdr: number;
  inStock: boolean;
  imageUrl?: string;
}

/**
 * Fetches catalogue data for the IDs in the cart (the cart itself stores no
 * names or prices) and renders line items + the order summary. Totals shown
 * here are advisory — checkout recomputes everything server-side.
 */
/** Product info plus the id set it was fetched for — so a line whose id isn't
 *  yet in `requested` is treated as still-loading rather than unavailable. */
interface CatalogueState {
  map: Map<string, CartProductInfo>;
  requested: Set<string>;
}

export function CartClient({ locale }: { locale: Locale }) {
  const t = getT(locale);
  const { items, setQty, removeItem } = useCart();
  const [catalogue, setCatalogue] = useState<CatalogueState | null>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const prevCount = useRef(items.length);

  const ids = useMemo(
    () => [...new Set(items.map((line) => line.productId))].sort().join(','),
    [items]
  );

  useEffect(() => {
    if (!ids) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCatalogue({ map: new Map(), requested: new Set() });
      return;
    }
    const requested = new Set(ids.split(','));
    let cancelled = false;
    fetch(`/api/cart/products?ids=${encodeURIComponent(ids)}`)
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data: { products: CartProductInfo[] }) => {
        if (cancelled) return;
        setCatalogue({ map: new Map(data.products.map((p) => [p.id, p])), requested });
      })
      .catch(() => {
        if (!cancelled) setCatalogue({ map: new Map(), requested });
      });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  // Keep keyboard focus in the cart when a line is removed (its button unmounts).
  useEffect(() => {
    if (items.length < prevCount.current && items.length > 0) {
      summaryRef.current?.focus();
    }
    prevCount.current = items.length;
  }, [items.length]);

  if (items.length === 0) {
    return (
      <div className="mt-10 border border-ink bg-card px-8 py-16 text-center">
        <h2 className="font-heading text-[26px] font-normal text-ink">{t.bag.emptyTitle}</h2>
        <p className="mx-auto mt-3 max-w-[360px] text-sm leading-relaxed text-ink/65">
          {t.bag.emptyBody}
        </p>
        <Link
          href={`/${locale}/koleksi`}
          className="mt-8 inline-block bg-ink px-8 py-4 text-xs font-semibold tracking-[0.16em] text-paper transition-colors hover:bg-accent"
        >
          {t.bag.browseCta}
        </Link>
      </div>
    );
  }

  if (catalogue === null) {
    return (
      <div className="mt-10 border border-ink bg-card px-8 py-16 text-center">
        <p className="text-sm text-ink/65">{t.bag.loading}</p>
      </div>
    );
  }

  // A line is "resolved" once its id has been fetched. Not-yet-fetched lines
  // (just added, refetch in flight) are pending — never shown as unavailable.
  const lineState = (productId: string) => {
    const resolved = catalogue.requested.has(productId);
    const product = catalogue.map.get(productId);
    return {
      product,
      pending: !resolved,
      available: resolved && !!product && product.inStock,
    };
  };

  const subtotalIdr = items.reduce((sum, line) => {
    const { product, available } = lineState(line.productId);
    return available && product ? sum + product.priceIdr * line.qty : sum;
  }, 0);
  const shippingIdr = shippingForSubtotalIdr(subtotalIdr);
  const hasUnavailable = items.some((line) => {
    const { pending, available } = lineState(line.productId);
    return !pending && !available;
  });
  const anyPending = items.some((line) => lineState(line.productId).pending);

  return (
    <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
      {/* Line items */}
      <ul className="divide-y divide-ink/15 border border-ink bg-card">
        {items.map((line) => {
          const { product, pending, available } = lineState(line.productId);
          const name = product
            ? locale === 'en'
              ? product.nameEn || product.name
              : product.name
            : line.slug;
          return (
            <li key={`${line.productId}:${line.size ?? ''}`} className="flex gap-4 p-4 sm:gap-5">
              <Link
                href={`/${locale}/koleksi/${line.category}/${line.slug}`}
                className="shrink-0"
                tabIndex={-1}
                aria-hidden="true"
              >
                <ImageSlot
                  src={product?.imageUrl}
                  alt={name}
                  className="h-[104px] w-[84px] border border-ink"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/${locale}/koleksi/${line.category}/${line.slug}`}
                      className="font-heading text-lg leading-snug text-ink transition-colors hover:text-accent"
                    >
                      {name}
                    </Link>
                    {line.size && (
                      <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-ink/50">
                        {t.bag.sizePrefix} {line.size}
                      </p>
                    )}
                    {!pending && !available && (
                      <p className="mt-1 text-[12px] font-medium text-error">{t.bag.unavailable}</p>
                    )}
                  </div>
                  {product && available && (
                    <PriceDisplay
                      amountIdr={product.priceIdr * line.qty}
                      className="shrink-0 text-[13px] font-semibold text-ink"
                    />
                  )}
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div
                    className="flex items-center border border-ink"
                    role="group"
                    aria-label={t.bag.qtyLabel}
                  >
                    <button
                      type="button"
                      onClick={() => setQty(line.productId, line.size, line.qty - 1)}
                      aria-label={line.qty <= 1 ? t.bag.remove : t.bag.decrease}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center text-ink transition-colors hover:bg-ink/5"
                    >
                      <Minus size={14} strokeWidth={1.5} aria-hidden="true" />
                    </button>
                    <span className="w-8 text-center text-[13px] font-medium tabular-nums text-ink">
                      {line.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(line.productId, line.size, line.qty + 1)}
                      disabled={line.qty >= MAX_QTY_PER_LINE}
                      aria-label={t.bag.increase}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center text-ink transition-colors hover:bg-ink/5 disabled:cursor-default disabled:opacity-30"
                    >
                      <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(line.productId, line.size)}
                    className="flex cursor-pointer items-center gap-1 text-[11px] font-medium uppercase tracking-[0.12em] text-ink/50 transition-colors hover:text-error"
                  >
                    <X size={13} strokeWidth={1.5} aria-hidden="true" />
                    {t.bag.remove}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Summary */}
      <aside
        ref={summaryRef}
        tabIndex={-1}
        aria-label={t.bag.summaryHead}
        className="border border-ink bg-card p-6 outline-none"
      >
        <h2 className="font-heading text-[22px] font-normal text-ink">{t.bag.summaryHead}</h2>
        <dl aria-live="polite" className="mt-5 space-y-3 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-ink/60">{t.bag.subtotal}</dt>
            <dd>
              <PriceDisplay amountIdr={subtotalIdr} className="font-medium text-ink" />
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/60">{t.bag.shipping}</dt>
            <dd>
              {shippingIdr === 0 ? (
                <span className="font-medium text-success">{t.bag.shippingFree}</span>
              ) : (
                <PriceDisplay amountIdr={shippingIdr} className="font-medium text-ink" />
              )}
            </dd>
          </div>
          <div className="flex justify-between border-t border-ink pt-3">
            <dt className="font-semibold text-ink">{t.bag.total}</dt>
            <dd>
              <PriceDisplay
                amountIdr={subtotalIdr + shippingIdr}
                className="font-heading text-[18px] font-semibold text-ink"
              />
            </dd>
          </div>
        </dl>
        {hasUnavailable ? (
          <p className="mt-6 text-[12px] leading-relaxed text-error">{t.bag.unavailable}</p>
        ) : anyPending ? (
          <span className="mt-6 flex w-full cursor-default items-center justify-center bg-ink/40 px-8 py-4 text-xs font-semibold tracking-[0.16em] text-paper">
            {t.bag.loading}
          </span>
        ) : (
          <Link
            href={`/${locale}/checkout`}
            className="mt-6 flex w-full items-center justify-center bg-ink px-8 py-4 text-xs font-semibold tracking-[0.16em] text-paper transition-colors hover:bg-accent"
          >
            {t.bag.checkoutCta}
          </Link>
        )}
        <Link
          href={`/${locale}/koleksi`}
          className="mt-3 flex w-full items-center justify-center border border-ink px-8 py-3.5 text-xs font-semibold tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
        >
          {t.bag.continueShopping}
        </Link>
      </aside>
    </div>
  );
}
