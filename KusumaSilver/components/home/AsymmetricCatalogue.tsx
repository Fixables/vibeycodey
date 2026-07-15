import Link from 'next/link';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { categoryLabel } from '@/lib/catalog';
import { getT } from '@/lib/i18n';
import type { Locale, Product } from '@/types';

interface AsymmetricCatalogueProps {
  locale: Locale;
  products: Product[];
}

function localizedName(product: Product, locale: Locale): string {
  return locale === 'en' ? product.nameEn || product.name : product.name;
}

interface ProductCellProps {
  product: Product;
  locale: Locale;
  categoryLabel: string;
  imageClassName: string;
}

function ProductCell({ product, locale, categoryLabel, imageClassName }: ProductCellProps) {
  return (
    <Link href={`/${locale}/koleksi/${product.category}/${product.slug}`} className="group block">
      <ImageSlot
        src={product.imageUrl}
        alt={localizedName(product, locale)}
        className={`border-b border-ink ${imageClassName}`}
        imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <div className="flex items-start justify-between gap-4 p-4">
        <div>
          <h3 className="font-heading text-lg font-normal text-ink">
            {localizedName(product, locale)}
          </h3>
          <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-ink/50">
            {categoryLabel}
          </p>
        </div>
        <PriceDisplay amountIdr={product.price} className="text-[13px] font-semibold text-ink" />
      </div>
    </Link>
  );
}

export function AsymmetricCatalogue({ locale, products }: AsymmetricCatalogueProps) {
  const t = getT(locale);

  return (
    <section className="px-5 py-14 sm:px-10 lg:py-20">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-heading text-[28px] font-normal text-ink lg:text-[34px]">
          {t.homeV3.catalogueHead}
        </h2>
        <Link
          href={`/${locale}/koleksi`}
          className="border-b border-ink pb-0.5 text-[11px] font-semibold tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
        >
          {t.homeV3.viewAll}
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="flex items-center justify-center border border-ink py-24">
          <Link
            href={`/${locale}/koleksi`}
            className="border-b border-ink pb-0.5 text-[11px] font-semibold tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {t.homeV3.viewAll}
          </Link>
        </div>
      ) : (
        <div className="grid border border-ink lg:grid-cols-[38%_24%_38%]">
          {products[0] && (
            <div className="border-b border-ink lg:border-b-0 lg:border-r">
              <ProductCell
                product={products[0]}
                locale={locale}
                categoryLabel={categoryLabel(t, products[0].category)}
                imageClassName="h-[380px] lg:h-[480px]"
              />
            </div>
          )}

          {products[1] && (
            <div className="flex flex-col border-b border-ink lg:border-b-0 lg:border-r">
              <div className="border-b border-ink p-6">
                <p className="text-[10px] tracking-[0.3em] text-accent">
                  {t.homeV3.techniqueLabel}
                </p>
                <p className="mt-3 font-heading text-[22px] leading-snug text-ink">
                  {t.homeV3.techniqueText}
                </p>
              </div>
              <ProductCell
                product={products[1]}
                locale={locale}
                categoryLabel={categoryLabel(t, products[1].category)}
                imageClassName="h-[240px]"
              />
            </div>
          )}

          {products[2] && (
            <div>
              <ProductCell
                product={products[2]}
                locale={locale}
                categoryLabel={categoryLabel(t, products[2].category)}
                imageClassName="h-[280px] lg:h-[360px]"
              />
              <div className="border-t border-ink p-6">
                <p className="text-[10px] tracking-[0.3em] text-accent">{t.homeV3.originLabel}</p>
                <p className="mt-3 font-heading text-[22px] leading-snug text-ink">
                  {t.homeV3.originText}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
