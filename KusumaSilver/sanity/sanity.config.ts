import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

export default defineConfig({
  name: 'kusuma-silver-v2',
  title: 'Kusuma Silver Studio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Konten Situs')
          .items([
            S.listItem()
              .title('Beranda')
              .id('homePage')
              .child(
                S.document()
                  .schemaType('homePage')
                  .documentId('homePage')
              ),
            S.listItem()
              .title('Tentang Kami')
              .id('aboutPage')
              .child(
                S.document()
                  .schemaType('aboutPage')
                  .documentId('aboutPage')
              ),
            S.listItem()
              .title('Kontak')
              .id('contactPage')
              .child(
                S.document()
                  .schemaType('contactPage')
                  .documentId('contactPage')
              ),
            S.listItem()
              .title('Informasi Toko')
              .id('storeInfo')
              .child(
                S.document()
                  .schemaType('storeInfo')
                  .documentId('storeInfo')
              ),
            S.divider(),
            S.documentTypeListItem('category').title('Kategori'),
            S.documentTypeListItem('product').title('Perhiasan'),
            S.documentTypeListItem('testimonial').title('Testimoni'),
            S.documentTypeListItem('customOrderStep').title('Langkah Custom Order'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
