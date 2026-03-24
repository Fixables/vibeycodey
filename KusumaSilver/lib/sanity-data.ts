import { cache } from 'react';
import { client, urlFor } from './sanity';
import { formatPrice } from './utils';
import type { Category, Product, StoreInfo, Testimonial, HomePageContent, AboutPageContent, ContactPageContent } from '@/types';

// ---- Helpers ----

export function getWhatsAppLink(whatsapp: string, message?: string): string {
  const base = `https://wa.me/${whatsapp}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

async function safeFetch<T>(query: string, params?: Record<string, string>, fallback?: T): Promise<T> {
  try {
    if (params) {
      return await client.fetch<T>(query, params);
    }
    return await client.fetch<T>(query);
  } catch {
    return (fallback ?? null) as T;
  }
}

function mapProduct(raw: Record<string, unknown>): Product {
  const rawImages = (raw.images as Array<Record<string, unknown>> | undefined) ?? [];
  const images = rawImages
    .map((img) => {
      try {
        return urlFor(img).width(800).url();
      } catch {
        return null;
      }
    })
    .filter(Boolean) as string[];

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
    imageUrl: images[0],
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

export async function getCategories(): Promise<Category[]> {
  const query = `*[_type == "category"] | order(order asc) {
    "slug": slug.current,
    name,
    nameEn,
    description,
    descriptionEn,
    icon,
    "productCount": count(*[_type == "product" && references(^._id) && inStock == true])
  }`;
  const raw = await safeFetch<Record<string, unknown>[]>(query, undefined, []);
  if (!raw) return [];
  return raw.map((c) => ({
    slug: c.slug as string,
    name: c.name as string,
    nameEn: (c.nameEn as string) ?? '',
    description: (c.description as string) ?? '',
    descriptionEn: (c.descriptionEn as string) ?? '',
    icon: (c.icon as string) ?? '',
    productCount: c.productCount as number,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const query = `*[_type == "category" && slug.current == $slug][0] {
    "slug": slug.current,
    name,
    nameEn,
    description,
    descriptionEn,
    icon,
    "productCount": count(*[_type == "product" && references(^._id) && inStock == true])
  }`;
  const raw = await safeFetch<Record<string, unknown> | null>(query, { slug }, null);
  if (!raw) return null;
  return {
    slug: raw.slug as string,
    name: raw.name as string,
    nameEn: (raw.nameEn as string) ?? '',
    description: (raw.description as string) ?? '',
    descriptionEn: (raw.descriptionEn as string) ?? '',
    icon: (raw.icon as string) ?? '',
    productCount: raw.productCount as number,
  };
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
  images[] { ..., asset-> },
  material,
  weight,
  sizes,
  stone,
  craftingTime,
  isCustomizable,
  featured,
  inStock
`;

export async function getProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && inStock == true] | order(_createdAt desc) { ${PRODUCT_FIELDS} }`;
  const raw = await safeFetch<Record<string, unknown>[]>(query, undefined, []);
  if (!raw) return [];
  return raw.map(mapProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && featured == true && inStock == true][0...6] { ${PRODUCT_FIELDS} }`;
  const raw = await safeFetch<Record<string, unknown>[]>(query, undefined, []);
  if (!raw) return [];
  return raw.map(mapProduct);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const query = `*[_type == "product" && category->slug.current == $categorySlug && inStock == true] | order(_createdAt desc) { ${PRODUCT_FIELDS} }`;
  const raw = await safeFetch<Record<string, unknown>[]>(query, { categorySlug }, []);
  if (!raw) return [];
  return raw.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const query = `*[_type == "product" && slug.current == $slug][0] { ${PRODUCT_FIELDS} }`;
  const raw = await safeFetch<Record<string, unknown> | null>(query, { slug }, null);
  if (!raw) return null;
  return mapProduct(raw);
}

export async function getAllProductSlugs(): Promise<{ slug: string; category: string }[]> {
  const query = `*[_type == "product"] { "slug": slug.current, "category": category->slug.current }`;
  return safeFetch<{ slug: string; category: string }[]>(query, undefined, []);
}

// ---- Testimonials ----

export async function getTestimonials(): Promise<Testimonial[]> {
  const query = `*[_type == "testimonial"] | order(order asc) {
    "id": _id,
    name,
    location,
    content,
    contentEn,
    rating
  }`;
  return safeFetch<Testimonial[]>(query, undefined, []);
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

export const getStoreInfo = cache(async (): Promise<StoreInfo> => {
  const query = `*[_type == "storeInfo"][0] {
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
    aboutContent,
    aboutContentEn
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
    aboutContent: raw?.aboutContent as unknown[] | undefined,
    aboutContentEn: raw?.aboutContentEn as unknown[] | undefined,
  };
});

// ---- Page Content ----

export async function getHomePageContent(): Promise<HomePageContent> {
  const data = await safeFetch<Record<string, unknown> | null>(
    `*[_type == "homePage" && _id == "homePage"][0]`,
    undefined,
    null
  );
  return (data ?? {}) as HomePageContent;
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  const data = await safeFetch<Record<string, unknown> | null>(
    `*[_type == "aboutPage" && _id == "aboutPage"][0]`,
    undefined,
    null
  );
  return (data ?? {}) as AboutPageContent;
}

export async function getContactPageContent(): Promise<ContactPageContent> {
  const data = await safeFetch<Record<string, unknown> | null>(
    `*[_type == "contactPage" && _id == "contactPage"][0]`,
    undefined,
    null
  );
  return (data ?? {}) as ContactPageContent;
}
