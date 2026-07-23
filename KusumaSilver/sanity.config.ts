import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool, defineLocations } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
// Studio icons come from @sanity/icons (the Studio's own icon set), not from
// lucide-react — lucide is for the website, and mixing the two makes the Studio
// config fail to load in the Sanity CLI's Node worker.
import {
  HomeIcon,
  BookIcon,
  StarIcon,
  EnvelopeIcon,
  ThLargeIcon,
  DiamondIcon,
  TagIcon,
  DocumentsIcon,
  CogIcon,
  FilterIcon,
  SparkleIcon,
  ComponentIcon,
  ExpandIcon,
} from '@sanity/icons';
import { schemaTypes } from './sanity/schemaTypes';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

/** Document types that exist exactly once and are opened from the menu. */
const SINGLETON_TYPES = new Set([
  'homePage',
  'aboutPage',
  'bespokePage',
  'contactPage',
  'cataloguePage',
  'storeInfo',
]);

/** Orders are created by the website's checkout, never by hand in the Studio. */
const READ_ONLY_TYPES = new Set(['order']);

/**
 * Where each page singleton appears on the site, so the Preview pane opens the
 * right page and the "Used on N pages" banner links somewhere useful.
 * The site is bilingual; Indonesian is the default locale.
 */
const PAGE_ROUTES: Record<string, { title: string; path: string }> = {
  homePage: { title: 'Home', path: '/id' },
  cataloguePage: { title: 'The Catalogue', path: '/id/koleksi' },
  aboutPage: { title: 'Our Story', path: '/id/tentang-kami' },
  bespokePage: { title: 'Silver Class', path: '/id/custom-order' },
  contactPage: { title: 'Contact', path: '/id/kontak' },
};

/** Singletons all resolve to their one fixed route. */
const singletonLocations = Object.fromEntries(
  Object.entries(PAGE_ROUTES).map(([type, { title, path }]) => [
    type,
    defineLocations({
      message: 'This is the page this document controls.',
      locations: [{ title, href: path }],
    }),
  ])
);

export default defineConfig({
  name: 'kusuma-silver',
  title: 'Kusuma Silver',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S, context) => {
        /**
         * A page that exists once. Opening it goes straight to the document
         * rather than to a list with a single item in it.
         */
        const page = (id: string, title: string, icon: typeof HomeIcon) =>
          S.listItem()
            .title(title)
            .id(id)
            .icon(icon)
            .child(S.document().schemaType(id).documentId(id).title(title));

        return S.list()
          .title('Kusuma Silver')
          .items([
            // ---- The pages of the website, in the order visitors meet them ----
            S.listItem()
              .title('Website Pages')
              .icon(ThLargeIcon)
              .child(
                S.list()
                  .title('Website Pages')
                  .items([
                    page('homePage', 'Home', HomeIcon),
                    page('cataloguePage', 'The Catalogue', ThLargeIcon),
                    page('aboutPage', 'Our Story', BookIcon),
                    page('bespokePage', 'Silver Class', StarIcon),
                    page('contactPage', 'Contact', EnvelopeIcon),
                  ])
              ),

            S.divider(),

            // ---- The shop ----
            orderableDocumentListDeskItem({
              type: 'product',
              title: 'Jewellery',
              icon: DiamondIcon,
              S,
              context,
            }),
            orderableDocumentListDeskItem({
              type: 'category',
              title: 'Categories',
              icon: TagIcon,
              S,
              context,
            }),

            // ---- The lists that drive the catalogue filters ----
            S.listItem()
              .title('Filters')
              .icon(FilterIcon)
              .child(
                S.list()
                  .title('Catalogue Filters')
                  .items([
                    orderableDocumentListDeskItem({
                      type: 'gemstone',
                      title: 'Gemstones',
                      icon: SparkleIcon,
                      S,
                      context,
                    }),
                    orderableDocumentListDeskItem({
                      type: 'material',
                      title: 'Materials',
                      icon: ComponentIcon,
                      S,
                      context,
                    }),
                    orderableDocumentListDeskItem({
                      type: 'size',
                      title: 'Sizes',
                      icon: ExpandIcon,
                      S,
                      context,
                    }),
                  ])
              ),

            S.divider(),

            // ---- Orders (look, don't touch) ----
            S.listItem()
              .title('Customer Orders')
              .icon(DocumentsIcon)
              .child(
                S.documentTypeList('order')
                  .title('Customer Orders')
                  .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
              ),

            S.divider(),

            page('storeInfo', 'Site Settings', CogIcon),
          ]);
      },
    }),
    /**
     * Preview — shows the live site beside the editor with unpublished changes
     * applied, and lets the owner click text on the page to jump to the field
     * that produces it.
     */
    presentationTool({
      title: 'Preview',
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_ORIGIN,
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      resolve: {
        locations: {
          ...singletonLocations,
          // A piece and a category each appear on their own page and in the
          // catalogue, so the owner can jump to either from the document.
          product: defineLocations({
            select: { name: 'name', slug: 'slug.current', category: 'category->slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.name || 'This piece',
                  href: `/id/koleksi/${doc?.category}/${doc?.slug}`,
                },
                { title: 'The Catalogue', href: '/id/koleksi' },
              ],
            }),
          }),
          category: defineLocations({
            select: { name: 'name', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                { title: doc?.name || 'This category', href: `/id/koleksi/${doc?.slug}` },
                { title: 'The Catalogue', href: '/id/koleksi' },
              ],
            }),
          }),
          // Site Settings feeds the menu and footer, which are on every page.
          storeInfo: defineLocations({
            message: 'These settings appear on every page of the site.',
            locations: [{ title: 'Home', href: '/id' }],
          }),
        },
      },
    }),
    // The query playground is a developer tool; it is noise for the owner and is
    // only loaded outside production.
    ...(process.env.NODE_ENV === 'development' ? [visionTool()] : []),
  ],
  schema: {
    types: schemaTypes,
    // Keep the pages and the settings out of the global "Create" menu — there
    // must only ever be one of each, and a second copy would be invisible to
    // the website.
    templates: (prev) => prev.filter((template) => !SINGLETON_TYPES.has(template.schemaType)),
  },
  document: {
    /**
     * Page documents cannot be deleted or duplicated: a deleted page would leave
     * the website silently falling back to its built-in text, and a duplicate
     * would never be read. Orders are records of real transactions, so they
     * cannot be created or deleted by hand either.
     */
    actions: (prev, { schemaType }) => {
      if (SINGLETON_TYPES.has(schemaType)) {
        return prev.filter(
          (action) => !['delete', 'duplicate', 'unpublish'].includes(action.action ?? '')
        );
      }
      if (READ_ONLY_TYPES.has(schemaType)) {
        return prev.filter((action) => !['delete', 'duplicate'].includes(action.action ?? ''));
      }
      return prev;
    },
    newDocumentOptions: (prev) =>
      prev.filter(
        (item) =>
          !SINGLETON_TYPES.has(item.templateId) && !READ_ONLY_TYPES.has(item.templateId)
      ),
  },
});
