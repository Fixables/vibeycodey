/**
 * Build a wa.me link, optionally pre-filling the message.
 *
 * This lives in its own module rather than in `lib/sanity-data.ts` because two
 * client components use it (the contact and booking forms). Importing it from
 * the data layer dragged the whole Sanity module graph — including the
 * server-only live-preview client — into the browser bundle, which fails the
 * build with "defineLive can only be used in React Server Components".
 *
 * It is a pure string function with no dependencies, so it is safe on either
 * side of the server/client boundary.
 */
export function getWhatsAppLink(whatsapp: string, message?: string): string {
  const base = `https://wa.me/${whatsapp}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
