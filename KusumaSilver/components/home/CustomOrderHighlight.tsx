import Link from 'next/link';
import { ArrowRight, MessageSquareText, PenSquare, Hammer, Package } from 'lucide-react';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

const stepIcons = [MessageSquareText, PenSquare, Hammer, Package];

interface CustomOrderHighlightProps {
  locale: Locale;
}

export function CustomOrderHighlight({ locale }: CustomOrderHighlightProps) {
  const t = getT(locale);

  return (
    <section className="bg-warm-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-heading text-3xl font-light text-charcoal sm:text-4xl">
            {t.customOrder.title}
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-px w-10 bg-silver-mid/60" />
            <div className="h-1 w-1 rounded-full bg-silver-dark" />
            <div className="h-px w-10 bg-silver-mid/60" />
          </div>
          <p className="mx-auto mt-5 max-w-xl text-sm text-text-muted leading-relaxed sm:text-base">
            {t.customOrder.body}
          </p>
        </div>

        {/* 4 step cards */}
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {t.customOrder.steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <div
                key={i}
                className="rounded-2xl border border-warm-white-dark bg-warm-white-mid p-5 text-left"
              >
                <div className="flex items-start justify-between">
                  <span className="font-heading text-xs font-semibold text-silver-dark tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="mt-3 flex h-12 w-12 items-center justify-center rounded-xl bg-charcoal/5">
                  <Icon size={22} className="text-charcoal" strokeWidth={1.5} />
                </div>
                <div className="mt-3 text-sm font-semibold text-charcoal">{step.title}</div>
                <div className="mt-1 text-xs text-text-muted leading-relaxed line-clamp-2">
                  {step.description}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/custom-order`}
            className="inline-flex items-center gap-2 rounded-full border border-charcoal px-7 py-2.5 text-sm font-medium text-charcoal transition-all duration-200 hover:bg-charcoal hover:text-warm-white"
          >
            {t.customOrder.cta}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
