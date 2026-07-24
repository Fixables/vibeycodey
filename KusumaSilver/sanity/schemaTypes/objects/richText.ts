import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * A formatted paragraph: bullet points, numbered lists, bold, italic, links.
 *
 * WHAT IS DELIBERATELY MISSING
 * No headings, no font sizes, no colours, no alignment, no inline images. The
 * page design owns typography — a heading typed into a product description
 * would not match the ones the page already renders, and would drift further
 * every time the design changes. Restricting the toolbar is what keeps the site
 * looking like one site.
 *
 * Only used for genuine paragraphs. Headings, button labels and short lines stay
 * plain strings so they cannot be bolded or bulleted into breaking a layout.
 */
const blockMember = defineArrayMember({
  type: 'block',
  // No `styles` beyond normal: the design decides what a heading looks like.
  styles: [{ title: 'Paragraph', value: 'normal' }],
  lists: [
    { title: 'Bullet list', value: 'bullet' },
    { title: 'Numbered list', value: 'number' },
  ],
  marks: {
    decorators: [
      { title: 'Bold', value: 'strong' },
      { title: 'Italic', value: 'em' },
    ],
    annotations: [
      defineField({
        name: 'link',
        title: 'Link',
        type: 'object',
        fields: [
          defineField({
            name: 'href',
            title: 'Web address',
            description: 'A full address (https://…), or a path on this site such as /id/koleksi.',
            type: 'url',
            validation: (Rule) =>
              Rule.required().uri({
                scheme: ['http', 'https', 'mailto', 'tel'],
                allowRelative: true,
              }),
          }),
        ],
      }),
    ],
  },
});

export const richText = defineType({
  name: 'richText',
  title: 'Formatted text',
  type: 'array',
  of: [blockMember],
});

/**
 * Bilingual formatted text. Same reasoning as `localeString`: both languages sit
 * in one field so neither can be forgotten.
 */
export const localeRichText = defineType({
  name: 'localeRichText',
  title: 'Formatted text',
  type: 'object',
  fields: [
    defineField({
      name: 'id',
      title: 'Bahasa Indonesia',
      type: 'array',
      of: [blockMember],
    }),
    defineField({
      name: 'en',
      title: 'English',
      description: 'Leave blank to show the Indonesian text on the English site too.',
      type: 'array',
      of: [blockMember],
    }),
  ],
});
