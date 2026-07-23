import { defineField, defineType } from 'sanity';

/**
 * One link in the menu or the footer.
 *
 * The menu used to be a hardcoded list in the website's code, with the category
 * addresses (`cincin`, `kalung`, …) typed out as plain text. That meant renaming
 * a category in the Studio silently broke its menu link. Here the owner picks a
 * category from a list instead of typing an address, so a link can never point
 * at a page that does not exist.
 */

/** The fixed pages of the site. Their addresses are set by the code, not typed. */
export const SITE_PAGES = [
  { title: 'Home', value: 'home' },
  { title: 'The Catalogue', value: 'catalogue' },
  { title: 'Our Story', value: 'story' },
  { title: 'Silver Class', value: 'bespoke' },
  { title: 'Contact', value: 'contact' },
] as const;

export const navItem = defineType({
  name: 'navItem',
  title: 'Menu link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'What the link says',
      description: 'Leave blank to use the category or page name.',
      type: 'localeString',
    }),
    defineField({
      name: 'linkType',
      title: 'Where does it go?',
      type: 'string',
      initialValue: 'category',
      options: {
        list: [
          { title: 'A category of jewellery', value: 'category' },
          { title: 'A page on this site', value: 'page' },
          { title: 'Another website', value: 'external' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Which category?',
      description: 'Pick from your categories. The link updates by itself if you rename one.',
      type: 'reference',
      to: [{ type: 'category' }],
      hidden: ({ parent }) => parent?.linkType !== 'category',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { linkType?: string } | undefined;
          if (parent?.linkType === 'category' && !value) return 'Choose a category.';
          return true;
        }),
    }),
    defineField({
      name: 'page',
      title: 'Which page?',
      type: 'string',
      options: { list: [...SITE_PAGES] },
      hidden: ({ parent }) => parent?.linkType !== 'page',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { linkType?: string } | undefined;
          if (parent?.linkType === 'page' && !value) return 'Choose a page.';
          return true;
        }),
    }),
    defineField({
      name: 'url',
      title: 'Web address',
      description: 'The full address, starting with https://',
      type: 'url',
      hidden: ({ parent }) => parent?.linkType !== 'external',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { linkType?: string } | undefined;
          if (parent?.linkType === 'external' && !value) return 'Enter a web address.';
          return true;
        }),
    }),
    defineField({
      name: 'highlight',
      title: 'Show in the accent colour',
      description: 'Makes this link stand out in the menu. Use it sparingly — one link at most.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'hidden',
      title: 'Hide this link',
      description: 'Turn on to take it out of the menu without deleting it.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      label: 'label.id',
      linkType: 'linkType',
      categoryName: 'category.name',
      page: 'page',
      url: 'url',
      hidden: 'hidden',
    },
    prepare({ label, linkType, categoryName, page, url, hidden }) {
      const target =
        linkType === 'category'
          ? (categoryName ?? 'Category not chosen')
          : linkType === 'page'
            ? (SITE_PAGES.find((p) => p.value === page)?.title ?? 'Page not chosen')
            : (url ?? 'Address not set');
      return {
        title: label || target,
        subtitle: hidden ? 'Hidden from the menu' : target,
      };
    },
  },
});
