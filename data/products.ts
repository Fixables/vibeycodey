import { Product } from '@/types';

// =============================================================================
// PRODUCTS — Edit this file to manage your product catalog
// =============================================================================
//
// HOW TO EDIT A PRODUCT:
//   Just find the product below and change any field you want.
//   Save the file and the site will update automatically.
//
// HOW TO ADD A NEW PRODUCT:
//   Copy one of the blocks below, paste it at the end of the matching
//   category section, and fill in your details. Make sure:
//     • id      — unique, e.g. 'p021', 'p022', ...
//     • slug    — unique URL-friendly name, e.g. 'benih-kangkung'
//     • category — must match one of the slugs in data/categories.ts
//
// HOW TO ADD A PHOTO:
//   1. Put your image file in:  public/images/products/
//      (any format: .jpg .png .webp — recommended size: 800x800px)
//   2. Set imageUrl to:  '/images/products/your-filename.jpg'
//   3. If you leave imageUrl out (or set it to undefined), a green
//      placeholder will show automatically — no errors.
//
// FIELD REFERENCE:
//   id          — unique identifier, never change after going live
//   slug        — unique, URL-safe name (lowercase, hyphens only)
//   name        — product name shown on the card
//   category    — category slug (see data/categories.ts for options)
//   price       — price in Rupiah as a number
//   priceDisplay— price formatted as a string shown to customers
//   description — short description shown on the card
//   imageUrl    — path to photo in /public folder (optional)
//   unit        — unit label shown as a badge, e.g. 'per kg', 'per buah'
//   featured    — true = appears on the homepage Featured Products section
//   inStock     — false = hides the product from the catalog
//
// =============================================================================

