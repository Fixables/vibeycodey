import { Category } from '@/types';

export const categories: Category[] = [
  {
    slug: 'benih-bibit',
    name: 'Benih & Bibit',
    description: 'Benih sayuran, buah, bunga, dan bibit siap tanam',
    icon: '🌱',
  },
  {
    slug: 'pupuk',
    name: 'Pupuk',
    description: 'Pupuk organik, kimia, cair, dan granul',
    icon: '🪣',
  },
  {
    slug: 'media-tanam',
    name: 'Media Tanam',
    description: 'Tanah pot, cocopeat, sekam, perlite, kompos',
    icon: '🌍',
  },
  {
    slug: 'pestisida-fungisida',
    name: 'Pestisida & Fungisida',
    description: 'Pembasmi hama, jamur, dan penyakit tanaman',
    icon: '🛡️',
  },
  {
    slug: 'alat-semprot',
    name: 'Alat Semprot',
    description: 'Sprayer tangan, sprayer elektrik, nozzle',
    icon: '💦',
  },
  {
    slug: 'pot-wadah',
    name: 'Pot & Wadah Tanam',
    description: 'Pot plastik, pot gerabah, grow bag, tray semai',
    icon: '🪴',
  },
  {
    slug: 'alat-berkebun',
    name: 'Alat Berkebun',
    description: 'Sekop, cangkul, gunting tanaman, sarung tangan',
    icon: '🌿',
  },
  {
    slug: 'perlengkapan',
    name: 'Perlengkapan Kebun',
    description: 'Selang, irigasi, rak tanaman, jaring tanaman',
    icon: '🔧',
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
