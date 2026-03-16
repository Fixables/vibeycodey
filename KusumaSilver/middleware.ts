import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['id', 'en'];
const DEFAULT_LOCALE = 'id';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip studio, _next, api, and static files
  if (
    pathname.startsWith('/studio') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const hasLocale = LOCALES.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );

  if (!hasLocale) {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    const locale =
      cookieLocale && LOCALES.includes(cookieLocale)
        ? cookieLocale
        : DEFAULT_LOCALE;
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|studio|.*\\..*).*)'],
};
