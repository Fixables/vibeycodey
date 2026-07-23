import { ImageSlot } from '@/components/ui/ImageSlot';
import { getT } from '@/lib/i18n';
import type { ResolvedHome } from '@/lib/home-content';
import type { Locale } from '@/types';

export function HeritageBand({ locale, home }: { locale: Locale; home: ResolvedHome }) {
  const t = getT(locale);

  return (
    <section className="grid bg-ink text-ink-soft lg:grid-cols-2">
      <div className="px-5 py-14 sm:px-10 lg:px-[72px] lg:py-[88px]">
        <p className="text-[10px] font-medium tracking-[0.34em] text-accent">{home.heritageEyebrow}</p>
        <h2 className="mt-4 font-heading text-[30px] font-normal leading-tight lg:text-[38px]">
          {home.heritageTitle}
        </h2>
        <p className="mt-5 max-w-[400px] text-sm leading-relaxed text-ink-soft/60">
          {home.heritageBody}
        </p>
        {home.stats.length > 0 && (
          <div
            // The band is a fixed 2-column layout, so the figures stay in one
            // row. The schema caps the list at 4 to keep them legible.
            className="mt-10 grid gap-6 border-t border-ink-soft/15 pt-8"
            style={{ gridTemplateColumns: `repeat(${home.stats.length}, minmax(0, 1fr))` }}
          >
            {home.stats.map((stat) => (
              <div key={`${stat.value}-${stat.label}`}>
                <p className="font-heading text-[28px] lg:text-[34px]">{stat.value}</p>
                <p className="mt-2 text-[10px] tracking-[0.2em] text-ink-soft/50">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <ImageSlot
        image={home.heritageImage}
        alt={t.homeV3.heritageImageAlt}
        label={t.homeV3.heritageImageAlt}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="min-h-[300px] bg-ink-soft/10 lg:min-h-[460px]"
      />
    </section>
  );
}
