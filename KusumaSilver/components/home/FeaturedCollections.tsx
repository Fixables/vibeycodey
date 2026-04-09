import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getCategories } from '@/lib/sanity-data';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface FeaturedCollectionsProps {
  locale: Locale;
}

export async function FeaturedCollections({ locale }: FeaturedCollectionsProps) {
  const categories = await getCategories();
  const t = getT(locale);
  const featured = categories.slice(0, 6);

  return (
    <section className="bg-warm-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t.collections.title}
          subtitle={t.collections.subtitle}
        />

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {featured.map((category) => {
            const displayName = locale === 'en' ? category.nameEn || category.name : category.name;
            const abbrev = displayName.slice(0, 2).toUpperCase();
            return (
              <Link
                key={category.slug}
                href={`/${locale}/koleksi/${category.slug}`}
                className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-warm-white-dark bg-warm-white-mid px-4 py-8 text-center transition-all duration-300 hover:border-charcoal hover:bg-charcoal"
              >
                {/* Decorative background abbrev */}
                <span
                  className="absolute inset-0 flex items-center justify-center font-heading text-7xl font-semibold text-silver-bright/10 select-none transition-opacity duration-300 group-hover:text-silver-bright/5"
                  aria-hidden="true"
                >
                  {abbrev}
                </span>

                {/* Foreground content */}
                <h3 className="relative text-sm font-semibold text-charcoal leading-tight transition-colors duration-300 group-hover:text-warm-white">
                  {displayName}
                </h3>
                {typeof category.productCount === 'number' && (
                  <span className="relative mt-1.5 text-xs text-text-muted transition-colors duration-300 group-hover:text-warm-white/50">
                    {category.productCount} {locale === 'en' ? 'pieces' : 'perhiasan'}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/koleksi`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal transition-colors duration-200 hover:text-terracotta"
          >
            {t.collections.viewAll}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
