import { Fragment } from 'react';
import { SplitHero } from '@/components/home/SplitHero';
import { AsymmetricCatalogue } from '@/components/home/AsymmetricCatalogue';
import { HeritageBand } from '@/components/home/HeritageBand';
import { Manifesto } from '@/components/home/Manifesto';
import { getCategories, getFeaturedProducts, getHomeContent, getProducts } from '@/lib/sanity-data';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import { resolveHome, type HomeSectionType } from '@/lib/home-content';
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
  let products = await getFeaturedProducts(locale);
  if (products.length < 6) {
    const all = await getProducts(locale);
    const seen = new Set(products.map((p) => p.slug));
    products = [...products, ...all.filter((p) => !seen.has(p.slug))];
  }

  const [homeDoc, categories] = await Promise.all([getHomeContent(), getCategories(locale)]);
  const home = resolveHome(homeDoc, locale, getT(locale));

  // The hero is pinned to the top; everything below it renders in the order the
  // owner arranged in the Studio, skipping anything they hid. Section types the
  // Studio offers are fixed by the design, so the layout cannot be broken.
  const section = (type: HomeSectionType) => {
    switch (type) {
      case 'catalogueStrip':
        return (
          <AsymmetricCatalogue
            locale={locale}
            products={products.slice(0, 8)}
            categories={categories}
            head={home.catalogueHead}
            panels={home.cataloguePanels}
          />
        );
      case 'heritageBand':
        return <HeritageBand locale={locale} home={home} />;
      case 'manifesto':
        return <Manifesto locale={locale} home={home} />;
    }
  };

  return (
    <>
      <SplitHero locale={locale} home={home} />
      {home.sections.map((entry) => (
        <Fragment key={entry.key}>{section(entry.type)}</Fragment>
      ))}
    </>
  );
}
