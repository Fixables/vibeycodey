import type { Translation } from '@/lib/i18n';
import type { Category, Locale, ResolvedImage, StoreInfo } from '@/types';

/**
 * Turning Site Settings into the chrome the site renders: the menu, the footer
 * columns, the announcement bar and the repeated spec text.
 *
 * WHY THIS EXISTS
 * The menu and footer used to be hardcoded arrays in Navbar.tsx and Footer.tsx,
 * with the category addresses typed out as literal strings ('cincin', 'kalung',
 * …). Renaming a category in the Studio silently broke its link. Here a menu
 * entry points at a category *document*, so the address is always whatever that
 * category's address currently is.
 *
 * Every list falls back to the previous hardcoded behaviour when the owner has
 * not set one up, so the site looks identical until they choose to change it.
 */

export interface ResolvedLink {
  href: string;
  label: string;
  external: boolean;
  highlight: boolean;
}

/** The fixed pages, and the route each one lives at. */
const PAGE_ROUTES: Record<string, string> = {
  home: '',
  catalogue: '/koleksi',
  story: '/tentang-kami',
  bespoke: '/custom-order',
  contact: '/kontak',
};

function localized(value: unknown, locale: Locale): string {
  if (typeof value === 'string') return value.trim();
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const preferred = record[locale];
    if (typeof preferred === 'string' && preferred.trim()) return preferred;
    if (typeof record.id === 'string' && record.id.trim()) return record.id;
  }
  return '';
}

/**
 * Convert one CMS menu entry into a link. Returns null when the entry cannot
 * produce a working link — a category that has since been deleted, or an
 * external entry with no address — so a half-finished entry in the Studio can
 * never render as a broken link on the site.
 */
function resolveNavItem(
  item: Record<string, unknown>,
  locale: Locale,
  categories: Category[]
): ResolvedLink | null {
  if (item.hidden) return null;

  const label = localized(item.label, locale);
  const highlight = Boolean(item.highlight);

  switch (item.linkType) {
    case 'category': {
      const ref = (item.category as { _ref?: string; slug?: string } | undefined)?.slug;
      const category = categories.find((c) => c.slug === ref);
      if (!category) return null;
      const name = locale === 'en' ? category.nameEn || category.name : category.name;
      return {
        href: `/${locale}/koleksi/${category.slug}`,
        label: label || name,
        external: false,
        highlight,
      };
    }
    case 'page': {
      const route = PAGE_ROUTES[item.page as string];
      if (route === undefined) return null;
      return { href: `/${locale}${route}`, label, external: false, highlight };
    }
    case 'external': {
      const url = typeof item.url === 'string' ? item.url : '';
      if (!url || !label) return null;
      return { href: url, label, external: true, highlight };
    }
    default:
      return null;
  }
}

function resolveNavList(
  raw: unknown,
  locale: Locale,
  categories: Category[]
): ResolvedLink[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => resolveNavItem(item as Record<string, unknown>, locale, categories))
    .filter((link): link is ResolvedLink => link !== null && Boolean(link.label));
}

export interface ResolvedChrome {
  logo: ResolvedImage | null;
  wordmarkSub: string;
  promoBar: string;
  promoBarHidden: boolean;
  mainNav: ResolvedLink[];
  footerBlurb: string;
  footerShopLinks: ResolvedLink[];
  footerAtelierLinks: ResolvedLink[];
  copyright: string;
}

export function resolveChrome(
  settings: StoreInfo,
  categories: Category[],
  locale: Locale,
  t: Translation
): ResolvedChrome {
  /**
   * Categories as menu links — the default when the owner has not built a menu.
   * Empty categories are left out: linking to a page with nothing on it is a
   * dead end for visitors, and the owner has not chosen to feature it. Once they
   * build a menu in Site Settings, that choice is theirs and is respected as-is.
   */
  const categoryLinks = (limit?: number): ResolvedLink[] =>
    categories
      .filter((category) => (category.productCount ?? 0) > 0)
      .slice(0, limit)
      .map((category) => ({
        href: `/${locale}/koleksi/${category.slug}`,
        label: locale === 'en' ? category.nameEn || category.name : category.name,
        external: false,
        highlight: false,
      }));

  const mainNav = resolveNavList(settings.mainNav, locale, categories);
  const footerShopLinks = resolveNavList(settings.footerShopLinks, locale, categories);
  const footerAtelierLinks = resolveNavList(settings.footerAtelierLinks, locale, categories);

  // The pages that used to be appended to the menu in code.
  const defaultPages: ResolvedLink[] = [
    { href: `/${locale}/custom-order`, label: t.chrome.navBespoke, external: false, highlight: true },
    { href: `/${locale}/tentang-kami`, label: t.chrome.navStory, external: false, highlight: false },
  ];

  const defaultAtelier: ResolvedLink[] = [
    { href: `/${locale}/tentang-kami`, label: t.chrome.navStory, external: false, highlight: false },
    { href: `/${locale}/custom-order`, label: t.chrome.navBespoke, external: false, highlight: false },
    { href: `/${locale}/kontak`, label: t.chrome.navContact, external: false, highlight: false },
    ...(settings.socialMedia?.instagram
      ? [
          {
            href: `https://instagram.com/${settings.socialMedia.instagram}`,
            label: 'Instagram',
            external: true,
            highlight: false,
          },
        ]
      : []),
  ];

  return {
    logo: settings.logo ?? null,
    wordmarkSub: localized(settings.wordmarkSub, locale) || t.chrome.wordmarkSub,
    promoBar: localized(settings.promoBar, locale) || t.chrome.shipbar,
    promoBarHidden: Boolean(settings.promoBarHidden),
    mainNav: mainNav.length ? mainNav : [...categoryLinks(), ...defaultPages],
    footerBlurb: localized(settings.footerBlurb, locale) || t.footerV3.blurb,
    footerShopLinks: footerShopLinks.length ? footerShopLinks : categoryLinks(4),
    footerAtelierLinks: footerAtelierLinks.length ? footerAtelierLinks : defaultAtelier,
    copyright: localized(settings.copyright, locale) || t.footerV3.copyright,
  };
}
