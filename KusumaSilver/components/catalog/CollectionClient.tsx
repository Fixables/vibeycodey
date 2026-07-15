'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { PieceGrid } from './PieceGrid';
import { getT } from '@/lib/i18n';
import type { Product, Category, Locale } from '@/types';

interface CollectionClientProps {
  products: Product[];
  categories: Category[];
  locale: Locale;
  initialCategory?: string;
}

export function CollectionClient({
  products,
  categories,
  locale,
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
    <div className="mx-auto max-w-[1280px]">
      <div className="px-5 pt-9 sm:px-10">
        <div className="flex items-center gap-3 border border-ink bg-card px-4 py-3">
          <Search size={16} strokeWidth={1.5} className="text-ink/50" />
          <label htmlFor="catalogue-search" className="sr-only">
            {t.catalogV3.searchPlaceholder}
          </label>
          <input
            id="catalogue-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.catalogV3.searchPlaceholder}
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            aria-pressed={activeCategory === 'all'}
            className={`cursor-pointer border border-ink px-4 py-2 text-[11px] font-semibold tracking-[0.12em] transition-colors ${
              activeCategory === 'all' ? 'bg-ink text-paper' : 'bg-transparent text-ink hover:bg-ink/5'
            }`}
          >
            {t.catalog.allCategories}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              aria-pressed={activeCategory === cat.slug}
              className={`cursor-pointer border border-ink px-4 py-2 text-[11px] font-semibold tracking-[0.12em] transition-colors ${
                activeCategory === cat.slug ? 'bg-ink text-paper' : 'bg-transparent text-ink hover:bg-ink/5'
              }`}
            >
              {locale === 'en' ? cat.nameEn || cat.name : cat.name}
            </button>
          ))}
        </div>

        <div className="mt-3 text-[11px] text-ink/50">
          {filtered.length} {t.catalogV3.found}
        </div>
      </div>

      <div className="px-5 pb-20 pt-7 sm:px-10">
        <PieceGrid products={filtered} locale={locale} />
      </div>
    </div>
  );
}
