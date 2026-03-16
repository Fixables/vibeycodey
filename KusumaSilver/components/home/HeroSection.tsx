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
    <section className="relative overflow-hidden bg-espresso py-24 sm:py-32">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-espresso via-espresso to-espresso-mid opacity-90" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 50%, #C4C4C4 1px, transparent 1px), radial-gradient(circle at 75% 50%, #C4C4C4 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Tagline pill */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="text-xs font-medium text-gold tracking-widest uppercase">
              {t.hero.tagline}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            {t.hero.headline}
          </h1>

          {/* Sub */}
          <p className="mt-6 text-base leading-relaxed text-white/70 sm:text-lg">
            {t.hero.sub}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`/${locale}/koleksi`}
              className="flex items-center gap-2 rounded-lg bg-gold px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-yellow-700 hover:shadow-xl"
            >
              {t.hero.cta}
              <ArrowRight size={16} />
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/20"
            >
              <MessageCircle size={16} />
              {t.hero.ctaSecondary}
            </a>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
            {[
              { value: '500+', label: locale === 'en' ? 'Designs' : 'Desain' },
              { value: '1000+', label: locale === 'en' ? 'Happy Customers' : 'Pelanggan Puas' },
              { value: '925', label: locale === 'en' ? 'Silver Standard' : 'Standar Perak' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-2xl font-semibold text-gold sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
