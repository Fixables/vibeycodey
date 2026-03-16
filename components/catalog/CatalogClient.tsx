'use client';

import { useState, useMemo } from 'react';
import { SearchFilter } from './SearchFilter';
import { ProductGrid } from './ProductGrid';
import { Category, Product } from '@/types';

interface CatalogClientProps {
  products: Product[];
  categories: Category[];
  whatsapp: string;
}

export function CatalogClient({ products, categories, whatsapp }: CatalogClientProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = products;

    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [products, activeCategory, query]);

  return (
    <div>
      {/* Search + Filter bar */}
      <div className="bg-white border-b border-green-light/30 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-72 flex-shrink-0">
            <SearchFilter value={query} onChange={setQuery} />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 flex-1 min-w-0">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === null
                  ? 'bg-green-deep text-white'
                  : 'bg-green-light/20 text-text-light hover:bg-green-light/40'
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug === activeCategory ? null : cat.slug)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.slug
                    ? 'bg-green-deep text-white'
                    : 'bg-green-light/20 text-text-light hover:bg-green-light/40'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-text-light text-sm mb-6">
          {filtered.length} produk ditemukan
        </p>
        <ProductGrid
          products={filtered}
          whatsapp={whatsapp}
          emptyMessage="Produk tidak ditemukan. Coba kata kunci lain."
        />
      </div>
    </div>
  );
}
