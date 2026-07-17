'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { categoryLabel } from '@/lib/catalog';
import { getT, type Translation } from '@/lib/i18n';
import type { Locale, Product } from '@/types';

interface AsymmetricCatalogueProps {
  locale: Locale;
  products: Product[];
}

function localizedName(product: Product, locale: Locale): string {
  return locale === 'en' ? product.nameEn || product.name : product.name;
}

interface CellProps {
  product: Product;
  locale: Locale;
  t: Translation;
  /** true for cells in the duplicated loop set — removed from the tab order */
  shadow?: boolean;
}

function CaptionBar({ product, locale, t }: CellProps) {
  return (
    <div className="flex items-start justify-between gap-4 p-4">
      <div>
        <h3 className="font-heading text-lg font-normal leading-tight text-ink">
          {localizedName(product, locale)}
        </h3>
        <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-ink/50">
          {categoryLabel(t, product.category)}
        </p>
      </div>
      <PriceDisplay amountIdr={product.price} className="text-[13px] font-semibold text-ink" />
    </div>
  );
}

/**
 * Column widths — the handoff's 38% / 24% / 38% rhythm (wide / narrow / wide).
 * Every cell fills the full strip height, so borders never flank empty space.
 */
const WIDE = 'w-[300px] shrink-0 sm:w-[440px]';
const NARROW = 'w-[230px] shrink-0 sm:w-[300px]';

/** Reusable image + caption block that links to the product page. */
function ProductBlock({ product, locale, t, shadow }: CellProps) {
  return (
    <Link
      href={`/${locale}/koleksi/${product.category}/${product.slug}`}
      className="group flex min-h-0 flex-1 flex-col"
      draggable={false}
      tabIndex={shadow ? -1 : undefined}
    >
      <ImageSlot
        src={product.imageUrl}
        alt={localizedName(product, locale)}
        className="min-h-0 flex-1 border-b border-ink"
        imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <CaptionBar product={product} locale={locale} t={t} />
    </Link>
  );
}

/** Plain full-height product cell — image fills, caption at the bottom. */
function ProductCell({ product, locale, t, shadow, width }: CellProps & { width: string }) {
  return (
    <div className={`flex ${width} flex-col border-r border-ink`}>
      <ProductBlock product={product} locale={locale} t={t} shadow={shadow} />
    </div>
  );
}

/** Full-height cell with an editorial panel stacked above or below the product. */
function PanelStack({
  product,
  locale,
  t,
  shadow,
  width,
  label,
  text,
  position,
}: CellProps & { width: string; label: string; text: string; position: 'top' | 'bottom' }) {
  const panel = (
    <div className={`p-6 ${position === 'top' ? 'border-b' : 'border-t'} border-ink`}>
      <p className="text-[10px] tracking-[0.3em] text-accent">{label}</p>
      <p className="mt-3 font-heading text-[22px] leading-snug text-ink">{text}</p>
    </div>
  );
  return (
    <div className={`flex ${width} flex-col border-r border-ink`}>
      {position === 'top' ? (
        <>
          {panel}
          <ProductBlock product={product} locale={locale} t={t} shadow={shadow} />
        </>
      ) : (
        <>
          <ProductBlock product={product} locale={locale} t={t} shadow={shadow} />
          {panel}
        </>
      )}
    </div>
  );
}

/** px scrolled per ms while idle-drifting (~22px/s) */
const DRIFT_SPEED = 0.022;
/** ms of no interaction before the drift resumes */
const RESUME_DELAY = 2500;
/** pointer travel in px beyond which a drag suppresses the click on release */
const DRAG_CLICK_THRESHOLD = 8;

