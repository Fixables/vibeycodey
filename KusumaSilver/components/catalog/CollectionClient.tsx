'use client';

import { useState, useMemo } from 'react';
import { SearchFilter } from './SearchFilter';
import { PieceGrid } from './PieceGrid';
import { getT } from '@/lib/i18n';
import type { Product, Category, Locale } from '@/types';

interface CollectionClientProps {
  products: Product[];
  categories: Category[];
  locale: Locale;
  whatsapp: string;
  initialCategory?: string;
}

export function CollectionClient({
  products,
  categories,
  locale,
  whatsapp,
  initialCategory = 'all',
}: CollectionClientProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const t = getT(locale);

  const filtered = useMemo(() => {
    let result = products;
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, activeCategory, query]);

  return (
    <div>
      {/* Sticky filter bar */}
      <div className="sticky top-[65px] z-40 border-b border-ivory-dark bg-white/95 backdrop-blur-md px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SearchFilter value={query} onChange={setQuery} locale={locale} />

          {/* Category tabs */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === 'all'
                  ? 'bg-espresso text-white'
                  : 'bg-ivory-dark text-text-light hover:text-espresso'
              }`}
            >
              {t.catalog.allCategories}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  activeCategory === cat.slug
                    ? 'bg-espresso text-white'
                    : 'bg-ivory-dark text-text-light hover:text-espresso'
                }`}
              >
                {cat.icon} {locale === 'en' ? cat.nameEn || cat.name : cat.name}
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="mt-2 text-xs text-text-light">
            {filtered.length} {locale === 'en' ? 'pieces found' : 'perhiasan ditemukan'}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PieceGrid products={filtered} locale={locale} whatsapp={whatsapp} />
      </div>
    </div>
  );
}
