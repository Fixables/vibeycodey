import { defineField, defineType } from 'sanity';

/**
 * The catalogue page (/koleksi) header.
 *
 * This page previously had no document at all — its heading and introduction
 * were fixed in the website's code, so the owner could not touch them. The
 * pieces themselves still come from Jewellery; this only controls the wording
 * around them.
 */
export const cataloguePage = defineType({
  name: 'cataloguePage',
  title: 'Catalogue Page',
  type: 'document',
  groups: [
    { name: 'header', title: 'Page header', default: true },
    { name: 'seo', title: 'Search & sharing' },
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Small label',
      description: 'The little orange text above the heading, shown in capitals.',
      type: 'localeString',
      group: 'header',
    }),
    defineField({
      name: 'title',
      title: 'Big heading',
      description: 'The main heading at the top of the catalogue.',
      type: 'localeString',
      group: 'header',
    }),
    defineField({
      name: 'subtitle',
      title: 'Introduction',
      description: 'The sentence under the heading.',
      type: 'localeText',
      group: 'header',
    }),
    defineField({
      name: 'emptyMessage',
      title: 'Message when nothing matches',
      description:
        'Shown when a visitor filters the catalogue and no pieces match, e.g. ' +
        '"No pieces match your filters."',
      type: 'localeString',
      group: 'header',
    }),

    defineField({ name: 'seo', title: 'Search & sharing', type: 'seo', group: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Catalogue Page', subtitle: 'Heading and introduction above the pieces' }),
  },
});
