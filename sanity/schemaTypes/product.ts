import { defineField, defineType } from 'sanity';

export const productType = defineType({
  name: 'product',
  title: 'Produk',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Produk',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'price',
      title: 'Harga (Rupiah)',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'imageUrl',
      title: 'URL Foto',
      type: 'url',
      description: 'URL foto produk (opsional)',
    }),
    defineField({
      name: 'unit',
      title: 'Satuan',
      type: 'string',
      description: 'Contoh: per kg, per buah, per bungkus',
    }),
    defineField({
      name: 'featured',
      title: 'Tampilkan di Halaman Utama?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'inStock',
      title: 'Tersedia di Stok?',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      categoryName: 'category.name',
    },
    prepare({ title, subtitle, categoryName }) {
      return {
        title,
        subtitle: categoryName
          ? `${categoryName} — Rp ${Number(subtitle ?? 0).toLocaleString('id-ID')}`
          : `Rp ${Number(subtitle ?? 0).toLocaleString('id-ID')}`,
      };
    },
  },
});
