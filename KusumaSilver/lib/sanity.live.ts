import { defineLive } from 'next-sanity/live';
import { client } from './sanity';

/**
 * Draft-mode reads for the Studio's Presentation tool.
 *
 * `sanityFetch` returns published content for ordinary visitors and unpublished
 * drafts when Next.js draft mode is on — which only happens inside the Studio's
 * preview pane, for someone who has already signed in to Sanity. That is what
 * lets the owner see a change before publishing it.
 *
 * Tokens:
 *  - `serverToken` reads drafts during server rendering.
 *  - `browserToken` is handed to the browser *only while draft mode is enabled*,
 *    so the preview pane can stream live updates as the owner types. It is never
 *    sent to a normal visitor.
 *
 * Both reuse SANITY_API_TOKEN, which is server-only. If that token ever gains
 * write scope, issue a separate read-only ("Viewer") token for the browser
 * instead — a browser token should never be able to write.
 */
const token = process.env.SANITY_API_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  // stegaEnabled + a studioUrl turns on click-to-edit: in the preview pane the
  // owner can click any piece of text and land on the field that produces it.
  client: client.withConfig({
    apiVersion: '2024-01-01',
    stega: { studioUrl: '/studio' },
  }),
  serverToken: token,
  browserToken: token,
});
