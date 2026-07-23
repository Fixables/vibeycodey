import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { client } from '@/lib/sanity';

/**
 * Turns on Next.js draft mode so the site renders unpublished content.
 *
 * The Studio's Presentation tool calls this when it opens the preview pane.
 * It is NOT an open door: `defineEnableDraftMode` validates the signed secret
 * that Sanity sends, so a visitor who simply guesses this URL cannot switch
 * themselves into draft mode and read unpublished content.
 */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_TOKEN }),
});
