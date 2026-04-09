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
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warm-white-dark">
          <div className="h-8 w-8 rounded-full bg-silver-mid/40" />
        </div>
        <p className="text-text-muted">{emptyMessage ?? t.catalog.noResults}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
