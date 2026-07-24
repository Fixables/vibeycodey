import { buildImage } from '@/lib/image';
import type { Translation } from '@/lib/i18n';
import type {
  Locale,
  LocaleRichText,
  PortableTextBlock,
  ResolvedImage,
  SanityImage,
} from '@/types';

/**
 * Read one localized value from a Studio document.
 *
 * Accepts BOTH shapes on purpose:
 *  - the new one, a single `localeString` object: `{ heroTitle: { id, en } }`
 *  - the legacy one, a pair of flat fields: `{ heroTitle, heroTitleEn }`
 *
 * That dual-read is what makes the localeString migration safe — the site reads
 * correctly before, during and after the documents are converted, so the schema
 * change and the data change do not have to ship together.
 *
 * English is optional in both shapes: a line written only in Indonesian shows on
 * the English site rather than disappearing from it.
 */
function pickLocalized(
  doc: Record<string, unknown> | null,
  locale: Locale,
  idKey: string,
  enKey: string,
  fallback: string
): string {
  const grouped = doc?.[idKey];
  if (grouped && typeof grouped === 'object' && !Array.isArray(grouped)) {
    const record = grouped as Record<string, unknown>;
    const preferred = record[locale];
    if (typeof preferred === 'string' && preferred.trim()) return preferred;
    if (typeof record.id === 'string' && record.id.trim()) return record.id;
    return fallback;
  }

  const flat = doc?.[locale === 'en' ? enKey : idKey];
  if (typeof flat === 'string' && flat.trim()) return flat;
  // An English value that was never filled in falls back to the Indonesian one.
  if (locale === 'en') {
    const indonesian = doc?.[idKey];
    if (typeof indonesian === 'string' && indonesian.trim()) return indonesian;
  }
  return fallback;
}

/**
 * Read formatted text for the current locale.
 *
 * Returns null when the owner has not written any, so the caller can fall back
 * to the plain-text field (or the built-in copy) instead. English is optional,
 * exactly as with plain text.
 */
function pickRichText(
  doc: Record<string, unknown> | null,
  key: string,
  locale: Locale
): PortableTextBlock[] | null {
  const value = doc?.[key] as LocaleRichText | undefined;
  if (!value) return null;
  const chosen = locale === 'en' ? value.en : value.id;
  const blocks = chosen?.length ? chosen : value.id;
  if (!blocks?.length) return null;
  // A block the owner opened and left blank should still fall through.
  const hasText = blocks.some((block) =>
    block._type !== 'block'
      ? true
      : (block.children ?? []).some((child) => (child.text ?? '').trim().length > 0)
  );
  return hasText ? blocks : null;
}

/** Resolve a CMS image on a page document to render-ready URLs. */
function pickImage(
  doc: Record<string, unknown> | null,
  key: string,
  locale: Locale,
  width: number,
  fallbackAlt: string,
  aspect?: Parameters<typeof buildImage>[1]['aspect']
): ResolvedImage | null {
  return buildImage(doc?.[key] as SanityImage | undefined, {
    width,
    aspect,
    fallbackAlt,
    locale,
  });
}

/** The built-in strip cards, used until the owner defines their own. */
function defaultPanels(h: Translation['homeV3']): { label: string; text: string }[] {
  return [
    { label: h.techniqueLabel, text: h.techniqueText },
    { label: h.madeInBaliLabel, text: h.madeInBaliText },
    { label: h.originLabel, text: h.originText },
    { label: h.sterlingLabel, text: h.sterlingText },
    { label: h.byHandLabel, text: h.byHandText },
    { label: h.familyLabel, text: h.familyText },
  ];
}

/** Fully-resolved home strings: Studio value if published, else default copy. */
export interface ResolvedHome {
  heroEyebrow: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDesc: string;
  /** Formatted version; render this when present, else `heroDesc`. */
  heroDescRich: PortableTextBlock[] | null;
  heroCta1: string;
  heroCta2: string;
  heroCoords: string;
  heroImage: ResolvedImage | null;
  catalogueHead: string;
  cataloguePanels: { label: string; text: string }[];
  heritageEyebrow: string;
  heritageTitle: string;
  heritageBody: string;
  heritageBodyRich: PortableTextBlock[] | null;
  /** Drag-reorderable in the Studio; falls back to the three legacy stat pairs. */
  stats: { value: string; label: string }[];
  heritageImage: ResolvedImage | null;
  manifestoQuote: string;
  manifestoAttr: string;
  /** Section order and visibility, chosen by the owner. */
  sections: HomeSection[];
}

