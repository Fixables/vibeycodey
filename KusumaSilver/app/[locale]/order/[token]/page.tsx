import Link from 'next/link';
import type { Metadata } from 'next';
import { getOrderByToken } from '@/lib/commerce/orders';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

export const metadata: Metadata = {
  robots: { index: false },
};

// Order state must always be read fresh — never prerendered or cached.
export const dynamic = 'force-dynamic';

type StatusKey =
  | 'payment_pending'
  | 'paid'
  | 'payment_failed'
  | 'payment_expired'
  | 'payment_cancelled'
  | 'refunded'
  | 'fulfillment_pending'
  | 'fulfilled';

/**
 * Public order-status page, addressed by the unguessable token. Shows order
 * number, pieces, totals, and statuses — deliberately no customer details.
 */
export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale: localeStr, token } = await params;
  const locale = localeStr as Locale;
  const t = getT(locale);

  const order = await getOrderByToken(token);

  if (!order) {
    return (
      <div className="mx-auto max-w-[720px] px-5 pb-20 pt-12 sm:px-10">
        <h1 className="font-heading text-4xl font-medium text-ink">{t.orderV3.notFoundTitle}</h1>
        <p className="mt-4 max-w-[440px] text-sm leading-relaxed text-ink/65">
          {t.orderV3.notFoundBody}
        </p>
        <Link
          href={`/${locale}/koleksi`}
          className="mt-8 inline-block bg-ink px-8 py-4 text-xs font-semibold tracking-[0.16em] text-paper transition-colors hover:bg-accent"
        >
          {t.orderV3.continueCta}
        </Link>
      </div>
    );
  }

  const statusLabel = (key: string): string => t.orderV3[key as StatusKey] ?? key;

  const note =
    order.paymentMethod === 'whatsapp'
      ? t.orderV3.whatsappNote
      : order.paymentStatus === 'paid'
        ? t.orderV3.paidNote
        : order.paymentStatus === 'payment_pending'
          ? t.orderV3.pendingNote
          : t.orderV3.failedNote;

  const paymentTone =
    order.paymentStatus === 'paid'
      ? 'text-success'
      : order.paymentStatus === 'payment_pending'
        ? 'text-warning'
        : 'text-error';

  const placed = new Date(order.createdAt).toLocaleDateString(
    locale === 'en' ? 'en-GB' : 'id-ID',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  return (
    <div className="mx-auto max-w-[880px] px-5 pb-20 pt-12 sm:px-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
        {t.orderV3.title}
      </p>
      <h1 className="mt-3 font-heading text-4xl font-medium text-ink">
        {t.orderV3.orderNumber} {order.orderNumber}
      </h1>
      <p className="mt-2 text-[13px] text-ink/55">
        {t.orderV3.placedOn} {placed}
      </p>

      <div className="mt-8 grid gap-px border border-ink bg-ink sm:grid-cols-2">
        <div className="bg-card p-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink/55">
            {t.orderV3.paymentHead}
          </p>
          <p className={`mt-2 font-heading text-[22px] ${paymentTone}`}>
            {statusLabel(order.paymentStatus)}
          </p>
        </div>
        <div className="bg-card p-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink/55">
            {t.orderV3.fulfillmentHead}
          </p>
          <p className="mt-2 font-heading text-[22px] text-ink">
            {statusLabel(order.fulfillmentStatus)}
          </p>
        </div>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-ink/65">{note}</p>

      <section className="mt-8 border border-ink bg-card">
        <h2 className="border-b border-ink px-6 py-4 font-heading text-[20px] font-normal text-ink">
          {t.orderV3.itemsHead}
        </h2>
        <ul className="divide-y divide-ink/15">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-baseline justify-between gap-4 px-6 py-4">
              <span className="min-w-0 text-sm text-ink">
                {item.name}
                {item.size ? ` · ${item.size}` : ''} × {item.qty}
              </span>
              <PriceDisplay
                amountIdr={item.lineTotalIdr}
                className="shrink-0 text-[13px] font-medium text-ink"
              />
            </li>
          ))}
        </ul>
        <dl className="space-y-3 border-t border-ink px-6 py-5 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-ink/60">{t.orderV3.subtotal}</dt>
            <dd>
              <PriceDisplay amountIdr={order.subtotalIdr} className="font-medium text-ink" />
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink/60">{t.orderV3.shipping}</dt>
            <dd>
              {order.shippingIdr === 0 ? (
                <span className="font-medium text-success">{t.orderV3.shippingFree}</span>
              ) : (
                <PriceDisplay amountIdr={order.shippingIdr} className="font-medium text-ink" />
              )}
            </dd>
          </div>
          <div className="flex justify-between border-t border-ink/15 pt-3">
            <dt className="font-semibold text-ink">{t.orderV3.total}</dt>
            <dd>
              <PriceDisplay
                amountIdr={order.totalIdr}
                className="font-heading text-[18px] font-semibold text-ink"
              />
            </dd>
          </div>
        </dl>
      </section>

      <Link
        href={`/${locale}/koleksi`}
        className="mt-8 inline-block border border-ink px-8 py-3.5 text-xs font-semibold tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
      >
        {t.orderV3.continueCta}
      </Link>
    </div>
  );
}
