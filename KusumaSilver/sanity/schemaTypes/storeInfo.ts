import { defineField, defineType } from 'sanity';
import { imageField } from './objects/image';

/**
 * Site-wide settings: the shop's details, the menu, the footer, and the text
 * that repeats on every page. Change it here once and it changes everywhere.
 *
 * The document type keeps its original name (`storeInfo`) on purpose — renaming
 * it would orphan the live document. Its Studio title says "Site Settings".
 */
export const storeInfo = defineType({
  name: 'storeInfo',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'Shop name & logo', default: true },
    { name: 'contact', title: 'Contact & location' },
    { name: 'social', title: 'Social media' },
    { name: 'menu', title: 'Menu' },
    { name: 'footer', title: 'Footer' },
    { name: 'defaults', title: 'Repeated text' },
    { name: 'seo', title: 'Search & sharing' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Shop name',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    imageField({
      name: 'logo',
      title: 'Logo',
      description:
        'Shown at the top of every page. A wide image with a transparent or white background ' +
        'works best. Leave blank to keep the current logo.',
      group: 'general',
    }),
    defineField({
      name: 'wordmarkSub',
      title: 'Line under the logo',
      description: 'The small spaced-out line under the logo, e.g. "NORTH BALI · EST. SINGARAJA".',
      type: 'localeString',
      group: 'general',
    }),
    defineField({ name: 'tagline', title: 'Tagline (Indonesian)', type: 'string', group: 'general' }),
    defineField({ name: 'taglineEn', title: 'Tagline (English)', type: 'string', group: 'general' }),

    defineField({
      name: 'whatsapp',
      title: 'WhatsApp number',
      description:
        'Digits only — country code first, with no "+", spaces, or dashes. e.g. 6281234567890. ' +
        'This powers every WhatsApp button on the site, so check it carefully.',
      type: 'string',
      group: 'contact',
      validation: (Rule) =>
        Rule.required()
          .regex(/^\d{8,15}$/, { name: 'digits only' })
          .error('Digits only, 8–15 of them, starting with the country code. e.g. 6281234567890'),
    }),
    defineField({
      name: 'whatsappDisplay',
      title: 'Phone number as shown to visitors',
      description: 'How the number appears on the contact page, e.g. +62 812-3456-7890.',
      type: 'string',
      group: 'contact',
    }),
    defineField({ name: 'email', title: 'Email (optional)', type: 'string', group: 'contact' }),
    defineField({
      name: 'address',
      title: 'Street address',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'City / region',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hoursWeekday',
      title: 'Opening hours — weekdays',
      description: 'e.g. Senin – Sabtu: 09.00 – 18.00.',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'hoursWeekend',
      title: 'Opening hours — weekend',
      description: 'e.g. Minggu: 10.00 – 15.00.',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'mapsEmbedUrl',
      title: 'Google Maps link',
      description:
        'This is what makes the map appear on the contact page — the map is hidden while it is ' +
        'blank. On Google Maps: Share → Embed a map → copy the address inside src="…".',
      type: 'url',
      group: 'contact',
    }),

    defineField({ name: 'instagram', title: 'Instagram username', description: 'Without the @.', type: 'string', group: 'social' }),
    defineField({ name: 'tiktok', title: 'TikTok username', description: 'Without the @.', type: 'string', group: 'social' }),
    defineField({ name: 'facebook', title: 'Facebook page address', type: 'url', group: 'social' }),

    defineField({
      name: 'promoBar',
      title: 'Announcement bar',
      description:
        'The line of text in the dark strip at the very top of every page, e.g. a shipping offer. ' +
        'Leave blank to use the built-in wording.',
      type: 'localeString',
      group: 'menu',
    }),
    defineField({
      name: 'promoBarHidden',
      title: 'Hide the announcement bar',
      type: 'boolean',
      initialValue: false,
      group: 'menu',
    }),
    defineField({
      name: 'mainNav',
      title: 'Menu links',
      description:
        'The links across the top of every page. Drag to reorder, or use Add item for another. ' +
        'Leave the list empty to show every category automatically.',
      type: 'array',
      group: 'menu',
      of: [{ type: 'navItem' }],
      validation: (Rule) => Rule.max(9).warning('More than about eight links crowd the menu.'),
    }),

    defineField({
      name: 'footerBlurb',
      title: 'Footer paragraph',
      description: 'The short paragraph under the shop name in the footer.',
      type: 'localeText',
      group: 'footer',
    }),
    defineField({
      name: 'footerShopLinks',
      title: 'Footer — "Shop" column',
      description: 'Leave empty to show your first four categories automatically.',
      type: 'array',
      group: 'footer',
      of: [{ type: 'navItem' }],
    }),
    defineField({
      name: 'footerAtelierLinks',
      title: 'Footer — "Atelier" column',
      description: 'Leave empty to show Our Story, Silver Class and Contact automatically.',
      type: 'array',
      group: 'footer',
      of: [{ type: 'navItem' }],
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright line',
      description: 'The small line at the very bottom, e.g. "© 2026 Kusuma Silver · Singaraja, North Bali".',
      type: 'localeString',
      group: 'footer',
    }),

    defineField({
      name: 'specOrigin',
      title: 'Default origin',
      description:
        'Shown in the details table on every piece page, unless a piece sets its own. ' +
        'e.g. "Singaraja, North Bali".',
      type: 'localeString',
      group: 'defaults',
    }),
    defineField({
      name: 'specTechnique',
      title: 'Default technique',
      description: 'e.g. "Hand-forged". A piece can override this.',
      type: 'localeString',
      group: 'defaults',
    }),
    defineField({
      name: 'specMaterial',
      title: 'Default material',
      description: 'Used when a piece has no material of its own, e.g. "925 Sterling Silver".',
      type: 'localeString',
      group: 'defaults',
    }),
    defineField({
      name: 'specLeadTime',
      title: 'Default lead time',
      description: 'Used when a piece has no lead time of its own, e.g. "3–5 working days".',
      type: 'localeString',
      group: 'defaults',
    }),

    defineField({
      name: 'defaultSeo',
      title: 'Site-wide search & sharing',
      description: 'Used for any page that has not set its own. Also used for the home page share image.',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'city', media: 'logo' },
    prepare({ title, subtitle, media }) {
      return { title: title ?? 'Site Settings', subtitle, media };
    },
  },
});
