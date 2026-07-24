import { cache } from 'react';
import { client } from './sanity';
import { sanityFetch } from './sanity.live';
import { buildImage, IMAGE_PROJECTION } from './image';
import { formatPrice } from './utils';
import type {
  Category,
  Locale,
  Product,
  SanityImage,
  LocaleRichText,
  PortableTextBlock,
  SizeTerm,
  StoreInfo,
  TaxonomyTerm,
} from '@/types';

// ---- Helpers ----

// Re-exported for the server components that already import it from here.
// Client components must import it from '@/lib/whatsapp' directly — importing
// anything from this module pulls the Sanity client into the browser bundle.
export { getWhatsAppLink } from './whatsapp';

function logFailure(error: unknown, query: string) {
  // Logged before falling back: without this, a bad query, an expired token or a
  // network fault is indistinguishable from "the owner hasn't written this yet",
  // and the site quietly serves built-in defaults with no signal.
  console.error(
    '[sanity] query failed, falling back to defaults:',
    error instanceof Error ? error.message : error,
    '\n  query:',
    query.replace(/\s+/g, ' ').trim().slice(0, 160)
  );
}

/**
 * Draft-aware fetch, for content rendered by a page.
 *
 * Goes through `sanityFetch`, which returns published content for ordinary
 * visitors and unpublished drafts when draft mode is on. That is what makes the
 * Studio's preview pane show work in progress — the same query powers the real
 * page and the preview, so the two can never drift apart.
 *
 * ONLY usable from a React Server Component. `sanityFetch` reads the draft-mode
 * cookie, so it needs a request scope: calling it from a route handler, from
 * `sitemap.ts`, or from `generateStaticParams` throws. Use `safeFetchStatic`
 * there instead.
 */
async function safeFetch<T>(query: string, params?: Record<string, string>, fallback?: T): Promise<T> {
  try {
    const { data } = await sanityFetch({ query, params: params ?? {} });
    return data as T;
  } catch (error) {
    logFailure(error, query);
    return (fallback ?? null) as T;
  }
}

/**
 * Published-only fetch, for everything that runs outside a request: build-time
 * static params, the sitemap, and API route handlers. Never sees drafts, which
 * is correct — none of those should preview unpublished content.
 */
async function safeFetchStatic<T>(
  query: string,
  params?: Record<string, string>,
  fallback?: T
): Promise<T> {
  try {
    return params ? await client.fetch<T>(query, params) : await client.fetch<T>(query);
  } catch (error) {
    logFailure(error, query);
    return (fallback ?? null) as T;
  }
}

/** Width the catalogue/strip cards render a product photo at, on a 2x screen. */
const CARD_IMAGE_WIDTH = 640;

/**
 * Products are consumed by client components (the catalogue strip, the grid),
 * which cannot build Sanity URLs themselves — importing the image builder there
 * would pull @sanity/client into the browser bundle. So the card-sized image is
 * resolved here, on the server, while the raw image objects travel alongside for
 * server components that need a different size (the product detail page).
 */
/**
 * Read a filter dimension off a product.
 *
 * Prefers the linked taxonomy documents. Falls back to splitting the old
 * free-text field ("Amethyst, Garnet, and Peridot") into separate terms, so a
 * piece the owner has not re-linked yet still filters correctly instead of
 * offering the whole sentence as one nonsense option.
 */
function taxonomyTerms(
  refs: unknown,
  legacy: unknown,
  locale: Locale,
  variants?: unknown,
  refKey = 'gemstone'
): TaxonomyTerm[] {
  // Preferred shape: options carrying their own price change and stock.
  if (Array.isArray(variants) && variants.length > 0) {
    return variants
      .map((row) => row as Record<string, unknown>)
      .map((row) => ({ row, term: row[refKey] as Record<string, unknown> | null }))
      .filter((entry): entry is { row: Record<string, unknown>; term: Record<string, unknown> } =>
        Boolean(entry.term?.slug)
      )
      .map(({ row, term }) => ({
        slug: term.slug as string,
        label:
          (locale === 'en' ? (term.nameEn as string) : (term.name as string)) ||
          (term.name as string),
        priceAdjust: typeof row.priceAdjust === 'number' ? row.priceAdjust : 0,
        // Absent means available: a piece migrated before this field existed
        // must not silently read as sold out.
        inStock: row.inStock !== false,
      }));
  }

  if (Array.isArray(refs) && refs.length > 0) {
    return refs
      .map((row) => row as Record<string, unknown> | null)
      .filter((row): row is Record<string, unknown> => Boolean(row?.slug))
      .map((row) => ({
        slug: row.slug as string,
        label:
          (locale === 'en' ? (row.nameEn as string) : (row.name as string)) ||
          (row.name as string),
        priceAdjust: 0,
        inStock: true,
      }));
  }
  return splitLegacyList(legacy).map((label) => ({
    slug: slugifyTerm(label),
    label,
    priceAdjust: 0,
    inStock: true,
  }));
}

