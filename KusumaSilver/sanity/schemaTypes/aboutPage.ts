import { defineField, defineType } from 'sanity';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title (Indonesian)',
      type: 'string',
      description: 'Heading shown at top of About page',
    }),
    defineField({
      name: 'pageTitleEn',
      title: 'Page Title (English)',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle (Indonesian)',
      type: 'string',
    }),
    defineField({
      name: 'subtitleEn',
      title: 'Subtitle (English)',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content (Indonesian)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text body of the About page',
    }),
    defineField({
      name: 'contentEn',
      title: 'Content (English)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'heroImage',
      title: 'About Page Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'values',
      title: 'Brand Values',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title (Indonesian)', type: 'string' },
            { name: 'titleEn', title: 'Title (English)', type: 'string' },
            { name: 'description', title: 'Description (Indonesian)', type: 'text', rows: 3 },
            { name: 'descriptionEn', title: 'Description (English)', type: 'text', rows: 3 },
          ],
          preview: { select: { title: 'title' } },
        },
      ],
      description: 'Value propositions shown on the about page',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Page Title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Meta Description',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { title: 'pageTitle' },
    prepare({ title }) {
      return { title: title || 'About Page', subtitle: 'About page content' };
    },
  },
});
