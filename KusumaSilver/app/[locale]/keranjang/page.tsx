import type { Metadata } from 'next';
import { CartClient } from '@/components/cart/CartClient';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

export const metadata: Metadata = {
  robots: { index: false },
};

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeStr } = await params;
  const locale = localeStr as Locale;
  const t = getT(locale);

  return (
    <div className="mx-auto max-w-[1080px] px-5 pb-20 pt-12 sm:px-10">
      <h1 className="font-heading text-4xl font-medium text-ink">{t.bag.title}</h1>
      <CartClient locale={locale} />
    </div>
  );
}
