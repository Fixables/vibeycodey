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
    <section className="relative overflow-hidden bg-charcoal py-20 sm:py-28">
      {/* Subtle side rules */}
      <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-silver-mid/10 to-transparent hidden lg:block" />
      <div className="absolute right-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-silver-mid/10 to-transparent hidden lg:block" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        {/* Ornamental divider */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="h-px w-10 bg-silver-mid/30" />
          <div className="flex gap-1.5">
            <span className="h-1 w-1 rounded-full bg-silver-mid/50" />
            <span className="h-1 w-1 rounded-full bg-silver-bright/70" />
            <span className="h-1 w-1 rounded-full bg-silver-mid/50" />
          </div>
          <div className="h-px w-10 bg-silver-mid/30" />
        </div>

        <h2
          className="font-heading font-light text-silver-bright"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)' }}
        >
          {t.cta.title}
        </h2>
        <p className="mt-4 text-sm text-warm-white/55 sm:text-base">{t.cta.sub}</p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-silver-bright px-7 py-3.5 text-sm font-semibold text-charcoal transition-all duration-200 hover:bg-silver-mid"
          >
            <MessageCircle size={16} />
            {t.cta.whatsapp}
          </a>
          <Link
            href={`/${locale}/koleksi`}
            className="flex items-center gap-2 rounded-lg border border-warm-white/20 px-7 py-3.5 text-sm font-semibold text-warm-white/80 transition-all duration-200 hover:border-warm-white/40 hover:text-warm-white"
          >
            {t.cta.browse}
          </Link>
        </div>
      </div>
    </section>
  );
}
