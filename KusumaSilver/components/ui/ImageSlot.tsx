import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ResolvedImage } from '@/lib/image';

interface ImageSlotProps {
  /**
   * A CMS image resolved through `buildImage()` — carries srcset, dimensions,
   * the blur-up placeholder and the owner's photo description.
   * Pass `null` (or omit) to render the empty-slot placeholder.
   */
  image?: ResolvedImage | null;
  /**
   * Plain URL, for images that do not come from the CMS. Kept so non-CMS call
   * sites (and anything mid-migration) keep working; prefer `image`.
   */
  src?: string | null;
  /** Used when the CMS has no photo description, and for the empty placeholder. */
  alt: string;
  /** Caption printed under the photo, when the design has room for one. */
  caption?: string;
  /** Label shown inside the empty-slot placeholder. */
  label?: string;
  /**
   * How wide the slot renders at each breakpoint, so the browser can pick the
   * right file. Defaults to full viewport width, which is safe but conservative.
   */
  sizes?: string;
  /** Load immediately instead of lazily — only for above-the-fold images. */
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}

export function ImageSlot({
  image,
  src,
  alt,
  caption,
  label,
  sizes = '100vw',
  priority = false,
  className,
  imgClassName,
}: ImageSlotProps) {
  const base = cn('relative overflow-hidden', className);
  const resolvedSrc = image?.src ?? src;

  if (!resolvedSrc) {
    return (
      <div className={base} role="img" aria-label={alt}>
        <div className="flex h-full w-full flex-col items-center justify-center bg-ink/5">
          <ImageIcon size={22} strokeWidth={1.5} className="text-ink/30" aria-hidden="true" />
          {label && <span className="mt-2 text-[12px] text-ink/45">{label}</span>}
        </div>
      </div>
    );
  }

  const figure = (
    <div className={base}>
      {/* A plain <img> rather than next/image: the crop, the focal point and the
          format are already decided by lib/image.ts (which is what makes the
          Studio's hotspot actually take effect), so all that is left is srcset,
          lazy loading and the blur-up — and next/image would re-encode URLs it
          does not control. draggable=false so dragging a photo does not start a
          native image drag, which would hijack the catalogue strip's
          drag-to-scroll. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolvedSrc}
        srcSet={image?.srcSet}
        sizes={image?.srcSet ? sizes : undefined}
        width={image?.width}
        height={image?.height}
        alt={image?.alt ?? alt}
        draggable={false}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        style={
          image?.blurDataURL
            ? {
                backgroundImage: `url(${image.blurDataURL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
        className={cn('h-full w-full select-none object-cover', imgClassName)}
      />
    </div>
  );

  const shownCaption = caption ?? image?.caption;
  if (!shownCaption) return figure;

  return (
    <figure className="flex flex-col">
      {figure}
      <figcaption className="mt-2 text-[11px] leading-relaxed text-ink/50">
        {shownCaption}
      </figcaption>
    </figure>
  );
}
