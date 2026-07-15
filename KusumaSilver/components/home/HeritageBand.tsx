import { ImageSlot } from '@/components/ui/ImageSlot';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

export function HeritageBand({ locale }: { locale: Locale }) {
  const t = getT(locale);

  const stats: Array<[string, string]> = [
    ['925', t.homeV3.statSilver],
    ['3', t.homeV3.statGen],
    ['100%', t.homeV3.statHand],
  ];

  return (
    <section className="grid bg-ink text-ink-soft lg:grid-cols-2">
      <div className="px-5 py-14 sm:px-10 lg:px-[72px] lg:py-[88px]">
        <p className="text-[10px] font-medium tracking-[0.34em] text-accent">
          {t.homeV3.heritageEyebrow}
        </p>
        <h2 className="mt-4 font-heading text-[30px] font-normal leading-tight lg:text-[38px]">
          {t.homeV3.heritageTitle}
        </h2>
        <p className="mt-5 max-w-[400px] text-sm leading-relaxed text-ink-soft/60">
          {t.homeV3.heritageBody}
        </p>
        <div className="mt-10 grid grid-cols-3 gap-6 border-t border-ink-soft/15 pt-8">
          {stats.map(([value, label]) => (
            <div key={label}>
              <p className="font-heading text-[28px] lg:text-[34px]">{value}</p>
              <p className="mt-2 text-[10px] tracking-[0.2em] text-ink-soft/50">{label}</p>
            </div>
          ))}
        </div>
      </div>
      <ImageSlot
        alt={t.homeV3.heritageImageAlt}
        label={t.homeV3.heritageImageAlt}
        className="min-h-[300px] bg-ink-soft/10 lg:min-h-[460px]"
      />
    </section>
  );
}
