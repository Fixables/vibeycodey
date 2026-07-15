import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getAllProductSlugs, getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { SizeSelector } from '@/components/product/SizeSelector';
import { categoryLabel, parseSizes } from '@/lib/catalog';
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
  const [product, storeInfo] = await Promise.all([getProductBySlug(slug), getStoreInfo()]);

  if (!product) notFound();

  const t = getT(locale);
  const name = locale === 'en' ? product.nameEn || product.name : product.name;
  const description = locale === 'en' ? product.descriptionEn || product.description : product.description;
  const catLabel = categoryLabel(t, kategori);

  const waMessage =
    locale === 'en'
      ? `Hello, I'm interested in ${product.nameEn || product.name}. Could you provide more details?`
      : `Halo, saya tertarik dengan ${product.name}. Bisa info lebih lanjut?`;
  const waLink = getWhatsAppLink(storeInfo.whatsapp, waMessage);

  const images = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];
  const thumbs = [images[1], images[2], images[3]];

  const specs = [
    { label: t.pieceV3.specMaterial, value: product.material || t.pieceV3.specMaterialFallback },
    { label: t.pieceV3.specOrigin, value: t.pieceV3.specOriginValue },
    { label: t.pieceV3.specTechnique, value: t.pieceV3.specTechniqueValue },
    product.weight && { label: t.pieceV3.specWeight, value: `${product.weight}g` },
    product.stone && { label: t.pieceV3.specStone, value: product.stone },
    { label: t.pieceV3.specLead, value: product.craftingTime || t.pieceV3.specLeadFallback },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="mx-auto max-w-[1280px] px-5 pb-20 pt-6 sm:px-10">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.08em] text-ink/45">
        <Link href={`/${locale}/koleksi`} className="uppercase transition-colors hover:text-accent">
          {t.pieceV3.breadcrumbRoot}
        </Link>
        <span>/</span>
        <Link href={`/${locale}/koleksi/${kategori}`} className="uppercase transition-colors hover:text-accent">
          {catLabel}
        </Link>
        <span>/</span>
        <span className="font-medium text-ink">{name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <ImageSlot src={images[0]} alt={name} className="aspect-square border border-ink" />
          <div className="mt-3 grid grid-cols-3 gap-3">
            {thumbs.map((img, i) => (
              <ImageSlot
                key={i}
                src={img}
                alt={`${name} — ${t.pieceV3.thumbLabel}`}
                label={t.pieceV3.thumbLabel}
                className="aspect-square border border-ink"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">{catLabel}</p>
          <h1 className="mt-3 font-heading text-[32px] font-medium leading-tight text-ink lg:text-[40px]">
            {name}
          </h1>
          <PriceDisplay amountIdr={product.price} className="mt-4 font-heading text-[26px] text-ink" />
          <p className="mt-5 text-sm leading-[1.75] text-ink/65">{description}</p>

          <SizeSelector sizes={parseSizes(product.sizes)} label={t.pieceV3.sizeLabel} />

          <div className="mt-8 w-full">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center bg-ink px-8 py-4 text-xs font-semibold tracking-[0.16em] text-paper transition-colors hover:bg-accent"
            >
              {t.pieceV3.orderWhatsApp}
            </a>
            <p className="mt-2 text-[11px] text-ink/45">{t.pieceV3.orderNote}</p>
          </div>

          <dl className="mt-8 w-full divide-y divide-ink/15 border-t border-ink/15">
            {specs.map((spec) => (
              <div key={spec.label} className="flex justify-between gap-6 py-3">
                <dt className="text-[11px] uppercase tracking-[0.08em] text-ink/55">{spec.label}</dt>
                <dd className="text-right text-[13px] font-medium text-ink">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