export function AsymmetricCatalogue({ locale, products }: AsymmetricCatalogueProps) {
  const t = getT(locale);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  // Copies of the product set in the strip. The wrap point (one set width) is
  // only reachable when the remaining copies at least fill the viewport, so
  // wide viewports with a small catalogue need more than two.
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const el = scrollerRef.current;
    const firstSet = firstSetRef.current;
    if (!el || !firstSet) return;

    const measure = () => {
      const setWidth = firstSet.offsetWidth;
      if (setWidth > 0) {
        setCopies(Math.max(2, Math.ceil(el.clientWidth / setWidth) + 1));
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [products.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    const firstSet = firstSetRef.current;
    if (!el || !firstSet) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let drifting = true;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    // Fractional scroll position — scrollLeft rounds to ints, so accumulate here.
    let pos = el.scrollLeft;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      // The strip renders the set twice; wrapping by one set width is invisible.
      const setWidth = firstSet.offsetWidth;
      if (drifting && setWidth > 0) {
        // Re-sync if the user scrolled since our last write.
        if (Math.abs(el.scrollLeft - pos) > 2) pos = el.scrollLeft;
        pos += dt * DRIFT_SPEED;
        if (pos >= setWidth) pos -= setWidth;
        el.scrollLeft = pos;
      } else if (setWidth > 0 && el.scrollLeft >= setWidth) {
        // Keep manual scrolling loopable too: wrap once past the first set.
        el.scrollLeft -= setWidth;
      }
      raf = requestAnimationFrame(step);
    };

    const hold = () => {
      drifting = false;
      clearTimeout(resumeTimer);
    };
    const resumeSoon = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        drifting = true;
        pos = el.scrollLeft;
      }, RESUME_DELAY);
    };
    const holdThenResume = () => {
      hold();
      resumeSoon();
    };

    // Drag-to-scroll for mouse users (touch scrolls natively via overflow).
    // Only ACTIVE interaction pauses the drift — plain hovering does not.
    let dragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let dragMoved = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true;
      dragStartX = e.clientX;
      dragStartScroll = el.scrollLeft;
      dragMoved = 0;
      hold();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      dragMoved = Math.max(dragMoved, Math.abs(dx));
      el.scrollLeft = dragStartScroll - dx;
    };
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      resumeSoon();
    };
    // After a real drag, swallow the click so links don't fire on release.
    const onClickCapture = (e: MouseEvent) => {
      if (dragMoved > DRAG_CLICK_THRESHOLD) {
        e.preventDefault();
        e.stopPropagation();
        dragMoved = 0;
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    // Track drag on the window so releasing outside the strip still ends it.
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);
    el.addEventListener('click', onClickCapture, true);
    el.addEventListener('wheel', holdThenResume, { passive: true });
    el.addEventListener('touchstart', hold, { passive: true });
    el.addEventListener('touchend', resumeSoon);
    el.addEventListener('focusin', hold);
    el.addEventListener('focusout', resumeSoon);

    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resumeTimer);
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      el.removeEventListener('pointercancel', endDrag);
      el.removeEventListener('click', onClickCapture, true);
      el.removeEventListener('wheel', holdThenResume);
      el.removeEventListener('touchstart', hold);
      el.removeEventListener('touchend', resumeSoon);
      el.removeEventListener('focusin', hold);
      el.removeEventListener('focusout', resumeSoon);
    };
  }, []);

  // Rotating pool of editorial one-liners so the panels aren't just technique
  // and origin on repeat.
  const panels = [
    { label: t.homeV3.techniqueLabel, text: t.homeV3.techniqueText },
    { label: t.homeV3.madeInBaliLabel, text: t.homeV3.madeInBaliText },
    { label: t.homeV3.originLabel, text: t.homeV3.originText },
    { label: t.homeV3.sterlingLabel, text: t.homeV3.sterlingText },
    { label: t.homeV3.byHandLabel, text: t.homeV3.byHandText },
    { label: t.homeV3.familyLabel, text: t.homeV3.familyText },
  ];

  // Composition follows the handoff's wide / narrow / wide rhythm: a plain wide
  // image, then a narrow cell with an editorial panel on top, then a wide cell
  // with a panel below — repeating, with the panels cycling the pool.
  const renderSet = (shadow: boolean) => {
    let panelIdx = 0;
    return products.map((product, i) => {
      const props = { product, locale, t, shadow };
      const kind = i % 3;
      if (kind === 0) {
        return <ProductCell key={product.slug} {...props} width={WIDE} />;
      }
      const panel = panels[panelIdx % panels.length];
      panelIdx += 1;
      return (
        <PanelStack
          key={product.slug}
          {...props}
          width={kind === 1 ? NARROW : WIDE}
          label={panel.label}
          text={panel.text}
          position={kind === 1 ? 'top' : 'bottom'}
        />
      );
    });
  };

  return (
    <section className="px-5 py-14 sm:px-10 lg:py-20">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-heading text-[28px] font-normal text-ink lg:text-[34px]">
          {t.homeV3.catalogueHead}
        </h2>
        <Link
          href={`/${locale}/koleksi`}
          className="border-b border-ink pb-0.5 text-[11px] font-semibold tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
        >
          {t.homeV3.viewAll}
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="flex items-center justify-center border border-ink py-24">
          <Link
            href={`/${locale}/koleksi`}
            className="border-b border-ink pb-0.5 text-[11px] font-semibold tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {t.homeV3.viewAll}
          </Link>
        </div>
      ) : (
        <div
          ref={scrollerRef}
          role="region"
          aria-label={t.homeV3.catalogueHead}
          tabIndex={0}
          className="scrollbar-none cursor-grab select-none overflow-x-auto border border-ink active:cursor-grabbing"
        >
          <div className="flex h-[520px] w-max sm:h-[620px]">
            <div ref={firstSetRef} className="flex">
              {renderSet(false)}
            </div>
            {/* Duplicate sets so the idle drift loops seamlessly */}
            {Array.from({ length: copies - 1 }, (_, i) => (
              <div key={i} className="flex" aria-hidden="true">
                {renderSet(true)}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
