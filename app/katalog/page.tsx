import { Metadata } from 'next';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CategoryGrid } from '@/components/catalog/CategoryGrid';
import { categories } from '@/data/categories';

export const metadata: Metadata = {
  title: 'Katalog Produk',
  description: 'Jelajahi semua kategori produk berkebun di Bali Greenhouse — benih, pupuk, media tanam, alat berkebun, pot, dan lainnya.',
};

export default function KatalogPage() {
  return (
    <div className="bg-[#F7F3EC] min-h-screen">
      <div className="bg-[#2C5F2E] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Katalog Produk"
            subtitle="Temukan semua kebutuhan berkebun Anda di satu tempat"
            align="center"
            className="[&_h2]:text-white [&_p]:text-white/70"
          />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CategoryGrid categories={categories} />
      </div>
    </div>
  );
}
