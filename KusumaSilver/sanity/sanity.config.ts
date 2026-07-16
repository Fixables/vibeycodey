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
      structure: (S) => {
        const singleton = (id: string, title: string) =>
          S.listItem()
            .title(title)
            .id(id)
            .child(S.document().schemaType(id).documentId(id));

        return S.list()
          .title('Konten Situs')
          .items([
            // --- Halaman (Pages) ---
            singleton('homePage', 'Beranda (Home)'),
            singleton('aboutPage', 'Tentang Kami (About)'),
            singleton('bespokePage', 'Silver Class'),
            singleton('contactPage', 'Kontak (Contact)'),
            S.divider(),
            // --- Toko (Shop) ---
            S.documentTypeListItem('product').title('Perhiasan (Products)'),
            S.documentTypeListItem('category').title('Kategori (Categories)'),
            S.divider(),
            // --- Pesanan (Orders) ---
            S.documentTypeListItem('order').title('Pesanan (Orders)'),
            S.divider(),
            // --- Pengaturan (Settings) ---
            singleton('storeInfo', 'Informasi Toko (Store Info)'),
          ]);
      },
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
