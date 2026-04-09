import Link from 'next/link';
import { MessageCircle, ArrowRight } from 'lucide-react';
import type { Locale } from '@/types';
import { getT } from '@/lib/i18n';
import { getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';

interface HeroSectionProps {
  locale: Locale;
}

export async function HeroSection({ locale }: HeroSectionProps) {
  const storeInfo = await getStoreInfo();
  const t = getT(locale);
  const waMessage =
    locale === 'en'
      ? 'Hello, I am interested in Kusuma Silver jewelry.'
      : 'Halo, saya tertarik dengan perhiasan Kusuma Silver.';
  const waLink = getWhatsAppLink(storeInfo.whatsapp, waMessage);

  const stats = [
    { value: '500+', label: locale === 'en' ? 'Designs' : 'Desain' },
    { value: '1000+', label: locale === 'en' ? 'Happy Customers' : 'Pelanggan Puas' },
    { value: '925', label: locale === 'en' ? 'Silver Standard' : 'Standar Perak' },
  ];

  return (
    <section className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden bg-charcoal">
      {/* Subtle vertical rule left edge */}
      <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-silver-mid/15 to-transparent hidden lg:block" />

      {/* Top overline */}
      <div className="absolute top-8 left-0 right-0 flex items-center justify-center px-4">
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-silver-mid/25" />
          <span className="text-[10px] font-medium text-silver-mid/70 tracking-[0.25em] uppercase">
            {t.hero.tagline}
          </span>
          <div className="h-px w-12 bg-silver-mid/25" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          {/* Headline — large editorial serif */}
          <h1
            className="font-heading font-light tracking-tight text-warm-white"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', lineHeight: '1.05' }}
          >
            {t.hero.headline}
          </h1>

          {/* Ornamental rule */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-silver-mid/30" />
            <div className="h-px w-3 bg-silver-bright/60" />
            <div className="h-px w-16 bg-silver-mid/30" />
          </div>

          {/* Sub */}
          <p className="mx-auto mt-7 max-w-md text-sm leading-relaxed text-warm-white/55 sm:text-base">
            {t.hero.sub}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`/${locale}/koleksi`}
              className="flex items-center gap-2 rounded-lg bg-silver-bright px-7 py-3.5 text-sm font-semibold text-charcoal transition-all duration-200 hover:bg-silver-mid"
            >
              {t.hero.cta}
              <ArrowRight size={15} />
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-warm-white/20 px-7 py-3.5 text-sm font-semibold text-warm-white/80 transition-all duration-200 hover:border-warm-white/40 hover:text-warm-white"
            >
              <MessageCircle size={15} />
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </div>

      {/* Stats strip — anchored to bottom */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-warm-white/8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-warm-white/8">
            {stats.map((stat) => (
              <div key={stat.label} className="px-4 py-5 text-center">
                <div className="font-heading text-xl font-semibold text-silver-bright sm:text-2xl">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-[10px] tracking-wider text-warm-white/35 uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
