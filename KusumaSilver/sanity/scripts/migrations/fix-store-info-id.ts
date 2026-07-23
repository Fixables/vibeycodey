/**
 * Migration 001 — give the Store Info document its expected id.
 *
 * THE BUG
 * The Studio's "Informasi Toko" menu item opens the document with the fixed id
 * `storeInfo` (see sanity.config.ts). The document that actually exists in
 * production was created with an auto-generated id, so the Studio opens an
 * empty *new* document while the site reads `*[_type == "storeInfo"][0]` and
 * gets the real one. The owner's edits appear to do nothing — and once they
 * publish that empty second document, the site starts choosing arbitrarily
 * between two storeInfo documents.
 *
 * THE FIX
 * A document id cannot be changed in place, so: copy the real document to
 * `_id: 'storeInfo'`, verify every field survived, then delete the old one.
 * Nothing references storeInfo, so no reference repair is needed.
 *
 *   npx tsx sanity/scripts/migrations/fix-store-info-id.ts            # dry run
 *   npx tsx sanity/scripts/migrations/fix-store-info-id.ts --apply    # write
 *
 * Idempotent: re-running once the canonical document exists is a no-op.
 */
import { createClient, type SanityDocument } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const CANONICAL_ID = 'storeInfo';
const apply = process.argv.includes('--apply');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

/** Content fields only — ids and system timestamps are expected to differ. */
function contentOf(doc: SanityDocument): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(doc)) {
    if (key.startsWith('_')) continue;
    out[key] = value;
  }
  return out;
}

async function main() {
  const docs = await client.fetch<SanityDocument[]>(
    `*[_type == "storeInfo" && !(_id in path("drafts.**"))] | order(_createdAt asc)`
  );

  console.log(`Found ${docs.length} storeInfo document(s):`);
  for (const doc of docs) {
    const fieldCount = Object.keys(contentOf(doc)).length;
    console.log(`  ${doc._id}${doc._id === CANONICAL_ID ? '  (canonical)' : ''} — ${fieldCount} fields, name="${doc.name ?? ''}"`);
  }

  if (docs.length === 0) {
    console.log('\nNothing to do — no storeInfo document exists.');
    return;
  }

  const canonical = docs.find((d) => d._id === CANONICAL_ID);
  const strays = docs.filter((d) => d._id !== CANONICAL_ID);

  if (strays.length === 0) {
    console.log('\nAlready correct — the only storeInfo document has the canonical id.');
    return;
  }

  // Pick the richest stray as the source of truth: the real content is the
  // document with the most filled-in fields, not necessarily the oldest.
  const filledCount = (doc: SanityDocument) =>
    Object.values(contentOf(doc)).filter(
      (v) => v !== null && v !== undefined && !(typeof v === 'string' && !v.trim())
    ).length;

  const source = [...strays].sort((a, b) => filledCount(b) - filledCount(a))[0];

  if (canonical && filledCount(canonical) >= filledCount(source)) {
    console.log(
      `\nThe canonical document already has as much content (${filledCount(canonical)} fields) ` +
        `as the stray (${filledCount(source)}). Refusing to overwrite it automatically — ` +
        `merge by hand in the Studio, then delete: ${strays.map((d) => d._id).join(', ')}`
    );
    return;
  }

  console.log(`\nPlan:`);
  console.log(`  1. copy ${source._id} (${filledCount(source)} filled fields) -> ${CANONICAL_ID}`);
  console.log(`  2. verify every content field matches`);
  console.log(`  3. delete ${strays.map((d) => d._id).join(', ')}`);
  console.log(`\nFields to carry over: ${Object.keys(contentOf(source)).sort().join(', ')}`);

  if (!apply) {
    console.log('\nDRY RUN — nothing written. Re-run with --apply to perform the migration.');
    return;
  }

  const next = { ...contentOf(source), _id: CANONICAL_ID, _type: 'storeInfo' };
  await client.createOrReplace(next as SanityDocument);
  console.log(`\nWrote ${CANONICAL_ID}.`);

  // Verify before deleting anything — a failed copy must not lose the original.
  const written = await client.fetch<SanityDocument | null>(`*[_id == $id][0]`, { id: CANONICAL_ID });
  if (!written) throw new Error('Verification failed: canonical document not found after write.');

  const expected = contentOf(source);
  const actual = contentOf(written);
  const mismatched = Object.keys(expected).filter(
    (key) => JSON.stringify(expected[key]) !== JSON.stringify(actual[key])
  );
  if (mismatched.length > 0) {
    throw new Error(
      `Verification failed: ${mismatched.join(', ')} did not survive the copy. ` +
        `The original documents were NOT deleted — inspect and retry.`
    );
  }
  console.log(`Verified ${Object.keys(expected).length} fields.`);

  for (const stray of strays) {
    await client.delete(stray._id);
    console.log(`Deleted ${stray._id}.`);
  }

  console.log('\nDone. "Informasi Toko" in the Studio now opens the document the site reads.');
}

main().catch((error) => {
  console.error('FAILED:', error.message);
  process.exit(1);
});
