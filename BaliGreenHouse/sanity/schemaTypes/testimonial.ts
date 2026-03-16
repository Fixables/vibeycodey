import { defineField, defineType } from 'sanity';

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimoni Pelanggan',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Pelanggan',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'location',
      title: 'Lokasi / Peran',
      type: 'string',
      description: 'Contoh: Petani di Badung, Bali atau Penghobi Tanaman di Denpasar',
    }),
    defineField({
      name: 'content',
      title: 'Isi Testimoni',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1–5)',
      type: 'number',
      validation: (r) => r.min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'order',
      title: 'Urutan Tampil',
      type: 'number',
      description: 'Angka kecil tampil lebih dulu',
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'location' },
  },
});
