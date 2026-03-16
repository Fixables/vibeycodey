import { getCategories, getProducts, getStoreInfo } from '@/lib/sanity-data';
import { CollectionClient } from '@/components/catalog/CollectionClient';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import type { Locale } from '@/types';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function KoleksiPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [categories, products, storeInfo] = await Promise.all([
    getCategories(),
    getProducts(),
    getStoreInfo(),
  ]);
  const t = getT(locale);

  return (
    <div>
      <div className="bg-espresso py-16 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t.collections.title}
            subtitle={t.collections.subtitle}
            theme="dark"
          />
        </div>
      </div>

      <CollectionClient
        products={products}
        categories={categories}
        locale={locale}
        whatsapp={storeInfo.whatsapp}
      />
    </div>
  );
}
