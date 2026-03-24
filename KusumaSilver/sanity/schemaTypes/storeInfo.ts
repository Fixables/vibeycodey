import { defineField, defineType } from 'sanity';

export const storeInfo = defineType({
  name: 'storeInfo',
  title: 'Store Info',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Store Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'tagline', title: 'Tagline (Indonesian)', type: 'string' }),
    defineField({ name: 'taglineEn', title: 'Tagline (English)', type: 'string' }),
    defineField({ name: 'address', title: 'Address', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'city', title: 'City', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Number (no + or spaces)',
      type: 'string',
      description: 'e.g. 6281234567890',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'whatsappDisplay', title: 'WhatsApp Display', type: 'string', description: 'e.g. +62 812-3456-7890' }),
    defineField({ name: 'email', title: 'Email (optional)', type: 'string' }),
    defineField({ name: 'hoursWeekday', title: 'Hours (Weekday)', type: 'string' }),
    defineField({ name: 'hoursWeekend', title: 'Hours (Weekend)', type: 'string' }),
    defineField({ name: 'instagram', title: 'Instagram Username', type: 'string', description: 'Without @' }),
    defineField({ name: 'tiktok', title: 'TikTok Username', type: 'string', description: 'Without @' }),
    defineField({ name: 'facebook', title: 'Facebook URL', type: 'url', description: 'Full Facebook page URL' }),
    defineField({ name: 'mapsEmbedUrl', title: 'Google Maps Embed URL', type: 'url' }),
    defineField({
      name: 'aboutContent',
      title: 'About Content (Indonesian)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'aboutContentEn',
      title: 'About Content (English)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'tagline' },
  },
});
