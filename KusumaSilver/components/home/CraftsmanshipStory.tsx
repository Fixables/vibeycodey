import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface CraftsmanshipStoryProps {
  locale: Locale;
}

export function CraftsmanshipStory({ locale }: CraftsmanshipStoryProps) {
  const t = getT(locale);

  const specs = [
    {
      label: locale === 'en' ? 'Material' : 'Material',
      value: '925 Sterling Silver',
    },
    {
      label: locale === 'en' ? 'Origin' : 'Asal',
      value: 'Bali, Indonesia',
    },
    {
      label: locale === 'en' ? 'Technique' : 'Teknik',
      value: locale === 'en' ? 'Hand-forged' : 'Tempa Tangan',
    },
    {
      label: locale === 'en' ? 'Finish' : 'Finishing',
      value: locale === 'en' ? 'Artisan-polished' : 'Poles Pengrajin',
    },
  ];

  return (
    <section className="bg-warm-white-mid py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20 lg:items-center">
          {/* Text side */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-10 bg-silver-mid" />
              <span className="text-xs font-medium text-silver-dark tracking-[0.15em] uppercase">
                {locale === 'en' ? 'Our Story' : 'Cerita Kami'}
              </span>
            </div>
            <h2
              className="font-heading font-light leading-snug text-charcoal"
              style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)' }}
            >
              {t.craftsmanship.title}
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm font-medium text-silver-dark tracking-wider">925</span>
              <span className="h-1 w-1 rounded-full bg-silver-dark/40" />
              <span className="text-sm font-medium text-silver-dark tracking-wider">Sterling Silver</span>
              <span className="h-1 w-1 rounded-full bg-silver-dark/40" />
              <span className="text-sm font-medium text-silver-dark tracking-wider">Bali</span>
            </div>
            <p className="mt-6 text-base leading-relaxed text-text-muted">
              {t.craftsmanship.body}
            </p>
            <Link
              href={`/${locale}/tentang-kami`}
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-charcoal transition-colors duration-200 hover:text-terracotta"
            >
              {t.craftsmanship.cta}
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Spec card — dark panel with material details */}
          <div className="rounded-2xl bg-charcoal p-10">
            <div className="space-y-0 divide-y divide-warm-white/8">
              {specs.map((spec) => (
                <div key={spec.label} className="flex items-baseline justify-between py-5 first:pt-0 last:pb-0">
                  <span className="text-xs font-medium text-silver-mid tracking-[0.12em] uppercase">
                    {spec.label}
                  </span>
                  <span className="font-heading text-base text-warm-white">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
            {/* Large decorative 925 mark */}
            <div className="mt-8 border-t border-warm-white/8 pt-7 flex items-end justify-between">
              <span className="font-heading text-6xl font-light leading-none text-silver-bright/15 select-none">
                925
              </span>
              <span className="text-xs text-warm-white/25 tracking-wider uppercase">
                {locale === 'en' ? 'Certified' : 'Tersertifikasi'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
