import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getCategoryBySlug, getProductsByCategory, getCategories, getStoreInfo } from '@/lib/sanity-data';
import { PieceGrid } from '@/components/catalog/PieceGrid';
import { SectionHeader } from '@/components/ui/SectionHeader';
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
  const [category, products, storeInfo] = await Promise.all([
    getCategoryBySlug(kategori),
    getProductsByCategory(kategori),
    getStoreInfo(),
  ]);

  if (!category) notFound();

  const t = getT(locale);
  const name = locale === 'en' ? category.nameEn || category.name : category.name;
  const description = locale === 'en' ? category.descriptionEn || category.description : category.description;

  return (
    <div>
      <div className="bg-charcoal py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/koleksi`}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-warm-white/60 transition-colors hover:text-warm-white"
          >
            <ChevronLeft size={16} />
            {t.collections.title}
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-warm-white/10">
              <span className="font-heading text-lg font-semibold text-silver-bright">
                {name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <SectionHeader
              title={name}
              subtitle={description}
              align="left"
              theme="dark"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PieceGrid products={products} locale={locale} whatsapp={storeInfo.whatsapp} />
      </div>
    </div>
  );
}
