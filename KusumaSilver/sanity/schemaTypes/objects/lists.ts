import { defineField, defineType } from 'sanity';

/**
 * The small repeatable items the owner can drag into order, add to, and hide.
 *
 * Each one replaces a set of hard-numbered fields (`step1Title`…`step4Body`,
 * `value1Head`…`value3Body`, `statSilver`/`statGen`/`statHand`), which could not
 * be reordered, extended, or shortened. The readers in lib/home-content.ts still
 * fall back to those legacy fields, so documents migrate without downtime.
 */

/** Shared "park this without deleting it" switch. */
const hiddenField = defineField({
  name: 'hidden',
  title: 'Hide this',
  description: 'Turn on to take it off the website without deleting it. Turn off to bring it back.',
  type: 'boolean',
  initialValue: false,
});

/** Preview that greys out hidden items so the owner can see what is live. */
function listPreview(titleKey: string, subtitleKey?: string) {
  return {
    select: { title: titleKey, subtitle: subtitleKey ?? '', hidden: 'hidden' },
    prepare({ title, subtitle, hidden }: Record<string, unknown>) {
      return {
        title: (title as string) || 'Untitled',
        subtitle: hidden ? 'Hidden from the website' : (subtitle as string) || undefined,
      };
    },
  };
}

/** One figure in the dark heritage band, e.g. "925 / STERLING SILVER". */
export const heritageStat = defineType({
  name: 'heritageStat',
  title: 'Figure',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'The big number',
      description: 'The large figure itself, e.g. 925, 3, or 100%. Same in both languages.',
      type: 'string',
      validation: (Rule) => Rule.required().max(6).error('Keep it short — long numbers overflow the band.'),
    }),
    defineField({
      name: 'label',
      title: 'Label under the number',
      description: 'e.g. STERLING SILVER. Shown in small capitals.',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    hiddenField,
  ],
  preview: listPreview('value', 'label.id'),
});

/** One of the values in the dark band on Our Story. */
export const storyValue = defineType({
  name: 'storyValue',
  title: 'Value',
  type: 'object',
  fields: [
    defineField({
      name: 'head',
      title: 'Title',
      description: 'e.g. "Hand-forged".',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Text underneath',
      type: 'localeText',
      validation: (Rule) => Rule.required(),
    }),
    hiddenField,
  ],
  preview: listPreview('head.id', 'body.id'),
});

/** One step in the Silver Class "how it works" row. */
export const processStep = defineType({
  name: 'processStep',
  title: 'Step',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Step title',
      description: 'The step is numbered automatically — do not type "01" here.',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'body', title: 'Step description', type: 'localeText' }),
    hiddenField,
  ],
  preview: listPreview('title.id', 'body.id'),
});

/** One choice in a dropdown on the Silver Class booking form. */
export const formOption = defineType({
  name: 'formOption',
  title: 'Choice',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Choice',
      description: 'One option in the dropdown, e.g. "A ring" or "2 people".',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    hiddenField,
  ],
  preview: listPreview('label.id'),
});

/** One editorial card in the home page's scrolling catalogue strip. */
export const cataloguePanel = defineType({
  name: 'panel',
  title: 'Card',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Small heading',
      description: 'The short label in capitals, e.g. TECHNIQUE.',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text underneath',
      type: 'localeText',
      validation: (Rule) => Rule.required(),
    }),
    hiddenField,
  ],
  preview: listPreview('label.id', 'text.id'),
});
