import { defineField, defineType } from 'sanity';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { imageMember } from './objects/image';

export const product = defineType({
  name: 'product',
  title: 'Jewellery Piece',
  type: 'document',
  groups: [
    { name: 'main', title: 'Basics', default: true },
    { name: 'photos', title: 'Photos' },
    { name: 'details', title: 'Details' },
    { name: 'seo', title: 'Search & sharing' },
    { name: 'advanced', title: 'Advanced' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name (Indonesian)',
      description: 'The name shown on the Indonesian site.',
      type: 'string',
      group: 'main',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameEn',
      title: 'Name (English)',
      description: 'The name shown on the English site. Leave blank to use the Indonesian name.',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'Which collection this piece belongs to.',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'main',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (Rupiah)',
      description: 'Numbers only, no dots. Type 350000 to show Rp 350.000.',
      type: 'number',
      group: 'main',
      validation: (Rule) => Rule.required().min(0).integer().error('Enter the price as a whole number of Rupiah.'),
    }),
    defineField({
      name: 'inStock',
      title: 'Available to buy',
      description: 'Turn off to mark the piece as unavailable and hide the Add-to-Bag button.',
      type: 'boolean',
      initialValue: true,
      group: 'main',
    }),
    defineField({
      name: 'featured',
      title: 'Show on the home page',
      description: 'Featured pieces appear in the scrolling strip on the home page.',
      type: 'boolean',
      initialValue: false,
      group: 'main',
    }),

    defineField({
      name: 'images',
      title: 'Photos',
      description:
        'The first photo is the main one — it is what shows on the catalogue card. The next three ' +
        'appear as small thumbnails on the piece page. Drag to reorder. Open a photo to describe it ' +
        'and to choose which part stays visible when it is trimmed to a square.',
      type: 'array',
      group: 'photos',
      of: [imageMember({ captionable: false, hideable: false })],
      validation: (Rule) => Rule.min(1).warning('A piece without a photo shows a grey placeholder.'),
    }),

    defineField({
      name: 'body',
      title: 'Description',
      description:
        'Shown on the piece page. Use the toolbar for bullet points, numbered lists, bold and ' +
        'italic — handy for explaining what a motif means, or listing what is included.',
      type: 'localeRichText',
      group: 'details',
    }),

    // Superseded by the formatted Description above. Kept so nothing is lost and
    // so the site still reads them for any piece not yet migrated.
    defineField({
      name: 'description',
      title: 'Description (old plain text)',
      type: 'text',
      rows: 4,
      group: 'details',
      readOnly: true,
      hidden: ({ parent }) => !parent?.description,
      description: 'Replaced by the formatted Description above.',
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Description, English (old plain text)',
      type: 'text',
      rows: 4,
      group: 'details',
      readOnly: true,
      hidden: ({ parent }) => !parent?.descriptionEn,
    }),
    defineField({
      name: 'materialRef',
      title: 'Material',
      description:
        'Pick from your Materials list. Add a new one under Materials in the sidebar. ' +
        'Leave blank to use the site default.',
      type: 'reference',
      to: [{ type: 'material' }],
      group: 'details',
    }),
    defineField({
      name: 'gemstones',
      title: 'Gemstones',
      description:
        'Tick every stone this piece is available with — one entry each, not a sentence. ' +
        'These become the Gemstone filter in the catalogue, so a shopper looking for ' +
        'Amethyst will find this piece.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'gemstone' }] }],
      group: 'details',
    }),
    defineField({
      name: 'sizeOptions',
      title: 'Available sizes',
      description:
        'Tick every size this piece comes in. Shoppers choose from these on the piece page, ' +
        'and they become the Size filter. Leave empty if the piece has no sizes.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'size' }] }],
      group: 'details',
    }),

    // ---- Superseded by the lists above; kept so nothing is lost and so the
    // site still reads them for any piece that has not been migrated yet.
    defineField({
      name: 'material',
      title: 'Material (old free text)',
      type: 'string',
      group: 'details',
      readOnly: true,
      hidden: ({ parent }) => !parent?.material,
      description: 'Replaced by the Material picker above. Shown only because this piece still has a value.',
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes (old free text)',
      type: 'string',
      group: 'details',
      readOnly: true,
      hidden: ({ parent }) => !parent?.sizes,
      description: 'Replaced by Available sizes above.',
    }),
    defineField({
      name: 'stone',
      title: 'Stone (old free text)',
      type: 'string',
      group: 'details',
      readOnly: true,
      hidden: ({ parent }) => !parent?.stone,
      description: 'Replaced by Gemstones above.',
    }),
    defineField({
      name: 'weight',
      title: 'Weight (grams)',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'craftingTime',
      title: 'Lead time',
      type: 'string',
      description: 'e.g. "3–5 hari kerja". Leave blank to use the site default.',
      group: 'details',
    }),
    defineField({
      name: 'origin',
      title: 'Origin (only if different)',
      description:
        'Shown in the details table. Leave blank to use the site-wide origin set in Site Settings.',
      type: 'localeString',
      group: 'details',
    }),
    defineField({
      name: 'technique',
      title: 'Technique (only if different)',
      description:
        'Shown in the details table. Leave blank to use the site-wide technique set in Site Settings.',
      type: 'localeString',
      group: 'details',
    }),
    defineField({
      name: 'isCustomizable',
      title: 'Can be customised',
      type: 'boolean',
      initialValue: false,
      group: 'details',
    }),

    defineField({ name: 'seo', title: 'Search & sharing', type: 'seo', group: 'seo' }),

    defineField({
      name: 'slug',
      title: 'Page address',
      description:
        'The last part of this piece\'s link. It is filled in from the name automatically. ' +
        'Changing it changes the page address — any existing links to this piece will stop working.',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      group: 'advanced',
      validation: (Rule) => Rule.required(),
    }),
    orderRankField({ type: 'product', hidden: true }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: { title: 'name', media: 'images.0', price: 'price', stock: 'inStock', featured: 'featured' },
    prepare({ title, media, price, stock, featured }) {
      const shown = price ? `Rp ${price.toLocaleString('id-ID')}` : 'No price';
      const flags = [stock === false ? 'Not available' : null, featured ? 'On home page' : null].filter(Boolean);
      return { title, media, subtitle: [shown, ...flags].join(' · ') };
    },
  },
});
