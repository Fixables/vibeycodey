import { defineField, defineType } from 'sanity';

/**
 * Store details used across the site — the footer, the contact page, and every
 * WhatsApp button. Update it here once and it changes everywhere.
 */
export const storeInfo = defineType({
  name: 'storeInfo',
  title: 'Store Info',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'contact', title: 'Contact & location' },
    { name: 'social', title: 'Social media' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Store name', type: 'string', group: 'general', validation: (Rule) => Rule.required() }),
    defineField({ name: 'tagline', title: 'Tagline (Indonesian)', type: 'string', group: 'general' }),
    defineField({ name: 'taglineEn', title: 'Tagline (English)', type: 'string', group: 'general' }),

    defineField({
      name: 'whatsapp',
      title: 'WhatsApp number (digits only)',
      description: 'Country code + number, no “+”, spaces, or dashes. e.g. 6281234567890. This powers every WhatsApp button.',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'whatsappDisplay',
      title: 'Phone number as shown',
      description: 'How the number appears on the contact page. e.g. +62 812-3456-7890.',
      type: 'string',
      group: 'contact',
    }),
    defineField({ name: 'email', title: 'Email (optional)', type: 'string', group: 'contact' }),
    defineField({ name: 'address', title: 'Street address', type: 'string', group: 'contact', validation: (Rule) => Rule.required() }),
    defineField({ name: 'city', title: 'City / region', type: 'string', group: 'contact', validation: (Rule) => Rule.required() }),
    defineField({ name: 'hoursWeekday', title: 'Opening hours — weekdays', description: 'e.g. Senin – Sabtu: 09.00 – 18.00.', type: 'string', group: 'contact' }),
    defineField({ name: 'hoursWeekend', title: 'Opening hours — weekend', description: 'e.g. Minggu: 10.00 – 15.00.', type: 'string', group: 'contact' }),
    defineField({
      name: 'mapsEmbedUrl',
      title: 'Google Maps embed link',
      description: 'On Google Maps: Share → Embed a map → copy the link inside src="…". Shows the map on the contact page.',
      type: 'url',
      group: 'contact',
    }),

    defineField({ name: 'instagram', title: 'Instagram username', description: 'Without the @.', type: 'string', group: 'social' }),
    defineField({ name: 'tiktok', title: 'TikTok username', description: 'Without the @.', type: 'string', group: 'social' }),
    defineField({ name: 'facebook', title: 'Facebook page URL', type: 'url', group: 'social' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'city' },
  },
});
