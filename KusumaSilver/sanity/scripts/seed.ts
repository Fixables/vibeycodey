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

const categories = [
  { name: 'Cincin', nameEn: 'Rings', slug: 'cincin', description: 'Cincin perak 925 berbagai gaya', descriptionEn: '925 silver rings in various styles', icon: '💍', order: 1 },
  { name: 'Kalung', nameEn: 'Necklaces', slug: 'kalung', description: 'Kalung perak elegan dan minimalis', descriptionEn: 'Elegant and minimalist silver necklaces', icon: '📿', order: 2 },
  { name: 'Gelang', nameEn: 'Bracelets', slug: 'gelang', description: 'Gelang perak untuk tampilan sempurna', descriptionEn: 'Silver bracelets for the perfect look', icon: '🪬', order: 3 },
  { name: 'Anting', nameEn: 'Earrings', slug: 'anting', description: 'Anting perak cantik dan stylish', descriptionEn: 'Beautiful and stylish silver earrings', icon: '✨', order: 4 },
  { name: 'Liontin', nameEn: 'Pendants', slug: 'liontin', description: 'Liontin perak dengan motif Bali', descriptionEn: 'Silver pendants with Balinese motifs', icon: '🔮', order: 5 },
  { name: 'Custom', nameEn: 'Custom', slug: 'custom', description: 'Perhiasan custom sesuai keinginan', descriptionEn: 'Custom jewelry tailored to your wishes', icon: '🎨', order: 6 },
];

const storeInfoData = {
  _type: 'storeInfo',
  name: 'Kusuma Silver',
  tagline: 'Perhiasan Perak 925 Asli dari Bali',
  taglineEn: 'Authentic 925 Silver Jewelry from Bali',
  address: 'Jl. Raya Celuk No. 1, Sukawati',
  city: 'Gianyar, Bali',
  whatsapp: '6281234567890',
  whatsappDisplay: '+62 812-3456-7890',
  email: 'info@kusumasilver.com',
  hoursWeekday: 'Senin – Sabtu: 09.00 – 18.00',
  hoursWeekend: 'Minggu: 10.00 – 15.00',
  instagram: 'kusumasilver',
};

async function seed() {
  console.log('🌱 Seeding Kusuma Silver Sanity data...');

  // Seed categories
  const categoryRefs: Record<string, string> = {};
  for (const cat of categories) {
    const existing = await client.fetch(
      `*[_type == "category" && slug.current == $slug][0]._id`,
      { slug: cat.slug }
    );
    if (existing) {
      categoryRefs[cat.slug] = existing;
      console.log(`  ⏭  Category exists: ${cat.name}`);
      continue;
    }
    const doc = await client.create({
      _type: 'category',
      name: cat.name,
      nameEn: cat.nameEn,
      slug: { _type: 'slug', current: cat.slug },
      description: cat.description,
      descriptionEn: cat.descriptionEn,
      icon: cat.icon,
      order: cat.order,
    });
    categoryRefs[cat.slug] = doc._id;
    console.log(`  ✅ Created category: ${cat.name}`);
  }

  // Seed store info
  const existing = await client.fetch(`*[_type == "storeInfo"][0]._id`);
  if (existing) {
    console.log('  ⏭  Store info exists');
  } else {
    await client.create(storeInfoData);
    console.log('  ✅ Created store info');
  }

  // Seed sample products
  const sampleProducts = [
    {
      name: 'Cincin Ukir Bali',
      nameEn: 'Balinese Carved Ring',
      slug: 'cincin-ukir-bali',
      categorySlug: 'cincin',
      price: 350000,
      description: 'Cincin perak 925 dengan ukiran motif tradisional Bali yang indah.',
      descriptionEn: 'A 925 silver ring with beautiful traditional Balinese carved motifs.',
      material: 'Perak 925',
      sizes: '6, 7, 8, 9, 10',
      craftingTime: '3–5 hari kerja',
      isCustomizable: true,
      featured: true,
    },
    {
      name: 'Kalung Bulan Sabit',
      nameEn: 'Crescent Moon Necklace',
      slug: 'kalung-bulan-sabit',
      categorySlug: 'kalung',
      price: 450000,
      description: 'Kalung perak 925 berbentuk bulan sabit yang elegan dan minimalis.',
      descriptionEn: 'An elegant and minimalist 925 silver crescent moon necklace.',
      material: 'Perak 925',
      craftingTime: '3–5 hari kerja',
      featured: true,
    },
    {
      name: 'Gelang Anyaman Bali',
      nameEn: 'Balinese Woven Bracelet',
      slug: 'gelang-anyaman-bali',
      categorySlug: 'gelang',
      price: 280000,
      description: 'Gelang perak 925 dengan teknik anyaman tradisional pengrajin Bali.',
      descriptionEn: 'A 925 silver bracelet with traditional Balinese weaving technique.',
      material: 'Perak 925',
      craftingTime: '3–5 hari kerja',
      featured: true,
    },
  ];

  for (const p of sampleProducts) {
    const existing = await client.fetch(
      `*[_type == "product" && slug.current == $slug][0]._id`,
      { slug: p.slug }
    );
    if (existing) {
      console.log(`  ⏭  Product exists: ${p.name}`);
      continue;
    }
    const catId = categoryRefs[p.categorySlug];
    if (!catId) { console.log(`  ⚠️ Category not found: ${p.categorySlug}`); continue; }
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
      sizes: p.sizes,
      craftingTime: p.craftingTime,
      isCustomizable: p.isCustomizable ?? false,
      featured: p.featured ?? false,
      inStock: true,
    });
    console.log(`  ✅ Created product: ${p.name}`);
  }

  console.log('\n🎉 Seed complete!');
}

seed().catch(console.error);
