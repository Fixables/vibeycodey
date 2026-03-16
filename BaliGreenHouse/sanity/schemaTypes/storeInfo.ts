import { defineField, defineType } from 'sanity';

export const storeInfoType = defineType({
  name: 'storeInfo',
  title: 'Informasi Toko',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Toko',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Alamat',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'city',
      title: 'Kota / Kode Pos',
      type: 'string',
    }),
    defineField({
      name: 'whatsapp',
      title: 'Nomor WhatsApp (tanpa +)',
      type: 'string',
      description: 'Contoh: 6281234567890',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'whatsappDisplay',
      title: 'Tampilan Nomor WhatsApp',
      type: 'string',
      description: 'Contoh: +62 812-3456-7890',
    }),
    defineField({
      name: 'email',
      title: 'Email (opsional)',
      type: 'string',
    }),
    defineField({
      name: 'hoursWeekday',
      title: 'Jam Buka Hari Kerja',
      type: 'string',
      description: 'Contoh: Senin – Sabtu: 08.00 – 17.00 WITA',
    }),
    defineField({
      name: 'hoursWeekend',
      title: 'Jam Buka Akhir Pekan',
      type: 'string',
      description: 'Contoh: Minggu: 09.00 – 14.00 WITA',
    }),
    defineField({
      name: 'instagram',
      title: 'Username Instagram',
      type: 'string',
      description: 'Tanpa @',
    }),
    defineField({
      name: 'facebook',
      title: 'Username Facebook',
      type: 'string',
    }),
    defineField({
      name: 'shopeeStoreUrl',
      title: 'Link Toko Shopee',
      type: 'url',
      description: 'URL halaman toko Bali Greenhouse di Shopee',
    }),
    defineField({
      name: 'mapsEmbedUrl',
      title: 'URL Embed Google Maps (opsional)',
      type: 'url',
    }),
    defineField({
      name: 'aboutContent',
      title: 'Konten "Cerita Kami"',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Paragraf untuk halaman Tentang Kami — edit bebas di sini',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'tagline' },
  },
});
