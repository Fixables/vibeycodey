import { PieceCard } from './PieceCard';
import { getT } from '@/lib/i18n';
import type { Product, Locale } from '@/types';

interface PieceGridProps {
  products: Product[];
  locale: Locale;
}

export function PieceGrid({ products, locale }: PieceGridProps) {
  const t = getT(locale);

  if (!products.length) {
    return (
      <div className="border border-ink bg-card px-8 py-16 text-center text-sm text-ink/60">
        {t.catalogV3.noResults}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {products.map((product) => (
        <PieceCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}
