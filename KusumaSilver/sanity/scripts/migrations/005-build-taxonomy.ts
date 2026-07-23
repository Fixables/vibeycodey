/**
 * Migration 005 — turn the free-text gemstone / material / size fields into
 * proper lists, and link each piece to them.
 *
 * WHY
 * `stone` was one text box holding "Amethyst, Garnet, Peridot, Citrine, and Pink
 * Zirconia". The catalogue filter treated that whole sentence as ONE gemstone,
 * so the Gemstone dropdown offered two nonsense options instead of eight real
 * stones. Sizes had the same shape and so could not be filtered at all.
 *
 * WHAT IT DOES
 *  1. Splits every free-text value into individual terms (commas, "and", "&").
 *  2. Creates one Gemstone / Material / Size document per distinct term,
 *     matching case-insensitively so "Perak 925" and "perak 925" do not become
 *     two entries.
 *  3. Links each piece to the terms it uses.
 *
 * The old text fields are LEFT IN PLACE — the site reads them as a fallback for
 * anything not yet linked, so the catalogue is correct throughout. Migration 006
 * can drop them once this has been verified.
 *
 *   npx tsx sanity/scripts/migrations/005-build-taxonomy.ts           # dry run
 *   npx tsx sanity/scripts/migrations/005-build-taxonomy.ts --apply   # write
 *
 * Idempotent: terms are created with deterministic ids, so re-running reuses
 * the existing documents instead of duplicating them.
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

/** Split a free-text list the way the owner actually wrote them. */
function splitList(value: unknown): string[] {
  if (typeof value !== 'string') return [];
  return value
    .split(/,|\band\b|&/gi)
    .map((s) => s.trim())
    .filter(Boolean);
}

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Deterministic id, so re-running the migration reuses the same documents. */
const docId = (type: string, label: string) => `${type}.${slugify(label)}`;

/** Ring sizes, necklace lengths and everything else are filtered separately. */
function sizeGroup(label: string): 'ring' | 'length' | 'other' {
  if (/\d\s*(cm|mm|inch|")/i.test(label)) return 'length';
  if (/^\d+(\.\d+)?$/.test(label)) return 'ring';
  return 'other';
}

/** Lexicographic ranks matching the ordering plugin's format. */
const rankFor = (index: number) => String(index * 1000).padStart(9, '0');

interface Term {
  label: string;
  group?: 'ring' | 'length' | 'other';
}

async function main() {
  const products = await client.fetch<SanityDocument[]>(
    `*[_type == "product" && !(_id in path("drafts.**"))]{
      _id, name, stone, material, sizes, gemstones, materialRef, sizeOptions
    }`
  );
  console.log(`Read ${products.length} piece(s).\n`);

  // Collect distinct terms, keyed case-insensitively so near-duplicates merge.
  const collect = (pick: (p: SanityDocument) => unknown) => {
    const byKey = new Map<string, Term>();
    for (const product of products) {
      for (const label of splitList(pick(product))) {
        const key = slugify(label);
        if (key && !byKey.has(key)) byKey.set(key, { label });
      }
    }
    return byKey;
  };

  const gemstones = collect((p) => p.stone);
  const materials = collect((p) => p.material);
  const sizes = collect((p) => p.sizes);
  for (const [, term] of sizes) term.group = sizeGroup(term.label);

  const report = (title: string, map: Map<string, Term>) => {
    console.log(`${title}: ${map.size}`);
    for (const [key, term] of map) {
      console.log(`  ${term.label}${term.group ? `  (${term.group})` : ''}   -> ${key}`);
    }
    console.log();
  };
  report('GEMSTONES', gemstones);
  report('MATERIALS', materials);
  report('SIZES', sizes);

  // Which pieces need linking, and to what.
  const links = products
    .map((product) => {
      const gemstoneIds = splitList(product.stone).map((l) => docId('gemstone', l));
      const materialId = splitList(product.material).map((l) => docId('material', l))[0];
      const sizeIds = splitList(product.sizes).map((l) => docId('size', l));

      // A piece is done when every dimension it actually has is linked. A
      // necklace with no stones must not count as "unlinked" forever just
      // because its gemstone list is legitimately empty.
      const needsGemstones =
        gemstoneIds.length > 0 && !(Array.isArray(product.gemstones) && product.gemstones.length > 0);
      const needsMaterial = Boolean(materialId) && !product.materialRef;
      const needsSizes =
        sizeIds.length > 0 && !(Array.isArray(product.sizeOptions) && product.sizeOptions.length > 0);

      return {
        id: product._id,
        name: (product.name as string)?.slice(0, 45),
        gemstones: gemstoneIds,
        materialRef: materialId,
        sizeOptions: sizeIds,
        pending: needsGemstones || needsMaterial || needsSizes,
      };
    })
    .filter((row) => row.pending);

  console.log(`PIECES TO LINK: ${links.length}`);
  for (const row of links) {
    console.log(
      `  ${row.name}\n    ${row.gemstones.length} stone(s), ${row.sizeOptions.length} size(s), material: ${row.materialRef ?? 'none'}`
    );
  }

  if (!apply) {
    console.log('\nDRY RUN — nothing written. Re-run with --apply.');
    console.log('The old text fields stay as a fallback, so the site is correct either way.');
    return;
  }

  // 1. Create the term documents. createIfNotExists never overwrites an entry
  //    the owner has since renamed by hand.
  let tx = client.transaction();
  const addTerms = (type: string, map: Map<string, Term>) => {
    [...map.entries()].forEach(([key, term], index) => {
      tx = tx.createIfNotExists({
        _id: `${type}.${key}`,
        _type: type,
        name: term.label,
        slug: { _type: 'slug', current: key },
        orderRank: rankFor(index),
        ...(term.group ? { group: term.group } : {}),
      });
    });
  };
  addTerms('gemstone', gemstones);
  addTerms('material', materials);
  addTerms('size', sizes);
  await tx.commit();
  console.log(`\nCreated/kept ${gemstones.size + materials.size + sizes.size} term document(s).`);

  // 2. Link the pieces.
  let linkTx = client.transaction();
  for (const row of links) {
    const patch: Record<string, unknown> = {};
    if (row.gemstones.length) {
      patch.gemstones = row.gemstones.map((id) => ({
        _type: 'reference',
        _ref: id,
        _key: id.replace(/[^a-z0-9]/gi, '').slice(0, 12),
      }));
    }
    if (row.materialRef) patch.materialRef = { _type: 'reference', _ref: row.materialRef };
    if (row.sizeOptions.length) {
      patch.sizeOptions = row.sizeOptions.map((id) => ({
        _type: 'reference',
        _ref: id,
        _key: id.replace(/[^a-z0-9]/gi, '').slice(0, 12),
      }));
    }
    if (Object.keys(patch).length) {
      linkTx = linkTx.patch(row.id, (p) => p.set(patch));
    }
  }
  await linkTx.commit();

  console.log(`Linked ${links.length} piece(s).`);
  console.log('\nDone. The catalogue filters now offer individual gemstones and sizes.');
}

main().catch((error) => {
  console.error('FAILED:', error.message);
  process.exit(1);
});
