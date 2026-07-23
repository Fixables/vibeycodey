import { MetadataRoute } from 'next';
// The sitemap runs outside a request, so it uses the published-only fetchers —
// unpublished pages must never appear in a sitemap anyway.
import { getCategorySlugs, getAllProductSlugs } from '@/lib/sanity-data';

const BASE_URL = 'https://kusumasilver.com';
const LOCALES = ['id', 'en'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let categorySlugs: string[] = [];
  let productSlugs: Awaited<ReturnType<typeof getAllProductSlugs>> = [];
  try {
    [categorySlugs, productSlugs] = await Promise.all([
      getCategorySlugs(),
      getAllProductSlugs(),
    ]);
  } catch {
    // Sanity not configured — return static routes only
  }

  const staticRoutes = ['', '/koleksi', '/custom-order', '/tentang-kami', '/kontak'];

  const staticEntries = LOCALES.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );

  const categoryEntries = LOCALES.flatMap((locale) =>
    categorySlugs.map((slug) => ({
      url: `${BASE_URL}/${locale}/koleksi/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  const productEntries = LOCALES.flatMap((locale) =>
    productSlugs.map((p) => ({
      url: `${BASE_URL}/${locale}/koleksi/${p.category}/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
