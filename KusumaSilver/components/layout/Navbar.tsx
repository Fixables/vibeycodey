'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';
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

  const links = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/koleksi`, label: t.nav.collections },
    { href: `/${locale}/custom-order`, label: t.nav.customOrder },
    { href: `/${locale}/tentang-kami`, label: t.nav.about },
    { href: `/${locale}/kontak`, label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-warm-white-dark bg-warm-white/98 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Left: hamburger */}
        <button
          className="flex h-9 w-9 items-center justify-center text-charcoal transition-opacity hover:opacity-60"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>

        {/* Center: logo — absolute centered */}
        <Link
          href={`/${locale}`}
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-none"
        >
          <span className="font-heading text-xl font-semibold tracking-tight text-charcoal">
            {storeName}
          </span>
          <span className="text-[8px] font-medium tracking-[0.35em] uppercase text-charcoal/55">
            Silver
          </span>
        </Link>

        {/* Right: search + locale + cart */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Search"
            className="text-charcoal/70 transition-opacity hover:opacity-60"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>
          <LocaleSwitcher currentLocale={locale} />
          <button
            aria-label="Cart"
            className="relative text-charcoal/70 transition-opacity hover:opacity-60"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-charcoal text-[9px] font-semibold text-warm-white">
              0
            </span>
          </button>
        </div>
      </div>

      {/* Full-width slide-down drawer */}
      {mobileOpen && (
        <div className="border-t border-warm-white-dark bg-warm-white">
          <nav className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-text-muted transition-colors hover:bg-warm-white-dark hover:text-charcoal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 border-t border-warm-white-dark pt-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-charcoal py-3 text-sm font-semibold text-warm-white transition-colors hover:bg-charcoal-mid"
              >
                {t.nav.orderNow}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
