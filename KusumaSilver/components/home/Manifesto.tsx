import { getT } from '@/lib/i18n';
import type { ResolvedHome } from '@/lib/home-content';
import type { Locale } from '@/types';

export function Manifesto({ locale, home }: { locale: Locale; home: ResolvedHome }) {
  const t = getT(locale);

  return (
    <section className="border-t border-ink-soft/[0.12] bg-ink px-5 py-16 text-center text-ink-soft lg:py-24">
      <div className="mx-auto flex max-w-[300px] items-center gap-4">
        <span className="h-px flex-1 bg-ink-soft/[0.12]" />
        <span className="text-[10px] tracking-[0.3em] text-accent">{t.homeV3.manifestoEyebrow}</span>
        <span className="h-px flex-1 bg-ink-soft/[0.12]" />
      </div>
      <blockquote className="mx-auto mt-8 max-w-[760px] font-heading text-[24px] font-light leading-[1.4] lg:text-[34px]">
        {home.manifestoQuote}
      </blockquote>
      <p className="mt-6 text-[11px] tracking-[0.2em] text-ink-soft/50">{home.manifestoAttr}</p>
    </section>
  );
}
