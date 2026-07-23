'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import { PieceGrid } from './PieceGrid';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { formatDisplayPrice } from '@/lib/commerce/config';
import { categoryLabel } from '@/lib/catalog';
import { getT } from '@/lib/i18n';
import type { Product, Category, Locale, SizeTerm, TaxonomyTerm } from '@/types';

interface CollectionClientProps {
  products: Product[];
  categories: Category[];
  locale: Locale;
  /**
   * When set, the primary category is fixed by the route: the browser shows a
   * breadcrumb and refines within this category — it does NOT offer a category
   * switcher. Omit on the master catalogue so category becomes a filter.
   */
  fixedCategory?: string;
  /** Owner-editable message shown when a visitor's filters match nothing. */
  emptyMessage?: string;
}

type SortKey = 'recommended' | 'priceAsc' | 'priceDesc' | 'name';

interface PriceBucket {
  id: string;
  min?: number;
  max?: number;
}

const PRICE_BUCKETS: PriceBucket[] = [
  { id: 'u1', max: 1_000_000 },
  { id: '1-5', min: 1_000_000, max: 5_000_000 },
  { id: '5-15', min: 5_000_000, max: 15_000_000 },
  { id: 'o15', min: 15_000_000 },
];

function inBucket(price: number, bucket: PriceBucket): boolean {
  if (bucket.min !== undefined && price < bucket.min) return false;
  if (bucket.max !== undefined && price >= bucket.max) return false;
  return true;
}

function localizedName(product: Product, locale: Locale): string {
  return locale === 'en' ? product.nameEn || product.name : product.name;
}

const ALL = '__all__';
/** Sentinel for "pieces with no stone at all". */
const NONE = '__none__';

/**
 * Distinct filter options across a set of pieces, keyed by slug so two spellings
 * of the same term collapse into one option, and sorted for a stable list.
 */
function collectTerms(
  products: Product[],
  pick: (product: Product) => TaxonomyTerm[]
): TaxonomyTerm[] {
  const bySlug = new Map<string, TaxonomyTerm>();
  for (const product of products) {
    for (const term of pick(product)) {
      if (!bySlug.has(term.slug)) bySlug.set(term.slug, term);
    }
  }
  return [...bySlug.values()].sort((a, b) => a.label.localeCompare(b.label));
}

/** Sizes for one group, ordered numerically ("10" after "9", not before it). */
function collectSizes(products: Product[], group: SizeTerm['group']): SizeTerm[] {
  const bySlug = new Map<string, SizeTerm>();
  for (const product of products) {
    for (const size of product.sizeOptions) {
      if (size.group === group && !bySlug.has(size.slug)) bySlug.set(size.slug, size);
    }
  }
  return [...bySlug.values()].sort((a, b) => {
    const na = parseFloat(a.label);
    const nb = parseFloat(b.label);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return a.label.localeCompare(b.label);
  });
}

const selectClass =
  'cursor-pointer appearance-none border border-ink bg-card py-2 pl-3 pr-8 text-[12px] font-medium tracking-[0.04em] text-ink outline-none transition-colors hover:border-accent focus:border-accent';

function FacetSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative inline-flex">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
      >
        {children}
      </select>
      <ChevronRight
        size={13}
        strokeWidth={1.75}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-ink/55"
        aria-hidden="true"
      />
    </div>
  );
}

