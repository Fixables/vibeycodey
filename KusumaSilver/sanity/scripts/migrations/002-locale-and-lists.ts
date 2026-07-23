/**
 * Migration 002 — convert the page documents to the new field shapes.
 *
 * TWO CHANGES, ONE PASS
 *
 * 1. Bilingual fields. `heroTitle` + `heroTitleEn` (two separate strings) become
 *    a single `heroTitle: { id, en }`. The Studio now shows one field per piece
 *    of copy instead of two, roughly halving the field count on every page.
 *
 * 2. Numbered field sets become lists. `step1Title`…`step4Body` become a `steps`
 *    array the owner can drag, extend and shorten; likewise `value1..3` and the
 *    three heritage stats.
 *
 * SAFETY
 * The website reads BOTH shapes (see `pickLocalized` and the array fallbacks in
 * lib/home-content.ts), so the site renders correctly before, during and after
 * this runs. The old fields are left in place rather than deleted — this
 * migration only adds. A follow-up commit can remove them once the new shape has
 * been live for a while.
 *
 *   npx tsx sanity/scripts/migrations/002-locale-and-lists.ts           # dry run
 *   npx tsx sanity/scripts/migrations/002-locale-and-lists.ts --apply   # write
 *
 * Idempotent: a field that already holds the new shape is left untouched.
 */
import { createClient, type SanityDocument } from '@sanity/client';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import { id as idCopy } from '../../../lib/translations/id';
import { en as enCopy } from '../../../lib/translations/en';

dotenv.config({ path: '.env.local' });

const apply = process.argv.includes('--apply');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

/** Fields to fold into `{ id, en }`, per document type. */
const LOCALE_FIELDS: Record<string, string[]> = {
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

interface Change {
  field: string;
  note: string;
}

function isLocaleObject(value: unknown): boolean {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value) && ('id' in (value as object) || 'en' in (value as object));
}

/** Fold `foo` + `fooEn` into `foo: { id, en }`. */
function foldLocaleFields(doc: SanityDocument, fields: string[]): { patch: Record<string, unknown>; changes: Change[] } {
  const patch: Record<string, unknown> = {};
  const changes: Change[] = [];

  for (const field of fields) {
    const current = doc[field];
    if (isLocaleObject(current)) continue; // already migrated
    const indonesian = typeof current === 'string' ? current : undefined;
    const english = typeof doc[`${field}En`] === 'string' ? (doc[`${field}En`] as string) : undefined;
    if (indonesian === undefined && english === undefined) continue;

    patch[field] = { _type: 'localeString', ...(indonesian ? { id: indonesian } : {}), ...(english ? { en: english } : {}) };
    changes.push({ field, note: `"${(indonesian ?? english ?? '').slice(0, 40)}…"` });
  }

  return { patch, changes };
}

const localeValue = (id?: unknown, en?: unknown) => ({
  _type: 'localeString',
  ...(typeof id === 'string' && id ? { id } : {}),
  ...(typeof en === 'string' && en ? { en } : {}),
});

const withKey = <T extends object>(item: T) => ({ _key: randomUUID().slice(0, 12), ...item });

