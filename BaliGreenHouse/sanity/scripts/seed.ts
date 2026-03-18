/**
 * Seed script — run once to populate Sanity with the static data
 * Usage: npx tsx sanity/scripts/seed.ts
 *
 * Requires env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN
 *
 * Data source: BGH - PANJER - FEB 2026.xlsx (Master sheet)
 */

import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

// ---------------------------------------------------------------------------
// Categories — mapped from Excel CATEGORY + SUB CATEGORY structure
// ---------------------------------------------------------------------------

const categories = [
  { slug: 'media-tanam',   name: 'Media Tanam',           description: 'Cocopeat, sekam, pasir malang, tanah, moss, pumice, dan media tanam lainnya', icon: '🌍', order: 1 },
  { slug: 'pupuk',         name: 'Pupuk',                  description: 'Pupuk NPK, pupuk organik, pupuk cair, vitamin tanaman, dan nutrisi hidroponik', icon: '🪣', order: 2 },
  { slug: 'pestisida',     name: 'Pestisida',              description: 'Insektisida, fungisida, herbisida, dan produk perlindungan tanaman', icon: '🛡️', order: 3 },
  { slug: 'pot-plastik',   name: 'Pot Plastik',            description: 'Pot GMP, pot anggrek, pot bonsai, tatakan, dan alas pot berbagai ukuran', icon: '🪴', order: 4 },
  { slug: 'polybag',       name: 'Polybag & Planter Bag',  description: 'Polybag berbagai ukuran, planter bag, dan compost bag', icon: '🌿', order: 5 },
  { slug: 'alat-berkebun', name: 'Alat Berkebun',          description: 'Gunting pruning, catok bonsai, sekop, gergaji, dan alat berkebun lainnya', icon: '✂️', order: 6 },
  { slug: 'kawat-bonsai',  name: 'Kawat Bonsai',           description: 'Kawat bonsai hitam, silver, dan cokelat berbagai nomor ukuran', icon: '🌳', order: 7 },
  { slug: 'perlengkapan',  name: 'Perlengkapan Kebun',     description: 'Sprayer, ajir, turus, paranet, polybag, name tag, dan perlengkapan berkebun', icon: '🔧', order: 8 },
];

// ---------------------------------------------------------------------------
// Helper — slugify barcode to URL-safe string
// ---------------------------------------------------------------------------
function s(barcode: string): string {
  return barcode.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

// ---------------------------------------------------------------------------
// Products — sourced from BGH - PANJER - FEB 2026.xlsx Master sheet
// Skipped: items with no sell price, internal entries (KARANG, ONGKIR),
//          exact duplicates (PL3156, PL3168, PS4026)
// ---------------------------------------------------------------------------

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  featured: boolean;
};

