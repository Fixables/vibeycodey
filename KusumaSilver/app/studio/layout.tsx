import type { Metadata, Viewport } from 'next';

/**
 * The Studio lives outside `app/[locale]`, and the root layout is a passthrough
 * that renders no <html> or <body> — those come from the locale layout, which
 * this route never passes through. Without them Next refuses to render the page
 * ("Missing <html> and <body> tags in the root layout"), so the Studio needs its
 * own shell.
 *
 * It deliberately does NOT pull in the site's fonts, global stylesheet, or
 * providers: the Studio ships its own styling, and the site's CSS reset would
 * fight it.
 */
export const metadata: Metadata = {
  title: 'Kusuma Silver — Content Manager',
  // The Studio is a private editing tool; keep it out of search results.
  robots: { index: false, follow: false },
};

// The Studio is a full-screen app and needs the real viewport width.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
