import { defineField, defineType } from 'sanity';

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title (Indonesian)',
      type: 'string',
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
      name: 'introText',
      title: 'Intro Text (Indonesian)',
      type: 'text',
      rows: 3,
      description: 'Optional introductory paragraph above the form',
    }),
    defineField({
      name: 'introTextEn',
      title: 'Intro Text (English)',
      type: 'text',
      rows: 3,
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
      return { title: title || 'Contact Page', subtitle: 'Contact page content' };
    },
  },
});
