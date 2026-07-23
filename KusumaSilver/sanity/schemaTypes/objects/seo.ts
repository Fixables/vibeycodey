import { defineField, defineType } from 'sanity';

/**
 * Search-engine and social-sharing text for one page.
 *
 * Every field is optional: blank falls back to the page's own heading and the
 * site-wide defaults in Site Settings, so a page is never left without a title.
 */
export const seo = defineType({
  name: 'seo',
  title: 'Search & sharing',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Title shown in Google',
      description:
        'The blue clickable line in search results. Around 60 characters — longer titles get cut off. ' +
        'Leave blank to use the page heading.',
      type: 'localeString',
      validation: (Rule) =>
        Rule.custom((value?: { id?: string; en?: string }) => {
          const tooLong = [value?.id, value?.en].filter((text) => (text?.length ?? 0) > 60);
          return tooLong.length
            ? 'Around 60 characters works best — Google cuts off longer titles.'
            : true;
        }).warning(),
    }),
    defineField({
      name: 'description',
      title: 'Description shown in Google',
      description:
        'The grey summary under the title in search results. Around 155 characters. ' +
        'Leave blank to use the page introduction.',
      type: 'localeText',
      validation: (Rule) =>
        Rule.custom((value?: { id?: string; en?: string }) => {
          const tooLong = [value?.id, value?.en].filter((text) => (text?.length ?? 0) > 160);
          return tooLong.length
            ? 'Around 155 characters works best — Google cuts off longer descriptions.'
            : true;
        }).warning(),
    }),
    defineField({
      name: 'shareImage',
      title: 'Photo used when the page is shared',
      description:
        'Shown when someone posts a link to this page on WhatsApp, Instagram or Facebook. ' +
        'A wide photo works best. Leave blank to use the site default.',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
});
