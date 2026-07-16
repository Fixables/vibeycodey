import { defineField, defineType } from 'sanity';

/**
 * Contact (Kontak) page text. The actual contact details — address, phone,
 * email, hours, map — live in "Informasi Toko" (Store Info) and appear here
 * automatically. This document only controls the page's headings.
 * Blank fields fall back to the built-in default copy.
 */
export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({ name: 'eyebrow', title: 'Header — small label (ID)', type: 'string' }),
    defineField({ name: 'eyebrowEn', title: 'Header — small label (EN)', type: 'string' }),
    defineField({ name: 'title', title: 'Header — big heading (ID)', type: 'string' }),
    defineField({ name: 'titleEn', title: 'Header — big heading (EN)', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Header — subtitle line (ID)', type: 'text', rows: 2 }),
    defineField({ name: 'subtitleEn', title: 'Header — subtitle line (EN)', type: 'text', rows: 2 }),
    defineField({ name: 'formTitle', title: 'Message form — heading (ID)', type: 'string' }),
    defineField({ name: 'formTitleEn', title: 'Message form — heading (EN)', type: 'string' }),
  ],
  preview: { prepare: () => ({ title: 'Contact Page', subtitle: 'Contact page headings' }) },
});
