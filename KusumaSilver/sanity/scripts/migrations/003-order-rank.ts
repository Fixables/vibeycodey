/**
 * Migration 003 — seed the drag-and-drop ordering.
 *
 * Categories and jewellery pieces are now ordered by dragging them in the
 * Studio, which stores the position in a hidden `orderRank` field. Documents
 * that have never been dragged have no rank, so without this they would all sort
 * together and the order would look arbitrary.
 *
 * Existing order is preserved:
 *  - categories keep the sequence from their old "menu order" number,
 *  - pieces start in the order they were created (newest first), which is what
 *    the catalogue showed before.
 *
 *   npx tsx sanity/scripts/migrations/003-order-rank.ts           # dry run
 *   npx tsx sanity/scripts/migrations/003-order-rank.ts --apply   # write
 *
 * Idempotent: documents that already have a rank are skipped, so re-running it
 * will never disturb an order the owner has since set by hand.
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

/**
 * Lexicographic ranks, mirroring the format the plugin itself writes so that
 * dragging in the Studio continues to work from these starting positions.
 * Padding keeps them sortable as plain strings and leaves room to insert
 * between any two entries later.
 */
function rankFor(index: number): string {
  return String(index * 1000).padStart(9, '0');
}

async function seed(type: 'category' | 'product', orderBy: string) {
  const docs = await client.fetch<SanityDocument[]>(
    `*[_type == $type && !(_id in path("drafts.**"))] | order(${orderBy}) { _id, name, orderRank }`,
    { type }
  );

  const unranked = docs.filter((doc) => !doc.orderRank);
  console.log(`\n${type}: ${docs.length} document(s), ${unranked.length} without a position`);

  if (unranked.length === 0) {
    console.log('  already ordered — nothing to do.');
    return;
  }

  // Rank every document, not just the unranked ones, so the resulting sequence
  // matches the order shown above rather than interleaving oddly.
  docs.forEach((doc, index) => {
    console.log(`  ${String(index + 1).padStart(2)}. ${rankFor(index)}  ${doc.name ?? doc._id}`);
  });

  if (!apply) return;

  let batch = client.transaction();
  docs.forEach((doc, index) => {
    batch = batch.patch(doc._id, (patch) => patch.set({ orderRank: rankFor(index) }));
  });
  await batch.commit();
  console.log(`  -> wrote ${docs.length} positions`);
}

async function main() {
  // Categories keep their old manual "menu order"; pieces keep newest-first.
  await seed('category', 'order asc, _createdAt asc');
  await seed('product', '_createdAt desc');

  if (!apply) {
    console.log('\nDRY RUN — nothing written. Re-run with --apply to seed the order.');
  } else {
    console.log('\nDone. Categories and pieces can now be dragged into order in the Studio.');
  }
}

main().catch((error) => {
  console.error('FAILED:', error.message);
  process.exit(1);
});
