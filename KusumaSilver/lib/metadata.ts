import type { Metadata } from 'next';
import { buildImage } from './image';
import { localizedValue } from './catalog';
import type { Locale, Seo } from '@/types';

/**
 * Page metadata from the CMS.
 *
 * Before this, `app/[locale]/layout.tsx` held the only metadata in the app: no
 * page exported `generateMetadata`, so every page — including every piece and
 * every category — shared one title and one description. Each page now supplies
 * its own, with the page heading as a fallback and the site-wide defaults from
 * Site Settings behind that, so a title is never missing.
 */
export function metadataFromSeo(
  seo: Seo | undefined,
  locale: Locale,
  fallback: { title: string; description?: string }
): Metadata {
  const title = localizedValue(seo?.title, locale) || fallback.title;
  const description = localizedValue(seo?.description, locale) || fallback.description;

  const share = buildImage(seo?.shareImage, {
    width: 1200,
    // 1.91:1 is what WhatsApp, Facebook and X expect for a link preview.
    aspect: 1200 / 630,
    fallbackAlt: title,
    locale,
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(share ? { images: [{ url: share.src, width: share.width, height: share.height }] } : {}),
    },
  };
}
