import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface CraftsmanshipStoryProps {
  locale: Locale;
}

export function CraftsmanshipStory({ locale }: CraftsmanshipStoryProps) {
  const t = getT(locale);

  return (
    <section className="bg-espresso py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Text */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              925 Sterling Silver
            </span>
            <h2 className="font-heading mt-3 text-3xl font-semibold text-white sm:text-4xl lg:text-5xl leading-tight">
              {t.craftsmanship.title}
            </h2>
            <div className="mt-4 h-0.5 w-12 bg-gold" />
            <p className="mt-6 text-base leading-relaxed text-white/70">
              {t.craftsmanship.body}
            </p>
            <Link
              href={`/${locale}/tentang-kami`}
              className="mt-8 inline-flex items-center gap-2 rounded-lg border border-gold/50 bg-white/5 px-6 py-3 text-sm font-semibold text-gold transition-all hover:bg-white/10"
            >
              {t.craftsmanship.cta}
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Visual grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: '💍', label: locale === 'en' ? 'Rings' : 'Cincin' },
              { emoji: '📿', label: locale === 'en' ? 'Necklaces' : 'Kalung' },
              { emoji: '🪬', label: locale === 'en' ? 'Bracelets' : 'Gelang' },
              { emoji: '✨', label: locale === 'en' ? 'Custom' : 'Custom' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-8 text-center"
              >
                <span className="text-5xl">{item.emoji}</span>
                <span className="mt-3 text-sm font-medium text-white/70">
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
