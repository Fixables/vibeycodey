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

  let products = await getFeaturedProducts();
  if (products.length < 3) {
    products = await getProducts();
  }

  return (
    <>
      <SplitHero locale={locale} />
      <AsymmetricCatalogue locale={locale} products={products.slice(0, 3)} />
      <HeritageBand locale={locale} />
      <Manifesto locale={locale} />
    </>
  );
}