/**
 * Sizes additionally carry a group, so ring sizes and lengths stay apart.
 * No locale here: "7" and "45 cm" read the same in both languages.
 */
function sizeTerms(refs: unknown, legacy: unknown, variants?: unknown): SizeTerm[] {
  if (Array.isArray(variants) && variants.length > 0) {
    return variants
      .map((row) => row as Record<string, unknown>)
      .map((row) => ({ row, term: row.size as Record<string, unknown> | null }))
      .filter((entry): entry is { row: Record<string, unknown>; term: Record<string, unknown> } =>
        Boolean(entry.term?.slug)
      )
      .map(({ row, term }) => ({
        slug: term.slug as string,
        label: term.name as string,
        group: (term.group as SizeTerm['group']) ?? 'other',
        priceAdjust: typeof row.priceAdjust === 'number' ? row.priceAdjust : 0,
        inStock: row.inStock !== false,
      }));
  }
  if (Array.isArray(refs) && refs.length > 0) {
    return refs
      .map((row) => row as Record<string, unknown> | null)
      .filter((row): row is Record<string, unknown> => Boolean(row?.slug))
      .map((row) => ({
        slug: row.slug as string,
        label: row.name as string,
        group: (row.group as SizeTerm['group']) ?? 'other',
        priceAdjust: 0,
        inStock: true,
      }));
  }
  return splitLegacyList(legacy).map((label) => ({
    slug: slugifyTerm(label),
    label,
    // Guess from the text so unmigrated pieces still group sensibly.
    group: /\d\s*(cm|mm|inch|")/i.test(label) ? 'length' : /^\d+$/.test(label) ? 'ring' : 'other',
    priceAdjust: 0,
    inStock: true,
  }));
}

/**
 * Split a free-text list into terms. Handles the separators the owner actually
 * used: commas, the word "and", and ampersands.
 */
function splitLegacyList(value: unknown): string[] {
  if (typeof value !== 'string') return [];
  return value
    .split(/,|\band\b|&/gi)
    .map((part) => part.trim())
    .filter(Boolean);
}

function slugifyTerm(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Formatted product description for this locale, or null if unwritten. */
function pickProductBody(value: unknown, locale: Locale): PortableTextBlock[] | null {
  const body = value as LocaleRichText | undefined;
  if (!body) return null;
  const chosen = locale === 'en' ? body.en : body.id;
  const blocks = chosen?.length ? chosen : body.id;
  if (!blocks?.length) return null;
  const hasText = blocks.some((block) =>
    block._type !== 'block'
      ? true
      : (block.children ?? []).some((child) => (child.text ?? '').trim().length > 0)
  );
  return hasText ? blocks : null;
}

function mapProduct(raw: Record<string, unknown>, locale: Locale): Product {
  const images = (raw.images as SanityImage[] | undefined) ?? [];
  const name = (locale === 'en' ? (raw.nameEn as string) : (raw.name as string)) || (raw.name as string);

  return {
    id: raw._id as string,
    slug: (raw.slug as { current: string }).current,
    name: raw.name as string,
    nameEn: (raw.nameEn as string) ?? '',
    category: (raw.category as { slug: { current: string } })?.slug?.current ?? '',
    price: (raw.price as number) ?? 0,
    priceDisplay: formatPrice((raw.price as number) ?? 0),
    description: (raw.description as string) ?? '',
    descriptionEn: (raw.descriptionEn as string) ?? '',
    bodyRich: pickProductBody(raw.body, locale),
    images,
    card: buildImage(images[0], {
      width: CARD_IMAGE_WIDTH,
      aspect: 'square',
      fallbackAlt: name,
      locale,
    }),
    origin: raw.origin as Product['origin'],
    technique: raw.technique as Product['technique'],
    seo: raw.seo as Product['seo'],
    // Filter values come from the taxonomy lists when a piece has been linked
    // up, and from the old free-text fields otherwise, so the catalogue is
    // correct before, during and after the migration.
    gemstones: taxonomyTerms(raw.gemstones, raw.stone, locale, raw.gemstoneVariants, 'gemstone'),
    materials: taxonomyTerms(
      raw.materialRef ? [raw.materialRef] : undefined,
      raw.material,
      locale
    ),
    sizeOptions: sizeTerms(raw.sizeOptions, raw.sizes, raw.sizeVariants),
    weight: raw.weight as number | undefined,
    craftingTime: raw.craftingTime as string | undefined,
    isCustomizable: (raw.isCustomizable as boolean) ?? false,
    featured: (raw.featured as boolean) ?? false,
    inStock: (raw.inStock as boolean) ?? true,
  };
}

// ---- Categories ----

function mapCategory(c: Record<string, unknown>, locale: Locale): Category {
  // The category's own photo if the owner has set one, otherwise fall back to
  // borrowing the first in-stock product's photo (the previous behaviour, which
  // left the three empty categories with no cover at all).
  const source = (c.image ?? c.coverImage) as SanityImage | undefined;
  const name = (locale === 'en' ? (c.nameEn as string) : (c.name as string)) || (c.name as string);
  const cover = buildImage(source, {
    width: 600,
    aspect: 'landscape',
    fallbackAlt: name,
    locale,
  });

  return {
    slug: c.slug as string,
    name: c.name as string,
    nameEn: (c.nameEn as string) ?? '',
    description: (c.description as string) ?? '',
    descriptionEn: (c.descriptionEn as string) ?? '',
    productCount: c.productCount as number,
    cover,
    seo: c.seo as Category['seo'],
  };
}

const CATEGORY_FIELDS = `
  "slug": slug.current,
  name,
  nameEn,
  description,
  descriptionEn,
  image ${IMAGE_PROJECTION},
  seo { ..., shareImage ${IMAGE_PROJECTION} },
  "productCount": count(*[_type == "product" && references(^._id) && inStock == true]),
  "coverImage": *[_type == "product" && references(^._id) && inStock == true && defined(images[0])][0].images[0] ${IMAGE_PROJECTION}
`;

/**
 * Menu order. `orderRank` comes from the Studio's drag-and-drop list; the legacy
 * `order` number is kept as a tiebreaker so categories that have not been
 * dragged yet keep the sequence the owner already set.
 */
const CATEGORY_ORDER = `| order(orderRank asc, order asc)`;

export async function getCategories(locale: Locale): Promise<Category[]> {
  const query = `*[_type == "category"] ${CATEGORY_ORDER} { ${CATEGORY_FIELDS} }`;
  const raw = await safeFetch<Record<string, unknown>[]>(query, undefined, []);
  if (!raw) return [];
  return raw.map((row) => mapCategory(row, locale));
}

/**
 * Category slugs only, published-only. For `generateStaticParams` and the
 * sitemap, which run outside a request and so cannot use the draft-aware fetch.
 */
export async function getCategorySlugs(): Promise<string[]> {
  const raw = await safeFetchStatic<{ slug: string }[]>(
    `*[_type == "category" && defined(slug.current)] ${CATEGORY_ORDER} { "slug": slug.current }`,
    undefined,
    []
  );
  return (raw ?? []).map((row) => row.slug).filter((slug) => typeof slug === 'string');
}

export async function getCategoryBySlug(slug: string, locale: Locale): Promise<Category | null> {
  const query = `*[_type == "category" && slug.current == $slug][0] { ${CATEGORY_FIELDS} }`;
  const raw = await safeFetch<Record<string, unknown> | null>(query, { slug }, null);
  if (!raw) return null;
  return mapCategory(raw, locale);
}

// ---- Products ----

const PRODUCT_FIELDS = `
  _id,
  name,
  nameEn,
  slug,
  "category": category->{ slug },
  price,
  description,
  descriptionEn,
  body,
  images[] ${IMAGE_PROJECTION},
  origin,
  technique,
  seo { ..., shareImage ${IMAGE_PROJECTION} },
  gemstoneVariants[]{ priceAdjust, inStock, gemstone->{ "slug": slug.current, name, nameEn } },
  sizeVariants[]{ priceAdjust, inStock, size->{ "slug": slug.current, name, group } },
  gemstones[]->{ "slug": slug.current, name, nameEn },
  materialRef->{ "slug": slug.current, name, nameEn },
  sizeOptions[]->{ "slug": slug.current, name, group },
  material,
  weight,
  sizes,
  stone,
  craftingTime,
  isCustomizable,
  featured,
  inStock
`;

/**
 * Catalogue order. `orderRank` is written by the Studio's drag-and-drop list;
 * documents that predate it sort last, then by newest, so ordering is always
 * deterministic even mid-migration.
 */
const PRODUCT_ORDER = `| order(orderRank asc, _createdAt desc)`;

export async function getProducts(locale: Locale): Promise<Product[]> {
  const query = `*[_type == "product" && inStock == true] ${PRODUCT_ORDER} { ${PRODUCT_FIELDS} }`;
  const raw = await safeFetch<Record<string, unknown>[]>(query, undefined, []);
  if (!raw) return [];
  return raw.map((row) => mapProduct(row, locale));
}

export async function getFeaturedProducts(locale: Locale): Promise<Product[]> {
  // Previously had no order clause at all, so the home strip's sequence was
  // undefined and could change between builds.
  const query = `*[_type == "product" && featured == true && inStock == true] ${PRODUCT_ORDER} [0...6] { ${PRODUCT_FIELDS} }`;
  const raw = await safeFetch<Record<string, unknown>[]>(query, undefined, []);
  if (!raw) return [];
  return raw.map((row) => mapProduct(row, locale));
}

export async function getProductsByCategory(categorySlug: string, locale: Locale): Promise<Product[]> {
  const query = `*[_type == "product" && category->slug.current == $categorySlug && inStock == true] ${PRODUCT_ORDER} { ${PRODUCT_FIELDS} }`;
  const raw = await safeFetch<Record<string, unknown>[]>(query, { categorySlug }, []);
  if (!raw) return [];
  return raw.map((row) => mapProduct(row, locale));
}

export async function getProductBySlug(slug: string, locale: Locale): Promise<Product | null> {
  const query = `*[_type == "product" && slug.current == $slug][0] { ${PRODUCT_FIELDS} }`;
  const raw = await safeFetch<Record<string, unknown> | null>(query, { slug }, null);
  if (!raw) return null;
  return mapProduct(raw, locale);
}

export async function getAllProductSlugs(): Promise<{ slug: string; category: string }[]> {
  const query = `*[_type == "product" && defined(slug.current) && defined(category->slug.current)] {
    "slug": slug.current,
    "category": category->slug.current
  }`;
  const raw = await safeFetchStatic<{ slug: string; category: string }[]>(query, undefined, []);
  // A piece still being written may have no slug or category yet. Next requires
  // every static param to be a string, so drop anything incomplete rather than
  // failing the whole build.
  return raw.filter((s) => typeof s.slug === 'string' && typeof s.category === 'string');
}

// ---- Store Info ----

const STORE_INFO_FALLBACK: StoreInfo = {
  name: 'Kusuma Silver',
  tagline: 'Perhiasan Perak 925 Asli dari Bali',
  taglineEn: 'Authentic 925 Silver Jewelry from Bali',
  address: 'Bali, Indonesia',
  city: 'Bali',
  whatsapp: '62',
  whatsappDisplay: '+62',
  hours: { weekday: 'Senin – Sabtu: 09.00 – 18.00', weekend: 'Minggu: 10.00 – 15.00' },
};

/**
 * @param draftAware - false when called from a route handler or the sitemap,
 *   which have no request scope and so cannot read the draft-mode cookie.
 */
async function fetchStoreInfo(locale: Locale, draftAware: boolean): Promise<StoreInfo> {
  // Prefer the document at the canonical id, falling back to whatever storeInfo
  // document exists. Historically the live document had an auto-generated id
  // while the Studio's menu opened `storeInfo`, so the owner edited a different
  // document than the site read (see migration 001). The coalesce keeps the site
  // correct both before and after that migration runs.
  //
  // Note: GROQ has no comment syntax, so keep all notes outside the query string.
  // The menu entries resolve their category (`category->`) so that renaming or
  // deleting a category can never leave a link pointing at a dead address.
  const query = `coalesce(*[_id == "storeInfo"][0], *[_type == "storeInfo"][0]) {
    name,
    tagline,
    taglineEn,
    address,
    city,
    whatsapp,
    whatsappDisplay,
    email,
    "hours": { "weekday": hoursWeekday, "weekend": hoursWeekend },
    "socialMedia": { "instagram": instagram, "tiktok": tiktok, "facebook": facebook },
    mapsEmbedUrl,
    logo ${IMAGE_PROJECTION},
    wordmarkSub,
    promoBar,
    promoBarHidden,
    footerBlurb,
    copyright,
    specOrigin,
    specTechnique,
    specMaterial,
    specLeadTime,
    defaultSeo { ..., shareImage ${IMAGE_PROJECTION} },
    mainNav[] { ..., category->{ "slug": slug.current, name, nameEn } },
    footerShopLinks[] { ..., category->{ "slug": slug.current, name, nameEn } },
    footerAtelierLinks[] { ..., category->{ "slug": slug.current, name, nameEn } }
  }`;

  const raw = draftAware
    ? await safeFetch<Record<string, unknown> | null>(query, undefined, null)
    : await safeFetchStatic<Record<string, unknown> | null>(query, undefined, null);

  return {
    name: (raw?.name as string) ?? STORE_INFO_FALLBACK.name,
    tagline: (raw?.tagline as string) ?? STORE_INFO_FALLBACK.tagline,
    taglineEn: (raw?.taglineEn as string) ?? STORE_INFO_FALLBACK.taglineEn,
    address: (raw?.address as string) ?? STORE_INFO_FALLBACK.address,
    city: (raw?.city as string) ?? STORE_INFO_FALLBACK.city,
    whatsapp: (raw?.whatsapp as string) ?? STORE_INFO_FALLBACK.whatsapp,
    whatsappDisplay: (raw?.whatsappDisplay as string) ?? STORE_INFO_FALLBACK.whatsappDisplay,
    email: raw?.email as string | undefined,
    hours: (raw?.hours as StoreInfo['hours']) ?? STORE_INFO_FALLBACK.hours,
    socialMedia: raw?.socialMedia as StoreInfo['socialMedia'],
    mapsEmbedUrl: raw?.mapsEmbedUrl as string | undefined,

    logo: buildImage(raw?.logo as SanityImage | undefined, {
      width: 320,
      fallbackAlt: (raw?.name as string) ?? STORE_INFO_FALLBACK.name,
      locale,
    }),
    wordmarkSub: raw?.wordmarkSub as StoreInfo['wordmarkSub'],
    promoBar: raw?.promoBar as StoreInfo['promoBar'],
    promoBarHidden: raw?.promoBarHidden as boolean | undefined,
    mainNav: raw?.mainNav as unknown[] | undefined,
    footerShopLinks: raw?.footerShopLinks as unknown[] | undefined,
    footerAtelierLinks: raw?.footerAtelierLinks as unknown[] | undefined,
    footerBlurb: raw?.footerBlurb as StoreInfo['footerBlurb'],
    copyright: raw?.copyright as StoreInfo['copyright'],
    specOrigin: raw?.specOrigin as StoreInfo['specOrigin'],
    specTechnique: raw?.specTechnique as StoreInfo['specTechnique'],
    specMaterial: raw?.specMaterial as StoreInfo['specMaterial'],
    specLeadTime: raw?.specLeadTime as StoreInfo['specLeadTime'],
    defaultSeo: raw?.defaultSeo as StoreInfo['defaultSeo'],
  };
}

/** Store details for a page. Shows unpublished edits inside the preview pane. */
export const getStoreInfo = cache((locale: Locale = 'id') => fetchStoreInfo(locale, true));

/**
 * Store details for code that runs outside a request — the checkout route
 * handler and the sitemap. Published content only.
 */
export const getStoreInfoStatic = cache((locale: Locale = 'id') => fetchStoreInfo(locale, false));

// ---- Page Content ----

/**
 * Fetch one page singleton with every image expanded to the full projection
 * (hotspot, crop, description, blur data). Images are returned raw rather than
 * pre-flattened to a URL string, so each component can request the size its own
 * frame needs — and so the owner's focal point survives as far as the renderer.
 *
 * Returns null when nothing is published; the page then falls back to the
 * built-in default copy.
 */
async function getPageDocument(type: string): Promise<Record<string, unknown> | null> {
  return safeFetch<Record<string, unknown> | null>(
    `*[_type == $type && _id == $type][0] {
      ...,
      heroImage ${IMAGE_PROJECTION},
      heritageImage ${IMAGE_PROJECTION},
      formImage ${IMAGE_PROJECTION},
      galleryImage1 ${IMAGE_PROJECTION},
      galleryImage2 ${IMAGE_PROJECTION},
      gallery[] ${IMAGE_PROJECTION},
      seo { ..., shareImage ${IMAGE_PROJECTION} }
    }`,
    { type },
    null
  );
}

/** Editable home page content (hero, catalogue strip, heritage, manifesto). */
export async function getHomeContent(): Promise<Record<string, unknown> | null> {
  return getPageDocument('homePage');
}

/** Editable "Our Story" page content. */
export async function getAboutContent(): Promise<Record<string, unknown> | null> {
  return getPageDocument('aboutPage');
}

/** Editable Contact page headings (contact details come from Store Info). */
export async function getContactContent(): Promise<Record<string, unknown> | null> {
  return getPageDocument('contactPage');
}

/** Editable catalogue (/koleksi) page headings and empty-state message. */
export async function getCatalogueContent(): Promise<Record<string, unknown> | null> {
  return getPageDocument('cataloguePage');
}

/** Editable Silver Class (custom-order) page content. */
export async function getBespokeContent(): Promise<Record<string, unknown> | null> {
  return getPageDocument('bespokePage');
}

