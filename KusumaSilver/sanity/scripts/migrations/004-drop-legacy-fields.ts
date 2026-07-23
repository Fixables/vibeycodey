/**
 * Migration 004 — remove the legacy fields left behind by migration 002.
 *
 * WHY
 * 002 converted `heroTitle` + `heroTitleEn` into `heroTitle: {id, en}`, and the
 * numbered `step1..4` / `value1..3` / `stat*` sets into arrays — but deliberately
 * left the originals in place as a safety net while the new shape was verified.
 * The Studio now flags them as "Unknown fields found", which is noise for the
 * owner, so this removes them.
 *
 * SAFETY
 * A legacy field is only dropped once its replacement is confirmed to hold the
 * content. If anything is missing the document is skipped and reported, so a
 * half-migrated document can never be stripped.
 *
 *   npx tsx sanity/scripts/migrations/004-drop-legacy-fields.ts           # dry run
 *   npx tsx sanity/scripts/migrations/004-drop-legacy-fields.ts --apply   # write
 *
 * Run 002 first. Idempotent: documents already cleaned report "nothing to drop".
 */
import { createClient, type SanityDocument } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const apply = process.argv.includes('--apply');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

/** Base names whose `<name>` is now a localeString and `<name>En` is obsolete. */
const LOCALE_BASES: Record<string, string[]> = {
  homePage: [
    'heroEyebrow', 'heroTitle1', 'heroTitle2', 'heroDesc', 'heroCta1', 'heroCta2',
    'catalogueHead', 'heritageEyebrow', 'heritageTitle', 'heritageBody',
    'manifestoQuote', 'manifestoAttr',
  ],
  aboutPage: [
    'heroEyebrow', 'heroTitle', 'lede', 'body1', 'body2', 'body3', 'ctaTitle',
    'ctaCatalogue', 'ctaBespoke',
  ],
  bespokePage: [
    'heroEyebrow', 'heroTitle1', 'heroTitle2', 'heroIntro', 'heroCta',
    'processEyebrow', 'processTitle', 'formEyebrow', 'formTitle', 'formSub',
  ],
  contactPage: ['eyebrow', 'title', 'subtitle', 'formTitle'],
  cataloguePage: ['eyebrow', 'title', 'subtitle', 'emptyMessage'],
  storeInfo: ['wordmarkSub', 'promoBar', 'footerBlurb', 'copyright'],
};

/** Fields replaced by an array, and the array that must exist first. */
const LIST_REPLACEMENTS: Record<string, { arrayField: string; legacy: string[] }[]> = {
  homePage: [
    {
      arrayField: 'stats',
      legacy: [
        'statSilverValue', 'statSilver', 'statSilverEn',
        'statGenValue', 'statGen', 'statGenEn',
        'statHandValue', 'statHand', 'statHandEn',
      ],
    },
  ],
  aboutPage: [
    {
      arrayField: 'values',
      legacy: [1, 2, 3].flatMap((n) => [
        `value${n}Head`, `value${n}HeadEn`, `value${n}Body`, `value${n}BodyEn`,
      ]),
    },
    { arrayField: 'gallery', legacy: ['galleryImage1', 'galleryImage2'] },
  ],
  bespokePage: [
    {
      arrayField: 'steps',
      legacy: [1, 2, 3, 4].flatMap((n) => [
        `step${n}Title`, `step${n}TitleEn`, `step${n}Body`, `step${n}BodyEn`,
      ]),
    },
  ],
};

const isLocaleObject = (v: unknown) =>
  Boolean(v) && typeof v === 'object' && !Array.isArray(v) && ('id' in (v as object) || 'en' in (v as object));

async function main() {
  let touched = 0;

  for (const type of Object.keys(LOCALE_BASES)) {
    const doc = await client.fetch<SanityDocument | null>(
      `*[_type == $type && _id == $type][0]`,
      { type }
    );
    if (!doc) {
      console.log(`\n${type}: no document — skipped.`);
      continue;
    }

    const drop: string[] = [];
    const blocked: string[] = [];

    // 1. The `<name>En` twins, safe once `<name>` is a localeString.
    for (const base of LOCALE_BASES[type]) {
      const legacy = `${base}En`;
      if (doc[legacy] === undefined) continue;
      if (isLocaleObject(doc[base])) {
        drop.push(legacy);
      } else {
        blocked.push(`${legacy} (${base} is not yet a localeString)`);
      }
    }

    // 2. Numbered sets, safe once the replacement array has content.
    for (const { arrayField, legacy } of LIST_REPLACEMENTS[type] ?? []) {
      const present = legacy.filter((field) => doc[field] !== undefined);
      if (present.length === 0) continue;
      if (Array.isArray(doc[arrayField]) && (doc[arrayField] as unknown[]).length > 0) {
        drop.push(...present);
      } else {
        blocked.push(`${present.length} ${arrayField} field(s) — '${arrayField}' is empty`);
      }
    }

    if (blocked.length) {
      console.log(`\n${type}: NOT SAFE TO CLEAN — run migration 002 first.`);
      for (const reason of blocked) console.log(`  blocked: ${reason}`);
      continue;
    }
    if (drop.length === 0) {
      console.log(`\n${type}: nothing to drop — already clean.`);
      continue;
    }

    console.log(`\n${type}: ${drop.length} legacy field(s) to remove`);
    console.log(`  ${drop.join(', ')}`);

    if (apply) {
      await client.patch(doc._id).unset(drop).commit();
      touched += 1;
      console.log('  -> removed');
    }
  }

  if (!apply) {
    console.log('\nDRY RUN — nothing written. Re-run with --apply to remove them.');
  } else {
    console.log(`\nDone. ${touched} document(s) cleaned.`);
    console.log('The Studio should no longer report "Unknown fields found".');
  }
}

main().catch((error) => {
  console.error('FAILED:', error.message);
  process.exit(1);
});
