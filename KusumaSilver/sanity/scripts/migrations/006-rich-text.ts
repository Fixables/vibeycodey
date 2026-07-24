/**
 * Migration 006 — convert the plain-text paragraphs into formatted text.
 *
 * WHY
 * The owner asked how to put bullet points and numbering into a description —
 * for example to explain what a dragonfly motif means. Plain text boxes cannot
 * do that. The paragraph fields are now Portable Text with a deliberately small
 * toolbar: bold, italic, bullet list, numbered list, link. No headings or
 * colours, because the page design owns typography.
 *
 * WHAT IT DOES
 * Copies each existing paragraph into the new formatted field, one block per
 * blank-line-separated paragraph so existing line breaks survive.
 *
 * Only paragraphs are converted. Headings, eyebrows, button labels and one-line
 * subtitles stay plain strings on purpose — formatting inside a button label or
 * a page heading would break the layout, not improve it.
 *
 * The old fields are LEFT IN PLACE; the site renders the formatted version when
 * present and the plain one otherwise, so nothing changes visually until the
 * owner actually adds formatting.
 *
 *   npx tsx sanity/scripts/migrations/006-rich-text.ts           # dry run
 *   npx tsx sanity/scripts/migrations/006-rich-text.ts --apply   # write
 *
 * Idempotent: a field that already holds formatted text is skipped.
 */
import { createClient, type SanityDocument } from '@sanity/client';
import { randomUUID } from 'crypto';
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

const key = () => randomUUID().slice(0, 12);

/** Plain text -> Portable Text, one block per blank-line-separated paragraph. */
function toBlocks(text: unknown): Record<string, unknown>[] | null {
  if (typeof text !== 'string' || !text.trim()) return null;
  return text
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => ({
      _type: 'block',
      _key: key(),
      style: 'normal',
      markDefs: [],
      // Single newlines inside a paragraph become spaces; Portable Text models
      // a hard break as a separate block, and inventing them here would change
      // how the text reads.
      children: [{ _type: 'span', _key: key(), text: para.replace(/\s*\n\s*/g, ' '), marks: [] }],
    }));
}

const alreadyRich = (value: unknown) =>
  Boolean(value) &&
  typeof value === 'object' &&
  (Array.isArray((value as Record<string, unknown>).id) ||
    Array.isArray((value as Record<string, unknown>).en));

/**
 * Build a localeRichText value from an ID/EN pair. Handles both storage shapes:
 * the grouped `{id, en}` localeString and the older flat `foo` / `fooEn`.
 */
function localeBlocks(doc: SanityDocument, base: string): Record<string, unknown> | null {
  const grouped = doc[base] as { id?: string; en?: string } | string | undefined;
  const idText = typeof grouped === 'object' && grouped ? grouped.id : (grouped as string);
  const enText =
    typeof grouped === 'object' && grouped ? grouped.en : (doc[`${base}En`] as string | undefined);

  const id = toBlocks(idText);
  const en = toBlocks(enText);
  if (!id && !en) return null;
  return { _type: 'localeRichText', ...(id ? { id } : {}), ...(en ? { en } : {}) };
}

/** Page singleton -> [source field, new formatted field] */
const PAGE_FIELDS: Record<string, [string, string][]> = {
  homePage: [
    ['heroDesc', 'heroDescRich'],
    ['heritageBody', 'heritageBodyRich'],
  ],
  aboutPage: [
    ['body1', 'body1Rich'],
    ['body2', 'body2Rich'],
    ['body3', 'body3Rich'],
  ],
  bespokePage: [['heroIntro', 'heroIntroRich']],
};

async function main() {
  let written = 0;

  for (const [type, fields] of Object.entries(PAGE_FIELDS)) {
    const doc = await client.fetch<SanityDocument | null>(
      `*[_type == $type && _id == $type][0]`,
      { type }
    );
    if (!doc) {
      console.log(`\n${type}: no document — skipped.`);
      continue;
    }

    const patch: Record<string, unknown> = {};
    for (const [source, target] of fields) {
      if (alreadyRich(doc[target])) continue;
      const blocks = localeBlocks(doc, source);
      if (blocks) patch[target] = blocks;
    }

    if (Object.keys(patch).length === 0) {
      console.log(`\n${type}: nothing to convert.`);
      continue;
    }
    console.log(`\n${type}: ${Object.keys(patch).join(', ')}`);
    if (apply) {
      await client.patch(doc._id).set(patch).commit();
      written += 1;
      console.log('  -> written');
    }
  }

  // Products: description + descriptionEn -> body
  const products = await client.fetch<SanityDocument[]>(
    `*[_type == "product" && !(_id in path("drafts.**"))]{ _id, name, description, descriptionEn, body }`
  );
  const pending = products.filter((p) => !alreadyRich(p.body) && toBlocks(p.description));

  console.log(`\nPRODUCTS: ${pending.length} of ${products.length} to convert`);
  for (const product of pending) console.log(`  ${(product.name as string)?.slice(0, 55)}`);

  if (apply && pending.length) {
    let tx = client.transaction();
    for (const product of pending) {
      const blocks = localeBlocks(product, 'description');
      if (blocks) tx = tx.patch(product._id, (p) => p.set({ body: blocks }));
    }
    await tx.commit();
    written += pending.length;
    console.log('  -> written');
  }

  if (!apply) {
    console.log('\nDRY RUN — nothing written. Re-run with --apply.');
    console.log('The site renders the plain text until the formatted version exists, so it is safe either way.');
  } else {
    console.log(`\nDone. ${written} document(s) updated.`);
    console.log('The owner can now add bullet points and numbering to these paragraphs.');
  }
}

main().catch((error) => {
  console.error('FAILED:', error.message);
  process.exit(1);
});
