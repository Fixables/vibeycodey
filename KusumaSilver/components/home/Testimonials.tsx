import { Star } from 'lucide-react';
import { getTestimonials } from '@/lib/sanity-data';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface TestimonialsProps {
  locale: Locale;
}

export async function Testimonials({ locale }: TestimonialsProps) {
  const testimonials = await getTestimonials();
  const t = getT(locale);

  if (!testimonials.length) return null;

  return (
    <section className="bg-warm-white-dark py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t.testimonials.title} />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t_item) => (
            <div
              key={t_item.id}
              className="rounded-2xl border border-silver-mid/20 bg-warm-white p-6 shadow-sm"
            >
              {/* Silver quote mark */}
              <div className="font-heading text-4xl font-light leading-none text-silver-mid select-none">
                &ldquo;
              </div>

              {/* Stars */}
              <div className="mt-1 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={
                      i < (t_item.rating ?? 5)
                        ? 'fill-silver-bright text-silver-bright'
                        : 'fill-none text-silver-dark'
                    }
                  />
                ))}
              </div>

              {/* Content */}
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {locale === 'en' && t_item.contentEn ? t_item.contentEn : t_item.content}
              </p>

              {/* Author */}
              <div className="mt-4 border-t border-warm-white-dark pt-4">
                <div className="text-sm font-semibold text-charcoal">{t_item.name}</div>
                {t_item.location && (
                  <div className="text-xs text-silver-dark">{t_item.location}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
