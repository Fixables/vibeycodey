import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface CustomOrderHighlightProps {
  locale: Locale;
}

export function CustomOrderHighlight({ locale }: CustomOrderHighlightProps) {
  const t = getT(locale);

  return (
    <section className="bg-warm-white-dark py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-charcoal px-8 py-14 text-center sm:px-12">
          {/* Ornamental label */}
          <div className="inline-flex items-center gap-2.5">
            <div className="h-px w-8 bg-silver-mid/50" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-silver-mid">
              {locale === 'en' ? 'Made to Order' : 'Dibuat Khusus'}
            </span>
            <div className="h-px w-8 bg-silver-mid/50" />
          </div>

          <h2 className="font-heading mt-4 text-3xl font-light text-warm-white sm:text-4xl">
            {t.customOrder.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-warm-white/60">
            {t.customOrder.body}
          </p>

          {/* Steps */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {t.customOrder.steps.map((step, i) => (
              <div
                key={i}
                className="rounded-2xl border border-warm-white/10 bg-warm-white/5 p-5 text-left"
              >
                <div className="font-heading text-2xl font-semibold text-silver-bright">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="mt-2 text-sm font-semibold text-warm-white">
                  {step.title}
                </div>
                <div className="mt-1 text-xs text-warm-white/50 leading-relaxed">
                  {step.description}
                </div>
              </div>
            ))}
          </div>

          <Link
            href={`/${locale}/custom-order`}
            className="mt-10 inline-flex items-center gap-2 rounded-lg bg-silver-bright px-7 py-3.5 text-sm font-semibold text-charcoal transition-all hover:bg-silver-mid"
          >
            {t.customOrder.cta}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
