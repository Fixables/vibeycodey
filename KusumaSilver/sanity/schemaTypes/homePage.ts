import { defineField, defineType } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline (Indonesian)',
      type: 'string',
      description: 'Main headline displayed on the hero section',
    }),
    defineField({
      name: 'heroHeadlineEn',
      title: 'Hero Headline (English)',
      type: 'string',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Subtext (Indonesian)',
      type: 'text',
      rows: 3,
      description: 'Supporting text below the headline',
    }),
    defineField({
      name: 'heroSubtextEn',
      title: 'Hero Subtext (English)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional background or featured image for the hero',
    }),
    defineField({
      name: 'heroCtaLabel',
      title: 'Hero CTA Button Label (Indonesian)',
      type: 'string',
      description: 'e.g. Lihat Koleksi',
    }),
    defineField({
      name: 'heroCtaLabelEn',
      title: 'Hero CTA Button Label (English)',
      type: 'string',
    }),
    defineField({
      name: 'collectionsTitle',
      title: 'Collections Section Title (Indonesian)',
      type: 'string',
    }),
    defineField({
      name: 'collectionsTitleEn',
      title: 'Collections Section Title (English)',
      type: 'string',
    }),
    defineField({
      name: 'collectionsSubtitle',
      title: 'Collections Section Subtitle (Indonesian)',
      type: 'string',
    }),
    defineField({
      name: 'collectionsSubtitleEn',
      title: 'Collections Section Subtitle (English)',
      type: 'string',
    }),
    defineField({
      name: 'craftsmanshipTitle',
      title: 'Craftsmanship Section Title (Indonesian)',
      type: 'string',
    }),
    defineField({
      name: 'craftsmanshipTitleEn',
      title: 'Craftsmanship Section Title (English)',
      type: 'string',
    }),
    defineField({
      name: 'craftsmanshipBody',
      title: 'Craftsmanship Section Body (Indonesian)',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'craftsmanshipBodyEn',
      title: 'Craftsmanship Section Body (English)',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'craftsmanshipImage',
      title: 'Craftsmanship Section Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ctaBannerTitle',
      title: 'CTA Banner Title (Indonesian)',
      type: 'string',
      description: 'Bottom-of-page call to action heading',
    }),
    defineField({
      name: 'ctaBannerTitleEn',
      title: 'CTA Banner Title (English)',
      type: 'string',
    }),
    defineField({
      name: 'ctaBannerSubtext',
      title: 'CTA Banner Subtext (Indonesian)',
      type: 'string',
    }),
    defineField({
      name: 'ctaBannerSubtextEn',
      title: 'CTA Banner Subtext (English)',
      type: 'string',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Page Title',
      type: 'string',
      description: 'Overrides the default page title for search engines',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Meta Description',
      type: 'text',
      rows: 3,
      description: '150–160 characters recommended',
    }),
  ],
  preview: {
    select: { title: 'heroHeadline' },
    prepare({ title }) {
      return { title: title || 'Home Page', subtitle: 'Home page content' };
    },
  },
});
