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
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t.testimonials.title} />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t_item) => (
            <div
              key={t_item.id}
              className="rounded-2xl border border-ivory-dark bg-ivory p-6 shadow-sm"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < (t_item.rating ?? 5)
                        ? 'fill-gold text-gold'
                        : 'fill-none text-stone'
                    }
                  />
                ))}
              </div>

              {/* Content */}
              <p className="mt-3 text-sm leading-relaxed text-text">
                &ldquo;{locale === 'en' && t_item.contentEn ? t_item.contentEn : t_item.content}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-4 border-t border-ivory-dark pt-4">
                <div className="text-sm font-semibold text-espresso">{t_item.name}</div>
                {t_item.location && (
                  <div className="text-xs text-text-light">{t_item.location}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
