/**
 * The site's public base URL, used for canonical links, the sitemap, robots.txt
 * and absolute URLs in social share cards.
 *
 * It was hardcoded to https://kusumasilver.com while the site actually ran at
 * kusumasilver.vercel.app, which meant the sitemap advertised URLs that did not
 * resolve and share previews pointed at the wrong host.
 *
 * Resolution order, so moving to a custom domain needs no code change:
 *
 *  1. NEXT_PUBLIC_SITE_URL — set this to pin the domain explicitly.
 *  2. VERCEL_PROJECT_PRODUCTION_URL — set by Vercel to the project's production
 *     domain. It follows a custom domain automatically once one is attached, so
 *     the eventual move to kusumasilver.com needs nothing but the DNS change.
 *  3. localhost, for local development.
 *
 * Note this is deliberately NOT the per-deployment `VERCEL_URL`, which is a
 * unique preview hostname — using it would put preview URLs in the sitemap.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction) return `https://${vercelProduction.replace(/\/$/, '')}`;

  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = '/'): string {
  return new URL(path, SITE_URL).toString();
}
