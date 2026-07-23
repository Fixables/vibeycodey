import { defineField, defineType } from 'sanity';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { imageField } from './objects/image';

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  groups: [
    { name: 'main', title: 'Basics', default: true },
    { name: 'seo', title: 'Search & sharing' },
    { name: 'advanced', title: 'Advanced' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name (Indonesian)',
      description: 'e.g. Cincin, Kalung.',
      type: 'string',
      group: 'main',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameEn',
      title: 'Name (English)',
      description: 'e.g. Rings, Necklaces.',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'description',
      title: 'Short description (Indonesian)',
      description: 'Shown under the category heading on its page.',
      type: 'string',
      group: 'main',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Short description (English)',
      type: 'string',
      group: 'main',
    }),
    imageField({
      name: 'image',
      title: 'Category photo',
      description:
        'The photo that represents this category. Leave blank and the site borrows the first ' +
        'photo from a piece in the category instead.',
      group: 'main',
    }),

    defineField({ name: 'seo', title: 'Search & sharing', type: 'seo', group: 'seo' }),

    defineField({
      name: 'slug',
      title: 'Page address',
      description:
        'The last part of the category page link. It is filled in from the name automatically. ' +
        'Changing it changes the page address — any existing links to this category will stop working.',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      group: 'advanced',
      validation: (Rule) => Rule.required(),
    }),
    // The old manual "order in the menu" number. Superseded by drag-and-drop
    // ordering, but kept (hidden) so nothing is lost and so categories that
    // have not been dragged yet keep the sequence the owner already chose.
    defineField({
      name: 'order',
      title: 'Menu order (no longer used)',
      type: 'number',
      hidden: true,
      readOnly: true,
      group: 'advanced',
    }),
    orderRankField({ type: 'category', hidden: true }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: { title: 'name', subtitle: 'nameEn', media: 'image' },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle ? `EN: ${subtitle}` : undefined, media };
    },
  },
});
