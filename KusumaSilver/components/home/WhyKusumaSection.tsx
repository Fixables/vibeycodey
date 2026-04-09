import { SectionHeader } from '@/components/ui/SectionHeader';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface WhyKusumaProps {
  locale: Locale;
}

export function WhyKusumaSection({ locale }: WhyKusumaProps) {
  const t = getT(locale);

  return (
    <section className="bg-warm-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_2fr] lg:gap-20">
          {/* Left: sticky title column */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px w-8 bg-silver-mid" />
              <span className="text-xs font-medium text-silver-dark tracking-[0.15em] uppercase">
                {locale === 'en' ? 'Our Promise' : 'Janji Kami'}
              </span>
            </div>
            <h2 className="font-heading text-3xl font-light text-charcoal sm:text-4xl">
              {t.whyUs.title}
            </h2>
          </div>

          {/* Right: numbered manifesto items */}
          <div className="divide-y divide-warm-white-dark">
            {t.whyUs.items.map((item, i) => (
              <div key={i} className="flex gap-8 py-8 first:pt-0 last:pb-0">
                <span className="font-heading text-sm font-medium text-silver-dark mt-0.5 w-6 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
