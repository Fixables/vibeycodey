/**
 * Seed script — run once to populate Sanity with the static data
 * Usage: npx tsx sanity/scripts/seed.ts
 *
 * Requires env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN
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
// Static data (copied from data/*.ts)
// ---------------------------------------------------------------------------

const categories = [
  { slug: 'benih-bibit', name: 'Benih & Bibit', description: 'Benih sayuran, buah, bunga, dan bibit siap tanam', icon: '🌱', order: 1 },
  { slug: 'pupuk', name: 'Pupuk', description: 'Pupuk organik, kimia, cair, dan granul', icon: '🪣', order: 2 },
  { slug: 'media-tanam', name: 'Media Tanam', description: 'Tanah pot, cocopeat, sekam, perlite, kompos', icon: '🌍', order: 3 },
  { slug: 'pestisida-fungisida', name: 'Pestisida & Fungisida', description: 'Pembasmi hama, jamur, dan penyakit tanaman', icon: '🛡️', order: 4 },
  { slug: 'alat-semprot', name: 'Alat Semprot', description: 'Sprayer tangan, sprayer elektrik, nozzle', icon: '💦', order: 5 },
  { slug: 'pot-wadah', name: 'Pot & Wadah Tanam', description: 'Pot plastik, pot gerabah, grow bag, tray semai', icon: '🪴', order: 6 },
  { slug: 'alat-berkebun', name: 'Alat Berkebun', description: 'Sekop, cangkul, gunting tanaman, sarung tangan', icon: '🌿', order: 7 },
  { slug: 'perlengkapan', name: 'Perlengkapan Kebun', description: 'Selang, irigasi, rak tanaman, jaring tanaman', icon: '🔧', order: 8 },
];

const products = [
  { id: 'p001', slug: 'benih-tomat-cherry', name: 'Benih Tomat Cherry', category: 'benih-bibit', price: 15000, description: 'Benih tomat cherry unggul, cocok untuk pot dan kebun rumah. Produksi buah lebat dengan rasa manis.', unit: 'per bungkus', featured: true, inStock: true },
  { id: 'p002', slug: 'bibit-cabai-merah', name: 'Bibit Cabai Merah', category: 'benih-bibit', price: 8000, description: 'Bibit cabai merah keriting siap tanam, tinggi 15–20 cm. Tahan penyakit dan produktivitas tinggi.', unit: 'per bibit', featured: false, inStock: true },
  { id: 'p003', slug: 'benih-selada-hidroponik', name: 'Benih Selada Hidroponik', category: 'benih-bibit', price: 20000, description: 'Benih selada varietas lollo rosso, ideal untuk sistem hidroponik NFT dan DWC.', unit: 'per bungkus', featured: true, inStock: true },
  { id: 'p004', slug: 'pupuk-npk-mutiara', name: 'Pupuk NPK Mutiara 16-16-16', category: 'pupuk', price: 35000, description: 'Pupuk NPK seimbang untuk pertumbuhan menyeluruh. Cocok untuk sayuran, buah, dan tanaman hias.', unit: 'per kg', featured: true, inStock: true },
  { id: 'p005', slug: 'pupuk-organik-cair-nasa', name: 'Pupuk Organik Cair NASA', category: 'pupuk', price: 45000, description: 'Pupuk organik cair mengandung hormon pertumbuhan alami. Merangsang akar dan mempercepat panen.', unit: 'per 500ml', featured: false, inStock: true },
  { id: 'p006', slug: 'kompos-organik-premium', name: 'Kompos Organik Premium', category: 'pupuk', price: 25000, description: 'Kompos matang dari bahan organik pilihan. Memperbaiki struktur tanah dan meningkatkan kesuburan.', unit: 'per 5kg', featured: false, inStock: true },
  { id: 'p007', slug: 'cocopeat-block', name: 'Cocopeat Block', category: 'media-tanam', price: 20000, description: 'Cocopeat press dari sabut kelapa berkualitas. Menyimpan air lebih lama, aerasi akar optimal.', unit: 'per blok 5kg', featured: true, inStock: true },
  { id: 'p008', slug: 'tanah-pot-premium', name: 'Tanah Pot Premium', category: 'media-tanam', price: 30000, description: 'Campuran tanah, cocopeat, dan pupuk organik siap pakai. pH seimbang untuk semua jenis tanaman.', unit: 'per 10kg', featured: false, inStock: true },
  { id: 'p009', slug: 'perlite-hortikultura', name: 'Perlite Hortikultura', category: 'media-tanam', price: 18000, description: 'Perlite grade A untuk meningkatkan drainase media tanam. Ideal untuk kaktus, sukulen, dan hidroponik.', unit: 'per liter', featured: false, inStock: true },
  { id: 'p010', slug: 'insektisida-organik', name: 'Insektisida Organik Neem Oil', category: 'pestisida-fungisida', price: 40000, description: 'Pestisida berbahan minyak nimba, aman untuk lingkungan. Efektif mengendalikan kutu, ulat, dan hama.', unit: 'per 250ml', featured: true, inStock: true },
  { id: 'p011', slug: 'fungisida-mankozeb', name: 'Fungisida Mankozeb 80WP', category: 'pestisida-fungisida', price: 28000, description: 'Fungisida kontak spektrum luas. Mencegah dan mengendalikan penyakit busuk daun dan embun tepung.', unit: 'per 100gr', featured: false, inStock: true },
  { id: 'p012', slug: 'sprayer-elektrik-16l', name: 'Sprayer Elektrik 16 Liter', category: 'alat-semprot', price: 350000, description: 'Sprayer elektrik dengan baterai 12V, kapasitas 16 liter. Pompa otomatis, tekanan stabil.', unit: 'per unit', featured: true, inStock: true },
  { id: 'p013', slug: 'sprayer-tangan-2l', name: 'Sprayer Tangan 2 Liter', category: 'alat-semprot', price: 35000, description: 'Sprayer pompa manual kapasitas 2 liter. Ringan dan mudah digunakan untuk tanaman dalam pot.', unit: 'per unit', featured: false, inStock: true },
  { id: 'p014', slug: 'pot-gerabah-30cm', name: 'Pot Gerabah 30cm', category: 'pot-wadah', price: 25000, description: 'Pot gerabah tanah liat asli, diameter 30cm. Sirkulasi udara alami untuk akar yang sehat.', unit: 'per buah', featured: true, inStock: true },
  { id: 'p015', slug: 'grow-bag-20l', name: 'Grow Bag 20 Liter', category: 'pot-wadah', price: 15000, description: 'Grow bag kain non-woven kapasitas 20 liter. Air pruning akar, drainage excellent.', unit: 'per buah', featured: false, inStock: true },
  { id: 'p016', slug: 'tray-semai-128-lubang', name: 'Tray Semai 128 Lubang', category: 'pot-wadah', price: 22000, description: 'Tray semai plastik 128 lubang, material PP tebal tahan lama. Ideal untuk pembibitan skala besar.', unit: 'per buah', featured: false, inStock: true },
  { id: 'p017', slug: 'sekop-mini-set', name: 'Set Sekop Mini 3 Pcs', category: 'alat-berkebun', price: 45000, description: 'Set sekop mini 3 buah (sekop, garpu, trowel) dengan gagang ergonomis anti-slip.', unit: 'per set', featured: true, inStock: true },
  { id: 'p018', slug: 'gunting-pangkas-bypass', name: 'Gunting Pangkas Bypass', category: 'alat-berkebun', price: 65000, description: 'Gunting pangkas baja stainless, mekanisme bypass. Tajam, ringan, nyaman di tangan.', unit: 'per buah', featured: false, inStock: true },
  { id: 'p019', slug: 'selang-air-15m', name: 'Selang Air 15 Meter', category: 'perlengkapan', price: 55000, description: 'Selang air fleksibel 15 meter, diameter 1/2 inci. Anti-kink, tahan UV dan tekanan tinggi.', unit: 'per roll', featured: false, inStock: true },
  { id: 'p020', slug: 'rak-tanaman-5-susun', name: 'Rak Tanaman 5 Susun', category: 'perlengkapan', price: 280000, description: 'Rak tanaman besi 5 susun, coating anti-karat. Cocok untuk balkon dan teras, mudah dirakit.', unit: 'per unit', featured: true, inStock: true },
];

const storeInfoData = {
  name: 'Bali Greenhouse',
  tagline: 'Solusi Lengkap untuk Kebun Anda',
  address: 'Jl. Raya Kerobokan No. 88, Kerobokan Kelod',
  city: 'Badung, Bali 80361',
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
  console.log('🌱 Seeding Sanity...\n');

  // 1. Categories
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
    console.log(`  ✅ Kategori: ${cat.name}`);
  }

  // 2. Products
  for (const p of products) {
    await client.createOrReplace({
      _type: 'product',
      _id: `product-${p.id}`,
      name: p.name,
      slug: { _type: 'slug', current: p.slug },
      category: {
        _type: 'reference',
        _ref: `category-${p.category}`,
      },
      price: p.price,
      description: p.description,
      unit: p.unit,
      featured: p.featured,
      inStock: p.inStock,
    });
    console.log(`  ✅ Produk: ${p.name}`);
  }

  // 3. StoreInfo singleton
  await client.createOrReplace({
    _type: 'storeInfo',
    _id: 'storeInfo',
    ...storeInfoData,
  });
  console.log(`  ✅ Informasi Toko: ${storeInfoData.name}`);

  console.log('\n🎉 Selesai! Buka Studio untuk memverifikasi data.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
