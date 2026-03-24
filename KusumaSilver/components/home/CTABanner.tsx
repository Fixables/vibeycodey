import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface CTABannerProps {
  locale: Locale;
}

export async function CTABanner({ locale }: CTABannerProps) {
  const storeInfo = await getStoreInfo();
  const t = getT(locale);
  const waMessage =
    locale === 'en'
      ? 'Hello, I would like to order Kusuma Silver jewelry.'
      : 'Halo, saya ingin memesan perhiasan Kusuma Silver.';
  const waLink = getWhatsAppLink(storeInfo.whatsapp, waMessage);

  return (
    <section className="relative overflow-hidden bg-charcoal py-16 sm:py-20">
      {/* Ornamental dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #D4D4D8 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        {/* Ornamental divider */}
        <div className="mb-6 flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-silver-mid/40" />
          <div className="h-1.5 w-1.5 rounded-full bg-silver-bright" />
          <div className="h-px w-12 bg-silver-mid/40" />
        </div>

        <h2 className="font-heading text-3xl font-light text-silver-bright sm:text-4xl">
          {t.cta.title}
        </h2>
        <p className="mt-4 text-base text-warm-white/60">{t.cta.sub}</p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-[#25D366] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#20b958] hover:shadow-xl"
          >
            <MessageCircle size={17} />
            {t.cta.whatsapp}
          </a>
          <Link
            href={`/${locale}/koleksi`}
            className="flex items-center gap-2 rounded-lg border border-silver-mid/30 bg-warm-white/8 px-7 py-3.5 text-sm font-semibold text-warm-white transition-all hover:bg-warm-white/15"
          >
            {t.cta.browse}
          </Link>
        </div>
      </div>
    </section>
  );
}
