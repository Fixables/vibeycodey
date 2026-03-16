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
    <section className="bg-ivory py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t.collections.title}
          subtitle={t.collections.subtitle}
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {featured.map((category) => (
            <Link
              key={category.slug}
              href={`/${locale}/koleksi/${category.slug}`}
              className="group flex flex-col items-center rounded-2xl border border-ivory-dark bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-md"
            >
              <span className="text-4xl">{category.icon}</span>
              <h3 className="mt-3 text-sm font-semibold text-espresso leading-tight">
                {locale === 'en' ? category.nameEn || category.name : category.name}
              </h3>
              {typeof category.productCount === 'number' && (
                <span className="mt-1 text-xs text-text-light">
                  {category.productCount} {locale === 'en' ? 'pieces' : 'perhiasan'}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={`/${locale}/koleksi`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-espresso transition-colors hover:text-gold"
          >
            {t.collections.viewAll}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
