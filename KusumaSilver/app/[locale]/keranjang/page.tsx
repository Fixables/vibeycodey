import Link from 'next/link';
import type { Metadata } from 'next';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

export const metadata: Metadata = {
  robots: { index: false },
};

/**
 * Cart page. Currently renders the designed empty-bag state; real cart line
 * items, totals, and checkout entry are wired in the commerce milestone (D).
 */
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
    </div>
  );
}
