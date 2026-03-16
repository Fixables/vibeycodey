import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Customer Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'location', title: 'Location (optional)', type: 'string' }),
    defineField({ name: 'content', title: 'Testimonial (Indonesian)', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
    defineField({ name: 'contentEn', title: 'Testimonial (English)', type: 'text', rows: 4 }),
    defineField({
      name: 'rating',
      title: 'Rating (1–5)',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 99 }),
  ],
  orderings: [{ title: 'Display Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'content' },
  },
});
