import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCategoryBySlug, getCategories, getProductsByCategory, getStoreInfo } from '@/lib/sanity-data';
import { ProductGrid } from '@/components/catalog/ProductGrid';

interface Props {
  params: Promise<{ kategori: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({ kategori: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategori } = await params;
  const category = await getCategoryBySlug(kategori);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function KategoriPage({ params }: Props) {
  const { kategori } = await params;
  const [category, categoryProducts, storeInfo] = await Promise.all([
    getCategoryBySlug(kategori),
    getProductsByCategory(kategori),
    getStoreInfo(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="bg-[#F7F3EC] min-h-screen">
      <div className="bg-[#2C5F2E] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Semua Kategori
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{category.icon}</div>
            <div>
              <h1
                className="text-3xl md:text-4xl font-bold text-white"
                style={{ fontFamily: 'var(--font-lora, Lora, serif)' }}
              >
                {category.name}
              </h1>
              <p className="text-white/70 mt-1">{category.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#6B7280] text-sm">
            {categoryProducts.length} produk ditemukan
          </p>
        </div>
        <ProductGrid
          products={categoryProducts}
          whatsapp={storeInfo.whatsapp}
          emptyMessage={`Belum ada produk di kategori ${category.name}.`}
        />
      </div>
    </div>
  );
}
