import { defineField, defineType } from 'sanity';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';

/**
 * The lists that drive the catalogue filters.
 *
 * THE PROBLEM THESE SOLVE
 * Gemstones, material and sizes used to be free text on each piece — one box
 * holding "Amethyst, Garnet, Peridot, Citrine, and Pink Zirconia". The filter
 * treated that whole sentence as a single gemstone, so the Gemstone dropdown
 * offered two nonsense options instead of eight real stones, and a typo
 * ("perak 925" vs "Perak 925") would silently create a duplicate option.
 *
 * Now the owner keeps a list of each, and ticks the ones that apply on a piece.
 * The filters build themselves from what is actually used, so they can never
 * fall out of step with the catalogue.
 */

interface TaxonomyOptions {
  name: string;
  title: string;
  /** Shown at the top of the list in the Studio. */
  description: string;
  examples: string;
}

/** Shared shape: a bilingual name, a slug for the URL, and drag ordering. */
function taxonomyType({ name, title, description, examples }: TaxonomyOptions) {
  return defineType({
    name,
    title,
    type: 'document',
    fields: [
      defineField({
        name: 'name',
        title: 'Name (Indonesian)',
        description: `${description} ${examples}`,
        type: 'string',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'nameEn',
        title: 'Name (English)',
        description: 'Leave blank to use the Indonesian name on the English site.',
        type: 'string',
      }),
      defineField({
        name: 'slug',
        title: 'Web address (automatic)',
        description: 'Used in filter links. Fills in from the name — you rarely need to change it.',
        type: 'slug',
        options: { source: 'name', maxLength: 60 },
        validation: (Rule) => Rule.required(),
      }),
      orderRankField({ type: name, hidden: true }),
    ],
    orderings: [orderRankOrdering],
    preview: {
      select: { title: 'name', subtitle: 'nameEn' },
      prepare: ({ title, subtitle }) => ({
        title,
        subtitle: subtitle && subtitle !== title ? `EN: ${subtitle}` : undefined,
      }),
    },
  });
}

export const gemstone = taxonomyType({
  name: 'gemstone',
  title: 'Gemstone',
  description: 'One stone per entry — never a list.',
  examples: 'e.g. Amethyst, Garnet, Peridot.',
});

export const material = taxonomyType({
  name: 'material',
  title: 'Material',
  description: 'One material per entry.',
  examples: 'e.g. Perak 925.',
});

/**
 * Sizes need a group: ring sizes (6, 7, 8) and necklace lengths (45 cm, 50 cm)
 * are not comparable, and listing them in one dropdown would be confusing for
 * shoppers. The group also controls the order they appear in.
 */
export const size = defineType({
  name: 'size',
  title: 'Size',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Size',
      description: 'One size per entry, exactly as it should appear. e.g. 7, or 45 cm.',
      type: 'string',
      validation: (Rule) => Rule.required().max(20),
    }),
    defineField({
      name: 'group',
      title: 'What kind of size is this?',
      description:
        'Keeps ring sizes and necklace lengths in separate filters, so shoppers are not ' +
        'offered "45 cm" when browsing rings.',
      type: 'string',
      initialValue: 'ring',
      options: {
        list: [
          { title: 'Ring size (6, 7, 8 …)', value: 'ring' },
          { title: 'Length (45 cm, 50 cm …)', value: 'length' },
          { title: 'One size / other', value: 'other' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Web address (automatic)',
      type: 'slug',
      options: { source: 'name', maxLength: 60 },
      validation: (Rule) => Rule.required(),
    }),
    orderRankField({ type: 'size', hidden: true }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: { title: 'name', group: 'group' },
    prepare: ({ title, group }) => ({
      title,
      subtitle:
        group === 'length' ? 'Length' : group === 'other' ? 'One size / other' : 'Ring size',
    }),
  },
});
