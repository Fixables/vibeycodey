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
    <section className="bg-warm-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t.collections.title}
          subtitle={t.collections.subtitle}
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {featured.map((category) => {
            const displayName = locale === 'en' ? category.nameEn || category.name : category.name;
            const abbrev = displayName.slice(0, 2).toUpperCase();
            return (
              <Link
                key={category.slug}
                href={`/${locale}/koleksi/${category.slug}`}
                className="group flex flex-col items-center rounded-2xl border border-warm-white-dark bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-silver-mid/50 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warm-white-dark text-charcoal transition-colors group-hover:bg-charcoal group-hover:text-silver-bright">
                  <span className="font-heading text-base font-semibold tracking-wide">{abbrev}</span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-charcoal leading-tight">
                  {displayName}
                </h3>
                {typeof category.productCount === 'number' && (
                  <span className="mt-1 text-xs text-text-muted">
                    {category.productCount} {locale === 'en' ? 'pieces' : 'perhiasan'}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={`/${locale}/koleksi`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal transition-colors hover:text-terracotta"
          >
            {t.collections.viewAll}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