const products: ProductRow[] = [
  // ── MEDIA TANAM ────────────────────────────────────────────────────────────
  { id: 'MT2001', slug: s('MT2001'), name: 'Andam', category: 'media-tanam', price: 15000, unit: 'per bungkus', featured: false },
  { id: 'MT2002', slug: s('MT2002'), name: 'Andam 25kg', category: 'media-tanam', price: 50000, unit: 'per karung', featured: false },
  { id: 'MT2003', slug: s('MT2003'), name: 'Arang 5kg', category: 'media-tanam', price: 15000, unit: 'per karung', featured: false },
  { id: 'MT2004', slug: s('MT2004'), name: 'Coco Fiber', category: 'media-tanam', price: 13000, unit: 'per bungkus', featured: false },
  { id: 'MT2005', slug: s('MT2005'), name: 'Cocopeat Block Mini', category: 'media-tanam', price: 25000, unit: 'per blok', featured: true },
  { id: 'MT2006', slug: s('MT2006'), name: 'Cocopeat Fermentasi 10kg', category: 'media-tanam', price: 15000, unit: 'per karung', featured: false },
  { id: 'MT2007', slug: s('MT2007'), name: 'Cocopeat Fermentasi 5kg', category: 'media-tanam', price: 8000, unit: 'per karung', featured: false },
  { id: 'MT2008', slug: s('MT2008'), name: 'Cocopeat Non Fermentasi 10kg', category: 'media-tanam', price: 10000, unit: 'per karung', featured: false },
  { id: 'MT2009', slug: s('MT2009'), name: 'Cocopeat Non Fermentasi 5kg', category: 'media-tanam', price: 5000, unit: 'per karung', featured: false },
  { id: 'MT2010', slug: s('MT2010'), name: 'Daun Bambu', category: 'media-tanam', price: 12000, unit: 'per bungkus', featured: false },
  { id: 'MT2011', slug: s('MT2011'), name: 'Humus Bambu', category: 'media-tanam', price: 12000, unit: 'per bungkus', featured: false },
  { id: 'MT2012', slug: s('MT2012'), name: 'Humus Bambu 25kg', category: 'media-tanam', price: 50000, unit: 'per karung', featured: false },
  { id: 'MT2013', slug: s('MT2013'), name: 'Hydroton 1kg', category: 'media-tanam', price: 50000, unit: 'per kg', featured: false },
  { id: 'MT2014', slug: s('MT2014'), name: 'Hydroton 500gr', category: 'media-tanam', price: 25000, unit: 'per 500gr', featured: false },
  { id: 'MT2015', slug: s('MT2015'), name: 'Media Aroid Mix', category: 'media-tanam', price: 15000, unit: 'per bungkus', featured: false },
  { id: 'MT2016', slug: s('MT2016'), name: 'Moss Hitam 1 Kampil', category: 'media-tanam', price: 70000, unit: 'per kampil', featured: false },
  { id: 'MT2017', slug: s('MT2017'), name: 'Moss Hitam 10kg', category: 'media-tanam', price: 20000, unit: 'per karung', featured: false },
  { id: 'MT2018', slug: s('MT2018'), name: 'Moss Hitam 5kg', category: 'media-tanam', price: 12000, unit: 'per karung', featured: false },
  { id: 'MT2019', slug: s('MT2019'), name: 'Moss Sphagnum 200gr', category: 'media-tanam', price: 35000, unit: 'per 200gr', featured: true },
  { id: 'MT2020', slug: s('MT2020'), name: 'Pakis Cacah', category: 'media-tanam', price: 12000, unit: 'per bungkus', featured: false },
  { id: 'MT2021', slug: s('MT2021'), name: 'Papan Pakis', category: 'media-tanam', price: 6000, unit: 'per buah', featured: false },
  { id: 'MT2022', slug: s('MT2022'), name: 'Pasir Malang 10kg', category: 'media-tanam', price: 15000, unit: 'per karung', featured: false },
  { id: 'MT2023', slug: s('MT2023'), name: 'Pasir Malang 1kg', category: 'media-tanam', price: 3000, unit: 'per kg', featured: false },
  { id: 'MT2024', slug: s('MT2024'), name: 'Pasir Malang 25kg', category: 'media-tanam', price: 35000, unit: 'per karung', featured: false },
  { id: 'MT2025', slug: s('MT2025'), name: 'Pasir Malang Halus', category: 'media-tanam', price: 17000, unit: 'per karung', featured: false },
  { id: 'MT2026', slug: s('MT2026'), name: 'Pasir Malang Kasar 10kg', category: 'media-tanam', price: 15000, unit: 'per karung', featured: false },
  { id: 'MT2027', slug: s('MT2027'), name: 'Pasir Malang Merah Kasar', category: 'media-tanam', price: 20000, unit: 'per karung', featured: false },
  { id: 'MT2028', slug: s('MT2028'), name: 'Pasir Malang Merah Pasiran 5kg', category: 'media-tanam', price: 17000, unit: 'per karung', featured: false },
  { id: 'MT2029', slug: s('MT2029'), name: 'Pasir Malang Merah Sedang 5kg', category: 'media-tanam', price: 17000, unit: 'per karung', featured: false },
  { id: 'MT2030', slug: s('MT2030'), name: 'Perlite', category: 'media-tanam', price: 40000, unit: 'per bungkus', featured: true },
  { id: 'MT2031', slug: s('MT2031'), name: 'Pine Bark', category: 'media-tanam', price: 20000, unit: 'per bungkus', featured: false },
  { id: 'MT2032', slug: s('MT2032'), name: 'Pumice 1-2mm Pasiran /kg', category: 'media-tanam', price: 7500, unit: 'per kg', featured: false },
  { id: 'MT2033', slug: s('MT2033'), name: 'Pumice 5-7mm Sedang /kg', category: 'media-tanam', price: 7500, unit: 'per kg', featured: false },
  { id: 'MT2034', slug: s('MT2034'), name: 'Pumice / Batu Apung', category: 'media-tanam', price: 17000, unit: 'per bungkus', featured: false },
  { id: 'MT2035', slug: s('MT2035'), name: 'Pupuk Kambing Butiran', category: 'media-tanam', price: 15000, unit: 'per karung', featured: false },
  { id: 'MT2036', slug: s('MT2036'), name: 'Pupuk Kompos 10kg', category: 'media-tanam', price: 15000, unit: 'per karung', featured: false },
  { id: 'MT2037', slug: s('MT2037'), name: 'Pupuk Kompos 5kg', category: 'media-tanam', price: 10000, unit: 'per karung', featured: false },
  { id: 'MT2038', slug: s('MT2038'), name: 'Rock Wool 33cm', category: 'media-tanam', price: 38000, unit: 'per lembar', featured: false },
  { id: 'MT2039', slug: s('MT2039'), name: 'Sekam Bakar 10kg', category: 'media-tanam', price: 10000, unit: 'per karung', featured: true },
  { id: 'MT2040', slug: s('MT2040'), name: 'Sekam Bakar 25kg', category: 'media-tanam', price: 25000, unit: 'per karung', featured: false },
  { id: 'MT2041', slug: s('MT2041'), name: 'Sekam Bakar 5kg', category: 'media-tanam', price: 8000, unit: 'per karung', featured: false },
  { id: 'MT2042', slug: s('MT2042'), name: 'Sekam Fermentasi 10kg', category: 'media-tanam', price: 12000, unit: 'per karung', featured: false },
  { id: 'MT2043', slug: s('MT2043'), name: 'Sekam Fermentasi 5kg', category: 'media-tanam', price: 8000, unit: 'per karung', featured: false },
  { id: 'MT2044', slug: s('MT2044'), name: 'Sekam Mentah 10kg', category: 'media-tanam', price: 10000, unit: 'per karung', featured: false },
  { id: 'MT2045', slug: s('MT2045'), name: 'Sekam Mentah 25kg', category: 'media-tanam', price: 15000, unit: 'per karung', featured: false },
  { id: 'MT2046', slug: s('MT2046'), name: 'Sekam Mentah 5kg', category: 'media-tanam', price: 5000, unit: 'per karung', featured: false },
  { id: 'MT2047', slug: s('MT2047'), name: 'Tanah Murni 10kg', category: 'media-tanam', price: 10000, unit: 'per karung', featured: false },
  { id: 'MT2048', slug: s('MT2048'), name: 'Tanah Murni 1kg', category: 'media-tanam', price: 3000, unit: 'per kg', featured: false },
  { id: 'MT2049', slug: s('MT2049'), name: 'Tanah Subur 1/4', category: 'media-tanam', price: 3000, unit: 'per bungkus', featured: false },
  { id: 'MT2050', slug: s('MT2050'), name: 'Tanah Subur 10kg Bintang Tani', category: 'media-tanam', price: 10000, unit: 'per karung', featured: false },
  { id: 'MT2051', slug: s('MT2051'), name: 'Tanah Subur 10kg Simantri', category: 'media-tanam', price: 10000, unit: 'per karung', featured: false },
  { id: 'MT2052', slug: s('MT2052'), name: 'Tanah Subur 1kg Bintang Tani', category: 'media-tanam', price: 3000, unit: 'per kg', featured: false },
  { id: 'MT2053', slug: s('MT2053'), name: 'Tanah Subur 25kg Bintang Tani', category: 'media-tanam', price: 25000, unit: 'per karung', featured: false },

  // ── PERLENGKAPAN › CATOK ───────────────────────────────────────────────────
  { id: 'PL3001', slug: s('PL3001'), name: 'Catok Bonsai Import 21cm Coklat', category: 'alat-berkebun', price: 250000, unit: 'per buah', featured: false },
  { id: 'PL3002', slug: s('PL3002'), name: 'Catok Bonsai Import 21cm Miring', category: 'alat-berkebun', price: 265000, unit: 'per buah', featured: false },

  // ── PERLENGKAPAN › GUNTING (PL3003-PL3004 are catok by name) ─────────────
  { id: 'PL3003', slug: s('PL3003'), name: 'Catok Bonsai Import 21cm Hijau', category: 'alat-berkebun', price: 265000, unit: 'per buah', featured: false },
  { id: 'PL3004', slug: s('PL3004'), name: 'Catok Bonsai Lokal 21cm', category: 'alat-berkebun', price: 65000, unit: 'per buah', featured: false },
  { id: 'PL3005', slug: s('PL3005'), name: 'Gunting Dahan/Stek Fukuda', category: 'alat-berkebun', price: 85000, unit: 'per buah', featured: true },
  { id: 'PL3006', slug: s('PL3006'), name: 'Gunting Dahan/Stek Merah/Hijau', category: 'alat-berkebun', price: 20000, unit: 'per buah', featured: false },
  { id: 'PL3007', slug: s('PL3007'), name: 'Gunting Dahan/Stek Putih', category: 'alat-berkebun', price: 35000, unit: 'per buah', featured: false },
  { id: 'PL3008', slug: s('PL3008'), name: 'Gunting Dahan/Stek Wipro', category: 'alat-berkebun', price: 125000, unit: 'per buah', featured: false },
  { id: 'PL3009', slug: s('PL3009'), name: 'Gunting Pruning Hijau-Kuning 16cm', category: 'alat-berkebun', price: 45000, unit: 'per buah', featured: false },
  { id: 'PL3010', slug: s('PL3010'), name: 'Gunting Pruning Hijau-Kuning 21cm No.2110', category: 'alat-berkebun', price: 70000, unit: 'per buah', featured: false },
  { id: 'PL3011', slug: s('PL3011'), name: 'Gunting Pruning Import 12.5cm No.4104', category: 'alat-berkebun', price: 60000, unit: 'per buah', featured: false },
  { id: 'PL3012', slug: s('PL3012'), name: 'Gunting Pruning Import 15.3cm No.4103', category: 'alat-berkebun', price: 70000, unit: 'per buah', featured: false },
  { id: 'PL3013', slug: s('PL3013'), name: 'Gunting Pruning Import 17.5cm No.4102', category: 'alat-berkebun', price: 80000, unit: 'per buah', featured: false },
  { id: 'PL3014', slug: s('PL3014'), name: 'Gunting Pruning Import 19.5cm No.4101', category: 'alat-berkebun', price: 90000, unit: 'per buah', featured: false },
  { id: 'PL3015', slug: s('PL3015'), name: 'Gunting Pruning Import Melengkung 12cm 3009-W', category: 'alat-berkebun', price: 45000, unit: 'per buah', featured: false },
  { id: 'PL3016', slug: s('PL3016'), name: 'Gunting Pruning Lancip Furano Kuning', category: 'alat-berkebun', price: 35000, unit: 'per buah', featured: false },
  { id: 'PL3017', slug: s('PL3017'), name: 'Gunting Pruning Lancip Merah 19cm', category: 'alat-berkebun', price: 30000, unit: 'per buah', featured: false },
  { id: 'PL3018', slug: s('PL3018'), name: 'Gunting Pruning Lancip Merah 21cm', category: 'alat-berkebun', price: 35000, unit: 'per buah', featured: false },
  { id: 'PL3019', slug: s('PL3019'), name: 'Gunting Pruning Merah Hitam 21cm', category: 'alat-berkebun', price: 65000, unit: 'per buah', featured: false },
  { id: 'PL3020', slug: s('PL3020'), name: 'Gunting Rumput Gagang Kayu', category: 'alat-berkebun', price: 100000, unit: 'per buah', featured: false },
  { id: 'PL3021', slug: s('PL3021'), name: 'Gunting Rumput Gagang Plastik', category: 'alat-berkebun', price: 100000, unit: 'per buah', featured: false },
  { id: 'PL3022', slug: s('PL3022'), name: 'Gunting Stek Hitam Kuning', category: 'alat-berkebun', price: 65000, unit: 'per buah', featured: false },

  // ── PERLENGKAPAN › KAWAT ───────────────────────────────────────────────────
  { id: 'PL3023', slug: s('PL3023'), name: 'Kawat Bonsai Cokelat No.2', category: 'kawat-bonsai', price: 140000, unit: 'per roll', featured: false },
  { id: 'PL3024', slug: s('PL3024'), name: 'Kawat Bonsai Cokelat No.3', category: 'kawat-bonsai', price: 140000, unit: 'per roll', featured: false },
  { id: 'PL3025', slug: s('PL3025'), name: 'Kawat Bonsai Hitam No.1', category: 'kawat-bonsai', price: 140000, unit: 'per roll', featured: false },
  { id: 'PL3026', slug: s('PL3026'), name: 'Kawat Bonsai Hitam No.1 Eceran', category: 'kawat-bonsai', price: 750, unit: 'per meter', featured: false },
  { id: 'PL3027', slug: s('PL3027'), name: 'Kawat Bonsai Hitam No.2', category: 'kawat-bonsai', price: 140000, unit: 'per roll', featured: true },
  { id: 'PL3028', slug: s('PL3028'), name: 'Kawat Bonsai Hitam No.2 Eceran', category: 'kawat-bonsai', price: 2000, unit: 'per meter', featured: false },
  { id: 'PL3029', slug: s('PL3029'), name: 'Kawat Bonsai Hitam No.3', category: 'kawat-bonsai', price: 140000, unit: 'per roll', featured: false },
  { id: 'PL3030', slug: s('PL3030'), name: 'Kawat Bonsai Hitam No.3 Eceran', category: 'kawat-bonsai', price: 4500, unit: 'per meter', featured: false },
  { id: 'PL3031', slug: s('PL3031'), name: 'Kawat Bonsai Hitam No.4', category: 'kawat-bonsai', price: 140000, unit: 'per roll', featured: false },
  { id: 'PL3032', slug: s('PL3032'), name: 'Kawat Bonsai Hitam No.4 Eceran', category: 'kawat-bonsai', price: 7500, unit: 'per meter', featured: false },
  { id: 'PL3033', slug: s('PL3033'), name: 'Kawat Bonsai Hitam No.5', category: 'kawat-bonsai', price: 140000, unit: 'per roll', featured: false },
  { id: 'PL3034', slug: s('PL3034'), name: 'Kawat Bonsai Hitam No.5 Eceran', category: 'kawat-bonsai', price: 11500, unit: 'per meter', featured: false },
  { id: 'PL3035', slug: s('PL3035'), name: 'Kawat Bonsai Hitam No.6', category: 'kawat-bonsai', price: 140000, unit: 'per roll', featured: false },
  { id: 'PL3036', slug: s('PL3036'), name: 'Kawat Bonsai Hitam No.6 Eceran', category: 'kawat-bonsai', price: 13500, unit: 'per meter', featured: false },
  { id: 'PL3037', slug: s('PL3037'), name: 'Kawat Bonsai Silver No.1', category: 'kawat-bonsai', price: 95000, unit: 'per roll', featured: false },
  { id: 'PL3038', slug: s('PL3038'), name: 'Kawat Bonsai Silver No.1 Eceran', category: 'kawat-bonsai', price: 500, unit: 'per meter', featured: false },
  { id: 'PL3039', slug: s('PL3039'), name: 'Kawat Bonsai Silver No.1.5', category: 'kawat-bonsai', price: 95000, unit: 'per roll', featured: false },
  { id: 'PL3040', slug: s('PL3040'), name: 'Kawat Bonsai Silver No.1.5 Eceran', category: 'kawat-bonsai', price: 750, unit: 'per meter', featured: false },
  { id: 'PL3041', slug: s('PL3041'), name: 'Kawat Bonsai Silver No.2', category: 'kawat-bonsai', price: 95000, unit: 'per roll', featured: false },
  { id: 'PL3042', slug: s('PL3042'), name: 'Kawat Bonsai Silver No.2 Eceran', category: 'kawat-bonsai', price: 1500, unit: 'per meter', featured: false },
  { id: 'PL3043', slug: s('PL3043'), name: 'Kawat Bonsai Silver No.2.5', category: 'kawat-bonsai', price: 95000, unit: 'per roll', featured: false },
  { id: 'PL3044', slug: s('PL3044'), name: 'Kawat Bonsai Silver No.2.5 Eceran', category: 'kawat-bonsai', price: 2000, unit: 'per meter', featured: false },
  { id: 'PL3045', slug: s('PL3045'), name: 'Kawat Bonsai Silver No.3', category: 'kawat-bonsai', price: 95000, unit: 'per roll', featured: true },
  { id: 'PL3046', slug: s('PL3046'), name: 'Kawat Bonsai Silver No.3 Eceran', category: 'kawat-bonsai', price: 3000, unit: 'per meter', featured: false },
  { id: 'PL3047', slug: s('PL3047'), name: 'Kawat Bonsai Silver No.3.5', category: 'kawat-bonsai', price: 95000, unit: 'per roll', featured: false },
  { id: 'PL3048', slug: s('PL3048'), name: 'Kawat Bonsai Silver No.3.5 Eceran', category: 'kawat-bonsai', price: 4000, unit: 'per meter', featured: false },
  { id: 'PL3049', slug: s('PL3049'), name: 'Kawat Bonsai Silver No.4', category: 'kawat-bonsai', price: 95000, unit: 'per roll', featured: false },
  { id: 'PL3050', slug: s('PL3050'), name: 'Kawat Bonsai Silver No.4 Eceran', category: 'kawat-bonsai', price: 5000, unit: 'per meter', featured: false },
  { id: 'PL3051', slug: s('PL3051'), name: 'Kawat Bonsai Silver No.5', category: 'kawat-bonsai', price: 95000, unit: 'per roll', featured: false },
  { id: 'PL3052', slug: s('PL3052'), name: 'Kawat Bonsai Silver No.5 Eceran', category: 'kawat-bonsai', price: 9000, unit: 'per meter', featured: false },
  { id: 'PL3053', slug: s('PL3053'), name: 'Kawat Bonsai Silver No.6', category: 'kawat-bonsai', price: 95000, unit: 'per roll', featured: false },
  { id: 'PL3054', slug: s('PL3054'), name: 'Kawat Bonsai Silver No.6 Eceran', category: 'kawat-bonsai', price: 10000, unit: 'per meter', featured: false },

  // ── PERLENGKAPAN › PERLENGKAPAN LAIN ──────────────────────────────────────
  { id: 'PL3055', slug: s('PL3055'), name: 'Ajir 11x1500mm', category: 'perlengkapan', price: 13000, unit: 'per buah', featured: false },
  { id: 'PL3056', slug: s('PL3056'), name: 'Ajir 8x1200mm', category: 'perlengkapan', price: 9500, unit: 'per buah', featured: false },
  { id: 'PL3057', slug: s('PL3057'), name: 'Ajir 8x750mm', category: 'perlengkapan', price: 6000, unit: 'per buah', featured: false },
  { id: 'PL3058', slug: s('PL3058'), name: 'Ajir 8x900mm', category: 'perlengkapan', price: 7000, unit: 'per buah', featured: false },
  { id: 'PL3059', slug: s('PL3059'), name: 'Batu Alam Putih 34', category: 'perlengkapan', price: 65000, unit: 'per karung', featured: false },
  { id: 'PL3060', slug: s('PL3060'), name: 'Batu Putih Besar', category: 'perlengkapan', price: 5000, unit: 'per kg', featured: false },
  { id: 'PL3062', slug: s('PL3062'), name: 'Batu Putih Kecil 1/5', category: 'perlengkapan', price: 5000, unit: 'per bungkus', featured: false },
  { id: 'PL3063', slug: s('PL3063'), name: 'Benang Extra Besar', category: 'perlengkapan', price: 22000, unit: 'per gulung', featured: false },
  { id: 'PL3064', slug: s('PL3064'), name: 'Benang Extra Kecil', category: 'perlengkapan', price: 7000, unit: 'per gulung', featured: false },
  { id: 'PL3065', slug: s('PL3065'), name: 'Benang Jean Kecil Hitam 200y', category: 'perlengkapan', price: 6000, unit: 'per gulung', featured: false },
  { id: 'PL3066', slug: s('PL3066'), name: 'Bibit Bintang Asia', category: 'perlengkapan', price: 15000, unit: 'per buah', featured: false },
  { id: 'PL3067', slug: s('PL3067'), name: 'Bibit Hitam', category: 'perlengkapan', price: 10000, unit: 'per buah', featured: false },
  { id: 'PL3068', slug: s('PL3068'), name: 'Bibit Putih', category: 'perlengkapan', price: 5000, unit: 'per buah', featured: false },
  { id: 'PL3069', slug: s('PL3069'), name: 'DC 25x25', category: 'perlengkapan', price: 13000, unit: 'per buah', featured: false },
  { id: 'PL3070', slug: s('PL3070'), name: 'DC 33x33', category: 'perlengkapan', price: 17000, unit: 'per buah', featured: false },
  { id: 'PL3071', slug: s('PL3071'), name: 'DC 50x50', category: 'perlengkapan', price: 40000, unit: 'per buah', featured: false },
  { id: 'PL3072', slug: s('PL3072'), name: 'Garuk Hitam / Garpu', category: 'alat-berkebun', price: 25000, unit: 'per buah', featured: false },
  { id: 'PL3073', slug: s('PL3073'), name: 'Gergaji Bonsai Mini', category: 'alat-berkebun', price: 60000, unit: 'per buah', featured: true },
  { id: 'PL3075', slug: s('PL3075'), name: 'Kawat Gantung Pot 75cm', category: 'perlengkapan', price: 4000, unit: 'per buah', featured: false },
  { id: 'PL3076', slug: s('PL3076'), name: 'Keranjang Pupuk', category: 'perlengkapan', price: 1500, unit: 'per buah', featured: false },
  { id: 'PL3077', slug: s('PL3077'), name: 'Lime Sulfur', category: 'perlengkapan', price: 35000, unit: 'per botol', featured: false },
  { id: 'PL3078', slug: s('PL3078'), name: 'Name Tag Gantung', category: 'perlengkapan', price: 1000, unit: 'per buah', featured: false },
  { id: 'PL3079', slug: s('PL3079'), name: 'Name Tag Tanaman', category: 'perlengkapan', price: 1000, unit: 'per buah', featured: false },
  { id: 'PL3080', slug: s('PL3080'), name: 'Paranet 75%', category: 'perlengkapan', price: 15000, unit: 'per meter', featured: false },
  { id: 'PL3081', slug: s('PL3081'), name: 'Patil Besi', category: 'alat-berkebun', price: 37500, unit: 'per buah', featured: false },
  { id: 'PL3082', slug: s('PL3082'), name: 'Patil Kayu', category: 'alat-berkebun', price: 25000, unit: 'per buah', featured: false },
  { id: 'PL3083', slug: s('PL3083'), name: 'Pembungkus / Cover Buah', category: 'perlengkapan', price: 50000, unit: 'per pack', featured: false },
  { id: 'PL3084', slug: s('PL3084'), name: 'Plastik Grafting', category: 'perlengkapan', price: 13000, unit: 'per roll', featured: false },
  { id: 'PL3085', slug: s('PL3085'), name: 'Salep Kambium 100ml', category: 'perlengkapan', price: 30000, unit: 'per botol', featured: false },
  { id: 'PL3086', slug: s('PL3086'), name: 'Sekop Besi Kecil Hijau', category: 'alat-berkebun', price: 15000, unit: 'per buah', featured: false },
  { id: 'PL3087', slug: s('PL3087'), name: 'Sekop Besi Kecil Hitam', category: 'alat-berkebun', price: 25000, unit: 'per buah', featured: true },
  { id: 'PL3088', slug: s('PL3088'), name: 'Sekop Plastik Hitam', category: 'alat-berkebun', price: 12000, unit: 'per buah', featured: false },
  { id: 'PL3089', slug: s('PL3089'), name: 'Sprayer 1 Liter', category: 'perlengkapan', price: 35000, unit: 'per unit', featured: false },
  { id: 'PL3090', slug: s('PL3090'), name: 'Sprayer 2 Liter', category: 'perlengkapan', price: 43000, unit: 'per unit', featured: true },
  { id: 'PL3091', slug: s('PL3091'), name: 'Sprayer Jet Spray Asena 1000ml', category: 'perlengkapan', price: 16000, unit: 'per unit', featured: false },
  { id: 'PL3092', slug: s('PL3092'), name: 'Sprayer Jet Spray Asena 500ml', category: 'perlengkapan', price: 14000, unit: 'per unit', featured: false },
  { id: 'PL3093', slug: s('PL3093'), name: 'Trai 128', category: 'perlengkapan', price: 15000, unit: 'per buah', featured: false },
  { id: 'PL3094', slug: s('PL3094'), name: 'Trai 32', category: 'perlengkapan', price: 15000, unit: 'per buah', featured: false },
  { id: 'PL3095', slug: s('PL3095'), name: 'Trai 50', category: 'perlengkapan', price: 15000, unit: 'per buah', featured: false },
  { id: 'PL3096', slug: s('PL3096'), name: 'Tremer Bonsai', category: 'alat-berkebun', price: 55000, unit: 'per buah', featured: false },
  { id: 'PL3097', slug: s('PL3097'), name: 'Trichoderma 250gr', category: 'perlengkapan', price: 30000, unit: 'per 250gr', featured: false },
  { id: 'PL3098', slug: s('PL3098'), name: 'Turus 100cm', category: 'perlengkapan', price: 30000, unit: 'per buah', featured: false },
  { id: 'PL3099', slug: s('PL3099'), name: 'Turus 30cm', category: 'perlengkapan', price: 9000, unit: 'per buah', featured: false },

  // ── PERLENGKAPAN › POLYBAG ─────────────────────────────────────────────────
  { id: 'PL3100', slug: s('PL3100'), name: 'Compost Bag 80 Liter', category: 'polybag', price: 50000, unit: 'per buah', featured: false },
  { id: 'PL3101', slug: s('PL3101'), name: 'Planter Bag 28 Liter', category: 'polybag', price: 15000, unit: 'per buah', featured: false },
  { id: 'PL3102', slug: s('PL3102'), name: 'Planter Bag 35 Liter', category: 'polybag', price: 15000, unit: 'per buah', featured: true },
  { id: 'PL3103', slug: s('PL3103'), name: 'Planter Bag 50 Liter', category: 'polybag', price: 19000, unit: 'per buah', featured: false },
  { id: 'PL3104', slug: s('PL3104'), name: 'Planter Bag 75 Liter', category: 'polybag', price: 25000, unit: 'per buah', featured: false },
  { id: 'PL3105', slug: s('PL3105'), name: 'Polybag 12', category: 'polybag', price: 5000, unit: 'per 100 lembar', featured: false },
  { id: 'PL3106', slug: s('PL3106'), name: 'Polybag 12 Ball', category: 'polybag', price: 30000, unit: 'per ball', featured: false },
  { id: 'PL3107', slug: s('PL3107'), name: 'Polybag 18', category: 'polybag', price: 5000, unit: 'per 100 lembar', featured: false },
  { id: 'PL3108', slug: s('PL3108'), name: 'Polybag 18 Ball', category: 'polybag', price: 30000, unit: 'per ball', featured: true },
  { id: 'PL3109', slug: s('PL3109'), name: 'Polybag 20', category: 'polybag', price: 5000, unit: 'per 100 lembar', featured: false },
  { id: 'PL3110', slug: s('PL3110'), name: 'Polybag 20 Ball', category: 'polybag', price: 30000, unit: 'per ball', featured: false },
  { id: 'PL3111', slug: s('PL3111'), name: 'Polybag 25', category: 'polybag', price: 5000, unit: 'per 100 lembar', featured: false },
  { id: 'PL3112', slug: s('PL3112'), name: 'Polybag 25 Ball', category: 'polybag', price: 30000, unit: 'per ball', featured: false },
  { id: 'PL3113', slug: s('PL3113'), name: 'Polybag 30', category: 'polybag', price: 5000, unit: 'per 100 lembar', featured: false },
  { id: 'PL3114', slug: s('PL3114'), name: 'Polybag 30 Ball', category: 'polybag', price: 30000, unit: 'per ball', featured: false },
  { id: 'PL3115', slug: s('PL3115'), name: 'Polybag 40', category: 'polybag', price: 1000, unit: 'per lembar', featured: false },
  { id: 'PL3116', slug: s('PL3116'), name: 'Polybag 40 Ball', category: 'polybag', price: 30000, unit: 'per ball', featured: false },
  { id: 'PL3117', slug: s('PL3117'), name: 'Polybag 50', category: 'polybag', price: 2000, unit: 'per lembar', featured: false },
  { id: 'PL3118', slug: s('PL3118'), name: 'Polybag 50 Ball Isi 19', category: 'polybag', price: 30000, unit: 'per ball', featured: false },
  { id: 'PL3119', slug: s('PL3119'), name: 'Turus 60cm', category: 'perlengkapan', price: 15000, unit: 'per buah', featured: false },
  { id: 'PL3199', slug: s('PL3199'), name: 'Planter Bag 45 Liter', category: 'polybag', price: 18000, unit: 'per buah', featured: false },

  // ── PERLENGKAPAN › POT PLASTIK ─────────────────────────────────────────────
  { id: 'PL3120', slug: s('PL3120'), name: 'Alas Pot GBL 10 Hitam', category: 'pot-plastik', price: 2000, unit: 'per buah', featured: false },
  { id: 'PL3121', slug: s('PL3121'), name: 'Alas Pot GBL 12 Hitam', category: 'pot-plastik', price: 2000, unit: 'per buah', featured: false },
  { id: 'PL3122', slug: s('PL3122'), name: 'Alas Pot GBL 12 Putih', category: 'pot-plastik', price: 2500, unit: 'per buah', featured: false },
  { id: 'PL3127', slug: s('PL3127'), name: 'Pot Anggrek 12 Hitam', category: 'pot-plastik', price: 4000, unit: 'per buah', featured: false },
  { id: 'PL3128', slug: s('PL3128'), name: 'Pot Anggrek Hitam 16', category: 'pot-plastik', price: 5000, unit: 'per buah', featured: false },
  { id: 'PL3129', slug: s('PL3129'), name: 'Pot Anggrek Kotak 15', category: 'pot-plastik', price: 5000, unit: 'per buah', featured: false },
  { id: 'PL3130', slug: s('PL3130'), name: 'Pot Anggrek Vanda Hitam 10 Kotak', category: 'pot-plastik', price: 4000, unit: 'per buah', featured: false },
  { id: 'PL3132', slug: s('PL3132'), name: 'Pot Anggrek Vanda Hitam 15', category: 'pot-plastik', price: 5500, unit: 'per buah', featured: false },
  { id: 'PL3133', slug: s('PL3133'), name: 'Pot Anggrek Vanda Hitam 20', category: 'pot-plastik', price: 6500, unit: 'per buah', featured: false },
  { id: 'PL3134', slug: s('PL3134'), name: 'Pot Apel 30 Hitam', category: 'pot-plastik', price: 14000, unit: 'per buah', featured: false },
  { id: 'PL3135', slug: s('PL3135'), name: 'Pot Argo 1 Tempel Hitam', category: 'pot-plastik', price: 8000, unit: 'per buah', featured: false },
  { id: 'PL3136', slug: s('PL3136'), name: 'Pot Aster 18 Hitam', category: 'pot-plastik', price: 8000, unit: 'per buah', featured: false },
  { id: 'PL3138', slug: s('PL3138'), name: 'Pot Aster 181 Hitam', category: 'pot-plastik', price: 12000, unit: 'per buah', featured: false },
  { id: 'PL3140', slug: s('PL3140'), name: 'Pot BN 15 Cokelat', category: 'pot-plastik', price: 4000, unit: 'per buah', featured: false },
  { id: 'PL3141', slug: s('PL3141'), name: 'Pot BN 18 Cokelat', category: 'pot-plastik', price: 5000, unit: 'per buah', featured: false },
  { id: 'PL3142', slug: s('PL3142'), name: 'Pot Bonsai Kotak', category: 'pot-plastik', price: 50000, unit: 'per buah', featured: false },
  { id: 'PL3143', slug: s('PL3143'), name: 'Pot Cempaka 100 Hitam', category: 'pot-plastik', price: 200000, unit: 'per buah', featured: false },
  { id: 'PL3144', slug: s('PL3144'), name: 'Pot Garden Hitam 12', category: 'pot-plastik', price: 4000, unit: 'per buah', featured: false },
  { id: 'PL3146', slug: s('PL3146'), name: 'Pot Gentong 27 Putih', category: 'pot-plastik', price: 14500, unit: 'per buah', featured: false },
  { id: 'PL3147', slug: s('PL3147'), name: 'Pot Glory 30 Hitam', category: 'pot-plastik', price: 15000, unit: 'per buah', featured: false },
  { id: 'PL3148', slug: s('PL3148'), name: 'Pot Glory 30 Putih', category: 'pot-plastik', price: 19000, unit: 'per buah', featured: false },
  { id: 'PL3149', slug: s('PL3149'), name: 'Pot GMP Apel 22 Hitam', category: 'pot-plastik', price: 8000, unit: 'per buah', featured: false },
  { id: 'PL3150', slug: s('PL3150'), name: 'Pot GMP Apel 22 Putih', category: 'pot-plastik', price: 10000, unit: 'per buah', featured: false },
  { id: 'PL3151', slug: s('PL3151'), name: 'Pot GMP B 50 Hitam', category: 'pot-plastik', price: 42000, unit: 'per buah', featured: true },
  { id: 'PL3152', slug: s('PL3152'), name: 'Pot GMP B 60 Hitam', category: 'pot-plastik', price: 75000, unit: 'per buah', featured: false },
  { id: 'PL3153', slug: s('PL3153'), name: 'Pot GMP B 70 Hitam', category: 'pot-plastik', price: 100000, unit: 'per buah', featured: false },
  { id: 'PL3154', slug: s('PL3154'), name: 'Pot GMP Hitam 10 Polos', category: 'pot-plastik', price: 2000, unit: 'per buah', featured: false },
  { id: 'PL3155', slug: s('PL3155'), name: 'Pot GMP Hitam 12 Polos', category: 'pot-plastik', price: 3000, unit: 'per buah', featured: false },
  { id: 'PL3157', slug: s('PL3157'), name: 'Pot GMP Hitam 15 Polos', category: 'pot-plastik', price: 2000, unit: 'per buah', featured: false },
  { id: 'PL3158', slug: s('PL3158'), name: 'Pot GMP Hitam 17 Polos', category: 'pot-plastik', price: 2500, unit: 'per buah', featured: false },
  { id: 'PL3159', slug: s('PL3159'), name: 'Pot GMP Hitam 20 Polos', category: 'pot-plastik', price: 3500, unit: 'per buah', featured: true },
  { id: 'PL3160', slug: s('PL3160'), name: 'Pot GMP Hitam 25 Polos', category: 'pot-plastik', price: 5500, unit: 'per buah', featured: false },
  { id: 'PL3161', slug: s('PL3161'), name: 'Pot GMP Hitam 26 Motif', category: 'pot-plastik', price: 8500, unit: 'per buah', featured: false },
  { id: 'PL3162', slug: s('PL3162'), name: 'Pot GMP Hitam 30 Motif', category: 'pot-plastik', price: 10000, unit: 'per buah', featured: false },
  { id: 'PL3163', slug: s('PL3163'), name: 'Pot GMP Hitam 30 Polos', category: 'pot-plastik', price: 8500, unit: 'per buah', featured: false },
  { id: 'PL3164', slug: s('PL3164'), name: 'Pot GMP Hitam 35 Polos', category: 'pot-plastik', price: 14000, unit: 'per buah', featured: false },
  { id: 'PL3165', slug: s('PL3165'), name: 'Pot GMP Hitam 40 Polos', category: 'pot-plastik', price: 17500, unit: 'per buah', featured: false },
  { id: 'PL3166', slug: s('PL3166'), name: 'Pot GMP Hitam 45 Polos', category: 'pot-plastik', price: 26000, unit: 'per buah', featured: false },
  { id: 'PL3167', slug: s('PL3167'), name: 'Pot GMP Hitam 8 Polos', category: 'pot-plastik', price: 1000, unit: 'per buah', featured: false },
  { id: 'PL3169', slug: s('PL3169'), name: 'Pot GMP Leci Hitam 30', category: 'pot-plastik', price: 14000, unit: 'per buah', featured: false },
  { id: 'PL3170', slug: s('PL3170'), name: 'Pot GMP Leci Hitam 40', category: 'pot-plastik', price: 26000, unit: 'per buah', featured: false },
  { id: 'PL3171', slug: s('PL3171'), name: 'Pot GMP Merah 30 Motif', category: 'pot-plastik', price: 18000, unit: 'per buah', featured: false },
  { id: 'PL3172', slug: s('PL3172'), name: 'Pot GMP Putih 17 Polos', category: 'pot-plastik', price: 4000, unit: 'per buah', featured: false },
  { id: 'PL3173', slug: s('PL3173'), name: 'Pot GMP Putih 20 Polos', category: 'pot-plastik', price: 5500, unit: 'per buah', featured: false },
  { id: 'PL3174', slug: s('PL3174'), name: 'Pot GMP Putih 25 Polos', category: 'pot-plastik', price: 10500, unit: 'per buah', featured: false },
  { id: 'PL3175', slug: s('PL3175'), name: 'Pot GMP Tempel RGU 22 Hitam', category: 'pot-plastik', price: 9000, unit: 'per buah', featured: false },
  { id: 'PL3178', slug: s('PL3178'), name: 'Pot Leci 25 Hitam', category: 'pot-plastik', price: 10000, unit: 'per buah', featured: false },
  { id: 'PL3179', slug: s('PL3179'), name: 'Pot Leci 35 Hitam', category: 'pot-plastik', price: 20000, unit: 'per buah', featured: false },
  { id: 'PL3180', slug: s('PL3180'), name: 'Pot Leci 45 Hitam', category: 'pot-plastik', price: 35000, unit: 'per buah', featured: false },
  { id: 'PL3181', slug: s('PL3181'), name: 'Pot Mado 18 Putih', category: 'pot-plastik', price: 6500, unit: 'per buah', featured: false },
  { id: 'PL3182', slug: s('PL3182'), name: 'Pot Motif Bunga Hitam 25', category: 'pot-plastik', price: 7000, unit: 'per buah', featured: false },
  { id: 'PL3183', slug: s('PL3183'), name: 'Pot Nanas 13 Cokelat', category: 'pot-plastik', price: 8000, unit: 'per buah', featured: false },
  { id: 'PL3184', slug: s('PL3184'), name: 'Pot Nara 18 Hitam', category: 'pot-plastik', price: 5000, unit: 'per buah', featured: false },
  { id: 'PL3185', slug: s('PL3185'), name: 'Pot NKH 40 Hitam', category: 'pot-plastik', price: 24000, unit: 'per buah', featured: false },
  { id: 'PL3187', slug: s('PL3187'), name: 'Pot Padi 12 Putih', category: 'pot-plastik', price: 4000, unit: 'per buah', featured: false },
  { id: 'PL3188', slug: s('PL3188'), name: 'Pot RGU 10 Hitam', category: 'pot-plastik', price: 1500, unit: 'per buah', featured: false },
  { id: 'PL3189', slug: s('PL3189'), name: 'Pot SGP 01 Hitam', category: 'pot-plastik', price: 14000, unit: 'per buah', featured: false },
  { id: 'PL3190', slug: s('PL3190'), name: 'Pot SGP 03 Hitam', category: 'pot-plastik', price: 16000, unit: 'per buah', featured: false },
  { id: 'PL3191', slug: s('PL3191'), name: 'Pot SGP 05 Hitam', category: 'pot-plastik', price: 25000, unit: 'per buah', featured: false },
  { id: 'PL3192', slug: s('PL3192'), name: 'Pot Tawon 10 Hitam', category: 'pot-plastik', price: 2000, unit: 'per buah', featured: false },
  { id: 'PL3193', slug: s('PL3193'), name: 'Tatakan Pot GBL T30 Hitam', category: 'pot-plastik', price: 5500, unit: 'per buah', featured: false },
  { id: 'PL3194', slug: s('PL3194'), name: 'Pot Padi 20 Putih', category: 'pot-plastik', price: 10000, unit: 'per buah', featured: false },
  { id: 'PL3195', slug: s('PL3195'), name: 'Pot Padi 20 Hitam', category: 'pot-plastik', price: 6000, unit: 'per buah', featured: false },
  { id: 'PL3196', slug: s('PL3196'), name: 'Pot Apel 25 Hitam', category: 'pot-plastik', price: 10000, unit: 'per buah', featured: false },
  { id: 'PL3197', slug: s('PL3197'), name: 'Pot Apel 25 Putih', category: 'pot-plastik', price: 17000, unit: 'per buah', featured: false },
  { id: 'PL3198', slug: s('PL3198'), name: 'Pot Leci 30 Putih', category: 'pot-plastik', price: 22000, unit: 'per buah', featured: false },

  // ── PESTISIDA › FUNGISIDA ──────────────────────────────────────────────────
  { id: 'PS4001', slug: s('PS4001'), name: 'Antracol 250gr', category: 'pestisida', price: 55000, unit: 'per 250gr', featured: false },
  { id: 'PS4002', slug: s('PS4002'), name: 'Antracol Pack 50gr', category: 'pestisida', price: 12000, unit: 'per 50gr', featured: false },

  // ── PESTISIDA › HERBISIDA ──────────────────────────────────────────────────
  { id: 'PS4003', slug: s('PS4003'), name: 'Cairan Pembasmi Rumput Liar 1 Liter', category: 'pestisida', price: 60000, unit: 'per liter', featured: false },
  { id: 'PS4004', slug: s('PS4004'), name: 'Cairan Pembasmi Rumput Liar 250ml', category: 'pestisida', price: 25000, unit: 'per 250ml', featured: false },
  { id: 'PS4005', slug: s('PS4005'), name: 'Gramoxone 1 Liter', category: 'pestisida', price: 100000, unit: 'per liter', featured: false },
  { id: 'PS4006', slug: s('PS4006'), name: 'Gramoxone 250ml', category: 'pestisida', price: 35000, unit: 'per 250ml', featured: false },
  { id: 'PS4007', slug: s('PS4007'), name: 'Gramoxone 500ml', category: 'pestisida', price: 60000, unit: 'per 500ml', featured: false },
  { id: 'PS4008', slug: s('PS4008'), name: 'Roundup 1 Liter', category: 'pestisida', price: 110000, unit: 'per liter', featured: false },
  { id: 'PS4009', slug: s('PS4009'), name: 'Roundup 200ml', category: 'pestisida', price: 35000, unit: 'per 200ml', featured: false },
  { id: 'PS4010', slug: s('PS4010'), name: 'Starlon 665 EC Herbisida 1 Liter', category: 'pestisida', price: 295000, unit: 'per liter', featured: false },
  { id: 'PS4011', slug: s('PS4011'), name: 'Starlon 665 EC Herbisida 100ml', category: 'pestisida', price: 45000, unit: 'per 100ml', featured: false },

  // ── PESTISIDA › INSEKTISIDA ────────────────────────────────────────────────
  { id: 'PS4012', slug: s('PS4012'), name: 'Alika 100ml', category: 'pestisida', price: 75000, unit: 'per 100ml', featured: false },
  { id: 'PS4013', slug: s('PS4013'), name: 'Alika 50ml', category: 'pestisida', price: 42000, unit: 'per 50ml', featured: false },
  { id: 'PS4014', slug: s('PS4014'), name: 'Amistar Top 325 SC 50ml', category: 'pestisida', price: 65000, unit: 'per 50ml', featured: false },
  { id: 'PS4015', slug: s('PS4015'), name: 'Curacron 500EC 100ml', category: 'pestisida', price: 45000, unit: 'per 100ml', featured: false },
  { id: 'PS4016', slug: s('PS4016'), name: 'Decis 50ml', category: 'pestisida', price: 25000, unit: 'per 50ml', featured: false },
  { id: 'PS4017', slug: s('PS4017'), name: 'Diazinon 100ml', category: 'pestisida', price: 35000, unit: 'per 100ml', featured: false },
  { id: 'PS4018', slug: s('PS4018'), name: 'Furadan 1kg', category: 'pestisida', price: 35000, unit: 'per kg', featured: false },
  { id: 'PS4019', slug: s('PS4019'), name: 'Furadan Repack 100gr', category: 'pestisida', price: 5000, unit: 'per 100gr', featured: false },
  { id: 'PS4020', slug: s('PS4020'), name: 'Kaliandra 50ml', category: 'pestisida', price: 35000, unit: 'per 50ml', featured: false },
  { id: 'PS4021', slug: s('PS4021'), name: 'Matador 50ml', category: 'pestisida', price: 25000, unit: 'per 50ml', featured: false },
  { id: 'PS4022', slug: s('PS4022'), name: 'Pegasus 80ml', category: 'pestisida', price: 98000, unit: 'per 80ml', featured: false },
  { id: 'PS4023', slug: s('PS4023'), name: 'Racun Tikus Maowang', category: 'pestisida', price: 10000, unit: 'per buah', featured: false },
  { id: 'PS4024', slug: s('PS4024'), name: 'Regent 250ml', category: 'pestisida', price: 110000, unit: 'per 250ml', featured: true },
  { id: 'PS4025', slug: s('PS4025'), name: 'Regent 50ml', category: 'pestisida', price: 35000, unit: 'per 50ml', featured: false },
  { id: 'PS4027', slug: s('PS4027'), name: 'Samite 100ml', category: 'pestisida', price: 45000, unit: 'per 100ml', featured: false },
  { id: 'PS4028', slug: s('PS4028'), name: 'Sevin', category: 'pestisida', price: 50000, unit: 'per buah', featured: false },
  { id: 'PS4029', slug: s('PS4029'), name: 'Termiban 100ml', category: 'pestisida', price: 35000, unit: 'per 100ml', featured: false },
  { id: 'PS4030', slug: s('PS4030'), name: 'Wisatox', category: 'pestisida', price: 35000, unit: 'per buah', featured: false },

  // ── LAIN LAIN (only real product) ──────────────────────────────────────────
  { id: 'OK1001', slug: s('OK1001'), name: 'Ethrel 100ml', category: 'pestisida', price: 65000, unit: 'per 100ml', featured: false },

  // ── PUPUK ──────────────────────────────────────────────────────────────────
  { id: 'PK5001', slug: s('PK5001'), name: '6-BAP Hijau Pembungaan', category: 'pupuk', price: 45000, unit: 'per botol', featured: false },
  { id: 'PK5002', slug: s('PK5002'), name: '6-BAP Hijau Penumbuh Akar', category: 'pupuk', price: 20000, unit: 'per botol', featured: false },
  { id: 'PK5003', slug: s('PK5003'), name: 'AB Mix Nutrisi', category: 'pupuk', price: 30000, unit: 'per bungkus', featured: false },
  { id: 'PK5004', slug: s('PK5004'), name: 'Atonik 100ml', category: 'pupuk', price: 25000, unit: 'per 100ml', featured: false },
  { id: 'PK5005', slug: s('PK5005'), name: 'BAP Biru 30ml', category: 'pupuk', price: 15000, unit: 'per 30ml', featured: false },
  { id: 'PK5006', slug: s('PK5006'), name: 'Bio Joz 1 Liter', category: 'pupuk', price: 200000, unit: 'per liter', featured: false },
  { id: 'PK5007', slug: s('PK5007'), name: 'Bio Joz 250ml', category: 'pupuk', price: 65000, unit: 'per 250ml', featured: false },
  { id: 'PK5008', slug: s('PK5008'), name: 'Bio Trent 500ml', category: 'pupuk', price: 60000, unit: 'per 500ml', featured: false },
  { id: 'PK5009', slug: s('PK5009'), name: 'Dekastar 13-13-13 Botol 100gr', category: 'pupuk', price: 25000, unit: 'per 100gr', featured: false },
  { id: 'PK5010', slug: s('PK5010'), name: 'Dekastar 13-13-13 Kotak 100gr', category: 'pupuk', price: 30000, unit: 'per 100gr', featured: false },
  { id: 'PK5011', slug: s('PK5011'), name: 'Dekastar 13-13-13 Kotak 500gr', category: 'pupuk', price: 95000, unit: 'per 500gr', featured: false },
  { id: 'PK5012', slug: s('PK5012'), name: 'Dekastar 17-11-10 Botol 100gr', category: 'pupuk', price: 25000, unit: 'per 100gr', featured: false },
  { id: 'PK5013', slug: s('PK5013'), name: 'Dekastar 17-11-10 Kotak 100gr', category: 'pupuk', price: 30000, unit: 'per 100gr', featured: false },
  { id: 'PK5014', slug: s('PK5014'), name: 'Dekastar 17-11-10 Kotak 500gr', category: 'pupuk', price: 95000, unit: 'per 500gr', featured: false },
  { id: 'PK5015', slug: s('PK5015'), name: 'Dekastar 6-13-25 Kotak 100gr', category: 'pupuk', price: 30000, unit: 'per 100gr', featured: false },
  { id: 'PK5016', slug: s('PK5016'), name: 'EM4', category: 'pupuk', price: 29000, unit: 'per botol', featured: false },
  { id: 'PK5017', slug: s('PK5017'), name: 'Gandasil B 100ml', category: 'pupuk', price: 15000, unit: 'per 100ml', featured: false },
  { id: 'PK5018', slug: s('PK5018'), name: 'Gandasil B 500gr', category: 'pupuk', price: 50000, unit: 'per 500gr', featured: false },
  { id: 'PK5019', slug: s('PK5019'), name: 'Gandasil D 100ml', category: 'pupuk', price: 15000, unit: 'per 100ml', featured: false },
  { id: 'PK5020', slug: s('PK5020'), name: 'Gandasil D 500ml', category: 'pupuk', price: 49000, unit: 'per 500ml', featured: false },
  { id: 'PK5021', slug: s('PK5021'), name: 'Hormon Seed Booster', category: 'pupuk', price: 35000, unit: 'per botol', featured: false },
  { id: 'PK5022', slug: s('PK5022'), name: 'Kapur Dolomite 1kg', category: 'pupuk', price: 15000, unit: 'per kg', featured: false },
  { id: 'PK5023', slug: s('PK5023'), name: 'KNO3 Putih Pak Tani 1kg', category: 'pupuk', price: 42000, unit: 'per kg', featured: false },
  { id: 'PK5024', slug: s('PK5024'), name: 'KNO3 Putih Pak Tani 2kg', category: 'pupuk', price: 84000, unit: 'per 2kg', featured: false },
  { id: 'PK5025', slug: s('PK5025'), name: 'Magnesium Pak Tani 1kg', category: 'pupuk', price: 25000, unit: 'per kg', featured: false },
  { id: 'PK5026', slug: s('PK5026'), name: 'MKP Pak Tani 1kg', category: 'pupuk', price: 60000, unit: 'per kg', featured: false },
  { id: 'PK5027', slug: s('PK5027'), name: 'Molase 1 Liter Repack', category: 'pupuk', price: 20000, unit: 'per liter', featured: false },
  { id: 'PK5028', slug: s('PK5028'), name: 'Molase Plus 2 Liter', category: 'pupuk', price: 35000, unit: 'per 2 liter', featured: false },
  { id: 'PK5029', slug: s('PK5029'), name: 'Multitonik Bunga 500ml', category: 'pupuk', price: 35000, unit: 'per 500ml', featured: false },
  { id: 'PK5030', slug: s('PK5030'), name: 'Multitonik Umum 500ml', category: 'pupuk', price: 25000, unit: 'per 500ml', featured: false },
  { id: 'PK5031', slug: s('PK5031'), name: 'Neem Oil 100ml', category: 'pupuk', price: 50000, unit: 'per 100ml', featured: true },
  { id: 'PK5032', slug: s('PK5032'), name: 'Perangsang Akar Infarm 100ml', category: 'pupuk', price: 35000, unit: 'per 100ml', featured: false },
  { id: 'PK5033', slug: s('PK5033'), name: 'Pupuk Agro Lestari 1 Liter', category: 'pupuk', price: 50000, unit: 'per liter', featured: false },
  { id: 'PK5034', slug: s('PK5034'), name: 'Pupuk Agro Lestari 450ml', category: 'pupuk', price: 35000, unit: 'per 450ml', featured: false },
  { id: 'PK5035', slug: s('PK5035'), name: 'Pupuk Anderson 100gr Repack', category: 'pupuk', price: 25000, unit: 'per 100gr', featured: false },
  { id: 'PK5036', slug: s('PK5036'), name: 'Pupuk Anderson 500gr', category: 'pupuk', price: 97000, unit: 'per 500gr', featured: false },
  { id: 'PK5037', slug: s('PK5037'), name: 'Pupuk Bio Flower Super 100ml', category: 'pupuk', price: 25000, unit: 'per 100ml', featured: false },
  { id: 'PK5038', slug: s('PK5038'), name: 'Pupuk Bio Flower Super 250ml', category: 'pupuk', price: 35000, unit: 'per 250ml', featured: false },
  { id: 'PK5039', slug: s('PK5039'), name: 'Pupuk Booster 76 1 Liter', category: 'pupuk', price: 65000, unit: 'per liter', featured: false },
  { id: 'PK5040', slug: s('PK5040'), name: 'Pupuk Booster 76 100ml', category: 'pupuk', price: 25000, unit: 'per 100ml', featured: false },
  { id: 'PK5041', slug: s('PK5041'), name: 'Pupuk Booster 76 250ml', category: 'pupuk', price: 45000, unit: 'per 250ml', featured: false },
  { id: 'PK5042', slug: s('PK5042'), name: 'Pupuk Dolomit 40kg', category: 'pupuk', price: 50000, unit: 'per karung', featured: false },
  { id: 'PK5043', slug: s('PK5043'), name: 'Pupuk Kambing 5kg', category: 'pupuk', price: 15000, unit: 'per karung', featured: true },
  { id: 'PK5044', slug: s('PK5044'), name: 'Pupuk Kambing Fermentasi 10kg', category: 'pupuk', price: 22000, unit: 'per karung', featured: false },
  { id: 'PK5045', slug: s('PK5045'), name: 'Pupuk Kambing Mix 10kg', category: 'pupuk', price: 20000, unit: 'per karung', featured: false },
  { id: 'PK5046', slug: s('PK5046'), name: 'Pupuk Meroke KNO3 Kalinitra 1kg', category: 'pupuk', price: 53000, unit: 'per kg', featured: false },
  { id: 'PK5047', slug: s('PK5047'), name: 'Pupuk Meroke MKP 1kg', category: 'pupuk', price: 68000, unit: 'per kg', featured: false },
  { id: 'PK5048', slug: s('PK5048'), name: 'Pupuk Mutiara 16-16-16 100gr Repack', category: 'pupuk', price: 3000, unit: 'per 100gr', featured: false },
  { id: 'PK5049', slug: s('PK5049'), name: 'Pupuk Mutiara 16-16-16 1kg', category: 'pupuk', price: 23000, unit: 'per kg', featured: true },
  { id: 'PK5051', slug: s('PK5051'), name: 'Pupuk Mutiara 16-16-16 5kg', category: 'pupuk', price: 95000, unit: 'per 5kg', featured: false },
  { id: 'PK5052', slug: s('PK5052'), name: 'Pupuk NPK 16-16-16 Pak Tani', category: 'pupuk', price: 25000, unit: 'per kg', featured: false },
  { id: 'PK5053', slug: s('PK5053'), name: 'Pupuk NPK Karate Plus Boron 1kg', category: 'pupuk', price: 25000, unit: 'per kg', featured: false },
  { id: 'PK5054', slug: s('PK5054'), name: 'Pupuk NPK Mutiara Grower 15-09-20 TE 1kg', category: 'pupuk', price: 25000, unit: 'per kg', featured: false },
  { id: 'PK5055', slug: s('PK5055'), name: 'Pupuk NPK Phonska 1kg', category: 'pupuk', price: 25000, unit: 'per kg', featured: false },
  { id: 'PK5056', slug: s('PK5056'), name: 'Pupuk NPK Phonska 1kg Repack', category: 'pupuk', price: 3000, unit: 'per 100gr', featured: false },
  { id: 'PK5057', slug: s('PK5057'), name: 'Pupuk Organik Cair Buah 100ml', category: 'pupuk', price: 35000, unit: 'per 100ml', featured: false },
  { id: 'PK5058', slug: s('PK5058'), name: 'Pupuk Organik Cair Sayuran 100ml', category: 'pupuk', price: 35000, unit: 'per 100ml', featured: false },
  { id: 'PK5059', slug: s('PK5059'), name: 'Pupuk Organik Cair Sayuran 500ml', category: 'pupuk', price: 60000, unit: 'per 500ml', featured: false },
  { id: 'PK5060', slug: s('PK5060'), name: 'Pupuk SK-Cote 19-10-13 100gr Repack', category: 'pupuk', price: 15000, unit: 'per 100gr', featured: false },
  { id: 'PK5061', slug: s('PK5061'), name: 'Pupuk SK-Cote 19-10-13 1kg', category: 'pupuk', price: 95000, unit: 'per kg', featured: false },
  { id: 'PK5062', slug: s('PK5062'), name: 'Pupuk Ultradap Pak Tani', category: 'pupuk', price: 55000, unit: 'per kg', featured: false },
  { id: 'PK5063', slug: s('PK5063'), name: 'Pupuk Urea 1/2kg', category: 'pupuk', price: 7000, unit: 'per 500gr', featured: false },
  { id: 'PK5064', slug: s('PK5064'), name: 'Pupuk Urea 1kg', category: 'pupuk', price: 14000, unit: 'per kg', featured: false },
  { id: 'PK5065', slug: s('PK5065'), name: 'Pupuk Urea 5kg', category: 'pupuk', price: 70000, unit: 'per 5kg', featured: false },
  { id: 'PK5066', slug: s('PK5066'), name: 'Pupuk XPK 1kg', category: 'pupuk', price: 90000, unit: 'per kg', featured: false },
  { id: 'PK5067', slug: s('PK5067'), name: 'Pupuk XPK Pack 100gr', category: 'pupuk', price: 15000, unit: 'per 100gr', featured: false },
  { id: 'PK5068', slug: s('PK5068'), name: 'Pupuk ZA 1kg', category: 'pupuk', price: 9000, unit: 'per kg', featured: false },
  { id: 'PK5069', slug: s('PK5069'), name: 'Rootup 100gr', category: 'pupuk', price: 35000, unit: 'per 100gr', featured: false },
  { id: 'PK5070', slug: s('PK5070'), name: 'Vitamin B1 100ml', category: 'pupuk', price: 20000, unit: 'per 100ml', featured: true },
  { id: 'PK5071', slug: s('PK5071'), name: 'Vitamin B1 100ml Taiwan', category: 'pupuk', price: 50000, unit: 'per 100ml', featured: false },
  { id: 'PK5072', slug: s('PK5072'), name: 'Vitamin B1 500ml', category: 'pupuk', price: 50000, unit: 'per 500ml', featured: false },
  { id: 'PK5073', slug: s('PK5073'), name: 'Vitamin B1 500ml Taiwan', category: 'pupuk', price: 180000, unit: 'per 500ml', featured: false },
  { id: 'PK5074', slug: s('PK5074'), name: 'Vitamin B1 Hijau Infarm 100ml', category: 'pupuk', price: 25000, unit: 'per 100ml', featured: false },
  { id: 'PK5075', slug: s('PK5075'), name: 'Vitamin B1+B6 100ml', category: 'pupuk', price: 45000, unit: 'per 100ml', featured: false },
];

