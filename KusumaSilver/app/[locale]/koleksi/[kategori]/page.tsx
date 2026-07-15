import { notFound } from 'next/navigation';
import { getCategoryBySlug, getCategories, getProducts } from '@/lib/sanity-data';
import { CollectionClient } from '@/components/catalog/CollectionClient';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import type { Locale } from '@/types';

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return SUPPORTED_LOCALES.flatMap((locale) =>
      categories.map((cat) => ({ locale, kategori: cat.slug }))
    );
  } catch {
    return SUPPORTED_LOCALES.map((locale) => ({ locale, kategori: 'cincin' }));
  }
}

export default async function KategoriPage({
  params,
}: {
  params: Promise<{ locale: Locale; kategori: string }>;
}) {
  const { locale, kategori } = await params;
  const [category, categories, products] = await Promise.all([
    getCategoryBySlug(kategori),
    getCategories(),
    getProducts(),
  ]);

  if (!category) notFound();

  const t = getT(locale);
  const name = locale === 'en' ? category.nameEn || category.name : category.name;
  const description = locale === 'en' ? category.descriptionEn || category.description : category.description;

  return (
    <div>
      <div className="bg-ink px-5 py-14 text-center text-ink-soft">
        <p className="text-[10px] tracking-[0.3em] text-accent uppercase">{t.catalogV3.eyebrow}</p>
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
      />
    </div>
  );
}
