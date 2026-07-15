import type { Metadata } from 'next';
import { CheckoutClient } from '@/components/checkout/CheckoutClient';
import { isMidtransConfigured, SNAP_JS_URL } from '@/lib/commerce/midtrans';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import type { Locale } from '@/types';

export const metadata: Metadata = {
  robots: { index: false },
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeStr } = await params;
  const locale = localeStr as Locale;
  const t = getT(locale);

  const snapClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? '';
  const midtransAvailable = isMidtransConfigured() && Boolean(snapClientKey);

  return (
    <div className="mx-auto max-w-[1080px] px-5 pb-20 pt-12 sm:px-10">
      <h1 className="font-heading text-4xl font-medium text-ink">{t.checkoutV3.title}</h1>
      <CheckoutClient
        locale={locale}
        midtransAvailable={midtransAvailable}
        snapClientKey={midtransAvailable ? snapClientKey : ''}
        snapJsUrl={SNAP_JS_URL}
      />
    </div>
  );
}
