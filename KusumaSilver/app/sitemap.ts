import { MetadataRoute } from 'next';
import { getCategories, getAllProductSlugs } from '@/lib/sanity-data';

const BASE_URL = 'https://kusumasilver.com';
const LOCALES = ['id', 'en'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let productSlugs: Awaited<ReturnType<typeof getAllProductSlugs>> = [];
  try {
    [categories, productSlugs] = await Promise.all([
      getCategories(),
      getAllProductSlugs(),
    ]);
  } catch {
    // Sanity not configured — return static routes only
  }

  const staticRoutes = ['', '/koleksi', '/custom-order', '/reseller', '/tentang-kami', '/kontak'];

  const staticEntries = LOCALES.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );

  const categoryEntries = LOCALES.flatMap((locale) =>
    categories.map((cat) => ({
      url: `${BASE_URL}/${locale}/koleksi/${cat.slug}`,
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
