import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface CraftsmanshipStoryProps {
  locale: Locale;
}

export function CraftsmanshipStory({ locale }: CraftsmanshipStoryProps) {
  const t = getT(locale);

  const craftItems = [
    { abbrev: 'RI', label: locale === 'en' ? 'Rings' : 'Cincin' },
    { abbrev: 'NK', label: locale === 'en' ? 'Necklaces' : 'Kalung' },
    { abbrev: 'BR', label: locale === 'en' ? 'Bracelets' : 'Gelang' },
    { abbrev: 'CU', label: locale === 'en' ? 'Custom' : 'Custom' },
  ];

  return (
    <section className="bg-warm-white-mid py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Text side */}
          <div>
            {/* Ornamental line divider */}
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-10 bg-silver-mid" />
              <span className="text-xs font-medium text-silver-dark tracking-[0.15em] uppercase">
                {locale === 'en' ? 'Our Story' : 'Cerita Kami'}
              </span>
            </div>
            <h2 className="font-heading text-3xl font-light leading-snug text-charcoal sm:text-4xl">
              {t.craftsmanship.title}
            </h2>
            <p className="mt-2 text-sm font-medium text-silver-dark tracking-wide">
              925 Sterling Silver
            </p>
            <p className="mt-6 text-base leading-relaxed text-text-muted">
              {t.craftsmanship.body}
            </p>
            <Link
              href={`/${locale}/tentang-kami`}
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-charcoal transition-colors hover:text-terracotta"
            >
              {t.craftsmanship.cta}
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Visual grid — four craft category tiles */}
          <div className="grid grid-cols-2 gap-4">
            {craftItems.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center rounded-2xl border border-silver-mid/20 bg-warm-white-dark py-10 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-warm-white border border-silver-mid/30">
                  <span className="font-heading text-lg font-semibold text-charcoal tracking-wide">
                    {item.abbrev}
                  </span>
                </div>
                <span className="mt-3 text-sm font-medium text-text-muted">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
