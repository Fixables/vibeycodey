import { defineField, defineType } from 'sanity';

/**
 * One choice a shopper can make on a piece — a gemstone, or a size — together
 * with what it costs and whether it is currently available.
 *
 * WHY PRICES ADD UP RATHER THAN BEING LISTED PER COMBINATION
 * A ring offered in 5 stones and 5 sizes has 25 combinations. Listing every one
 * would mean 25 rows to fill in and keep accurate for a single ring, and 30 as
 * soon as a sixth stone is added — the kind of thing that goes stale within a
 * week. Instead each option carries a price *change* against the piece's base
 * price, so the same ring needs 10 rows, and the shop owner's real case ("the
 * longer the chain, the more expensive") is expressed directly.
 *
 * The trade-off, deliberately accepted: availability is per option, so a stone
 * or a size can be marked sold out, but not one specific pairing of the two.
 */

const priceAdjustField = defineField({
  name: 'priceAdjust',
  title: 'Price change',
  description:
    'How much this option adds to the base price, in Rupiah. Leave blank or 0 when it costs ' +
    'the same. Use a negative number to make it cheaper, e.g. -50000.',
  type: 'number',
  initialValue: 0,
  validation: (Rule) =>
    Rule.integer().error('Whole Rupiah only — no decimals, and no dots as separators.'),
});

const availableField = defineField({
  name: 'inStock',
  title: 'Available',
  description: 'Untick when this option runs out. Shoppers still see it, greyed out.',
  type: 'boolean',
  initialValue: true,
});

/** Money for a preview line: "+Rp 25.000" / "−Rp 50.000" / "". */
function adjustLabel(adjust: unknown): string {
  const value = typeof adjust === 'number' ? adjust : 0;
  if (!value) return '';
  const sign = value > 0 ? '+' : '−';
  return ` · ${sign}Rp ${Math.abs(value).toLocaleString('id-ID')}`;
}

export const gemstoneVariant = defineType({
  name: 'gemstoneVariant',
  title: 'Gemstone option',
  type: 'object',
  fields: [
    defineField({
      name: 'gemstone',
      title: 'Gemstone',
      description: 'Pick from your Gemstones list. Add new ones under Filters → Gemstones.',
      type: 'reference',
      to: [{ type: 'gemstone' }],
      validation: (Rule) => Rule.required(),
    }),
    priceAdjustField,
    availableField,
  ],
  preview: {
    select: { title: 'gemstone.name', adjust: 'priceAdjust', inStock: 'inStock' },
    prepare: ({ title, adjust, inStock }) => ({
      title: title ?? 'Choose a gemstone',
      subtitle: `${inStock === false ? 'Sold out' : 'Available'}${adjustLabel(adjust)}`,
    }),
  },
});

export const sizeVariant = defineType({
  name: 'sizeVariant',
  title: 'Size option',
  type: 'object',
  fields: [
    defineField({
      name: 'size',
      title: 'Size',
      description: 'Pick from your Sizes list. Add new ones under Filters → Sizes.',
      type: 'reference',
      to: [{ type: 'size' }],
      validation: (Rule) => Rule.required(),
    }),
    priceAdjustField,
    availableField,
  ],
  preview: {
    select: { title: 'size.name', adjust: 'priceAdjust', inStock: 'inStock' },
    prepare: ({ title, adjust, inStock }) => ({
      title: title ?? 'Choose a size',
      subtitle: `${inStock === false ? 'Sold out' : 'Available'}${adjustLabel(adjust)}`,
    }),
  },
});
