import type { Category, Locale, LocaleString } from '@/types';

/**
 * Display name for a category slug.
 *
 * This used to be a hardcoded map of five slugs to translation keys, which meant
 * the owner could rename a category in the Studio and see no change on the site
 * — and a sixth category ("Custom") fell through to showing its raw slug. The
 * names now come from the category documents themselves; the slug is only used
 * as a last resort if a product references a category that no longer exists.
 */
export function categoryLabel(categories: Category[], slug: string, locale: Locale): string {
  const match = categories.find((category) => category.slug === slug);
  if (!match) return slug;
  return (locale === 'en' ? match.nameEn || match.name : match.name) || slug;
}

/** Read a bilingual CMS value, falling back to Indonesian when English is blank. */
export function localizedValue(value: LocaleString | undefined, locale: Locale): string {
  if (!value) return '';
  const preferred = locale === 'en' ? value.en : value.id;
  return (preferred?.trim() || value.id?.trim()) ?? '';
}

export function parseSizes(sizes?: string): string[] {
  return sizes ? sizes.split(',').map((s) => s.trim()).filter(Boolean) : [];
}
