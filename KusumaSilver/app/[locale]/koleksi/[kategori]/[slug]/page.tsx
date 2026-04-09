import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, MessageCircle, Play } from 'lucide-react';
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
  const mainImage = images[0];
  const thumbImages = images.slice(1, 4);

  const specs = [
    product.material && { label: t.piece.material, value: product.material },
    product.weight && { label: t.piece.weight, value: `${product.weight}g` },
    product.sizes && { label: t.piece.sizes, value: product.sizes },
    product.stone && { label: t.piece.stone, value: product.stone },
    product.craftingTime && { label: t.piece.craftingTime, value: product.craftingTime },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="bg-warm-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-text-muted">
          <Link href={`/${locale}/koleksi`} className="transition-colors hover:text-charcoal">
            {t.nav.collections}
          </Link>
          <ChevronLeft size={12} className="rotate-180" />
          <Link href={`/${locale}/koleksi/${kategori}`} className="capitalize transition-colors hover:text-charcoal">
            {kategori}
          </Link>
          <ChevronLeft size={12} className="rotate-180" />
          <span className="text-charcoal font-medium truncate max-w-[140px]">{name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Image gallery */}
          <div>
            {/* Main image */}
            <div className="relative overflow-hidden rounded-2xl bg-charcoal aspect-square">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-charcoal-light">
                  <div className="h-20 w-20 rounded-full bg-silver-mid/20" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {thumbImages.length > 0 && (
              <div className="mt-3 flex gap-3">
                {/* First thumb — selected state */}
                {mainImage && (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-charcoal bg-charcoal">
                    <Image src={mainImage} alt={name} fill className="object-cover" sizes="80px" />
                  </div>
                )}
                {thumbImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-warm-white-dark bg-charcoal"
                  >
                    <Image src={img} alt={`${name} view ${i + 2}`} fill className="object-cover" sizes="80px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {product.isCustomizable && (
              <Badge variant="terracotta" className="mb-3 self-start">
                {t.piece.customizable}
              </Badge>
            )}

            <h1
              className="font-heading font-semibold text-charcoal leading-tight"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)' }}
            >
              {name}
            </h1>

            <div className="mt-3 font-heading text-2xl font-semibold text-charcoal">
              {product.priceDisplay}
            </div>

            {/* "Add to Cart" style CTA — routes to WhatsApp */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center rounded-full bg-silver-mid/30 py-3.5 text-sm font-semibold text-charcoal transition-all hover:bg-silver-mid/50"
            >
              {t.piece.order}
            </a>

            <p className="mt-6 text-sm leading-relaxed text-text-muted">{description}</p>

            {/* Specs */}
            {specs.length > 0 && (
              <div className="mt-6 divide-y divide-warm-white-dark rounded-2xl border border-warm-white-dark p-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
                      {spec.label}
                    </dt>
                    <dd className="text-sm font-medium text-charcoal">{spec.value}</dd>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Artisanship section */}
        <div className="mt-16 border-t border-warm-white-dark pt-14">
          <h2 className="font-heading text-2xl font-light text-center text-charcoal sm:text-3xl">
            {locale === 'en' ? 'Artisanship' : 'Keahlian Pengrajin'}
          </h2>
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="h-px w-10 bg-silver-mid/60" />
            <div className="h-1 w-1 rounded-full bg-silver-dark" />
            <div className="h-px w-10 bg-silver-mid/60" />
          </div>

          {/* Video placeholder */}
          <div className="mt-8 relative overflow-hidden rounded-2xl bg-charcoal aspect-video">
            <div className="flex h-full items-center justify-center flex-col gap-3">
              <button
                aria-label="Play artisan video"
                className="flex h-16 w-16 items-center justify-center rounded-full border border-warm-white/30 bg-warm-white/10 backdrop-blur-sm transition-all hover:bg-warm-white/20"
              >
                <Play size={22} className="text-warm-white translate-x-0.5" fill="white" />
              </button>
              <p className="text-xs tracking-widest uppercase text-warm-white/40">Play</p>
            </div>
          </div>
          <p className="mt-3 text-center text-sm text-text-muted">
            <strong className="text-charcoal">
              {locale === 'en' ? 'Artisanship:' : 'Kerajinan:'}
            </strong>{' '}
            {locale === 'en' ? 'The Hammering Process' : 'Proses Tempa'}
          </p>

          {/* Balinese motif note */}
          <p className="mx-auto mt-6 max-w-md text-center text-sm text-text-muted leading-relaxed">
            <strong className="text-charcoal">
              {locale === 'en' ? 'Balinese Motif:' : 'Motif Bali:'}
            </strong>{' '}
            {locale === 'en'
              ? 'Inspired by the sacred temples and lush nature of Bali, each piece features traditional filigree and granulation patterns.'
              : 'Terinspirasi dari kuil suci dan alam Bali yang hijau, setiap karya menampilkan pola filigri dan granulasi tradisional.'}
          </p>

          {/* 925 Hand-Forged card */}
          <div className="mx-auto mt-10 max-w-sm overflow-hidden rounded-2xl bg-charcoal p-8">
            <p className="font-heading text-xl font-light text-warm-white">
              {locale === 'en' ? '925 Hand-Forged' : '925 Tempa Tangan'}
            </p>
            <div className="mt-8 flex items-end justify-between">
              <span className="font-heading text-5xl font-light text-silver-bright/15 select-none">925</span>
              <div className="text-right">
                <p className="font-heading text-lg font-semibold text-warm-white leading-none">Kusuma</p>
                <p className="text-[9px] tracking-[0.3em] uppercase text-warm-white/50">Silver</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