// Generic descriptions by category
const descriptions: Record<string, string> = {
  'media-tanam': 'Media tanam berkualitas untuk mendukung pertumbuhan tanaman yang optimal. Tersedia di Bali Greenhouse Panjer.',
  'pupuk': 'Pupuk pilihan untuk mendukung pertumbuhan dan produktivitas tanaman. Tersedia di Bali Greenhouse Panjer.',
  'pestisida': 'Produk perlindungan tanaman berkualitas untuk mengendalikan hama dan penyakit. Tersedia di Bali Greenhouse Panjer.',
  'pot-plastik': 'Pot plastik berkualitas dalam berbagai ukuran untuk semua jenis tanaman. Tersedia di Bali Greenhouse Panjer.',
  'polybag': 'Polybag dan planter bag berkualitas untuk kebutuhan berkebun Anda. Tersedia di Bali Greenhouse Panjer.',
  'alat-berkebun': 'Alat berkebun berkualitas untuk memudahkan perawatan tanaman dan bonsai. Tersedia di Bali Greenhouse Panjer.',
  'kawat-bonsai': 'Kawat bonsai berkualitas untuk membentuk dan melatih pertumbuhan bonsai. Tersedia di Bali Greenhouse Panjer.',
  'perlengkapan': 'Perlengkapan berkebun lengkap untuk mendukung aktivitas kebun Anda. Tersedia di Bali Greenhouse Panjer.',
};

