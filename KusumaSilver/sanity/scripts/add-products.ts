import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

/**
 * Adds a set of placeholder products so the catalogue and home strip look
 * populated. These are realistic stand-ins — the owner can edit prices,
 * photos, and copy (or delete them) in the Studio at any time.
 */
const products = [
  {
    name: 'Anting Bulan Perak',
    nameEn: 'Silver Moon Earrings',
    slug: 'anting-bulan-perak',
    categorySlug: 'anting',
    price: 320000,
    description: 'Anting perak 925 berbentuk bulan sabit, ringan dan elegan untuk sehari-hari.',
    descriptionEn: 'Crescent-moon 925 silver earrings — light and elegant for everyday wear.',
    material: 'Perak 925',
    craftingTime: '3–5 hari kerja',
    featured: true,
  },
  {
    name: 'Liontin Barong',
    nameEn: 'Barong Pendant',
    slug: 'liontin-barong',
    categorySlug: 'liontin',
    price: 390000,
    description: 'Liontin perak 925 dengan motif Barong, simbol pelindung khas Bali.',
    descriptionEn: 'A 925 silver pendant with the Barong motif, Bali’s guardian symbol.',
    material: 'Perak 925',
    craftingTime: '4–6 hari kerja',
    featured: true,
  },
  {
    name: 'Cincin Sulur Melati',
    nameEn: 'Jasmine Vine Ring',
    slug: 'cincin-sulur-melati',
    categorySlug: 'cincin',
    price: 410000,
    description: 'Cincin perak 925 dengan ukiran sulur bunga melati yang halus.',
    descriptionEn: 'A 925 silver ring with a delicate jasmine-vine engraving.',
    material: 'Perak 925',
    sizes: '6, 7, 8, 9',
    craftingTime: '3–5 hari kerja',
    isCustomizable: true,
    featured: true,
  },
  {
    name: 'Kalung Rantai Bali',
    nameEn: 'Balinese Chain Necklace',
    slug: 'kalung-rantai-bali',
    categorySlug: 'kalung',
    price: 520000,
    description: 'Kalung perak 925 dengan rantai tenun tangan bergaya klasik Bali.',
    descriptionEn: 'A 925 silver necklace with a hand-woven chain in classic Balinese style.',
    material: 'Perak 925',
    craftingTime: '5–7 hari kerja',
    featured: true,
  },
  {
    name: 'Gelang Ukir Naga',
    nameEn: 'Dragon Carved Cuff',
    slug: 'gelang-ukir-naga',
    categorySlug: 'gelang',
    price: 480000,
    description: 'Gelang kaku perak 925 dengan ukiran naga, tebal dan penuh karakter.',
    descriptionEn: 'A weighty 925 silver cuff with a carved dragon motif, full of character.',
    material: 'Perak 925',
    sizes: 'S, M, L',
    craftingTime: '5–7 hari kerja',
    featured: true,
  },
  {
    name: 'Anting Jepun',
    nameEn: 'Frangipani Earrings',
    slug: 'anting-jepun',
    categorySlug: 'anting',
    price: 300000,
    description: 'Anting perak 925 berbentuk bunga jepun (kamboja), ikon bunga Bali.',
    descriptionEn: 'Frangipani-blossom 925 silver earrings — Bali’s signature flower.',
    material: 'Perak 925',
    craftingTime: '3–5 hari kerja',
    featured: true,
  },
];

async function run() {
  console.log('🌱 Adding placeholder products...');
  for (const p of products) {
    const existing = await client.fetch(`*[_type == "product" && slug.current == $slug][0]._id`, {
      slug: p.slug,
    });
    if (existing) {
      console.log(`  ⏭  exists: ${p.name}`);
      continue;
    }
    const catId = await client.fetch(`*[_type == "category" && slug.current == $slug][0]._id`, {
      slug: p.categorySlug,
    });
    if (!catId) {
      console.log(`  ⚠️  category missing: ${p.categorySlug} (skipping ${p.name})`);
      continue;
    }
    await client.create({
      _type: 'product',
      name: p.name,
      nameEn: p.nameEn,
      slug: { _type: 'slug', current: p.slug },
      category: { _type: 'reference', _ref: catId },
      price: p.price,
      description: p.description,
      descriptionEn: p.descriptionEn,
      material: p.material,
      ...(p.sizes ? { sizes: p.sizes } : {}),
      craftingTime: p.craftingTime,
      isCustomizable: p.isCustomizable ?? false,
      featured: p.featured ?? false,
      inStock: true,
    });
    console.log(`  ✅ created: ${p.name}`);
  }
  console.log('🎉 Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
