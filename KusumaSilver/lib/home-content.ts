import type { Translation } from '@/lib/i18n';
import type { Locale } from '@/types';

/** Fully-resolved home strings: Studio value if published, else default copy. */
export interface ResolvedHome {
  heroEyebrow: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDesc: string;
  heroCta1: string;
  heroCta2: string;
  heroImageUrl?: string;
  heritageEyebrow: string;
  heritageTitle: string;
  heritageBody: string;
  statSilver: string;
  statGen: string;
  statHand: string;
  heritageImageUrl?: string;
  manifestoQuote: string;
  manifestoAttr: string;
}

/**
 * Merge the (optional) Studio document over the built-in translations: any
 * field the owner has filled in wins; blanks fall back to the default copy.
 */
export function resolveHome(
  doc: Record<string, unknown> | null,
  locale: Locale,
  t: Translation
): ResolvedHome {
  const pick = (idKey: string, enKey: string, fallback: string): string => {
    const value = doc?.[locale === 'en' ? enKey : idKey];
    return typeof value === 'string' && value.trim() ? value : fallback;
  };
  const h = t.homeV3;
  return {
    heroEyebrow: pick('heroEyebrow', 'heroEyebrowEn', h.heroEyebrow),
    heroTitle1: pick('heroTitle1', 'heroTitle1En', h.heroTitle1),
    heroTitle2: pick('heroTitle2', 'heroTitle2En', h.heroTitle2),
    heroDesc: pick('heroDesc', 'heroDescEn', h.heroDesc),
    heroCta1: pick('heroCta1', 'heroCta1En', h.heroCta1),
    heroCta2: pick('heroCta2', 'heroCta2En', h.heroCta2),
    heroImageUrl: (doc?.heroImageUrl as string) || undefined,
    heritageEyebrow: pick('heritageEyebrow', 'heritageEyebrowEn', h.heritageEyebrow),
    heritageTitle: pick('heritageTitle', 'heritageTitleEn', h.heritageTitle),
    heritageBody: pick('heritageBody', 'heritageBodyEn', h.heritageBody),
    statSilver: pick('statSilver', 'statSilverEn', h.statSilver),
    statGen: pick('statGen', 'statGenEn', h.statGen),
    statHand: pick('statHand', 'statHandEn', h.statHand),
    heritageImageUrl: (doc?.heritageImageUrl as string) || undefined,
    manifestoQuote: pick('manifestoQuote', 'manifestoQuoteEn', h.manifestoQuote),
    manifestoAttr: pick('manifestoAttr', 'manifestoAttrEn', h.manifestoAttr),
  };
}
