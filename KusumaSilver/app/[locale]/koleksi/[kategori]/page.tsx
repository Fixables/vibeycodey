import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getCatalogueContent,
  getCategoryBySlug,
  getCategories,
  getCategorySlugs,
  getProducts,
} from '@/lib/sanity-data';
import { CollectionClient } from '@/components/catalog/CollectionClient';
import { resolveCatalogue } from '@/lib/home-content';
import { metadataFromSeo } from '@/lib/metadata';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import type { Locale } from '@/types';

// Studio edits go live within ~60s without a rebuild; new categories render
// on demand (dynamicParams defaults to true).
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    // Slugs only, via the published-only fetcher: this runs at build time, with
    // no request scope for the draft-aware one to read.
    const slugs = await getCategorySlugs();
    return SUPPORTED_LOCALES.flatMap((locale) =>
      slugs.map((kategori) => ({ locale, kategori }))
    );
  } catch {
    return SUPPORTED_LOCALES.map((locale) => ({ locale, kategori: 'cincin' }));
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; kategori: string }>;
}): Promise<Metadata> {
  const { locale, kategori } = await params;
  const category = await getCategoryBySlug(kategori, locale);
  if (!category) return {};

  const name = locale === 'en' ? category.nameEn || category.name : category.name;
  const description = locale === 'en' ? category.descriptionEn || category.description : category.description;
  return metadataFromSeo(category.seo, locale, { title: name, description });
}

export default async function KategoriPage({
  params,
}: {
  params: Promise<{ locale: Locale; kategori: string }>;
}) {
  const { locale, kategori } = await params;
  const [category, categories, products, catalogueDoc] = await Promise.all([
    getCategoryBySlug(kategori, locale),
    getCategories(locale),
    getProducts(locale),
    getCatalogueContent(),
  ]);

  if (!category) notFound();

  const t = getT(locale);
  const catalogue = resolveCatalogue(catalogueDoc, locale, t);
  const name = locale === 'en' ? category.nameEn || category.name : category.name;
  const description = locale === 'en' ? category.descriptionEn || category.description : category.description;

  return (
    <div>
      <div className="bg-ink px-5 py-14 text-center text-ink-soft">
        <p className="text-[10px] tracking-[0.3em] text-accent uppercase">{catalogue.eyebrow}</p>
        <h1 className="mt-4 font-heading text-[34px] font-light lg:text-[46px]">{name}</h1>
        {description && (
          <p className="mx-auto mt-4 max-w-[520px] text-sm leading-relaxed text-ink-soft/60">{description}</p>
        )}
      </div>

      <CollectionClient
        products={products}
        categories={categories}
        locale={locale}
        fixedCategory={kategori}
        emptyMessage={catalogue.emptyMessage}
      />
    </div>
  );
}
