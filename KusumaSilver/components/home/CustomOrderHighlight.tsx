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
    <section className="bg-ivory-dark py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-espresso px-8 py-14 text-center sm:px-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            {locale === 'en' ? 'Made to Order' : 'Dibuat Khusus'}
          </span>
          <h2 className="font-heading mt-4 text-3xl font-semibold text-white sm:text-4xl">
            {t.customOrder.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/70">
            {t.customOrder.body}
          </p>

          {/* Steps */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {t.customOrder.steps.map((step, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
                <div className="font-heading text-2xl font-semibold text-gold">{String(i + 1).padStart(2, '0')}</div>
                <div className="mt-2 text-sm font-semibold text-white">{step.title}</div>
                <div className="mt-1 text-xs text-white/60 leading-relaxed">{step.description}</div>
              </div>
            ))}
          </div>

          <Link
            href={`/${locale}/custom-order`}
            className="mt-10 inline-flex items-center gap-2 rounded-lg bg-gold px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-yellow-700"
          >
            {t.customOrder.cta}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