export function CollectionClient({
  products,
  categories,
  locale,
  fixedCategory,
  emptyMessage,
}: CollectionClientProps) {
  const t = getT(locale);
  const { currency } = useCurrency();

  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(ALL);
  const [material, setMaterial] = useState(ALL);
  const [stone, setStone] = useState(ALL);
  const [ringSize, setRingSize] = useState(ALL);
  const [length, setLength] = useState(ALL);
  const [priceBucket, setPriceBucket] = useState(ALL);
  const [sort, setSort] = useState<SortKey>('recommended');

  // Products in scope before user filters: locked to the route category when
  // this is a category page, otherwise the whole catalogue.
  const scoped = useMemo(
    () => (fixedCategory ? products.filter((p) => p.category === fixedCategory) : products),
    [products, fixedCategory]
  );

  // Facet options, collected from the pieces actually in scope so a filter can
  // never offer a value that matches nothing.
  //
  // Each piece contributes its individual terms rather than one combined string.
  // A ring available in five stones used to produce a single Gemstone option
  // reading "Amethyst, Garnet, Peridot, Citrine, and Pink Zirconia"; it now
  // contributes five, and picking any one of them finds the ring.
  const materials = useMemo(() => collectTerms(scoped, (p) => p.materials), [scoped]);
  const stones = useMemo(() => collectTerms(scoped, (p) => p.gemstones), [scoped]);
  const hasStonelessPieces = useMemo(() => scoped.some((p) => p.gemstones.length === 0), [scoped]);

  // Ring sizes and necklace lengths are not comparable, so they are offered as
  // separate filters — a shopper browsing rings is never shown "45 cm".
  const ringSizes = useMemo(() => collectSizes(scoped, 'ring'), [scoped]);
  const lengths = useMemo(() => collectSizes(scoped, 'length'), [scoped]);

  const activePriceBuckets = useMemo(
    () => PRICE_BUCKETS.filter((b) => scoped.some((p) => inBucket(p.price, b))),
    [scoped]
  );

  const showCategoryFacet = !fixedCategory && categories.length > 1;
  const showMaterialFacet = materials.length > 1;
  const showStoneFacet = stones.length + (hasStonelessPieces ? 1 : 0) > 1 && stones.length > 0;
  const showRingSizeFacet = ringSizes.length > 1;
  const showLengthFacet = lengths.length > 1;
  const showPriceFacet = activePriceBuckets.length > 1;

  function priceBucketLabel(bucket: PriceBucket): string {
    if (bucket.min === undefined) {
      return `${t.catalogV3.priceUnder} ${formatDisplayPrice(bucket.max!, currency)}`;
    }
    if (bucket.max === undefined) {
      return `${t.catalogV3.priceOver} ${formatDisplayPrice(bucket.min, currency)}`;
    }
    return `${formatDisplayPrice(bucket.min, currency)} – ${formatDisplayPrice(bucket.max, currency)}`;
  }

  const filtered = useMemo(() => {
    let result = scoped;

    if (showCategoryFacet && categoryFilter !== ALL) {
      result = result.filter((p) => p.category === categoryFilter);
    }
    // A piece matches when it *contains* the chosen term, so a ring offered in
    // five stones is found by any one of them.
    if (showMaterialFacet && material !== ALL) {
      result = result.filter((p) => p.materials.some((m) => m.slug === material));
    }
    if (showStoneFacet && stone !== ALL) {
      result =
        stone === NONE
          ? result.filter((p) => p.gemstones.length === 0)
          : result.filter((p) => p.gemstones.some((g) => g.slug === stone));
    }
    if (showRingSizeFacet && ringSize !== ALL) {
      result = result.filter((p) => p.sizeOptions.some((s) => s.slug === ringSize));
    }
    if (showLengthFacet && length !== ALL) {
      result = result.filter((p) => p.sizeOptions.some((s) => s.slug === length));
    }
    if (showPriceFacet && priceBucket !== ALL) {
      const bucket = PRICE_BUCKETS.find((b) => b.id === priceBucket);
      if (bucket) result = result.filter((p) => inBucket(p.price, bucket));
    }
    if (query.trim()) {
      // Match every word separately rather than the whole phrase. Searching
      // "cincin bali" used to find nothing for "Cincin Ukir Bali", because the
      // phrase is not a substring of the name — the words are just not adjacent.
      // Now a piece matches when all the words appear somewhere in its details,
      // in any order.
      const words = query.toLowerCase().split(/\s+/).filter(Boolean);
      result = result.filter((p) => {
        const haystack = [
          p.name,
          p.nameEn,
          p.description,
          p.descriptionEn,
          ...p.materials.map((m) => m.label),
          ...p.gemstones.map((g) => g.label),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return words.every((word) => haystack.includes(word));
      });
    }

    const sorted = [...result];
    switch (sort) {
      case 'priceAsc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => localizedName(a, locale).localeCompare(localizedName(b, locale)));
        break;
      case 'recommended':
        sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
        break;
    }
    return sorted;
  }, [
    scoped,
    showCategoryFacet,
    categoryFilter,
    showMaterialFacet,
    material,
    showStoneFacet,
    stone,
    showRingSizeFacet,
    ringSize,
    showLengthFacet,
    length,
    showPriceFacet,
    priceBucket,
    query,
    sort,
    locale,
  ]);

  const filtersActive =
    categoryFilter !== ALL ||
    material !== ALL ||
    stone !== ALL ||
    ringSize !== ALL ||
    length !== ALL ||
    priceBucket !== ALL ||
    query.trim() !== '';

  function resetFilters() {
    setCategoryFilter(ALL);
    setMaterial(ALL);
    setStone(ALL);
    setRingSize(ALL);
    setLength(ALL);
    setPriceBucket(ALL);
    setQuery('');
  }

  const crumbLabel = fixedCategory
    ? categoryLabel(categories, fixedCategory, locale)
    : t.catalogV3.allCatalogue;

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="border-b border-ink px-5 py-5 sm:px-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] tracking-[0.08em] text-ink/45">
          <Link href={`/${locale}`} className="uppercase transition-colors hover:text-accent">
            {t.catalogV3.home}
          </Link>
          <ChevronRight size={12} strokeWidth={1.5} aria-hidden="true" />
          <span className="font-medium uppercase text-ink">{crumbLabel}</span>
        </nav>

        {/* Filter + sort bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/55">
              {t.catalogV3.filterBy}:
            </span>
            {showCategoryFacet && (
              <FacetSelect label={t.catalogV3.facetCategory} value={categoryFilter} onChange={setCategoryFilter}>
                <option value={ALL}>{t.catalogV3.facetCategory}</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {locale === 'en' ? cat.nameEn || cat.name : cat.name}
                  </option>
                ))}
              </FacetSelect>
            )}
            {showMaterialFacet && (
              <FacetSelect label={t.catalogV3.facetMaterial} value={material} onChange={setMaterial}>
                <option value={ALL}>{t.catalogV3.facetMaterial}</option>
                {materials.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.label}
                  </option>
                ))}
              </FacetSelect>
            )}
            {showStoneFacet && (
              <FacetSelect label={t.catalogV3.facetGemstone} value={stone} onChange={setStone}>
                <option value={ALL}>{t.catalogV3.facetGemstone}</option>
                {stones.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.label}
                  </option>
                ))}
                {hasStonelessPieces && <option value={NONE}>{t.catalogV3.noStone}</option>}
              </FacetSelect>
            )}
            {showRingSizeFacet && (
              <FacetSelect label={t.catalogV3.facetRingSize} value={ringSize} onChange={setRingSize}>
                <option value={ALL}>{t.catalogV3.facetRingSize}</option>
                {ringSizes.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.label}
                  </option>
                ))}
              </FacetSelect>
            )}
            {showLengthFacet && (
              <FacetSelect label={t.catalogV3.facetLength} value={length} onChange={setLength}>
                <option value={ALL}>{t.catalogV3.facetLength}</option>
                {lengths.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.label}
                  </option>
                ))}
              </FacetSelect>
            )}
            {showPriceFacet && (
              <FacetSelect label={t.catalogV3.facetPrice} value={priceBucket} onChange={setPriceBucket}>
                <option value={ALL}>{t.catalogV3.facetPrice}</option>
                {activePriceBuckets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {priceBucketLabel(b)}
                  </option>
                ))}
              </FacetSelect>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/55">
              {t.catalogV3.sortBy}:
            </span>
            <FacetSelect label={t.catalogV3.sortBy} value={sort} onChange={(v) => setSort(v as SortKey)}>
              <option value="recommended">{t.catalogV3.sortRecommended}</option>
              <option value="priceAsc">{t.catalogV3.sortPriceAsc}</option>
              <option value="priceDesc">{t.catalogV3.sortPriceDesc}</option>
              <option value="name">{t.catalogV3.sortName}</option>
            </FacetSelect>
          </div>
        </div>

        {/* Count + search + reset */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex items-center gap-3 text-[12px] text-ink/55">
            <span>
              {t.catalogV3.showing} {filtered.length} {t.catalogV3.of} {scoped.length}
            </span>
            {filtersActive && (
              <button
                type="button"
                onClick={resetFilters}
                className="cursor-pointer border-b border-ink pb-px font-medium uppercase tracking-[0.1em] text-ink transition-colors hover:border-accent hover:text-accent"
              >
                {t.catalogV3.viewAll}
              </button>
            )}
          </div>
          <div className="flex min-w-[200px] flex-1 items-center gap-2 border border-ink bg-card px-3 py-2 sm:max-w-[280px]">
            <Search size={15} strokeWidth={1.5} className="shrink-0 text-ink/50" aria-hidden="true" />
            <label htmlFor="catalogue-search" className="sr-only">
              {t.catalogV3.searchPlaceholder}
            </label>
            <input
              id="catalogue-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.catalogV3.searchPlaceholder}
              className="w-full bg-transparent text-[13px] text-ink placeholder:text-ink/40 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="px-5 pb-20 pt-7 sm:px-10">
        <PieceGrid
          products={filtered}
          categories={categories}
          locale={locale}
          emptyMessage={emptyMessage}
        />
      </div>
    </div>
  );
}