/** The section types the home page can render. The list is fixed by the design. */
export type HomeSectionType = 'catalogueStrip' | 'heritageBand' | 'manifesto';

export interface HomeSection {
  type: HomeSectionType;
  key: string;
}

/** Order used when the owner has not arranged the sections — today's layout. */
const DEFAULT_SECTIONS: HomeSectionType[] = ['catalogueStrip', 'heritageBand', 'manifesto'];

/**
 * Read the owner's section arrangement, dropping hidden entries and anything
 * whose type this build does not know how to render (so removing a section type
 * from the code can never crash a published page).
 */
function resolveSections(doc: Record<string, unknown> | null): HomeSection[] {
  const raw = Array.isArray(doc?.sections) ? (doc.sections as Record<string, unknown>[]) : [];
  const chosen = raw
    .filter((section) => !section.hidden)
    .map((section, index) => ({
      type: section._type as HomeSectionType,
      key: (section._key as string) ?? `${section._type}-${index}`,
    }))
    .filter((section) => DEFAULT_SECTIONS.includes(section.type));

  if (chosen.length > 0) return chosen;
  return DEFAULT_SECTIONS.map((type) => ({ type, key: type }));
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
  // The heritage stat figures are numerals, so they are one shared field rather
  // than an ID/EN pair.
  const pickPlain = (key: string, fallback: string) => {
    const value = doc?.[key];
    return typeof value === 'string' && value.trim() ? value : fallback;
  };
  const h = t.homeV3;

  // The editorial cards in the scrolling strip. The owner can add, reorder, or
  // remove them in the Studio; an empty list keeps the built-in six.
  const rawPanels = Array.isArray(doc?.cataloguePanels)
    ? (doc.cataloguePanels as Record<string, unknown>[])
    : [];
  // The English fields are optional: a card written in Indonesian only still
  // shows on the English site rather than vanishing from it.
  const panelText = (panel: Record<string, unknown>, idKey: string, enKey: string) => {
    const id = typeof panel[idKey] === 'string' ? (panel[idKey] as string).trim() : '';
    return pickLocalized(panel, locale, idKey, enKey, id);
  };
  const cataloguePanels = rawPanels
    .filter((panel) => !panel.hidden)
    .map((panel) => ({
      label: panelText(panel, 'label', 'labelEn'),
      text: panelText(panel, 'text', 'textEn'),
    }))
    .filter((panel) => panel.label && panel.text);

  // Heritage figures. Prefer the drag-reorderable array; fall back to the three
  // legacy stat fields so documents that predate the migration still render.
  const rawStats = Array.isArray(doc?.stats) ? (doc.stats as Record<string, unknown>[]) : [];
  const arrayStats = rawStats
    .filter((stat) => !stat.hidden)
    .map((stat) => ({
      value: typeof stat.value === 'string' ? stat.value.trim() : '',
      label: panelText(stat, 'label', 'labelEn'),
    }))
    .filter((stat) => stat.value && stat.label);
  const stats = arrayStats.length
    ? arrayStats
    : [
        { value: pickPlain('statSilverValue', h.statSilverValue), label: pick('statSilver', 'statSilverEn', h.statSilver) },
        { value: pickPlain('statGenValue', h.statGenValue), label: pick('statGen', 'statGenEn', h.statGen) },
        { value: pickPlain('statHandValue', h.statHandValue), label: pick('statHand', 'statHandEn', h.statHand) },
      ];

  return {
    heroEyebrow: pick('heroEyebrow', 'heroEyebrowEn', h.heroEyebrow),
    heroTitle1: pick('heroTitle1', 'heroTitle1En', h.heroTitle1),
    heroTitle2: pick('heroTitle2', 'heroTitle2En', h.heroTitle2),
    heroDesc: pick('heroDesc', 'heroDescEn', h.heroDesc),
    heroDescRich: pickRichText(doc, 'heroDescRich', locale),
    heroCta1: pick('heroCta1', 'heroCta1En', h.heroCta1),
    heroCta2: pick('heroCta2', 'heroCta2En', h.heroCta2),
    heroCoords: pickPlain('heroCoords', h.heroCoords),
    // The hero fills a 58%-wide column up to 620px tall; 1200px covers it at 2x.
    heroImage: pickImage(doc, 'heroImage', locale, 1200, h.heroImageAlt),
    catalogueHead: pick('catalogueHead', 'catalogueHeadEn', h.catalogueHead),
    cataloguePanels: cataloguePanels.length ? cataloguePanels : defaultPanels(h),
    heritageEyebrow: pick('heritageEyebrow', 'heritageEyebrowEn', h.heritageEyebrow),
    heritageTitle: pick('heritageTitle', 'heritageTitleEn', h.heritageTitle),
    heritageBody: pick('heritageBody', 'heritageBodyEn', h.heritageBody),
    heritageBodyRich: pickRichText(doc, 'heritageBodyRich', locale),
    stats,
    heritageImage: pickImage(doc, 'heritageImage', locale, 1200, h.heritageImageAlt),
    manifestoQuote: pick('manifestoQuote', 'manifestoQuoteEn', h.manifestoQuote),
    manifestoAttr: pick('manifestoAttr', 'manifestoAttrEn', h.manifestoAttr),
    sections: resolveSections(doc),
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
  heroImage: ResolvedImage | null;
  lede: string;
  body: string[];
  /** Formatted paragraphs, index-aligned with `body`; null where unwritten. */
  bodyRich: (PortableTextBlock[] | null)[];
  /** Drag-reorderable gallery; falls back to the two legacy gallery fields. */
  gallery: ResolvedImage[];
  values: { head: string; body: string }[];
  ctaTitle: string;
  ctaCatalogue: string;
  ctaBespoke: string;
}

/**
 * Read a repeatable list the owner can drag, add to, and hide items in.
 * Returns an empty array when there is nothing usable, so callers can decide
 * whether to fall back to the legacy numbered fields.
 */
function resolveList<T>(
  doc: Record<string, unknown> | null,
  key: string,
  locale: Locale,
  map: (item: Record<string, unknown>, pick: (idKey: string, enKey: string) => string) => T,
  isUsable: (item: T) => boolean
): T[] {
  const raw = Array.isArray(doc?.[key]) ? (doc[key] as Record<string, unknown>[]) : [];
  return raw
    .filter((item) => !item.hidden)
    .map((item) =>
      map(item, (idKey, enKey) => {
        const indonesian = typeof item[idKey] === 'string' ? (item[idKey] as string).trim() : '';
        return pickLocalized(item, locale, idKey, enKey, indonesian);
      })
    )
    .filter(isUsable);
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

  const arrayValues = resolveList(
    doc,
    'values',
    locale,
    (_item, p) => ({ head: p('head', 'headEn'), body: p('body', 'bodyEn') }),
    (value) => Boolean(value.head && value.body)
  );
  const values = arrayValues.length
    ? arrayValues
    : [
        { head: pick('value1Head', 'value1HeadEn', s.valuesHead1), body: pick('value1Body', 'value1BodyEn', s.valuesBody1) },
        { head: pick('value2Head', 'value2HeadEn', s.valuesHead2), body: pick('value2Body', 'value2BodyEn', s.valuesBody2) },
        { head: pick('value3Head', 'value3HeadEn', s.valuesHead3), body: pick('value3Body', 'value3BodyEn', s.valuesBody3) },
      ];

  // Prefer the drag-reorderable gallery array; fall back to the two legacy
  // single-image fields so unmigrated documents keep their photos.
  const rawGallery = Array.isArray(doc?.gallery) ? (doc.gallery as SanityImage[]) : [];
  const gallery = rawGallery.length
    ? rawGallery
        .map((image, i) =>
          buildImage(image, {
            width: 800,
            aspect: image?.shape ?? 'square',
            fallbackAlt: i === 0 ? s.galleryAlt1 : s.galleryAlt2,
            locale,
          })
        )
        .filter((image): image is ResolvedImage => image !== null)
    : [
        pickImage(doc, 'galleryImage1', locale, 800, s.galleryAlt1, 'square'),
        pickImage(doc, 'galleryImage2', locale, 800, s.galleryAlt2, 'square'),
      ].filter((image): image is ResolvedImage => image !== null);

  return {
    heroEyebrow: pick('heroEyebrow', 'heroEyebrowEn', s.eyebrow),
    heroTitle: pick('heroTitle', 'heroTitleEn', s.title),
    heroImage: pickImage(doc, 'heroImage', locale, 1600, s.heroImageAlt),
    lede: pick('lede', 'ledeEn', s.lede),
    body: [
      pick('body1', 'body1En', defaults[0]),
      pick('body2', 'body2En', defaults[1]),
      pick('body3', 'body3En', defaults[2]),
    ],
    bodyRich: [
      pickRichText(doc, 'body1Rich', locale),
      pickRichText(doc, 'body2Rich', locale),
      pickRichText(doc, 'body3Rich', locale),
    ],
    gallery,
    values,
    ctaTitle: pick('ctaTitle', 'ctaTitleEn', s.ctaTitle),
    ctaCatalogue: pick('ctaCatalogue', 'ctaCatalogueEn', s.ctaCatalogue),
    ctaBespoke: pick('ctaBespoke', 'ctaBespokeEn', s.ctaBespoke),
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

// ---- Catalogue (/koleksi) ----

export interface ResolvedCatalogue {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Shown when a visitor's filters match nothing. */
  emptyMessage: string;
}

export function resolveCatalogue(
  doc: Record<string, unknown> | null,
  locale: Locale,
  t: Translation
): ResolvedCatalogue {
  const pick = (idKey: string, enKey: string, fallback: string) =>
    pickLocalized(doc, locale, idKey, enKey, fallback);
  const c = t.catalogV3;
  return {
    eyebrow: pick('eyebrow', 'eyebrowEn', c.eyebrow),
    title: pick('title', 'titleEn', c.title),
    subtitle: pick('subtitle', 'subtitleEn', c.subtitle),
    emptyMessage: pick('emptyMessage', 'emptyMessageEn', c.noResults),
  };
}

// ---- Bespoke (Custom Order) ----

export interface ResolvedBespoke {
  heroEyebrow: string;
  heroTitle1: string;
  heroTitle2: string;
  heroIntro: string;
  heroIntroRich: PortableTextBlock[] | null;
  heroCta: string;
  heroImage: ResolvedImage | null;
  processEyebrow: string;
  processTitle: string;
  /** Drag-reorderable; falls back to the four legacy numbered step fields. */
  steps: { title: string; description: string }[];
  formEyebrow: string;
  formTitle: string;
  formSub: string;
  /** The enquiry-section photo, which previously had no field at all. */
  formImage: ResolvedImage | null;
  /** Owner-editable dropdown choices on the booking form. */
  typeOptions: string[];
  budgetOptions: string[];
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

  const arraySteps = resolveList(
    doc,
    'steps',
    locale,
    (_item, p) => ({ title: p('title', 'titleEn'), description: p('body', 'bodyEn') }),
    (step) => Boolean(step.title)
  );
  const steps = arraySteps.length
    ? arraySteps
    : [0, 1, 2, 3].map((i) => ({
        title: pick(`step${i + 1}Title`, `step${i + 1}TitleEn`, stepDefaults[i]?.title ?? ''),
        description: pick(`step${i + 1}Body`, `step${i + 1}BodyEn`, stepDefaults[i]?.description ?? ''),
      }));

  const options = (key: string, fallback: readonly string[]): string[] => {
    const chosen = resolveList(
      doc,
      key,
      locale,
      (_item, p) => p('label', 'labelEn'),
      (label) => Boolean(label)
    );
    return chosen.length ? chosen : [...fallback];
  };

  return {
    heroEyebrow: pick('heroEyebrow', 'heroEyebrowEn', b.eyebrow),
    heroTitle1: pick('heroTitle1', 'heroTitle1En', b.title1),
    heroTitle2: pick('heroTitle2', 'heroTitle2En', b.title2),
    heroIntro: pick('heroIntro', 'heroIntroEn', b.intro),
    heroIntroRich: pickRichText(doc, 'heroIntroRich', locale),
    heroCta: pick('heroCta', 'heroCtaEn', b.heroCta),
    heroImage: pickImage(doc, 'heroImage', locale, 1200, b.heroImageAlt),
    processEyebrow: pick('processEyebrow', 'processEyebrowEn', b.processEyebrow),
    processTitle: pick('processTitle', 'processTitleEn', b.processTitle),
    steps,
    formEyebrow: pick('formEyebrow', 'formEyebrowEn', b.formEyebrow),
    formTitle: pick('formTitle', 'formTitleEn', b.formTitle),
    formSub: pick('formSub', 'formSubEn', b.formSub),
    formImage: pickImage(doc, 'formImage', locale, 800, b.formImageAlt, 'portrait'),
    typeOptions: options('typeOptions', b.typeOptions),
    budgetOptions: options('budgetOptions', b.budgetOptions),
  };
}
