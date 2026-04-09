import { Gem, Hammer, PenLine, ShieldCheck } from 'lucide-react';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

const icons = [Gem, Hammer, PenLine, ShieldCheck];

interface WhyKusumaProps {
  locale: Locale;
}

export function WhyKusumaSection({ locale }: WhyKusumaProps) {
  const t = getT(locale);

  return (
    <section className="bg-warm-white-mid py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-light text-charcoal text-center sm:text-4xl">
          {t.whyUs.title}
        </h2>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-px w-10 bg-silver-mid/60" />
          <div className="h-1 w-1 rounded-full bg-silver-dark" />
          <div className="h-px w-10 bg-silver-mid/60" />
        </div>

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {t.whyUs.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-terracotta/20 bg-terracotta/5">
                  <Icon size={24} className="text-terracotta" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-charcoal leading-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
