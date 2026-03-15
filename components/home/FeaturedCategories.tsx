import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getCategories } from '@/lib/sanity-data';

export async function FeaturedCategories() {
  const categories = await getCategories();
  const featured = categories.slice(0, 6);
  return (
    <section className="py-16 md:py-20 bg-[#F7F3EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Jelajahi Kategori Produk"
          subtitle="Temukan semua yang Anda butuhkan untuk berkebun"
          className="mb-10"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {featured.map((cat) => (
            <Link
              key={cat.slug}
              href={`/katalog/${cat.slug}`}
              className="group bg-white rounded-2xl p-6 border border-[#A8C5A0]/30 hover:border-[#2C5F2E]/40 hover:shadow-md transition-all duration-200"
            >
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h3 className="font-bold text-[#2C5F2E] text-lg mb-1 group-hover:text-[#4A8C4F] transition-colors">
                {cat.name}
              </h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">{cat.description}</p>
              <div className="flex items-center gap-1 mt-4 text-[#2C5F2E] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Lihat produk <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-[#2C5F2E] font-semibold hover:text-[#4A8C4F] transition-colors"
          >
            Lihat semua kategori <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
