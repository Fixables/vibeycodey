import { SplitHero } from '@/components/home/SplitHero';
import { AsymmetricCatalogue } from '@/components/home/AsymmetricCatalogue';
import { HeritageBand } from '@/components/home/HeritageBand';
import { Manifesto } from '@/components/home/Manifesto';
import { getFeaturedProducts, getHomeContent, getProducts } from '@/lib/sanity-data';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import { resolveHome } from '@/lib/home-content';
import type { Locale } from '@/types';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

// Re-fetch CMS content at most once a minute so Studio edits go live without a
// rebuild (owner publishes → visible within ~60s).
export const revalidate = 60;

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

  const home = resolveHome(await getHomeContent(), locale, getT(locale));

  return (
    <>
      <SplitHero locale={locale} home={home} />
      <AsymmetricCatalogue
        locale={locale}
        products={products.slice(0, 8)}
        head={home.catalogueHead}
        panels={home.cataloguePanels}
      />
      <HeritageBand locale={locale} home={home} />
      <Manifesto locale={locale} home={home} />
    </>
  );
}
