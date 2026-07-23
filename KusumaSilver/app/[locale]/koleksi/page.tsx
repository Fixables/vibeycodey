import type { Metadata } from 'next';
import { getCatalogueContent, getCategories, getProducts } from '@/lib/sanity-data';
import { CollectionClient } from '@/components/catalog/CollectionClient';
import { resolveCatalogue } from '@/lib/home-content';
import { metadataFromSeo } from '@/lib/metadata';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import type { Locale, Seo } from '@/types';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

// Studio edits go live within ~60s without a rebuild.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const doc = await getCatalogueContent();
  const catalogue = resolveCatalogue(doc, locale, getT(locale));
  return metadataFromSeo(doc?.seo as Seo | undefined, locale, {
    title: catalogue.title,
    description: catalogue.subtitle,
  });
}

export default async function KoleksiPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [categories, products, catalogueDoc] = await Promise.all([
    getCategories(locale),
    getProducts(locale),
    getCatalogueContent(),
  ]);
  const t = getT(locale);
  const catalogue = resolveCatalogue(catalogueDoc, locale, t);

  return (
    <div>
      <div className="bg-ink px-5 py-14 text-center text-ink-soft">
        <p className="text-[10px] tracking-[0.3em] text-accent uppercase">{catalogue.eyebrow}</p>
        <h1 className="mt-4 font-heading text-[34px] font-light lg:text-[46px]">{catalogue.title}</h1>
        <p className="mx-auto mt-4 max-w-[520px] text-sm leading-relaxed text-ink-soft/60">
          {catalogue.subtitle}
        </p>
      </div>

      <CollectionClient
        products={products}
        categories={categories}
        locale={locale}
        emptyMessage={catalogue.emptyMessage}
      />
    </div>
  );
}
