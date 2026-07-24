import Link from 'next/link';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { CardAddToBag } from './CardAddToBag';
import { categoryLabel } from '@/lib/catalog';
import { hasVariantPricing, lowestVariantPrice } from '@/lib/commerce/variants';
import { getT } from '@/lib/i18n';
import type { Category, Product, Locale } from '@/types';

interface PieceCardProps {
  product: Product;
  /** Used to show the category's real name rather than its slug. */
  categories: Category[];
  locale: Locale;
}

export function PieceCard({ product, categories, locale }: PieceCardProps) {
  const t = getT(locale);
  const name = locale === 'en' ? product.nameEn || product.name : product.name;
  const href = `/${locale}/koleksi/${product.category}/${product.slug}`;
  const firstAvailable = (options: { slug: string; inStock: boolean }[]) =>
    options.find((o) => o.inStock)?.slug ?? options[0]?.slug ?? null;
  // Only a single fixed option each way can be added straight from the card.
  const needsChoice = product.sizeOptions.length > 1 || product.gemstones.length > 1;
  const priceable = {
    price: product.price,
    gemstones: product.gemstones,
    sizeOptions: product.sizeOptions,
  };
  const varies = hasVariantPricing(priceable);
  const fromPrice = varies ? lowestVariantPrice(priceable) : product.price;

  return (
    <div className="group flex h-full flex-col border border-ink bg-card">
      <Link
        href={href}
        className="flex flex-1 flex-col"
      >
        <ImageSlot
          image={product.card}
          alt={name}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-square border-b border-ink"
          imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-heading text-[17px] font-normal leading-snug text-ink">{name}</h3>
          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-ink/45">
            {categoryLabel(categories, product.category, locale)}
          </p>
          {/* "From" when options are priced differently, so the card never
              shows a number the piece page then contradicts. */}
          <div className="mt-auto flex items-baseline gap-1.5 pt-3">
            {varies && (
              <span className="text-[10px] uppercase tracking-[0.1em] text-ink/45">
                {t.catalogV3.priceFrom}
              </span>
            )}
            <PriceDisplay amountIdr={fromPrice} className="text-[13px] font-semibold text-ink" />
          </div>
        </div>
      </Link>
      {product.inStock && (
        <div className="px-4 pb-4">
          <CardAddToBag
            locale={locale}
            productId={product.id}
            slug={product.slug}
            category={product.category}
            size={firstAvailable(product.sizeOptions)}
            gemstone={firstAvailable(product.gemstones)}
            needsChoice={needsChoice}
            href={href}
          />
        </div>
      )}
    </div>
  );
}