/** Build the repeatable lists from the old numbered fields. */
function buildLists(doc: SanityDocument): { patch: Record<string, unknown>; changes: Change[] } {
  const patch: Record<string, unknown> = {};
  const changes: Change[] = [];

  if (doc._type === 'homePage' && !Array.isArray(doc.stats)) {
    // The big numbers (925, 3, 100%) were never stored in Sanity — only the
    // labels were, and the figures came from the built-in copy. Seed them from
    // that copy so the owner ends up with a complete, editable list showing
    // exactly what the site already displays, rather than half a list.
    const stats = [
      {
        value: doc.statSilverValue ?? idCopy.homeV3.statSilverValue,
        id: doc.statSilver ?? idCopy.homeV3.statSilver,
        en: doc.statSilverEn ?? enCopy.homeV3.statSilver,
      },
      {
        value: doc.statGenValue ?? idCopy.homeV3.statGenValue,
        id: doc.statGen ?? idCopy.homeV3.statGen,
        en: doc.statGenEn ?? enCopy.homeV3.statGen,
      },
      {
        value: doc.statHandValue ?? idCopy.homeV3.statHandValue,
        id: doc.statHand ?? idCopy.homeV3.statHand,
        en: doc.statHandEn ?? enCopy.homeV3.statHand,
      },
    ]
      .filter((stat) => typeof stat.value === 'string' && stat.value)
      .map((stat) => withKey({ _type: 'heritageStat', value: stat.value, label: localeValue(stat.id, stat.en) }));
    if (stats.length) {
      patch.stats = stats;
      changes.push({ field: 'stats', note: `${stats.length} figures` });
    }
  }

  if (doc._type === 'aboutPage') {
    if (!Array.isArray(doc.values)) {
      const values = [1, 2, 3]
        .map((n) => ({
          head: localeValue(doc[`value${n}Head`], doc[`value${n}HeadEn`]),
          body: localeValue(doc[`value${n}Body`], doc[`value${n}BodyEn`]),
        }))
        .filter((value) => value.head.id || value.head.en)
        .map((value) => withKey({ _type: 'storyValue', ...value }));
      if (values.length) {
        patch.values = values;
        changes.push({ field: 'values', note: `${values.length} values` });
      }
    }
    if (!Array.isArray(doc.gallery)) {
      const gallery = [doc.galleryImage1, doc.galleryImage2]
        .filter((image) => image && typeof image === 'object')
        .map((image) => withKey({ ...(image as object), _type: 'galleryPhoto', shape: 'square' }));
      if (gallery.length) {
        patch.gallery = gallery;
        changes.push({ field: 'gallery', note: `${gallery.length} photos` });
      }
    }
  }

  if (doc._type === 'bespokePage' && !Array.isArray(doc.steps)) {
    const steps = [1, 2, 3, 4]
      .map((n) => ({
        title: localeValue(doc[`step${n}Title`], doc[`step${n}TitleEn`]),
        body: localeValue(doc[`step${n}Body`], doc[`step${n}BodyEn`]),
      }))
      .filter((step) => step.title.id || step.title.en)
      .map((step) => withKey({ _type: 'processStep', ...step }));
    if (steps.length) {
      patch.steps = steps;
      changes.push({ field: 'steps', note: `${steps.length} steps` });
    }
  }

  return { patch, changes };
}

async function main() {
  let touched = 0;

  for (const [type, fields] of Object.entries(LOCALE_FIELDS)) {
    const doc = await client.fetch<SanityDocument | null>(`*[_type == $type && _id == $type][0]`, { type });
    if (!doc) {
      console.log(`\n${type}: no document yet — nothing to migrate.`);
      continue;
    }

    const locale = foldLocaleFields(doc, fields);
    const lists = buildLists(doc);
    const patch = { ...locale.patch, ...lists.patch };
    const changes = [...locale.changes, ...lists.changes];

    if (changes.length === 0) {
      console.log(`\n${type}: already migrated.`);
      continue;
    }

    console.log(`\n${type}: ${changes.length} field(s) to convert`);
    for (const change of changes) console.log(`  ${change.field.padEnd(18)} ${change.note}`);

    if (apply) {
      await client.patch(doc._id).set(patch).commit();
      touched += 1;
      console.log(`  -> written`);
    }
  }

  if (!apply) {
    console.log('\nDRY RUN — nothing written. Re-run with --apply to perform the migration.');
    console.log('The website reads both the old and the new shape, so it stays correct either way.');
  } else {
    console.log(`\nDone. ${touched} document(s) updated. The old fields were left in place as a safety net.`);
  }
}

main().catch((error) => {
  console.error('FAILED:', error.message);
  process.exit(1);
});
