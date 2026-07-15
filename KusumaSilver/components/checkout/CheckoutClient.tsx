'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { shippingForSubtotalIdr } from '@/lib/commerce/shipping';
import { getT } from '@/lib/i18n';
import type { CartProductInfo } from '@/components/cart/CartClient';
import type { Locale } from '@/types';

interface CheckoutClientProps {
  locale: Locale;
  /** Server + client Midtrans keys are both configured. */
  midtransAvailable: boolean;
  /** Safe-to-expose Snap client key (empty when unavailable). */
  snapClientKey: string;
  /** Environment-matched snap.js URL. */
  snapJsUrl: string;
}

type PayMethod = 'midtrans' | 'whatsapp';

interface SnapWindow extends Window {
  snap?: {
    pay: (
      token: string,
      callbacks: {
        onSuccess?: () => void;
        onPending?: () => void;
        onError?: () => void;
        onClose?: () => void;
      }
    ) => void;
  };
}

const inputClass =
  'w-full border border-ink bg-card px-3.5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-accent';

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-ink/55"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function CheckoutClient({
  locale,
  midtransAvailable,
  snapClientKey,
  snapJsUrl,
}: CheckoutClientProps) {
  const t = getT(locale);
  const router = useRouter();
  const { items, clear } = useCart();
  const [products, setProducts] = useState<Map<string, CartProductInfo> | null>(null);
  const [method, setMethod] = useState<PayMethod>(midtransAvailable ? 'midtrans' : 'whatsapp');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Order placement clears the cart; remember so the empty state doesn't flash.
  const [placed, setPlaced] = useState(false);

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
        if (!cancelled) setProducts(new Map(data.products.map((p) => [p.id, p])));
      })
      .catch(() => {
        if (!cancelled) setProducts(new Map());
      });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  // Load snap.js lazily; the browser only ever holds the public client key.
  useEffect(() => {
    if (!midtransAvailable) return;
    if (document.querySelector(`script[src="${snapJsUrl}"]`)) return;
    const script = document.createElement('script');
    script.src = snapJsUrl;
    script.setAttribute('data-client-key', snapClientKey);
    document.body.appendChild(script);
  }, [midtransAvailable, snapClientKey, snapJsUrl]);

  if (items.length === 0 && !placed) {
    return (
      <div className="mt-10 border border-ink bg-card px-8 py-16 text-center">
        <h2 className="font-heading text-[26px] font-normal text-ink">{t.bag.emptyTitle}</h2>
        <Link
          href={`/${locale}/koleksi`}
          className="mt-8 inline-block bg-ink px-8 py-4 text-xs font-semibold tracking-[0.16em] text-paper transition-colors hover:bg-accent"
        >
          {t.bag.browseCta}
        </Link>
      </div>
    );
  }

  const subtotalIdr = items.reduce((sum, line) => {
    const product = products?.get(line.productId);
    return product && product.inStock ? sum + product.priceIdr * line.qty : sum;
  }, 0);
  const shippingIdr = shippingForSubtotalIdr(subtotalIdr);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const customer = {
      name: form.get('name'),
      phone: form.get('phone'),
      email: form.get('email') || undefined,
      address: form.get('address'),
      city: form.get('city'),
      province: form.get('province') || undefined,
      postalCode: form.get('postalCode') || undefined,
      notes: form.get('notes') || undefined,
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          locale,
          items: items.map((line) => ({
            productId: line.productId,
            size: line.size,
            qty: line.qty,
          })),
          customer,
        }),
      });

      if (res.status === 409) {
        setError(t.checkoutV3.errorUnavailable);
        setSubmitting(false);
        return;
      }
      if (!res.ok) {
        setError(t.checkoutV3.errorGeneric);
        setSubmitting(false);
        return;
      }

      const data = (await res.json()) as {
        statusUrl: string;
        snapToken?: string;
        whatsappUrl?: string;
      };

      setPlaced(true);
      clear();

      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
        router.push(data.statusUrl);
        return;
      }

      const snap = (window as SnapWindow).snap;
      if (data.snapToken && snap) {
        const goToStatus = () => router.push(data.statusUrl);
        snap.pay(data.snapToken, {
          onSuccess: goToStatus,
          onPending: goToStatus,
          onError: goToStatus,
          onClose: goToStatus,
        });
      } else {
        // Snap unavailable in the browser — the order exists; show its status.
        router.push(data.statusUrl);
      }
    } catch {
      setError(t.checkoutV3.errorGeneric);
      setSubmitting(false);
    }
  }

  const methodOption = (value: PayMethod, label: string, desc: string, disabled = false) => (
    <label
      className={`flex gap-3 border border-ink p-4 transition-colors ${
        disabled ? 'opacity-40' : 'cursor-pointer hover:border-accent'
      } ${method === value ? 'bg-ink/5 outline outline-1 outline-ink' : ''}`}
    >
      <input
        type="radio"
        name="payMethod"
        value={value}
        checked={method === value}
        onChange={() => setMethod(value)}
        disabled={disabled}
        className="mt-0.5 accent-ink"
      />
      <span>
        <span className="block text-[13px] font-semibold tracking-[0.04em] text-ink">{label}</span>
        <span className="mt-1 block text-[12px] leading-relaxed text-ink/60">{desc}</span>
      </span>
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        {/* Contact */}
        <section className="border border-ink bg-card p-6">
          <h2 className="font-heading text-[22px] font-normal text-ink">
            {t.checkoutV3.contactHead}
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field id="co-name" label={t.checkoutV3.nameLabel}>
              <input id="co-name" name="name" required maxLength={200} autoComplete="name" className={inputClass} />
            </Field>
            <Field id="co-phone" label={t.checkoutV3.phoneLabel}>
              <input
                id="co-phone"
                name="phone"
                required
                inputMode="tel"
                pattern="[+0-9][0-9\s\-]{6,20}"
                maxLength={24}
                autoComplete="tel"
                className={inputClass}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field id="co-email" label={t.checkoutV3.emailLabel}>
                <input id="co-email" name="email" type="email" maxLength={200} autoComplete="email" className={inputClass} />
              </Field>
            </div>
          </div>
        </section>

        {/* Shipping */}
        <section className="border border-ink bg-card p-6">
          <h2 className="font-heading text-[22px] font-normal text-ink">
            {t.checkoutV3.shippingHead}
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field id="co-address" label={t.checkoutV3.addressLabel}>
                <textarea
                  id="co-address"
                  name="address"
                  required
                  rows={2}
                  maxLength={600}
                  autoComplete="street-address"
                  className={inputClass}
                />
              </Field>
            </div>
            <Field id="co-city" label={t.checkoutV3.cityLabel}>
              <input id="co-city" name="city" required maxLength={200} autoComplete="address-level2" className={inputClass} />
            </Field>
            <Field id="co-province" label={t.checkoutV3.provinceLabel}>
              <input id="co-province" name="province" maxLength={200} autoComplete="address-level1" className={inputClass} />
            </Field>
            <Field id="co-postal" label={t.checkoutV3.postalLabel}>
              <input id="co-postal" name="postalCode" maxLength={12} inputMode="numeric" autoComplete="postal-code" className={inputClass} />
            </Field>
            <Field id="co-notes" label={t.checkoutV3.notesLabel}>
              <input id="co-notes" name="notes" maxLength={600} className={inputClass} />
            </Field>
          </div>
        </section>

        {/* Payment */}
        <section className="border border-ink bg-card p-6">
          <h2 className="font-heading text-[22px] font-normal text-ink">
            {t.checkoutV3.paymentHead}
          </h2>
          {!midtransAvailable && (
            <p className="mt-3 text-[12px] leading-relaxed text-ink/60">
              {t.checkoutV3.payUnavailable}
            </p>
          )}
          <div className="mt-5 grid gap-3">
            {midtransAvailable &&
              methodOption('midtrans', t.checkoutV3.payCard, t.checkoutV3.payCardDesc)}
            {methodOption('whatsapp', t.checkoutV3.payWhatsApp, t.checkoutV3.payWhatsAppDesc)}
          </div>
        </section>
      </div>

      {/* Summary */}
      <aside className="border border-ink bg-card p-6">
        <h2 className="font-heading text-[22px] font-normal text-ink">
          {t.checkoutV3.summaryHead}
        </h2>
        <ul className="mt-5 space-y-3">
          {items.map((line) => {
            const product = products?.get(line.productId);
            const name = product
              ? locale === 'en'
                ? product.nameEn || product.name
                : product.name
              : line.slug;
            return (
              <li
                key={`${line.productId}:${line.size ?? ''}`}
                className="flex items-baseline justify-between gap-3 text-[13px]"
              >
                <span className="min-w-0 text-ink/75">
                  {name}
                  {line.size ? ` · ${line.size}` : ''} × {line.qty}
                </span>
                {product && (
                  <PriceDisplay
                    amountIdr={product.priceIdr * line.qty}
                    className="shrink-0 font-medium text-ink"
                  />
                )}
              </li>
            );
          })}
        </ul>
        <dl className="mt-5 space-y-3 border-t border-ink/15 pt-4 text-[13px]">
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

        {error && (
          <p role="alert" className="mt-5 text-[12px] leading-relaxed text-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 flex w-full cursor-pointer items-center justify-center bg-ink px-8 py-4 text-xs font-semibold tracking-[0.16em] text-paper transition-colors hover:bg-accent disabled:cursor-default disabled:opacity-60"
        >
          {submitting ? t.checkoutV3.processing : t.checkoutV3.placeOrder}
        </button>
        <Link
          href={`/${locale}/keranjang`}
          className="mt-3 flex w-full items-center justify-center gap-2 border border-ink px-8 py-3.5 text-xs font-semibold tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
        >
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
          {t.checkoutV3.backToBag}
        </Link>
      </aside>
    </form>
  );
}
