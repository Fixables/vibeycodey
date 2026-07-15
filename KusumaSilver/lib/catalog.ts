import type { Translation } from '@/lib/i18n';

export function categoryLabel(t: Translation, slug: string): string {
  const labels: Record<string, string> = {
    cincin: t.chrome.navRings,
    kalung: t.chrome.navNecklaces,
    gelang: t.chrome.navBracelets,
    anting: t.chrome.navEarrings,
    liontin: t.chrome.navPendants,
  };
  return labels[slug] ?? slug;
}

export function parseSizes(sizes?: string): string[] {
  return sizes ? sizes.split(',').map((s) => s.trim()).filter(Boolean) : [];
}
