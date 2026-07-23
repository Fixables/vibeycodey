import { urlFor } from './sanity';
import type { ImageShape, Locale, ResolvedImage, SanityImage } from '@/types';

export type { ResolvedImage };

/**
 * Turning a Sanity image into something the browser can render well.
 *
 * WHY THIS EXISTS
 * The site used to build image URLs with `urlFor(img).width(800)` and then let
 * CSS `object-cover` do the cropping. That silently threw away two things:
 *
 *  1. The hotspot. Sanity only applies the owner's chosen focal point when the
 *     URL asks for a width AND a height with `fit=crop`. With width alone the
 *     CDN returns the whole frame and the browser crops from the centre — so
 *     dragging the hotspot in the Studio did nothing at all.
 *  2. Format and responsiveness. One fixed width, no srcset, and no
 *     `auto=format`, so a 1500x1500 PNG shipped as a PNG to every device.
 *
 * Both are fixed here, in one place, so components never build URLs themselves.
 */

/** Widths we generate for the srcset. Covers phone through 2x desktop. */
const BREAKPOINTS = [400, 640, 828, 1080, 1440, 1920] as const;

/** Aspect ratios behind the owner-facing shape names. */
const SHAPE_RATIOS: Record<Exclude<ImageShape, 'original'>, number> = {
  square: 1,
  landscape: 4 / 3,
  portrait: 3 / 4,
};

interface BuildOptions {
  /** Rendered width at the largest breakpoint. Drives the srcset. */
  width: number;
  /**
   * Width / height. Pass a number, or a shape name the owner chose in the
   * Studio. Omit for the image's own ratio (no cropping, hotspot has no effect).
   */
  aspect?: number | ImageShape;
  /** Fallback used when the CMS has no photo description. */
  fallbackAlt: string;
  locale: Locale;
  /** JPEG/WebP quality. 80 is visually lossless for jewelry photography. */
  quality?: number;
}

/** A localized CMS value, tolerating both the new object and legacy plain string. */
function localized(value: unknown, locale: Locale): string | undefined {
  if (typeof value === 'string') return value.trim() || undefined;
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const preferred = record[locale];
    if (typeof preferred === 'string' && preferred.trim()) return preferred;
    // English is optional; fall back to Indonesian rather than showing nothing.
    const fallback = record.id;
    if (typeof fallback === 'string' && fallback.trim()) return fallback;
  }
  return undefined;
}

function ratioOf(aspect: BuildOptions['aspect']): number | undefined {
  if (aspect === undefined || aspect === 'original') return undefined;
  if (typeof aspect === 'number') return aspect > 0 ? aspect : undefined;
  return SHAPE_RATIOS[aspect];
}

/**
 * Build the src, srcset and dimensions for one image slot.
 * Returns null when there is no image, or when the owner has hidden it — callers
 * then render their placeholder instead.
 */
export function buildImage(
  source: SanityImage | null | undefined,
  options: BuildOptions
): ResolvedImage | null {
  // `asset->` expansion replaces _ref with _id, so accept either.
  if (!(source?.asset?._ref || source?.asset?._id) || source.hidden) return null;

  const ratio = ratioOf(options.aspect);
  const quality = options.quality ?? 80;

  const at = (width: number): string => {
    let builder = urlFor(source).width(width).auto('format').quality(quality);
    if (ratio) {
      // width + height + fit:crop is what makes Sanity honour the hotspot.
      builder = builder.height(Math.round(width / ratio)).fit('crop');
    }
    return builder.url();
  };

  try {
    // Offer up to 2x the rendered width for retina screens, and always include
    // the rendered width itself so small slots still get an exact match.
    const sorted = [
      ...new Set<number>([
        ...BREAKPOINTS.filter((w) => w <= options.width * 2),
        options.width,
      ]),
    ].sort((a, b) => a - b);

    return {
      src: at(options.width),
      srcSet: sorted.map((w) => `${at(w)} ${w}w`).join(', '),
      width: options.width,
      height: ratio ? Math.round(options.width / ratio) : options.width,
      blurDataURL: source.asset?.metadata?.lqip,
      alt: localized(source.alt, options.locale) ?? options.fallbackAlt,
      caption: localized(source.caption, options.locale),
      shape: typeof options.aspect === 'string' ? options.aspect : undefined,
    };
  } catch {
    // A malformed asset reference must not take the page down.
    return null;
  }
}

/**
 * The GROQ projection every image needs. Without `hotspot`, `crop` and the asset
 * metadata, the URL builder cannot apply the owner's focal point or the blur-up.
 */
export const IMAGE_PROJECTION = `{
  ...,
  hidden,
  alt,
  caption,
  asset->{ _id, "metadata": metadata{ lqip, dimensions } }
}`;

/** Tailwind aspect-ratio class for an owner-chosen shape. */
export function shapeClass(shape: ImageShape | undefined): string {
  switch (shape) {
    case 'landscape':
      return 'aspect-[4/3]';
    case 'portrait':
      return 'aspect-[3/4]';
    case 'original':
      return '';
    case 'square':
    default:
      return 'aspect-square';
  }
}