// ---------------------------------------------------------------------------
// StoreInfo — keep existing values (don't overwrite if already customised)
// ---------------------------------------------------------------------------

const storeInfoData = {
  name: 'Bali Greenhouse',
  tagline: 'Solusi Lengkap untuk Kebun Anda',
  address: 'Jl. Raya Panjer, Panjer',
  city: 'Denpasar Selatan, Bali',
  whatsapp: '6281234567890',
  whatsappDisplay: '+62 812-3456-7890',
  email: 'info@baligreenhouse.id',
  hoursWeekday: 'Senin – Sabtu: 08.00 – 17.00 WITA',
  hoursWeekend: 'Minggu: 09.00 – 14.00 WITA',
  instagram: 'baligreenhouse',
  facebook: 'baligreenhouse',
};

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function seed() {
  console.log('🌱 Seeding Sanity — BGH Panjer catalog...\n');

  // 1. Categories
  console.log('📂 Membuat kategori...');
  for (const cat of categories) {
    await client.createOrReplace({
      _type: 'category',
      _id: `category-${cat.slug}`,
      name: cat.name,
      slug: { _type: 'slug', current: cat.slug },
      description: cat.description,
      icon: cat.icon,
      order: cat.order,
    });
    console.log(`  ✅ ${cat.name}`);
  }

  // 2. Products
  console.log(`\n📦 Membuat ${products.length} produk...`);
  let count = 0;
  for (const p of products) {
    await client.createOrReplace({
      _type: 'product',
      _id: `product-${p.id.toLowerCase()}`,
      name: p.name,
      slug: { _type: 'slug', current: p.slug },
      category: {
        _type: 'reference',
        _ref: `category-${p.category}`,
      },
      price: p.price,
      description: descriptions[p.category] ?? 'Tersedia di Bali Greenhouse Panjer.',
      unit: p.unit,
      featured: p.featured,
      inStock: true,
    });
    count++;
    if (count % 20 === 0) console.log(`  ... ${count}/${products.length}`);
  }
  console.log(`  ✅ ${products.length} produk selesai`);

  // 3. StoreInfo singleton
  await client.createOrReplace({
    _type: 'storeInfo',
    _id: 'storeInfo',
    ...storeInfoData,
  });
  console.log(`\n  ✅ Informasi Toko: ${storeInfoData.name}`);

  console.log('\n🎉 Selesai! Buka Studio untuk memverifikasi data.');
  console.log(`   Kategori: ${categories.length}`);
  console.log(`   Produk:   ${products.length}`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
