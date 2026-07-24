import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getProductBySlug,
  getAllProductSlugs,
  getCategories,
  getStoreInfo,
  getWhatsAppLink,
} from '@/lib/sanity-data';
import { PurchasePanel } from '@/components/product/PurchasePanel';
import { ProductGallery } from '@/components/product/ProductGallery';
import { RichText } from '@/components/ui/RichText';
import { buildImage } from '@/lib/image';
import { metadataFromSeo } from '@/lib/metadata';
import { categoryLabel, localizedValue } from '@/lib/catalog';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import type { Locale, ResolvedImage } from '@/types';

// Studio edits go live within ~60s without a rebuild; newly added pieces
// render on demand (dynamicParams defaults to true).
export const revalidate = 60;

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale);
  if (!product) return {};

  const name = locale === 'en' ? product.nameEn || product.name : product.name;
  const description = locale === 'en' ? product.descriptionEn || product.description : product.description;

  return metadataFromSeo(product.seo, locale, {
    title: name,
    // Search results cut off around 155 characters, so trim at a word boundary.
    description: description.length > 155 ? `${description.slice(0, 152).trimEnd()}…` : description,
  });
}

export default async function PieceDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; kategori: string; slug: string }>;
}) {
  const { locale, kategori, slug } = await params;
  const [product, storeInfo, categories] = await Promise.all([
    getProductBySlug(slug, locale),
    getStoreInfo(locale),
    getCategories(locale),
  ]);

  if (!product) notFound();

  const t = getT(locale);
  const name = locale === 'en' ? product.nameEn || product.name : product.name;
  const description = locale === 'en' ? product.descriptionEn || product.description : product.description;
  const catLabel = categoryLabel(categories, kategori, locale);

  const waMessage =
    locale === 'en'
      ? `Hello, I'm interested in ${product.nameEn || product.name}. Could you provide more details?`
      : `Halo, saya tertarik dengan ${product.name}. Bisa info lebih lanjut?`;
  const waLink = getWhatsAppLink(storeInfo.whatsapp, waMessage);

  // Every photo is resolved at both sizes: large for the main frame, small for
  // the thumbnail strip. The page previously rendered only the first four, so a
  // piece with seven photos silently dropped three of them.
  const resolveAll = (width: number) =>
    product.images
      .map((image) =>
        buildImage(image, { width, aspect: 'square', fallbackAlt: name, locale })
      )
      .filter((image): image is ResolvedImage => image !== null);

  const galleryLarge = resolveAll(1000);
  const galleryThumbs = resolveAll(320);

  // Most pieces share the same origin, technique, material and lead time, so
  // those come from Site Settings. A piece only overrides one when it differs,
  // and the built-in wording is the last resort.
  const fromSettings = (
    own: string | undefined,
    setting: Parameters<typeof localizedValue>[0],
    builtIn: string
  ) => own || localizedValue(setting, locale) || builtIn;

  const specs = [
    {
      label: t.pieceV3.specMaterial,
      value: fromSettings(
        product.materials.map((m) => m.label).join(', '),
        storeInfo.specMaterial,
        t.pieceV3.specMaterialFallback
      ),
    },
    {
      label: t.pieceV3.specOrigin,
      value: fromSettings(localizedValue(product.origin, locale), storeInfo.specOrigin, t.pieceV3.specOriginValue),
    },
    {
      label: t.pieceV3.specTechnique,
      value: fromSettings(
        localizedValue(product.technique, locale),
        storeInfo.specTechnique,
        t.pieceV3.specTechniqueValue
      ),
    },
    product.weight && { label: t.pieceV3.specWeight, value: `${product.weight}g` },
    product.gemstones.length > 0 && {
      label: t.pieceV3.specStone,
      value: product.gemstones.map((g) => g.label).join(', '),
    },
    {
      label: t.pieceV3.specLead,
      value: fromSettings(product.craftingTime, storeInfo.specLeadTime, t.pieceV3.specLeadFallback),
    },
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
          <ProductGallery
            images={galleryLarge}
            thumbnails={galleryThumbs}
            productName={name}
            locale={locale}
          />
        </div>

        <div className="flex flex-col items-start">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">{catLabel}</p>
          <h1 className="mt-3 font-heading text-[32px] font-medium leading-tight text-ink lg:text-[40px]">
            {name}
          </h1>
          <RichText
            value={product.bodyRich}
            fallback={<p>{description}</p>}
            className="mt-5 text-sm leading-[1.75] text-ink/65"
          />

          <PurchasePanel
            locale={locale}
            productId={product.id}
            slug={product.slug}
            category={kategori}
            basePrice={product.price}
            gemstones={product.gemstones}
            sizes={product.sizeOptions}
            inStock={product.inStock}
            whatsappLink={waLink}
          />

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
