import { defineField, defineType } from 'sanity';

/**
 * Home page sections.
 *
 * These control ORDER and VISIBILITY only — each section's text and photos stay
 * in their own tab on the Home Page document. That is deliberate:
 *
 *  - it is a much smaller change to live content (nothing has to be moved),
 *  - the owner keeps editing copy where they already look for it, and
 *  - the section list stays short enough to understand at a glance.
 *
 * The three types below are the only ones the design has components for, so the
 * owner can rearrange the page but cannot produce a layout the CSS was never
 * written for. The hero is not in this list — it is always first.
 */

interface SectionOptions {
  name: string;
  title: string;
  description: string;
}

function section({ name, title, description }: SectionOptions) {
  return defineType({
    name,
    title,
    type: 'object',
    fields: [
      defineField({
        name: 'hidden',
        title: 'Hide this section',
        description: 'Turn on to take the section off the page without losing its content.',
        type: 'boolean',
        initialValue: false,
      }),
    ],
    preview: {
      select: { hidden: 'hidden' },
      prepare({ hidden }) {
        return {
          title,
          subtitle: hidden ? 'Hidden from the page' : description,
        };
      },
    },
  });
}

export const catalogueStripSection = section({
  name: 'catalogueStrip',
  title: 'Catalogue strip',
  description: 'The sideways-scrolling row of pieces',
});

export const heritageBandSection = section({
  name: 'heritageBand',
  title: 'Heritage band',
  description: 'The dark section with the figures',
});

export const manifestoSection = section({
  name: 'manifesto',
  title: 'Manifesto quote',
  description: 'The large centred quote',
});
