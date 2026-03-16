import { Metadata } from 'next';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CatalogClient } from '@/components/catalog/CatalogClient';
import { getCategories, getProducts, getStoreInfo } from '@/lib/sanity-data';

export const metadata: Metadata = {
  title: 'Katalog Produk',
  description: 'Jelajahi semua produk berkebun di Bali Greenhouse — benih, pupuk, media tanam, alat berkebun, pot, dan lainnya.',
};

export default async function KatalogPage() {
  const [categories, products, storeInfo] = await Promise.all([
    getCategories(),
    getProducts(),
    getStoreInfo(),
  ]);

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-green-deep py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Katalog Produk"
            subtitle="Temukan semua kebutuhan berkebun Anda di satu tempat"
            align="center"
            className="[&_h2]:text-white [&_p]:text-white/70"
          />
        </div>
      </div>
      <CatalogClient
        products={products}
        categories={categories}
        whatsapp={storeInfo.whatsapp}
      />
    </div>
  );
}
