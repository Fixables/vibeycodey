import { defineField, defineType } from 'sanity';

export const customOrderStep = defineType({
  name: 'customOrderStep',
  title: 'Custom Order Step',
  type: 'document',
  fields: [
    defineField({
      name: 'stepNumber',
      title: 'Step Number',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'title',
      title: 'Title (Indonesian)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: 'Title (English)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description (Indonesian)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Description (English)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'icon',
      title: 'Icon (emoji)',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 99,
    }),
  ],
  orderings: [{ title: 'Step Number', name: 'stepNumber', by: [{ field: 'stepNumber', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'stepNumber' },
    prepare({ title, subtitle }) {
      return { title: `${subtitle}. ${title}` };
    },
  },
});
