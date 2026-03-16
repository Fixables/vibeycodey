import { MetadataRoute } from 'next';
import { getCategories } from '@/lib/sanity-data';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://baligreenhouse.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getCategories();

  const categoryUrls = categories.map((cat) => ({
    url: `${BASE_URL}/katalog/${cat.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/katalog`, changeFrequency: 'weekly', priority: 0.9 },
    ...categoryUrls,
    { url: `${BASE_URL}/tentang-kami`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/kontak`, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
