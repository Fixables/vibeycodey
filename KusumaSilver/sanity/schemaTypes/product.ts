import { defineField, defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Product (Jewelry Piece)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name (Indonesian)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameEn',
      title: 'Name (English)',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (IDR)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'description',
      title: 'Description (Indonesian)',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Description (English)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      description: 'First image is the main photo. Add multiple for the detail page gallery.',
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
      description: 'e.g. Perak 925, Sterling Silver 925',
    }),
    defineField({
      name: 'weight',
      title: 'Weight (grams)',
      type: 'number',
      description: 'Weight in grams',
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'string',
      description: 'e.g. 6, 7, 8, 9 or Free Size',
    }),
    defineField({
      name: 'stone',
      title: 'Stone / Gem',
      type: 'string',
      description: 'e.g. Blue Topaz, Onyx, None',
    }),
    defineField({
      name: 'craftingTime',
      title: 'Crafting Time',
      type: 'string',
      description: 'e.g. 3–5 hari kerja, 7–14 hari untuk custom',
    }),
    defineField({
      name: 'isCustomizable',
      title: 'Customizable?',
      type: 'boolean',
      description: 'Can this piece be customized?',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Home Page',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      subtitle: 'price',
    },
    prepare({ title, media, subtitle }) {
      return {
        title,
        media,
        subtitle: subtitle ? `Rp ${subtitle.toLocaleString('id-ID')}` : 'No price',
      };
    },
  },
});
