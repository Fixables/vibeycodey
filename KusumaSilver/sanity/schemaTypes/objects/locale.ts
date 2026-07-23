import { defineField, defineType } from 'sanity';

/**
 * Bilingual text. The site runs in Indonesian and English, so every piece of
 * visible copy has two values.
 *
 * This replaces the old `foo` / `fooEn` twin-field pattern, which showed the
 * owner two separate fields for every sentence (bespokePage had 34 of them in
 * one flat list). Grouping them halves the field count and makes the pairing
 * obvious.
 *
 * English is optional throughout: a line written only in Indonesian still shows
 * on the English site rather than vanishing from it. See `pickLocalized` in
 * lib/home-content.ts, which also still reads the old flat pairs so documents
 * migrate without downtime.
 */

const ID_TITLE = 'Bahasa Indonesia';
const EN_TITLE = 'English';
const EN_DESCRIPTION = 'Leave blank to show the Indonesian text on the English site too.';

export const localeString = defineType({
  name: 'localeString',
  title: 'Text',
  type: 'object',
  // Side by side rather than stacked — the two values are one thought.
  options: { columns: 2 },
  fields: [
    defineField({ name: 'id', title: ID_TITLE, type: 'string' }),
    defineField({ name: 'en', title: EN_TITLE, type: 'string', description: EN_DESCRIPTION }),
  ],
});

export const localeText = defineType({
  name: 'localeText',
  title: 'Paragraph',
  type: 'object',
  fields: [
    defineField({ name: 'id', title: ID_TITLE, type: 'text', rows: 3 }),
    defineField({
      name: 'en',
      title: EN_TITLE,
      type: 'text',
      rows: 3,
      description: EN_DESCRIPTION,
    }),
  ],
});
