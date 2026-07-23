import { defineField, defineType } from 'sanity';
import { imageField } from './objects/image';

/**
 * Silver Class page (the /custom-order route). Blank fields fall back to the
 * built-in default copy.
 */
export const bespokePage = defineType({
  name: 'bespokePage',
  title: 'Silver Class Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Top of page', default: true },
    { name: 'process', title: 'How it works' },
    { name: 'form', title: 'Booking form' },
    { name: 'seo', title: 'Search & sharing' },
  ],
  fields: [
    defineField({ name: 'heroEyebrow', title: 'Small label', type: 'localeString', group: 'hero' }),
    defineField({ name: 'heroTitle1', title: 'Heading — first line', type: 'localeString', group: 'hero' }),
    defineField({ name: 'heroTitle2', title: 'Heading — second line (italic)', type: 'localeString', group: 'hero' }),
    defineField({ name: 'heroIntro', title: 'Intro paragraph', type: 'localeText', group: 'hero' }),
    defineField({
      name: 'heroCta',
      title: 'Button text',
      description: 'The button scrolls down to the booking form.',
      type: 'localeString',
      group: 'hero',
    }),
    imageField({
      name: 'heroImage',
      title: 'Photo (right side)',
      description: 'The photo beside the heading at the top of the page.',
      group: 'hero',
    }),

    defineField({ name: 'processEyebrow', title: 'Small label', type: 'localeString', group: 'process' }),
    defineField({ name: 'processTitle', title: 'Heading', type: 'localeString', group: 'process' }),
    defineField({
      name: 'steps',
      title: 'The steps',
      description:
        'The numbered steps across the middle of the page. Drag to reorder — the numbers update ' +
        'by themselves. Four fits the row exactly.',
      type: 'array',
      group: 'process',
      of: [{ type: 'processStep' }],
      validation: (Rule) => Rule.max(6).warning('More than four steps wrap onto a second row.'),
    }),

    defineField({ name: 'formEyebrow', title: 'Small label', type: 'localeString', group: 'form' }),
    defineField({ name: 'formTitle', title: 'Heading', type: 'localeString', group: 'form' }),
    defineField({ name: 'formSub', title: 'Line under the heading', type: 'localeString', group: 'form' }),
    imageField({
      name: 'formImage',
      title: 'Photo beside the form',
      description: 'Shown on wide screens only. Without a photo here the space shows a grey placeholder.',
      group: 'form',
    }),
    defineField({
      name: 'typeOptions',
      title: '"What would you like to make?" choices',
      description: 'The options in the first dropdown. Drag to reorder. Leave empty to keep the built-in list.',
      type: 'array',
      group: 'form',
      of: [{ type: 'formOption' }],
    }),
    defineField({
      name: 'budgetOptions',
      title: '"How many people?" choices',
      description: 'The options in the second dropdown. Leave empty to keep the built-in list.',
      type: 'array',
      group: 'form',
      of: [{ type: 'formOption' }],
    }),

    defineField({ name: 'seo', title: 'Search & sharing', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Silver Class Page', subtitle: 'Class description, steps, and booking form' }) },
});
