import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Turns draft mode back off and returns to the published site.
 *
 * Presentation clears draft mode by itself when the preview pane closes, but
 * the cookie can outlive that — for example if the owner opened the preview in
 * its own tab and then navigated away. Visiting /api/draft-mode/disable gets
 * them back to what visitors see.
 */
export async function GET(request: Request) {
  const draft = await draftMode();
  draft.disable();

  // Send them somewhere sensible rather than leaving a blank response.
  const redirectTo = new URL(request.url).searchParams.get('redirect') ?? '/';
  // Only ever redirect within this site — an absolute URL here would turn the
  // endpoint into an open redirect.
  const safePath = redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/';

  return NextResponse.redirect(new URL(safePath, request.url));
}
