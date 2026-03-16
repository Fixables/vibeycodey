import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeaturedProducts, getStoreInfo } from '@/lib/sanity-data';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PieceCard } from '@/components/catalog/PieceCard';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface FeaturedPiecesProps {
  locale: Locale;
}

export async function FeaturedPieces({ locale }: FeaturedPiecesProps) {
  const [products, storeInfo] = await Promise.all([
    getFeaturedProducts(),
    getStoreInfo(),
  ]);
  const t = getT(locale);

  if (!products.length) return null;

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={locale === 'en' ? 'Featured Pieces' : 'Perhiasan Pilihan'}
          subtitle={
            locale === 'en'
              ? 'Handpicked favorites from our collection'
              : 'Pilihan terbaik dari koleksi kami'
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <PieceCard
              key={product.id}
              product={product}
              locale={locale}
              whatsapp={storeInfo.whatsapp}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/koleksi`}
            className="inline-flex items-center gap-2 rounded-lg bg-espresso px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-espresso-mid"
          >
            {t.collections.viewAll}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
