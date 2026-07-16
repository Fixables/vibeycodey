import { defineField, defineType } from 'sanity';

/**
 * "Our Story" (Tentang Kami) page content. Blank fields fall back to the
 * built-in default copy, so nothing breaks. Each text field comes in two
 * languages: (ID) Indonesian and (EN) English.
 */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Top of page', default: true },
    { name: 'story', title: 'Story text' },
    { name: 'values', title: 'Values band' },
  ],
  fields: [
    defineField({ name: 'heroEyebrow', title: 'Top — small label (ID)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroEyebrowEn', title: 'Top — small label (EN)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle', title: 'Top — big heading (ID)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitleEn', title: 'Top — big heading (EN)', type: 'string', group: 'hero' }),
    defineField({
      name: 'heroImage',
      title: 'Top — background photo',
      description: 'The large photo behind the page heading.',
      type: 'image',
      options: { hotspot: true },
      group: 'hero',
    }),

    defineField({
      name: 'lede',
      title: 'Story — opening line, large (ID)',
      description: 'The bigger opening sentence of the story.',
      type: 'text',
      rows: 2,
      group: 'story',
    }),
    defineField({ name: 'ledeEn', title: 'Story — opening line, large (EN)', type: 'text', rows: 2, group: 'story' }),
    defineField({ name: 'body1', title: 'Story — paragraph 1 (ID)', type: 'text', rows: 3, group: 'story' }),
    defineField({ name: 'body1En', title: 'Story — paragraph 1 (EN)', type: 'text', rows: 3, group: 'story' }),
    defineField({ name: 'body2', title: 'Story — paragraph 2 (ID)', type: 'text', rows: 3, group: 'story' }),
    defineField({ name: 'body2En', title: 'Story — paragraph 2 (EN)', type: 'text', rows: 3, group: 'story' }),
    defineField({ name: 'body3', title: 'Story — paragraph 3 (ID)', type: 'text', rows: 3, group: 'story' }),
    defineField({ name: 'body3En', title: 'Story — paragraph 3 (EN)', type: 'text', rows: 3, group: 'story' }),
    defineField({ name: 'galleryImage1', title: 'Story — gallery photo 1 (left)', type: 'image', options: { hotspot: true }, group: 'story' }),
    defineField({ name: 'galleryImage2', title: 'Story — gallery photo 2 (right)', type: 'image', options: { hotspot: true }, group: 'story' }),

    defineField({ name: 'value1Head', title: 'Values — item 1 title (ID)', type: 'string', group: 'values' }),
    defineField({ name: 'value1HeadEn', title: 'Values — item 1 title (EN)', type: 'string', group: 'values' }),
    defineField({ name: 'value1Body', title: 'Values — item 1 text (ID)', type: 'text', rows: 2, group: 'values' }),
    defineField({ name: 'value1BodyEn', title: 'Values — item 1 text (EN)', type: 'text', rows: 2, group: 'values' }),
    defineField({ name: 'value2Head', title: 'Values — item 2 title (ID)', type: 'string', group: 'values' }),
    defineField({ name: 'value2HeadEn', title: 'Values — item 2 title (EN)', type: 'string', group: 'values' }),
    defineField({ name: 'value2Body', title: 'Values — item 2 text (ID)', type: 'text', rows: 2, group: 'values' }),
    defineField({ name: 'value2BodyEn', title: 'Values — item 2 text (EN)', type: 'text', rows: 2, group: 'values' }),
    defineField({ name: 'value3Head', title: 'Values — item 3 title (ID)', type: 'string', group: 'values' }),
    defineField({ name: 'value3HeadEn', title: 'Values — item 3 title (EN)', type: 'string', group: 'values' }),
    defineField({ name: 'value3Body', title: 'Values — item 3 text (ID)', type: 'text', rows: 2, group: 'values' }),
    defineField({ name: 'value3BodyEn', title: 'Values — item 3 text (EN)', type: 'text', rows: 2, group: 'values' }),

    defineField({ name: 'ctaTitle', title: 'Bottom — call-to-action heading (ID)', type: 'string', group: 'values' }),
    defineField({ name: 'ctaTitleEn', title: 'Bottom — call-to-action heading (EN)', type: 'string', group: 'values' }),
  ],
  preview: { prepare: () => ({ title: 'About Page', subtitle: 'Our Story page content' }) },
});
