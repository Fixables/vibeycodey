import { defineField, defineType } from 'sanity';

/**
 * Home page content. Every field maps to a visible part of the home page.
 * Leaving a field blank falls back to the built-in default text, so the site
 * never breaks. Fields come in pairs: one Indonesian, one English.
 */
export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero (top of page)', default: true },
    { name: 'heritage', title: 'Heritage band' },
    { name: 'manifesto', title: 'Manifesto' },
  ],
  fields: [
    // ---- Hero ----
    defineField({
      name: 'heroEyebrow',
      title: 'Hero — small label above headline (ID)',
      description: 'The little orange text at the top of the hero. e.g. “PERAK 925 · BALI UTARA”.',
      type: 'string',
      group: 'hero',
    }),
    defineField({ name: 'heroEyebrowEn', title: 'Hero — small label above headline (EN)', type: 'string', group: 'hero' }),
    defineField({
      name: 'heroTitle1',
      title: 'Hero — big headline, first line (ID)',
      description: 'The large headline. First line is upright, second line is italic.',
      type: 'string',
      group: 'hero',
    }),
    defineField({ name: 'heroTitle1En', title: 'Hero — big headline, first line (EN)', type: 'string', group: 'hero' }),
    defineField({
      name: 'heroTitle2',
      title: 'Hero — big headline, second line / italic (ID)',
      type: 'string',
      group: 'hero',
    }),
    defineField({ name: 'heroTitle2En', title: 'Hero — big headline, second line / italic (EN)', type: 'string', group: 'hero' }),
    defineField({
      name: 'heroDesc',
      title: 'Hero — description paragraph (ID)',
      description: 'The paragraph under the headline.',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({ name: 'heroDescEn', title: 'Hero — description paragraph (EN)', type: 'text', rows: 3, group: 'hero' }),
    defineField({
      name: 'heroCta1',
      title: 'Hero — first button text (ID)',
      description: 'The dark button (goes to the catalogue).',
      type: 'string',
      group: 'hero',
    }),
    defineField({ name: 'heroCta1En', title: 'Hero — first button text (EN)', type: 'string', group: 'hero' }),
    defineField({
      name: 'heroCta2',
      title: 'Hero — second button text (ID)',
      description: 'The outline button (goes to Our Story).',
      type: 'string',
      group: 'hero',
    }),
    defineField({ name: 'heroCta2En', title: 'Hero — second button text (EN)', type: 'string', group: 'hero' }),
    defineField({
      name: 'heroImage',
      title: 'Hero — main image',
      description: 'The large photo on the left of the hero (e.g. a model wearing a necklace).',
      type: 'image',
      options: { hotspot: true },
      group: 'hero',
    }),

    // ---- Heritage band (dark section) ----
    defineField({ name: 'heritageEyebrow', title: 'Heritage — small label (ID)', type: 'string', group: 'heritage' }),
    defineField({ name: 'heritageEyebrowEn', title: 'Heritage — small label (EN)', type: 'string', group: 'heritage' }),
    defineField({
      name: 'heritageTitle',
      title: 'Heritage — heading (ID)',
      description: 'The heading in the dark band, e.g. “Ditempa di atas pesisir Lovina”.',
      type: 'string',
      group: 'heritage',
    }),
    defineField({ name: 'heritageTitleEn', title: 'Heritage — heading (EN)', type: 'string', group: 'heritage' }),
    defineField({ name: 'heritageBody', title: 'Heritage — paragraph (ID)', type: 'text', rows: 4, group: 'heritage' }),
    defineField({ name: 'heritageBodyEn', title: 'Heritage — paragraph (EN)', type: 'text', rows: 4, group: 'heritage' }),
    defineField({
      name: 'statSilver',
      title: 'Heritage — stat label under “925” (ID)',
      type: 'string',
      group: 'heritage',
    }),
    defineField({ name: 'statSilverEn', title: 'Heritage — stat label under “925” (EN)', type: 'string', group: 'heritage' }),
    defineField({ name: 'statGen', title: 'Heritage — stat label under “3” (ID)', type: 'string', group: 'heritage' }),
    defineField({ name: 'statGenEn', title: 'Heritage — stat label under “3” (EN)', type: 'string', group: 'heritage' }),
    defineField({ name: 'statHand', title: 'Heritage — stat label under “100%” (ID)', type: 'string', group: 'heritage' }),
    defineField({ name: 'statHandEn', title: 'Heritage — stat label under “100%” (EN)', type: 'string', group: 'heritage' }),
    defineField({
      name: 'heritageImage',
      title: 'Heritage — image',
      description: 'The photo on the right of the dark band (e.g. an artisan at work).',
      type: 'image',
      options: { hotspot: true },
      group: 'heritage',
    }),

    // ---- Manifesto ----
    defineField({
      name: 'manifestoQuote',
      title: 'Manifesto — quote (ID)',
      description: 'The large centred quote near the bottom of the page.',
      type: 'text',
      rows: 2,
      group: 'manifesto',
    }),
    defineField({ name: 'manifestoQuoteEn', title: 'Manifesto — quote (EN)', type: 'text', rows: 2, group: 'manifesto' }),
    defineField({
      name: 'manifestoAttr',
      title: 'Manifesto — attribution line (ID)',
      description: 'The small line under the quote, e.g. “— KELUARGA KUSUMA, SINGARAJA”.',
      type: 'string',
      group: 'manifesto',
    }),
    defineField({ name: 'manifestoAttrEn', title: 'Manifesto — attribution line (EN)', type: 'string', group: 'manifesto' }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page', subtitle: 'Hero, heritage band, and manifesto text' };
    },
  },
});
