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

  return (
    <section className="relative overflow-hidden bg-charcoal py-28 sm:py-36">
      {/* Dot-grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #D4D4D8 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-charcoal to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Tagline pill */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-silver-mid/30 bg-warm-white/5 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-silver-bright" />
            <span className="text-xs font-medium text-silver-mid tracking-[0.15em] uppercase">
              {t.hero.tagline}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl font-light leading-tight text-warm-white sm:text-5xl lg:text-6xl">
            {t.hero.headline}
          </h1>

          {/* Sub */}
          <p className="mt-6 text-base leading-relaxed text-warm-white/60 sm:text-lg">
            {t.hero.sub}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`/${locale}/koleksi`}
              className="flex items-center gap-2 rounded-lg bg-silver-bright px-7 py-3.5 text-sm font-semibold text-charcoal transition-all hover:bg-silver-mid"
            >
              {t.hero.cta}
              <ArrowRight size={15} />
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-warm-white/25 bg-warm-white/8 px-7 py-3.5 text-sm font-semibold text-warm-white transition-all hover:bg-warm-white/15"
            >
              <MessageCircle size={15} />
              {t.hero.ctaSecondary}
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 border-t border-warm-white/10 pt-10">
            {[
              { value: '500+', label: locale === 'en' ? 'Designs' : 'Desain' },
              { value: '1000+', label: locale === 'en' ? 'Happy Customers' : 'Pelanggan Puas' },
              { value: '925', label: locale === 'en' ? 'Silver Standard' : 'Standar Perak' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-2xl font-semibold text-silver-bright sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-warm-white/40 tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
