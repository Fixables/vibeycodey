import Link from 'next/link';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { CardAddToBag } from './CardAddToBag';
import { categoryLabel, parseSizes } from '@/lib/catalog';
import { getT } from '@/lib/i18n';
import type { Product, Locale } from '@/types';

interface PieceCardProps {
  product: Product;
  locale: Locale;
}

export function PieceCard({ product, locale }: PieceCardProps) {
  const t = getT(locale);
  const name = locale === 'en' ? product.nameEn || product.name : product.name;
  const defaultSize = parseSizes(product.sizes)[0] ?? null;

  return (
    <div className="group flex h-full flex-col border border-ink bg-card">
      <Link
        href={`/${locale}/koleksi/${product.category}/${product.slug}`}
        className="flex flex-1 flex-col"
      >
        <ImageSlot
          src={product.imageUrl}
          alt={name}
          className="aspect-square border-b border-ink"
          imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-heading text-[17px] font-normal leading-snug text-ink">{name}</h3>
          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-ink/45">
            {categoryLabel(t, product.category)}
          </p>
          <PriceDisplay
            amountIdr={product.price}
            className="mt-auto pt-3 text-[13px] font-semibold text-ink"
          />
        </div>
      </Link>
      {product.inStock && (
        <div className="px-4 pb-4">
          <CardAddToBag
            locale={locale}
            productId={product.id}
            slug={product.slug}
            category={product.category}
            size={defaultSize}
          />
        </div>
      )}
    </div>
  );
}
