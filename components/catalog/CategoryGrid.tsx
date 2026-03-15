import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types';

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/katalog/${cat.slug}`}
          className="group bg-white rounded-2xl p-5 border border-[#A8C5A0]/30 hover:border-[#2C5F2E]/40 hover:shadow-md transition-all duration-200"
        >
          <div className="text-3xl mb-3">{cat.icon}</div>
          <h3 className="font-bold text-[#2C5F2E] text-sm mb-1 group-hover:text-[#4A8C4F] transition-colors">{cat.name}</h3>
          <p className="text-[#6B7280] text-xs leading-relaxed line-clamp-2">{cat.description}</p>
          <div className="flex items-center gap-1 mt-3 text-[#2C5F2E] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Lihat <ArrowRight className="w-3 h-3" />
          </div>
        </Link>
      ))}
    </div>
  );
}
