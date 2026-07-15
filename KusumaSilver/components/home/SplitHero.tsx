import Link from 'next/link';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

export function SplitHero({ locale }: { locale: Locale }) {
  const t = getT(locale);

  return (
    <section className="grid border-b border-ink lg:grid-cols-[58%_42%]">
      <ImageSlot
        alt={t.homeV3.heroImageAlt}
        label={t.homeV3.heroImageAlt}
        className="h-[380px] border-b border-ink lg:h-[620px] lg:border-b-0 lg:border-r"
      />
      <div className="flex flex-col justify-center px-5 py-12 sm:px-10 lg:px-16">
        <p className="text-[10px] font-medium tracking-[0.34em] text-accent">
          {t.homeV3.heroEyebrow}
        </p>
        <h1 className="mt-5 font-heading text-[38px] font-light leading-[1.1] text-ink lg:text-[54px]">
          {t.homeV3.heroTitle1}
          <br />
          <em className="font-normal italic">{t.homeV3.heroTitle2}</em>
        </h1>
        <p className="mt-6 max-w-[360px] text-sm leading-[1.75] text-ink/65">
          {t.homeV3.heroDesc}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/koleksi`}
            className="bg-ink px-8 py-4 text-xs font-semibold tracking-[0.16em] text-paper transition-colors hover:bg-accent"
          >
            {t.homeV3.heroCta1}
          </Link>
          <Link
            href={`/${locale}/tentang-kami`}
            className="border border-ink px-8 py-4 text-xs font-semibold tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            {t.homeV3.heroCta2}
          </Link>
        </div>
        <p className="mt-10 text-[11px] tracking-[0.08em] text-ink/45">{t.homeV3.heroCoords}</p>
      </div>
    </section>
  );
}
