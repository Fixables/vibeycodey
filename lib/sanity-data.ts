import { cache } from 'react';
import { client, urlFor } from './sanity';
import { formatPrice } from './utils';
import type { Category, Product, StoreInfo, Testimonial } from '@/types';

// ---------------------------------------------------------------------------
// GROQ queries
// ---------------------------------------------------------------------------

const CATEGORY_FIELDS = `
  "slug": slug.current,
  name,
  description,
  icon,
  order,
  "productCount": count(*[_type == "product" && category._ref == ^._id && inStock == true])
`;

const PRODUCT_FIELDS = `
  "id": _id,
  "slug": slug.current,
  name,
  "category": category->slug.current,
  price,
  description,
  image,
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
    productCount: number;
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
    productCount: number;
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

type SanityImage = { asset: { _ref: string; _type: string } };

type RawProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: SanityImage;
  shopeeUrl?: string;
  unit?: string;
  featured?: boolean;
  inStock: boolean;
};

function mapProduct(raw: RawProduct): Product {
  const { image, ...rest } = raw;
  return {
    ...rest,
    imageUrl: image ? urlFor(image).width(600).height(600).fit('crop').url() : undefined,
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

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const raw = await client.fetch<RawProduct | null>(
    `*[_type == "product" && slug.current == $slug][0] { ${PRODUCT_FIELDS} }`,
    { slug }
  );
  if (!raw) return undefined;
  return mapProduct(raw);
}

export async function getAllProductSlugs(): Promise<Array<{ kategori: string; slug: string }>> {
  return client.fetch(
    `*[_type == "product" && inStock == true] {
      "slug": slug.current,
      "kategori": category->slug.current
    }`
  );
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export async function getTestimonials(): Promise<Testimonial[]> {
  return client.fetch(
    `*[_type == "testimonial"] | order(order asc) {
      "id": _id,
      name,
      location,
      content,
      rating
    }`
  );
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
    shopeeStoreUrl?: string;
    mapsEmbedUrl?: string;
    aboutContent?: unknown[];
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
      shopeeStoreUrl,
      mapsEmbedUrl,
      aboutContent
    }`
  );
  return raw;
});

// ---------------------------------------------------------------------------
// WhatsApp link utility
// ---------------------------------------------------------------------------

export function getWhatsAppLink(whatsapp: string, message?: string): string {
  const base = `https://wa.me/${whatsapp}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}
