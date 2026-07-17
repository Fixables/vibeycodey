import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  // Read published documents only. Without this the token makes queries return
  // drafts too, so a half-finished piece in the Studio (no slug, no category)
  // leaks into the site and breaks the build.
  perspective: 'published',
  // Server-only env var; enables reads when the dataset is private. All page
  // data flows through server components / build, so this never ships to the
  // browser bundle.
  token: process.env.SANITY_API_TOKEN,
});

const builder = createImageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}
