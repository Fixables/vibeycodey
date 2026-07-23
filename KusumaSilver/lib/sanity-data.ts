import { cache } from 'react';
import { client } from './sanity';
import { buildImage, IMAGE_PROJECTION } from './image';
import { formatPrice } from './utils';
import type { Category, Locale, Product, SanityImage, StoreInfo } from '@/types';

// ---- Helpers ----

export function getWhatsAppLink(whatsapp: string, message?: string): string {
  const base = `https://wa.me/${whatsapp}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Fetch that degrades to a fallback rather than breaking the page — a blank CMS
 * field must never take the site down.
 *
 * The failure is logged server-side first: without it, a bad query, an expired
 * token, or a network fault is indistinguishable from "the owner hasn't written
 * this yet", and the site quietly serves built-in defaults with no signal.
 */
async function safeFetch<T>(query: string, params?: Record<string, string>, fallback?: T): Promise<T> {
  try {
    if (params) {
      return await client.fetch<T>(query, params);
    }
    return await client.fetch<T>(query);
  } catch (error) {
    console.error(
      '[sanity] query failed, falling back to defaults:',
      error instanceof Error ? error.message : error,
      '\n  query:',
      query.replace(/\s+/g, ' ').trim().slice(0, 160)
    );
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
    material: raw.material as string | undefined,
    weight: raw.weight as number | undefined,
    sizes: raw.sizes as string | undefined,
    stone: raw.stone as string | undefined,
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
  images[] ${IMAGE_PROJECTION},
  origin,
  technique,
  seo { ..., shareImage ${IMAGE_PROJECTION} },
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
  const raw = await safeFetch<{ slug: string; category: string }[]>(query, undefined, []);
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

export const getStoreInfo = cache(async (locale: Locale = 'id'): Promise<StoreInfo> => {
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

  const raw = await safeFetch<Record<string, unknown> | null>(query, undefined, null);

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
});

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

