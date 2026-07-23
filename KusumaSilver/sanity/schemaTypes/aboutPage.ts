import { defineField, defineType } from 'sanity';
import { imageField, imageMember } from './objects/image';

/**
 * "Our Story" (Tentang Kami) page content. Blank fields fall back to the
 * built-in default copy, so nothing breaks.
 */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Our Story Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Top of page', default: true },
    { name: 'story', title: 'Story text' },
    { name: 'gallery', title: 'Photo gallery' },
    { name: 'values', title: 'Values band' },
    { name: 'cta', title: 'Bottom buttons' },
    { name: 'seo', title: 'Search & sharing' },
  ],
  fields: [
    defineField({ name: 'heroEyebrow', title: 'Small label', type: 'localeString', group: 'hero' }),
    defineField({ name: 'heroTitle', title: 'Big heading', type: 'localeString', group: 'hero' }),
    imageField({
      name: 'heroImage',
      title: 'Background photo',
      description: 'The large photo behind the page heading. The heading sits over the bottom of it.',
      group: 'hero',
    }),

    defineField({
      name: 'lede',
      title: 'Opening line (large)',
      description: 'The bigger opening sentence of the story.',
      type: 'localeText',
      group: 'story',
    }),
    defineField({ name: 'body1', title: 'Paragraph 1', type: 'localeText', group: 'story' }),
    defineField({ name: 'body2', title: 'Paragraph 2', type: 'localeText', group: 'story' }),
    defineField({
      name: 'body3',
      title: 'Paragraph 3 (after the photos)',
      description: 'This one appears below the photo gallery. Leave blank to skip it.',
      type: 'localeText',
      group: 'story',
    }),

    defineField({
      name: 'gallery',
      title: 'Photos',
      description:
        'The row of photos in the middle of the page. Drag to reorder. Two photos show side by ' +
        'side; add a third and they become three across. Each photo has its own shape setting.',
      type: 'array',
      group: 'gallery',
      of: [{ ...imageMember({ captionable: true, hideable: true }), name: 'galleryPhoto' }],
      validation: (Rule) => Rule.max(3).warning('More than three photos will not fit in one row.'),
    }),

    defineField({
      name: 'values',
      title: 'Values',
      description:
        'The items in the dark band near the bottom. Drag to reorder, or use Add item for another. ' +
        'Three fits the layout best.',
      type: 'array',
      group: 'values',
      of: [{ type: 'storyValue' }],
      validation: (Rule) => Rule.max(4).warning('More than four values get cramped.'),
    }),

    defineField({ name: 'ctaTitle', title: 'Closing heading', type: 'localeString', group: 'cta' }),
    defineField({
      name: 'ctaCatalogue',
      title: 'First button',
      description: 'The dark button. It always goes to the catalogue.',
      type: 'localeString',
      group: 'cta',
    }),
    defineField({
      name: 'ctaBespoke',
      title: 'Second button',
      description: 'The outline button. It always goes to the Silver Class page.',
      type: 'localeString',
      group: 'cta',
    }),

    defineField({ name: 'seo', title: 'Search & sharing', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Our Story Page', subtitle: 'Story, photos, and values' }) },
});
