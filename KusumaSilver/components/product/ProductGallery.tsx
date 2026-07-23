'use client';

import { useEffect, useRef, useState } from 'react';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { getT } from '@/lib/i18n';
import type { Locale, ResolvedImage } from '@/types';

interface ProductGalleryProps {
  /** Every photo on the piece, largest first. Resolved on the server. */
  images: ResolvedImage[];
  /** Thumbnail-sized versions of the same photos, in the same order. */
  thumbnails: ResolvedImage[];
  productName: string;
  locale: Locale;
}

/**
 * The photo gallery on a piece's page.
 *
 * Two things it fixes:
 *  - It shows EVERY photo. The page used to render the first plus exactly three
 *    thumbnails, so a piece with seven photos silently lost three of them.
 *  - Thumbnails are now buttons that swap the large image, so the smaller photos
 *    can actually be looked at. Before, only the first photo was ever shown big.
 */
export function ProductGallery({ images, thumbnails, productName, locale }: ProductGalleryProps) {
  const t = getT(locale);
  const [active, setActive] = useState(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Only move focus when the user drives the gallery from the keyboard —
  // otherwise clicking a thumbnail would yank focus around unexpectedly.
  const focusNext = useRef(false);

  // Guard against the active index pointing past the end if the photos change.
  const safeActive = Math.min(active, Math.max(images.length - 1, 0));

  useEffect(() => {
    if (!focusNext.current) return;
    focusNext.current = false;
    thumbRefs.current[safeActive]?.focus();
  }, [safeActive]);

  if (images.length === 0) {
    return (
      <ImageSlot
        image={null}
        alt={productName}
        label={t.pieceV3.thumbLabel}
        className="aspect-square border border-ink"
      />
    );
  }

  function selectRelative(offset: number) {
    focusNext.current = true;
    setActive((current) => {
      const next = current + offset;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  }

  return (
    <div>
      <ImageSlot
        image={images[safeActive]}
        alt={productName}
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="aspect-square border border-ink"
      />

      {images.length > 1 && (
        <div
          role="group"
          aria-label={t.pieceV3.galleryLabel}
          className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5"
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') {
              event.preventDefault();
              selectRelative(1);
            } else if (event.key === 'ArrowLeft') {
              event.preventDefault();
              selectRelative(-1);
            }
          }}
        >
          {thumbnails.map((thumb, i) => {
            const isActive = i === safeActive;
            return (
              <button
                key={thumb.src}
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${productName} — ${t.pieceV3.thumbLabel} ${i + 1}`}
                aria-current={isActive}
                // Roving tabindex: the group is one tab stop, arrows move within.
                tabIndex={isActive ? 0 : -1}
                className={`cursor-pointer border transition-colors ${
                  isActive ? 'border-accent' : 'border-ink hover:border-accent'
                }`}
              >
                <ImageSlot
                  image={thumb}
                  alt=""
                  sizes="(min-width: 1024px) 10vw, 22vw"
                  className="aspect-square"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
