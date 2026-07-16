import type { Translation } from '@/lib/i18n';
import type { Locale } from '@/types';

/** Studio value for the current locale if present, otherwise the fallback. */
function pickLocalized(
  doc: Record<string, unknown> | null,
  locale: Locale,
  idKey: string,
  enKey: string,
  fallback: string
): string {
  const value = doc?.[locale === 'en' ? enKey : idKey];
  return typeof value === 'string' && value.trim() ? value : fallback;
}

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
  const pick = (idKey: string, enKey: string, fallback: string) =>
    pickLocalized(doc, locale, idKey, enKey, fallback);
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

// ---- About (Our Story) ----

const DEFAULT_ABOUT_BODY: Record<Locale, [string, string, string]> = {
  id: [
    'Kusuma Silver lahir dari kecintaan kami terhadap seni kerajinan perak Bali yang telah diwariskan turun-temurun. Setiap perhiasan yang kami buat adalah perwujudan dari keahlian tangan pengrajin Bali yang berpengalaman.',
    'Kami menggunakan perak 925 berkualitas tinggi yang telah tersertifikasi, dipadukan dengan desain yang menggabungkan estetika tradisional Bali dengan sentuhan kontemporer.',
    'Visi kami adalah membawa keindahan kerajinan perak Bali ke seluruh dunia, sambil terus mendukung para pengrajin lokal Bali.',
  ],
  en: [
    'Kusuma Silver was born from our love for Balinese silver craftsmanship that has been passed down through generations. Every piece of jewelry we create is an embodiment of the skill of experienced Balinese artisans.',
    'We use certified high-quality 925 silver, combined with designs that blend traditional Balinese aesthetics with contemporary touches.',
    'Our vision is to bring the beauty of Balinese silver craftsmanship to the world, while continuing to support local Balinese artisans.',
  ],
};

export interface ResolvedAbout {
  heroEyebrow: string;
  heroTitle: string;
  heroImageUrl?: string;
  lede: string;
  body: string[];
  galleryImage1Url?: string;
  galleryImage2Url?: string;
  values: { head: string; body: string }[];
  ctaTitle: string;
}

export function resolveAbout(
  doc: Record<string, unknown> | null,
  locale: Locale,
  t: Translation
): ResolvedAbout {
  const pick = (idKey: string, enKey: string, fallback: string) =>
    pickLocalized(doc, locale, idKey, enKey, fallback);
  const s = t.storyV3;
  const defaults = DEFAULT_ABOUT_BODY[locale];
  return {
    heroEyebrow: pick('heroEyebrow', 'heroEyebrowEn', s.eyebrow),
    heroTitle: pick('heroTitle', 'heroTitleEn', s.title),
    heroImageUrl: (doc?.heroImageUrl as string) || undefined,
    lede: pick('lede', 'ledeEn', s.lede),
    body: [
      pick('body1', 'body1En', defaults[0]),
      pick('body2', 'body2En', defaults[1]),
      pick('body3', 'body3En', defaults[2]),
    ],
    galleryImage1Url: (doc?.galleryImage1Url as string) || undefined,
    galleryImage2Url: (doc?.galleryImage2Url as string) || undefined,
    values: [
      { head: pick('value1Head', 'value1HeadEn', s.valuesHead1), body: pick('value1Body', 'value1BodyEn', s.valuesBody1) },
      { head: pick('value2Head', 'value2HeadEn', s.valuesHead2), body: pick('value2Body', 'value2BodyEn', s.valuesBody2) },
      { head: pick('value3Head', 'value3HeadEn', s.valuesHead3), body: pick('value3Body', 'value3BodyEn', s.valuesBody3) },
    ],
    ctaTitle: pick('ctaTitle', 'ctaTitleEn', s.ctaTitle),
  };
}

// ---- Contact ----

export interface ResolvedContact {
  eyebrow: string;
  title: string;
  subtitle: string;
  formTitle: string;
}

export function resolveContact(
  doc: Record<string, unknown> | null,
  locale: Locale,
  t: Translation
): ResolvedContact {
  const pick = (idKey: string, enKey: string, fallback: string) =>
    pickLocalized(doc, locale, idKey, enKey, fallback);
  const c = t.contactV3;
  return {
    eyebrow: pick('eyebrow', 'eyebrowEn', c.eyebrow),
    title: pick('title', 'titleEn', c.title),
    subtitle: pick('subtitle', 'subtitleEn', c.subtitle),
    formTitle: pick('formTitle', 'formTitleEn', c.formTitle),
  };
}

// ---- Bespoke (Custom Order) ----

export interface ResolvedBespoke {
  heroEyebrow: string;
  heroTitle1: string;
  heroTitle2: string;
  heroIntro: string;
  heroImageUrl?: string;
  processEyebrow: string;
  processTitle: string;
  steps: { title: string; description: string }[];
  formEyebrow: string;
  formTitle: string;
  formSub: string;
}

export function resolveBespoke(
  doc: Record<string, unknown> | null,
  locale: Locale,
  t: Translation
): ResolvedBespoke {
  const pick = (idKey: string, enKey: string, fallback: string) =>
    pickLocalized(doc, locale, idKey, enKey, fallback);
  const b = t.bespokeV3;
  const stepDefaults = t.customOrder.steps;
  return {
    heroEyebrow: pick('heroEyebrow', 'heroEyebrowEn', b.eyebrow),
    heroTitle1: pick('heroTitle1', 'heroTitle1En', b.title1),
    heroTitle2: pick('heroTitle2', 'heroTitle2En', b.title2),
    heroIntro: pick('heroIntro', 'heroIntroEn', b.intro),
    heroImageUrl: (doc?.heroImageUrl as string) || undefined,
    processEyebrow: pick('processEyebrow', 'processEyebrowEn', b.processEyebrow),
    processTitle: pick('processTitle', 'processTitleEn', b.processTitle),
    steps: [0, 1, 2, 3].map((i) => ({
      title: pick(`step${i + 1}Title`, `step${i + 1}TitleEn`, stepDefaults[i]?.title ?? ''),
      description: pick(`step${i + 1}Body`, `step${i + 1}BodyEn`, stepDefaults[i]?.description ?? ''),
    })),
    formEyebrow: pick('formEyebrow', 'formEyebrowEn', b.formEyebrow),
    formTitle: pick('formTitle', 'formTitleEn', b.formTitle),
    formSub: pick('formSub', 'formSubEn', b.formSub),
  };
}
