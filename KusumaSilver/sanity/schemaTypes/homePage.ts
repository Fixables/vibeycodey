import { defineField, defineType } from 'sanity';
import { imageField } from './objects/image';

/**
 * Home page content. Every field maps to a visible part of the home page.
 * Leaving a field blank falls back to the built-in default text, so the site
 * never breaks.
 *
 * Text fields hold both languages in one place (Bahasa Indonesia + English).
 * Documents written before that change still hold separate `…En` fields; the
 * website reads either shape, so nothing has to be migrated in a hurry.
 */
export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Top of page', default: true },
    { name: 'layout', title: 'Section order' },
    { name: 'strip', title: 'Catalogue strip' },
    { name: 'heritage', title: 'Heritage band' },
    { name: 'manifesto', title: 'Manifesto' },
    { name: 'seo', title: 'Search & sharing' },
  ],
  fields: [
    // ---- Hero ----
    defineField({
      name: 'heroEyebrow',
      title: 'Small label above the headline',
      description: 'The little orange text at the top, e.g. "925 STERLING · NORTH BALI".',
      type: 'localeString',
      group: 'hero',
    }),
    defineField({
      name: 'heroTitle1',
      title: 'Headline — first line',
      description: 'The large headline. The first line is upright, the second is italic.',
      type: 'localeString',
      group: 'hero',
    }),
    defineField({
      name: 'heroTitle2',
      title: 'Headline — second line (italic)',
      type: 'localeString',
      group: 'hero',
    }),
    defineField({
      name: 'heroDescRich',
      title: 'Paragraph under the headline',
      type: 'localeRichText',
      group: 'hero',
    }),
    defineField({
      name: 'heroCta1',
      title: 'First button',
      description: 'The dark button. It always goes to the catalogue.',
      type: 'localeString',
      group: 'hero',
    }),
    defineField({
      name: 'heroCta2',
      title: 'Second button',
      description: 'The outline button. It always goes to Our Story.',
      type: 'localeString',
      group: 'hero',
    }),
    defineField({
      name: 'heroCoords',
      title: 'Small line under the buttons',
      description: 'The location line, e.g. SINGARAJA · 8°6′ S, 115°5′ E. Same in both languages.',
      type: 'string',
      group: 'hero',
    }),
    imageField({
      name: 'heroImage',
      title: 'Main photo',
      description: 'The large photo on the left of the top section.',
      group: 'hero',
    }),

    // ---- Section order ----
    defineField({
      name: 'sections',
      title: 'Sections, in order',
      description:
        'Drag to change the order the sections appear down the page, or hide one temporarily. ' +
        'The top section with the big headline is always first and is not listed here. ' +
        'Leave this empty to keep the standard order.',
      type: 'array',
      group: 'layout',
      of: [{ type: 'catalogueStrip' }, { type: 'heritageBand' }, { type: 'manifesto' }],
      validation: (Rule) => Rule.max(6),
    }),

    // ---- Catalogue strip ----
    defineField({
      name: 'catalogueHead',
      title: 'Heading above the row',
      description: 'The words above the scrolling row of pieces, e.g. "The Catalogue".',
      type: 'localeString',
      group: 'strip',
    }),
    defineField({
      name: 'cataloguePanels',
      title: 'Text cards between the photos',
      description:
        'The small cards that sit between product photos in the scrolling row. They repeat in ' +
        'order once the photos run out. Drag to reorder. Leave the list empty to keep the six built-in cards.',
      type: 'array',
      group: 'strip',
      of: [{ type: 'panel' }],
    }),

    // ---- Heritage band ----
    defineField({ name: 'heritageEyebrow', title: 'Small label', type: 'localeString', group: 'heritage' }),
    defineField({
      name: 'heritageTitle',
      title: 'Heading',
      description: 'The heading in the dark band.',
      type: 'localeString',
      group: 'heritage',
    }),
    defineField({ name: 'heritageBodyRich', title: 'Paragraph', type: 'localeRichText', group: 'heritage' }),
    defineField({
      name: 'stats',
      title: 'The figures',
      description:
        'The large numbers along the bottom of the dark band. Drag to reorder, or use Add item ' +
        'for another. Three fits best; four is the most that stays readable.',
      type: 'array',
      group: 'heritage',
      of: [{ type: 'heritageStat' }],
      validation: (Rule) => Rule.max(4).warning('More than four figures get cramped on phones.'),
    }),
    imageField({
      name: 'heritageImage',
      title: 'Photo',
      description: 'The photo on the right of the dark band.',
      group: 'heritage',
    }),

    // ---- Manifesto ----
    defineField({
      name: 'manifestoQuote',
      title: 'Quote',
      description: 'The large centred quote near the bottom of the page.',
      type: 'localeText',
      group: 'manifesto',
    }),
    defineField({
      name: 'manifestoAttr',
      title: 'Line under the quote',
      description: 'e.g. "— THE KUSUMA FAMILY, SINGARAJA".',
      type: 'localeString',
      group: 'manifesto',
    }),

    defineField({ name: 'seo', title: 'Search & sharing', type: 'seo', group: 'seo' }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page', subtitle: 'Top section, catalogue strip, heritage band, manifesto' };
    },
  },
});