export const products: Product[] = [

  // ---------------------------------------------------------------------------
  // BENIH & BIBIT
  // ---------------------------------------------------------------------------
  {
    id: 'p001',
    slug: 'benih-tomat-cherry',
    name: 'Benih Tomat Cherry',
    category: 'benih-bibit',
    price: 15000,
    priceDisplay: 'Rp 15.000',
    description: 'Benih tomat cherry unggul, cocok untuk pot dan kebun rumah. Produksi buah lebat dengan rasa manis.',
    imageUrl: undefined,
    unit: 'per bungkus',
    featured: true,
    inStock: true,
  },
  {
    id: 'p002',
    slug: 'bibit-cabai-merah',
    name: 'Bibit Cabai Merah',
    category: 'benih-bibit',
    price: 8000,
    priceDisplay: 'Rp 8.000',
    description: 'Bibit cabai merah keriting siap tanam, tinggi 15–20 cm. Tahan penyakit dan produktivitas tinggi.',
    imageUrl: undefined,
    unit: 'per bibit',
    featured: false,
    inStock: true,
  },
  {
    id: 'p003',
    slug: 'benih-selada-hidroponik',
    name: 'Benih Selada Hidroponik',
    category: 'benih-bibit',
    price: 20000,
    priceDisplay: 'Rp 20.000',
    description: 'Benih selada varietas lollo rosso, ideal untuk sistem hidroponik NFT dan DWC.',
    imageUrl: undefined,
    unit: 'per bungkus',
    featured: true,
    inStock: true,
  },

  // ---------------------------------------------------------------------------
  // PUPUK
  // ---------------------------------------------------------------------------
  {
    id: 'p004',
    slug: 'pupuk-npk-mutiara',
    name: 'Pupuk NPK Mutiara 16-16-16',
    category: 'pupuk',
    price: 35000,
    priceDisplay: 'Rp 35.000',
    description: 'Pupuk NPK seimbang untuk pertumbuhan menyeluruh. Cocok untuk sayuran, buah, dan tanaman hias.',
    imageUrl: undefined,
    unit: 'per kg',
    featured: true,
    inStock: true,
  },
  {
    id: 'p005',
    slug: 'pupuk-organik-cair-nasa',
    name: 'Pupuk Organik Cair NASA',
    category: 'pupuk',
    price: 45000,
    priceDisplay: 'Rp 45.000',
    description: 'Pupuk organik cair mengandung hormon pertumbuhan alami. Merangsang akar dan mempercepat panen.',
    imageUrl: undefined,
    unit: 'per 500ml',
    featured: false,
    inStock: true,
  },
  {
    id: 'p006',
    slug: 'kompos-organik-premium',
    name: 'Kompos Organik Premium',
    category: 'pupuk',
    price: 25000,
    priceDisplay: 'Rp 25.000',
    description: 'Kompos matang dari bahan organik pilihan. Memperbaiki struktur tanah dan meningkatkan kesuburan.',
    imageUrl: undefined,
    unit: 'per 5kg',
    featured: false,
    inStock: true,
  },

  // ---------------------------------------------------------------------------
  // MEDIA TANAM
  // ---------------------------------------------------------------------------
  {
    id: 'p007',
    slug: 'cocopeat-block',
    name: 'Cocopeat Block',
    category: 'media-tanam',
    price: 20000,
    priceDisplay: 'Rp 20.000',
    description: 'Cocopeat press dari sabut kelapa berkualitas. Menyimpan air lebih lama, aerasi akar optimal.',
    imageUrl: undefined,
    unit: 'per blok 5kg',
    featured: true,
    inStock: true,
  },
  {
    id: 'p008',
    slug: 'tanah-pot-premium',
    name: 'Tanah Pot Premium',
    category: 'media-tanam',
    price: 30000,
    priceDisplay: 'Rp 30.000',
    description: 'Campuran tanah, cocopeat, dan pupuk organik siap pakai. pH seimbang untuk semua jenis tanaman.',
    imageUrl: undefined,
    unit: 'per 10kg',
    featured: false,
    inStock: true,
  },
  {
    id: 'p009',
    slug: 'perlite-hortikultura',
    name: 'Perlite Hortikultura',
    category: 'media-tanam',
    price: 18000,
    priceDisplay: 'Rp 18.000',
    description: 'Perlite grade A untuk meningkatkan drainase media tanam. Ideal untuk kaktus, sukulen, dan hidroponik.',
    imageUrl: undefined,
    unit: 'per liter',
    featured: false,
    inStock: true,
  },

  // ---------------------------------------------------------------------------
  // PESTISIDA & FUNGISIDA
  // ---------------------------------------------------------------------------
  {
    id: 'p010',
    slug: 'insektisida-organik',
    name: 'Insektisida Organik Neem Oil',
    category: 'pestisida-fungisida',
    price: 40000,
    priceDisplay: 'Rp 40.000',
    description: 'Pestisida berbahan minyak nimba, aman untuk lingkungan. Efektif mengendalikan kutu, ulat, dan hama.',
    imageUrl: undefined,
    unit: 'per 250ml',
    featured: true,
    inStock: true,
  },
  {
    id: 'p011',
    slug: 'fungisida-mankozeb',
    name: 'Fungisida Mankozeb 80WP',
    category: 'pestisida-fungisida',
    price: 28000,
    priceDisplay: 'Rp 28.000',
    description: 'Fungisida kontak spektrum luas. Mencegah dan mengendalikan penyakit busuk daun dan embun tepung.',
    imageUrl: undefined,
    unit: 'per 100gr',
    featured: false,
    inStock: true,
  },

  // ---------------------------------------------------------------------------
  // ALAT SEMPROT
  // ---------------------------------------------------------------------------
  {
    id: 'p012',
    slug: 'sprayer-elektrik-16l',
    name: 'Sprayer Elektrik 16 Liter',
    category: 'alat-semprot',
    price: 350000,
    priceDisplay: 'Rp 350.000',
    description: 'Sprayer elektrik dengan baterai 12V, kapasitas 16 liter. Pompa otomatis, tekanan stabil.',
    imageUrl: undefined,
    unit: 'per unit',
    featured: true,
    inStock: true,
  },
  {
    id: 'p013',
    slug: 'sprayer-tangan-2l',
    name: 'Sprayer Tangan 2 Liter',
    category: 'alat-semprot',
    price: 35000,
    priceDisplay: 'Rp 35.000',
    description: 'Sprayer pompa manual kapasitas 2 liter. Ringan dan mudah digunakan untuk tanaman dalam pot.',
    imageUrl: undefined,
    unit: 'per unit',
    featured: false,
    inStock: true,
  },

  // ---------------------------------------------------------------------------
  // POT & WADAH TANAM
  // ---------------------------------------------------------------------------
  {
    id: 'p014',
    slug: 'pot-gerabah-30cm',
    name: 'Pot Gerabah 30cm',
    category: 'pot-wadah',
    price: 25000,
    priceDisplay: 'Rp 25.000',
    description: 'Pot gerabah tanah liat asli, diameter 30cm. Sirkulasi udara alami untuk akar yang sehat.',
    imageUrl: undefined,
    unit: 'per buah',
    featured: true,
    inStock: true,
  },
  {
    id: 'p015',
    slug: 'grow-bag-20l',
    name: 'Grow Bag 20 Liter',
    category: 'pot-wadah',
    price: 15000,
    priceDisplay: 'Rp 15.000',
    description: 'Grow bag kain non-woven kapasitas 20 liter. Air pruning akar, drainage excellent.',
    imageUrl: undefined,
    unit: 'per buah',
    featured: false,
    inStock: true,
  },
  {
    id: 'p016',
    slug: 'tray-semai-128-lubang',
    name: 'Tray Semai 128 Lubang',
    category: 'pot-wadah',
    price: 22000,
    priceDisplay: 'Rp 22.000',
    description: 'Tray semai plastik 128 lubang, material PP tebal tahan lama. Ideal untuk pembibitan skala besar.',
    imageUrl: undefined,
    unit: 'per buah',
    featured: false,
    inStock: true,
  },

  // ---------------------------------------------------------------------------
  // ALAT BERKEBUN
  // ---------------------------------------------------------------------------
  {
    id: 'p017',
    slug: 'sekop-mini-set',
    name: 'Set Sekop Mini 3 Pcs',
    category: 'alat-berkebun',
    price: 45000,
    priceDisplay: 'Rp 45.000',
    description: 'Set sekop mini 3 buah (sekop, garpu, trowel) dengan gagang ergonomis anti-slip.',
    imageUrl: undefined,
    unit: 'per set',
    featured: true,
    inStock: true,
  },
  {
    id: 'p018',
    slug: 'gunting-pangkas-bypass',
    name: 'Gunting Pangkas Bypass',
    category: 'alat-berkebun',
    price: 65000,
    priceDisplay: 'Rp 65.000',
    description: 'Gunting pangkas baja stainless, mekanisme bypass. Tajam, ringan, nyaman di tangan.',
    imageUrl: undefined,
    unit: 'per buah',
    featured: false,
    inStock: true,
  },

  // ---------------------------------------------------------------------------
  // PERLENGKAPAN KEBUN
  // ---------------------------------------------------------------------------
  {
    id: 'p019',
    slug: 'selang-air-15m',
    name: 'Selang Air 15 Meter',
    category: 'perlengkapan',
    price: 55000,
    priceDisplay: 'Rp 55.000',
    description: 'Selang air fleksibel 15 meter, diameter 1/2 inci. Anti-kink, tahan UV dan tekanan tinggi.',
    imageUrl: undefined,
    unit: 'per roll',
    featured: false,
    inStock: true,
  },
  {
    id: 'p020',
    slug: 'rak-tanaman-5-susun',
    name: 'Rak Tanaman 5 Susun',
    category: 'perlengkapan',
    price: 280000,
    priceDisplay: 'Rp 280.000',
    description: 'Rak tanaman besi 5 susun, coating anti-karat. Cocok untuk balkon dan teras, mudah dirakit.',
    imageUrl: undefined,
    unit: 'per unit',
    featured: true,
    inStock: true,
  },

];

// =============================================================================
// Do not edit below this line
// =============================================================================

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured && p.inStock);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug && p.inStock);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
