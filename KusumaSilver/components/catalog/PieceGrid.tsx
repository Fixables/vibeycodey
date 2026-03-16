import { PieceCard } from './PieceCard';
import { getT } from '@/lib/i18n';
import type { Product, Locale } from '@/types';

interface PieceGridProps {
  products: Product[];
  locale: Locale;
  whatsapp: string;
  emptyMessage?: string;
}

export function PieceGrid({ products, locale, whatsapp, emptyMessage }: PieceGridProps) {
  const t = getT(locale);

  if (!products.length) {
    return (
      <div className="py-16 text-center">
        <div className="text-5xl">💍</div>
        <p className="mt-4 text-text-light">{emptyMessage ?? t.catalog.noResults}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <PieceCard
          key={product.id}
          product={product}
          locale={locale}
          whatsapp={whatsapp}
        />
      ))}
    </div>
  );
}
