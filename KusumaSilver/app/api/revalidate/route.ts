import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Called by a Sanity webhook whenever content is published, so an edit goes
 * live immediately instead of waiting for the page's revalidate window (which
 * can leave a low-traffic route serving a stale copy for a long time).
 *
 * Authenticated with a shared secret sent as a header — the secret lives only
 * in the Vercel env and the Sanity webhook config, never in the client bundle.
 */
function isAuthorized(request: Request): boolean {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return false;
  const provided = request.headers.get('x-revalidate-secret');
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ revalidated: false, message: 'Unauthorized' }, { status: 401 });
  }

  // Content is shared across every locale, and a single edit (a store phone
  // number, a category rename) can surface on any page — so refresh the whole
  // locale tree rather than trying to map document types to routes.
  for (const locale of SUPPORTED_LOCALES) {
    revalidatePath(`/${locale}`, 'layout');
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
