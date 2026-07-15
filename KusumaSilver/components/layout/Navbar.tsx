'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface NavbarProps {
  locale: Locale;
  whatsappLink: string;
  storeName: string;
}

export function Navbar({ locale, whatsappLink, storeName }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = getT(locale);
  const { count: cartCount } = useCart();

  const categoryLinks = [
    { href: `/${locale}/koleksi/cincin`, label: t.chrome.navRings },
    { href: `/${locale}/koleksi/kalung`, label: t.chrome.navNecklaces },
    { href: `/${locale}/koleksi/gelang`, label: t.chrome.navBracelets },
    { href: `/${locale}/koleksi/anting`, label: t.chrome.navEarrings },
    { href: `/${locale}/koleksi/liontin`, label: t.chrome.navPendants },
  ];

  const navLinks = [
    ...categoryLinks,
    { href: `/${locale}/custom-order`, label: t.chrome.navBespoke, accent: true },
    { href: `/${locale}/tentang-kami`, label: t.chrome.navStory },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-paper">
      {/* Row 1 — search / wordmark / bag */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 pb-3 pt-4 sm:px-10 lg:pb-4 lg:pt-5">
        {/* Left: mobile hamburger, desktop search */}
        <div className="flex items-center">
          <button
            className="-ml-2 flex h-11 w-11 cursor-pointer items-center justify-center text-ink lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t.chrome.menuClose : t.chrome.menuOpen}
          >
            {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
          <Link
            href={`/${locale}/koleksi`}
            className="hidden items-center gap-3.5 text-ink transition-colors hover:text-accent lg:flex"
          >
            <Search size={18} strokeWidth={1.5} />
            <span className="text-[11px] font-medium tracking-[0.1em] text-ink/65">
              {t.chrome.search}
            </span>
          </Link>
        </div>

        {/* Center: logo */}
        <Link href={`/${locale}`} className="flex justify-center" aria-label={storeName}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.jpg"
            alt={storeName}
            className="h-10 w-auto mix-blend-multiply sm:h-12 lg:h-14"
          />
        </Link>

        {/* Right: bag */}
        <div className="flex items-center justify-end">
          <Link
            href={`/${locale}/keranjang`}
            aria-label={t.chrome.cartLabel}
            className="relative -mr-2 flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-accent"
          >
            <ShoppingBag size={19} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0.5 flex h-[15px] min-w-[15px] items-center justify-center bg-ink px-0.5 text-[9px] font-semibold text-paper">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Row 2 — category nav (desktop) */}
      <nav className="hidden justify-center gap-10 px-10 pb-4 text-xs font-medium tracking-[0.14em] lg:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`transition-colors hover:text-accent ${
              'accent' in link && link.accent ? 'text-accent' : 'text-ink'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile slide-down menu */}
      {mobileOpen && (
        <nav className="border-t border-ink bg-paper lg:hidden">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href} className="border-b border-ink/15">
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-5 py-3.5 text-sm font-medium tracking-[0.14em] transition-colors hover:text-accent ${
                    'accent' in link && link.accent ? 'text-accent' : 'text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="border-b border-ink/15">
              <Link
                href={`/${locale}/kontak`}
                onClick={() => setMobileOpen(false)}
                className="block px-5 py-3.5 text-sm font-medium tracking-[0.14em] text-ink transition-colors hover:text-accent"
              >
                {t.chrome.navContact}
              </Link>
            </li>
          </ul>
          <div className="px-5 py-4">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="block w-full bg-ink px-8 py-3.5 text-center text-xs font-semibold tracking-[0.16em] text-paper transition-colors hover:bg-accent"
            >
              {t.nav.orderNow.toUpperCase()}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
