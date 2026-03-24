import Link from 'next/link';
import type { Category, Locale } from '@/types';

interface CategoryGridProps {
  categories: Category[];
  locale: Locale;
}

export function CategoryGrid({ categories, locale }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/${locale}/koleksi/${category.slug}`}
          className="group flex flex-col items-center rounded-2xl border border-ivory-dark bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-silver-mid/50 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warm-white-dark text-charcoal transition-colors group-hover:bg-charcoal group-hover:text-silver-bright">
            <span className="font-heading text-base font-semibold tracking-wide">
              {(locale === 'en' ? category.nameEn || category.name : category.name).slice(0, 2).toUpperCase()}
            </span>
          </div>
          <h3 className="mt-2 text-sm font-semibold text-espresso leading-tight">
            {locale === 'en' ? category.nameEn || category.name : category.name}
          </h3>
          {typeof category.productCount === 'number' && (
            <span className="mt-1 text-xs text-text-muted">
              {category.productCount} {locale === 'en' ? 'pieces' : 'perhiasan'}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
