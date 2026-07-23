import { PieceCard } from './PieceCard';
import { getT } from '@/lib/i18n';
import type { Category, Product, Locale } from '@/types';

interface PieceGridProps {
  products: Product[];
  categories: Category[];
  locale: Locale;
  /** Owner-editable empty state; falls back to the built-in wording. */
  emptyMessage?: string;
}

export function PieceGrid({ products, categories, locale, emptyMessage }: PieceGridProps) {
  const t = getT(locale);

  if (!products.length) {
    return (
      <div className="border border-ink bg-card px-8 py-16 text-center text-sm text-ink/60">
        {emptyMessage || t.catalogV3.noResults}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {products.map((product) => (
        <PieceCard key={product.id} product={product} categories={categories} locale={locale} />
      ))}
    </div>
  );
}
