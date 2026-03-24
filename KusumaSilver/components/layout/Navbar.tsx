'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { LogoIcon } from '@/components/ui/LogoIcon';
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
    <header className="sticky top-0 z-50 border-b border-warm-white-dark bg-warm-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          <LogoIcon size={36} />
          <div className="flex flex-col">
            <span className="font-heading text-lg font-semibold text-charcoal tracking-tight leading-none">
              {storeName}
            </span>
            <span className="text-[10px] text-text-muted tracking-[0.15em] uppercase leading-tight">
              Bali Silver
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-muted transition-colors hover:text-charcoal"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher currentLocale={locale} />
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-charcoal bg-charcoal px-4 py-2 text-sm font-semibold text-warm-white transition-all hover:bg-charcoal-mid"
          >
            <MessageCircle size={15} />
            {t.nav.orderNow}
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-charcoal"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-warm-white-dark bg-warm-white px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1 pt-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-warm-white-dark hover:text-charcoal"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between border-t border-warm-white-dark pt-4">
            <LocaleSwitcher currentLocale={locale} />
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-charcoal px-4 py-2 text-sm font-semibold text-warm-white"
            >
              <MessageCircle size={15} />
              {t.nav.orderNow}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
