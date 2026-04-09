import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Play } from 'lucide-react';
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

  // heroImage comes from the HomePageContent singleton in Sanity if set
  const heroImage: string | undefined = undefined; // placeholder — wire to CMS when ready

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-charcoal">
      {/* Background image */}
      {heroImage ? (
        <Image
          src={heroImage}
          alt="Kusuma Silver artisan"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      ) : (
        /* CSS hammered texture fallback */
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80px 80px at 15% 20%, rgba(212,212,216,0.06) 0%, transparent 70%),
              radial-gradient(ellipse 60px 90px at 40% 55%, rgba(212,212,216,0.04) 0%, transparent 70%),
              radial-gradient(ellipse 100px 70px at 70% 30%, rgba(212,212,216,0.05) 0%, transparent 70%),
              radial-gradient(ellipse 50px 80px at 85% 70%, rgba(212,212,216,0.04) 0%, transparent 70%),
              radial-gradient(ellipse 70px 50px at 30% 80%, rgba(212,212,216,0.04) 0%, transparent 70%)
            `,
            backgroundColor: '#18181B',
          }}
        />
      )}

      {/* Gradient overlay — heavier at bottom for CTA readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/40" />

      {/* Top label */}
      <div className="absolute top-6 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-3 px-4">
          <div className="h-px w-8 bg-silver-mid/30" />
          <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-silver-mid/60">
            {t.hero.tagline}
          </span>
          <div className="h-px w-8 bg-silver-mid/30" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <h1
          className="font-heading font-light tracking-tight text-warm-white"
          style={{ fontSize: 'clamp(2.6rem, 8vw, 5rem)', lineHeight: '1.08' }}
        >
          {t.hero.headline}
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-warm-white/65 sm:text-base">
          {t.hero.sub}
        </p>

        {/* Play button */}
        <button
          aria-label="Play video"
          className="mx-auto mt-9 flex h-16 w-16 items-center justify-center rounded-full border border-warm-white/30 bg-warm-white/10 backdrop-blur-sm transition-all hover:bg-warm-white/20"
        >
          <Play size={22} className="text-warm-white translate-x-0.5" fill="white" />
        </button>
        <p className="mt-2 text-xs tracking-widest uppercase text-warm-white/45">Play</p>

        {/* Pill CTAs */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/${locale}/koleksi`}
            className="rounded-full border border-warm-white/50 px-8 py-3 text-sm font-medium text-warm-white transition-all hover:bg-warm-white/10"
          >
            {t.hero.cta}
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-warm-white px-8 py-3 text-sm font-semibold text-charcoal transition-all hover:bg-silver-bright"
          >
            <MessageCircle size={14} />
            {t.hero.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
