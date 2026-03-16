import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

export default defineConfig({
  name: 'bali-greenhouse',
  title: 'Bali Greenhouse CMS',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Konten')
          .items([
            S.listItem()
              .title('Informasi Toko')
              .id('storeInfo')
              .child(
                S.document()
                  .schemaType('storeInfo')
                  .documentId('storeInfo')
              ),
            S.divider(),
            S.documentTypeListItem('category').title('Kategori Produk'),
            S.documentTypeListItem('product').title('Produk'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
