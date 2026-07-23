import { defineField, defineType } from 'sanity';

/**
 * Contact (Kontak) page text.
 *
 * The contact details themselves — address, phone, email, hours, map — live in
 * Site Settings and appear here automatically, so they are only ever typed once.
 * This document controls the page's wording. Blank fields fall back to the
 * built-in default copy.
 */
export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  groups: [
    { name: 'header', title: 'Page header', default: true },
    { name: 'form', title: 'Message form' },
    { name: 'seo', title: 'Search & sharing' },
  ],
  fields: [
    defineField({ name: 'eyebrow', title: 'Small label', type: 'localeString', group: 'header' }),
    defineField({ name: 'title', title: 'Big heading', type: 'localeString', group: 'header' }),
    defineField({ name: 'subtitle', title: 'Line under the heading', type: 'localeText', group: 'header' }),

    defineField({
      name: 'formTitle',
      title: 'Message form heading',
      description:
        'The heading above the message form. The address, phone number, opening hours and map ' +
        'shown beside it all come from Site Settings.',
      type: 'localeString',
      group: 'form',
    }),

    defineField({ name: 'seo', title: 'Search & sharing', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Contact Page', subtitle: 'Headings — details come from Site Settings' }) },
});
