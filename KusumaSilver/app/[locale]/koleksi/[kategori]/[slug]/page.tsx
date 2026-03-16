import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, MessageCircle, Sparkles } from 'lucide-react';
import { getProductBySlug, getAllProductSlugs, getStoreInfo, getCategoryBySlug } from '@/lib/sanity-data';
import { getWhatsAppLink } from '@/lib/sanity-data';
import { Badge } from '@/components/ui/Badge';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import type { Locale } from '@/types';

export async function generateStaticParams() {
  try {
    const slugs = await getAllProductSlugs();
    return SUPPORTED_LOCALES.flatMap((locale) =>
      slugs.map((s) => ({ locale, kategori: s.category, slug: s.slug }))
    );
  } catch {
    return [];
  }
}

export default async function PieceDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; kategori: string; slug: string }>;
}) {
  const { locale, kategori, slug } = await params;
  const [product, storeInfo] = await Promise.all([
    getProductBySlug(slug),
    getStoreInfo(),
  ]);

  if (!product) notFound();

  const t = getT(locale);
  const name = locale === 'en' ? product.nameEn || product.name : product.name;
  const description = locale === 'en' ? product.descriptionEn || product.description : product.description;

  const waMessage =
    locale === 'en'
      ? `Hello, I'm interested in ${product.nameEn || product.name}. Could you provide more details?`
      : `Halo, saya tertarik dengan ${product.name}. Bisa info lebih lanjut?`;
  const waLink = getWhatsAppLink(storeInfo.whatsapp, waMessage);

  const images = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];

  return (
    <div className="bg-ivory min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-text-light">
          <Link href={`/${locale}/koleksi`} className="transition-colors hover:text-espresso">
            {t.nav.collections}
          </Link>
          <ChevronLeft size={14} className="rotate-180" />
          <Link href={`/${locale}/koleksi/${kategori}`} className="transition-colors hover:text-espresso capitalize">
            {kategori}
          </Link>
          <ChevronLeft size={14} className="rotate-180" />
          <span className="text-espresso font-medium">{name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Images */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-ivory-dark">
              {images[0] ? (
                <Image
                  src={images[0]}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-8xl">💍</div>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {images.slice(1).map((img, i) => (
                  <div
                    key={i}
                    className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-ivory-dark bg-ivory-dark"
                  >
                    <Image
                      src={img}
                      alt={`${name} ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              {product.isCustomizable && (
                <Badge variant="gold">
                  <Sparkles size={12} className="mr-1" />
                  {t.piece.customizable}
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="gray">
                  {locale === 'en' ? 'Out of Stock' : 'Stok Habis'}
                </Badge>
              )}
            </div>

            <h1 className="font-heading mt-3 text-3xl font-semibold text-espresso sm:text-4xl leading-tight">
              {name}
            </h1>

            <div className="mt-4 font-heading text-2xl font-semibold text-gold">
              {product.priceDisplay}
            </div>

            <p className="mt-6 text-base leading-relaxed text-text-light">{description}</p>

            {/* Specs table */}
            {(product.material || product.weight || product.sizes || product.stone || product.craftingTime) && (
              <div className="mt-6 rounded-2xl border border-ivory-dark bg-white p-5">
                <h2 className="font-heading text-base font-semibold text-espresso mb-3">
                  {locale === 'en' ? 'Specifications' : 'Spesifikasi'}
                </h2>
                <dl className="space-y-2">
                  {product.material && (
                    <div className="flex gap-3">
                      <dt className="w-32 shrink-0 text-sm text-text-light">{t.piece.material}</dt>
                      <dd className="text-sm font-medium text-espresso">{product.material}</dd>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex gap-3">
                      <dt className="w-32 shrink-0 text-sm text-text-light">{t.piece.weight}</dt>
                      <dd className="text-sm font-medium text-espresso">{product.weight}g</dd>
                    </div>
                  )}
                  {product.sizes && (
                    <div className="flex gap-3">
                      <dt className="w-32 shrink-0 text-sm text-text-light">{t.piece.sizes}</dt>
                      <dd className="text-sm font-medium text-espresso">{product.sizes}</dd>
                    </div>
                  )}
                  {product.stone && (
                    <div className="flex gap-3">
                      <dt className="w-32 shrink-0 text-sm text-text-light">{t.piece.stone}</dt>
                      <dd className="text-sm font-medium text-espresso">{product.stone}</dd>
                    </div>
                  )}
                  {product.craftingTime && (
                    <div className="flex gap-3">
                      <dt className="w-32 shrink-0 text-sm text-text-light">{t.piece.craftingTime}</dt>
                      <dd className="text-sm font-medium text-espresso">{product.craftingTime}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Order CTA */}
            <div className="mt-8">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#20b958] hover:shadow-xl"
              >
                <MessageCircle size={20} />
                {t.piece.order}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
