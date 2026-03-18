'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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

  const isSearching = query.trim().length > 0;
  const showCategoryPicker = !activeCategory && !isSearching;

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

  const activeCategoryData = categories.find((c) => c.slug === activeCategory);

  return (
    <div>
      {/* Search bar — always visible */}
      <div className="bg-white border-b border-green-light/30 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="w-full sm:w-80 flex-shrink-0">
            <SearchFilter value={query} onChange={(v) => { setQuery(v); if (v.trim()) setActiveCategory(null); }} />
          </div>
          {/* Category pills — only shown when a category is active or searching */}
          {!showCategoryPicker && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 flex-1 min-w-0">
              <button
                onClick={() => { setActiveCategory(null); setQuery(''); }}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium bg-green-light/20 text-text-light hover:bg-green-light/40 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Semua Kategori
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => { setActiveCategory(cat.slug === activeCategory ? null : cat.slug); setQuery(''); }}
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
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {showCategoryPicker ? (
          /* ── Category picker ── */
          <div>
            <p className="text-text-light text-sm mb-6">{categories.length} kategori tersedia</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className="group text-left bg-white rounded-2xl p-5 border border-green-light/30 hover:border-green-deep/40 hover:shadow-md transition-all duration-200"
                >
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <h3 className="font-bold text-green-deep text-sm mb-1 group-hover:text-green-mid transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-text-light text-xs leading-relaxed line-clamp-2">{cat.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    {cat.productCount != null && cat.productCount > 0 && (
                      <span className="text-[10px] text-text-light bg-green-light/20 px-2 py-0.5 rounded-full">
                        {cat.productCount} produk
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-green-deep text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                      Lihat <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Product list ── */
          <div>
            <p className="text-text-light text-sm mb-6">
              {activeCategoryData && !isSearching
                ? `${activeCategoryData.icon} ${activeCategoryData.name} — ${filtered.length} produk`
                : `${filtered.length} produk ditemukan`}
            </p>
            <ProductGrid
              products={filtered}
              whatsapp={whatsapp}
              emptyMessage="Produk tidak ditemukan. Coba kata kunci lain."
            />
          </div>
        )}
      </div>
    </div>
  );
}
