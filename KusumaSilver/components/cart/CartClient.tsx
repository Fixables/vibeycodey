'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
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
export function CartClient({ locale }: { locale: Locale }) {
  const t = getT(locale);
  const { items, setQty, removeItem } = useCart();
  const [products, setProducts] = useState<Map<string, CartProductInfo> | null>(null);

  const ids = useMemo(
    () => [...new Set(items.map((line) => line.productId))].sort().join(','),
    [items]
  );

  useEffect(() => {
    if (!ids) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProducts(new Map());
      return;
    }
    let cancelled = false;
    fetch(`/api/cart/products?ids=${encodeURIComponent(ids)}`)
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data: { products: CartProductInfo[] }) => {
        if (cancelled) return;
        setProducts(new Map(data.products.map((product) => [product.id, product])));
      })
      .catch(() => {
        if (!cancelled) setProducts(new Map());
      });
    return () => {
      cancelled = true;
    };
  }, [ids]);

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

  if (products === null) {
    return (
      <div className="mt-10 border border-ink bg-card px-8 py-16 text-center">
        <p className="text-sm text-ink/65">{t.bag.loading}</p>
      </div>
    );
  }

  const subtotalIdr = items.reduce((sum, line) => {
    const product = products.get(line.productId);
    return product && product.inStock ? sum + product.priceIdr * line.qty : sum;
  }, 0);
  const shippingIdr = shippingForSubtotalIdr(subtotalIdr);
  const hasUnavailable = items.some((line) => {
    const product = products.get(line.productId);
    return !product || !product.inStock;
  });

  return (
    <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
      {/* Line items */}
      <ul className="divide-y divide-ink/15 border border-ink bg-card">
        {items.map((line) => {
          const product = products.get(line.productId);
          const name = product
            ? locale === 'en'
              ? product.nameEn || product.name
              : product.name
            : line.slug;
          const available = product?.inStock ?? false;
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
                    {!available && (
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
                      aria-label={t.bag.decrease}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center text-ink transition-colors hover:bg-ink/5"
                    >
                      <Minus size={14} strokeWidth={1.5} />
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
                      <Plus size={14} strokeWidth={1.5} />
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
      <aside className="border border-ink bg-card p-6">
        <h2 className="font-heading text-[22px] font-normal text-ink">{t.bag.summaryHead}</h2>
        <dl className="mt-5 space-y-3 text-[13px]">
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
