import { defineField, defineType } from 'sanity';

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name (Indonesian)',
      description: 'e.g. Cincin, Kalung.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'nameEn', title: 'Name (English)', description: 'e.g. Rings, Necklaces.', type: 'string' }),
    defineField({
      name: 'description',
      title: 'Short description (Indonesian)',
      description: 'Shown under the category heading on its page.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'descriptionEn', title: 'Short description (English)', type: 'string' }),
    defineField({
      name: 'order',
      title: 'Order in the menu',
      description: 'Lower numbers show first (1, 2, 3 …).',
      type: 'number',
      initialValue: 99,
    }),
    defineField({
      name: 'slug',
      title: 'Web address (automatic)',
      description: 'Part of the page link. Fills in from the name — you rarely need to change it.',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [{ title: 'Menu order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'nameEn' },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? `EN: ${subtitle}` : undefined };
    },
  },
});
