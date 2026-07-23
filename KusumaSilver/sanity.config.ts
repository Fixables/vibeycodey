import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
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
