import { Shield, Hammer, Sparkles, Star } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

const icons = [Shield, Hammer, Sparkles, Star];

interface WhyKusumaProps {
  locale: Locale;
}

export function WhyKusumaSection({ locale }: WhyKusumaProps) {
  const t = getT(locale);

  return (
    <section className="bg-ivory py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t.whyUs.title} />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.whyUs.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <div
                key={i}
                className="rounded-2xl border border-ivory-dark bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-espresso/5">
                  <Icon size={24} className="text-espresso" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-espresso">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-light">
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
