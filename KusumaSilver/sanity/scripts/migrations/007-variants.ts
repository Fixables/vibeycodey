/**
 * Migration 007 — give every gemstone and size a price and a stock switch.
 *
 * WHY
 * The owner needs different prices per option ("the longer the chain, the more
 * expensive") and needs to mark individual options sold out. `gemstones` and
 * `sizeOptions` were plain lists of references with nowhere to record either.
 *
 * WHAT IT DOES
 * Copies each referenced option into `gemstoneVariants` / `sizeVariants`, in
 * the same order, with `priceAdjust: 0` and `inStock: true` — so every piece
 * keeps exactly the price and availability it has today. The owner then edits
 * the numbers that actually differ.
 *
 * The old lists are LEFT IN PLACE and the site reads them as a fallback, so the
 * catalogue is correct before, during and after.
 *
 *   npx tsx sanity/scripts/migrations/007-variants.ts           # dry run
 *   npx tsx sanity/scripts/migrations/007-variants.ts --apply   # write
 *
 * Idempotent: a piece that already has variants is skipped.
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

interface Ref {
  _ref: string;
}

/** Plain reference list -> variant objects, preserving order. */
function toVariants(refs: unknown, refField: 'gemstone' | 'size', variantType: string) {
  if (!Array.isArray(refs) || refs.length === 0) return null;
  return refs
    .map((row) => row as Ref | null)
    .filter((row): row is Ref => Boolean(row?._ref))
    .map((row) => ({
      _type: variantType,
      _key: key(),
      [refField]: { _type: 'reference', _ref: row._ref },
      priceAdjust: 0,
      inStock: true,
    }));
}

async function main() {
  const products = await client.fetch<SanityDocument[]>(
    `*[_type == "product" && !(_id in path("drafts.**"))]{
      _id, name, gemstones, sizeOptions, gemstoneVariants, sizeVariants
    }`
  );

  const pending: { id: string; name: string; patch: Record<string, unknown>; summary: string }[] = [];

  for (const product of products) {
    const patch: Record<string, unknown> = {};
    const parts: string[] = [];

    if (!Array.isArray(product.gemstoneVariants) || product.gemstoneVariants.length === 0) {
      const variants = toVariants(product.gemstones, 'gemstone', 'gemstoneVariant');
      if (variants) {
        patch.gemstoneVariants = variants;
        parts.push(`${variants.length} gemstone(s)`);
      }
    }
    if (!Array.isArray(product.sizeVariants) || product.sizeVariants.length === 0) {
      const variants = toVariants(product.sizeOptions, 'size', 'sizeVariant');
      if (variants) {
        patch.sizeVariants = variants;
        parts.push(`${variants.length} size(s)`);
      }
    }

    if (Object.keys(patch).length > 0) {
      pending.push({
        id: product._id,
        name: (product.name as string)?.slice(0, 50) ?? product._id,
        patch,
        summary: parts.join(', '),
      });
    }
  }

  console.log(`${pending.length} of ${products.length} piece(s) to convert\n`);
  for (const row of pending) console.log(`  ${row.name}\n    ${row.summary}`);

  if (!apply) {
    console.log('\nDRY RUN — nothing written. Re-run with --apply.');
    console.log('Every option starts at +0 and In stock, so no price or availability changes.');
    return;
  }

  if (pending.length > 0) {
    let tx = client.transaction();
    for (const row of pending) tx = tx.patch(row.id, (p) => p.set(row.patch));
    await tx.commit();
  }

  console.log(`\nDone. ${pending.length} piece(s) updated.`);
  console.log('Prices and availability are unchanged — the owner can now edit them per option.');
}

main().catch((error) => {
  console.error('FAILED:', error.message);
  process.exit(1);
});
