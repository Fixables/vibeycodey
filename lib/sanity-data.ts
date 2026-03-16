import { cache } from 'react';
import { client } from './sanity';
import { formatPrice } from './utils';
import type { Category, Product, StoreInfo } from '@/types';

// ---------------------------------------------------------------------------
// GROQ queries
// ---------------------------------------------------------------------------

const CATEGORY_FIELDS = `
  "slug": slug.current,
  name,
  description,
  icon,
  order
`;

const PRODUCT_FIELDS = `
  "id": _id,
  "slug": slug.current,
  name,
  "category": category->slug.current,
  price,
  description,
  imageUrl,
  shopeeUrl,
  unit,
  featured,
  inStock
`;

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  const raw = await client.fetch<Array<{
    slug: string;
    name: string;
    description: string;
    icon: string;
    order: number;
  }>>(
    `*[_type == "category"] | order(order asc) { ${CATEGORY_FIELDS} }`
  );
  return raw.map(({ order: _order, ...rest }) => rest);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const raw = await client.fetch<{
    slug: string;
    name: string;
    description: string;
    icon: string;
    order: number;
  } | null>(
    `*[_type == "category" && slug.current == $slug][0] { ${CATEGORY_FIELDS} }`,
    { slug }
  );
  if (!raw) return undefined;
  const { order: _order, ...rest } = raw;
  return rest;
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

type RawProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl?: string;
  shopeeUrl?: string;
  unit?: string;
  featured?: boolean;
  inStock: boolean;
};

function mapProduct(raw: RawProduct): Product {
  return {
    ...raw,
    priceDisplay: formatPrice(raw.price),
  };
}

export async function getProducts(): Promise<Product[]> {
  const raw = await client.fetch<RawProduct[]>(
    `*[_type == "product" && inStock == true] | order(_createdAt asc) { ${PRODUCT_FIELDS} }`
  );
  return raw.map(mapProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const raw = await client.fetch<RawProduct[]>(
    `*[_type == "product" && featured == true && inStock == true][0...6] { ${PRODUCT_FIELDS} }`
  );
  return raw.map(mapProduct);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const raw = await client.fetch<RawProduct[]>(
    `*[_type == "product" && inStock == true && category->slug.current == $categorySlug] | order(_createdAt asc) { ${PRODUCT_FIELDS} }`,
    { categorySlug }
  );
  return raw.map(mapProduct);
}

// ---------------------------------------------------------------------------
// Store info — wrapped in React cache() to deduplicate parallel calls
// ---------------------------------------------------------------------------

export const getStoreInfo = cache(async function (): Promise<StoreInfo> {
  const raw = await client.fetch<{
    name: string;
    tagline: string;
    address: string;
    city: string;
    whatsapp: string;
    whatsappDisplay: string;
    email?: string;
    hours: { weekday: string; weekend: string };
    socialMedia?: { instagram?: string; facebook?: string };
    mapsEmbedUrl?: string;
  }>(
    `*[_type == "storeInfo"][0] {
      name,
      tagline,
      address,
      city,
      whatsapp,
      whatsappDisplay,
      email,
      "hours": { "weekday": hoursWeekday, "weekend": hoursWeekend },
      "socialMedia": { "instagram": instagram, "facebook": facebook },
      mapsEmbedUrl
    }`
  );
  return raw;
});

// ---------------------------------------------------------------------------
// WhatsApp link utility — now takes whatsapp number as first arg
// ---------------------------------------------------------------------------

export function getWhatsAppLink(whatsapp: string, message?: string): string {
  const base = `https://wa.me/${whatsapp}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}
