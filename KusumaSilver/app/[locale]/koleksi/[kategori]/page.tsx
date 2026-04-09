import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { getCategoryBySlug, getProductsByCategory, getCategories, getStoreInfo } from '@/lib/sanity-data';
import { PieceGrid } from '@/components/catalog/PieceGrid';
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

  const filterLabels = locale === 'en'
    ? ['Material', 'Stone', 'Crafting Technique']
    : ['Material', 'Batu', 'Teknik Kerajinan'];

  return (
    <div className="bg-warm-white min-h-screen">
      {/* Hammered silver texture header */}
      <div
        className="relative overflow-hidden py-16 sm:py-20"
        style={{
          background: 'linear-gradient(145deg, #D8D5CE 0%, #C4C0B8 30%, #D0CCC4 55%, #B8B4AC 80%, #C8C4BC 100%)',
        }}
      >
        {/* Hammered bump overlay */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 6px 4px at 8% 15%, rgba(255,255,255,0.5) 0%, transparent 100%),
              radial-gradient(ellipse 4px 6px at 22% 40%, rgba(255,255,255,0.3) 0%, transparent 100%),
              radial-gradient(ellipse 8px 5px at 38% 70%, rgba(255,255,255,0.4) 0%, transparent 100%),
              radial-gradient(ellipse 5px 7px at 55% 25%, rgba(255,255,255,0.35) 0%, transparent 100%),
              radial-gradient(ellipse 7px 4px at 70% 55%, rgba(255,255,255,0.45) 0%, transparent 100%),
              radial-gradient(ellipse 4px 8px at 85% 30%, rgba(255,255,255,0.3) 0%, transparent 100%),
              radial-gradient(ellipse 6px 5px at 92% 75%, rgba(255,255,255,0.4) 0%, transparent 100%),
              radial-gradient(ellipse 3px 3px at 15% 85%, rgba(0,0,0,0.08) 0%, transparent 100%),
              radial-gradient(ellipse 5px 3px at 45% 50%, rgba(0,0,0,0.06) 0%, transparent 100%),
              radial-gradient(ellipse 4px 5px at 75% 80%, rgba(0,0,0,0.07) 0%, transparent 100%)
            `,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/koleksi`}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-charcoal/60 transition-colors hover:text-charcoal"
          >
            <ChevronLeft size={16} />
            {t.collections.title}
          </Link>
          <h1
            className="font-heading font-light text-charcoal"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: '1.05' }}
          >
            {name}
          </h1>
        </div>
      </div>

      {/* Filter bar */}
      <div className="border-b border-warm-white-dark bg-warm-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto">
          {filterLabels.map((label) => (
            <button
              key={label}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-warm-white-dark bg-warm-white px-4 py-2 text-xs font-medium text-charcoal transition-colors hover:border-charcoal"
            >
              {label}
              <ChevronDown size={13} className="text-text-muted" />
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PieceGrid products={products} locale={locale} whatsapp={storeInfo.whatsapp} />
      </div>
    </div>
  );
}
