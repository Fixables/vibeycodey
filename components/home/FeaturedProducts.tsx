import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProductCard } from '@/components/catalog/ProductCard';
import { getFeaturedProducts, getStoreInfo } from '@/lib/sanity-data';

export async function FeaturedProducts() {
  const [featured, storeInfo] = await Promise.all([getFeaturedProducts(), getStoreInfo()]);
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Produk Unggulan"
          subtitle="Pilihan terbaik dari koleksi kami yang paling diminati"
          className="mb-10"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} whatsapp={storeInfo.whatsapp} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-[#2C5F2E] font-semibold hover:text-[#4A8C4F] transition-colors border border-[#2C5F2E] hover:border-[#4A8C4F] px-6 py-2.5 rounded-xl"
          >
            Lihat Semua Produk <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
