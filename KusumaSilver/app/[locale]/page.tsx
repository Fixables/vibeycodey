import { SplitHero } from '@/components/home/SplitHero';
import { AsymmetricCatalogue } from '@/components/home/AsymmetricCatalogue';
import { HeritageBand } from '@/components/home/HeritageBand';
import { Manifesto } from '@/components/home/Manifesto';
import { getFeaturedProducts, getProducts } from '@/lib/sanity-data';
import { SUPPORTED_LOCALES } from '@/lib/i18n';
import type { Locale } from '@/types';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  // Featured pieces first, topped up with the rest of the catalogue so the
  // horizontal strip has enough cells to scroll.
  let products = await getFeaturedProducts();
  if (products.length < 6) {
    const all = await getProducts();
    const seen = new Set(products.map((p) => p.slug));
    products = [...products, ...all.filter((p) => !seen.has(p.slug))];
  }

  return (
    <>
      <SplitHero locale={locale} />
      <AsymmetricCatalogue locale={locale} products={products.slice(0, 8)} />
      <HeritageBand locale={locale} />
      <Manifesto locale={locale} />
    </>
  );
}
