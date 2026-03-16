import Link from 'next/link';
import { Instagram, MessageCircle } from 'lucide-react';
import { LogoIcon } from '@/components/ui/LogoIcon';
import { getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface FooterProps {
  locale: Locale;
}

export async function Footer({ locale }: FooterProps) {
  const storeInfo = await getStoreInfo();
  const t = getT(locale);
  const waLink = getWhatsAppLink(storeInfo.whatsapp);

  const navLinks = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/koleksi`, label: t.nav.collections },
    { href: `/${locale}/custom-order`, label: t.nav.customOrder },
    { href: `/${locale}/reseller`, label: t.nav.reseller },
    { href: `/${locale}/tentang-kami`, label: t.nav.about },
    { href: `/${locale}/kontak`, label: t.nav.contact },
  ];

  return (
    <footer className="bg-espresso text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
                <LogoIcon size={36} bare />
              </div>
              <span className="font-heading text-xl font-semibold">{storeInfo.name}</span>
            </div>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">{t.footer.tagline}</p>
            <div className="mt-4 flex gap-3">
              {storeInfo.socialMedia?.instagram && (
                <a
                  href={`https://instagram.com/${storeInfo.socialMedia.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <Instagram size={18} />
                </a>
              )}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              {t.footer.nav}
            </h3>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              {t.footer.contact}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>{storeInfo.address}, {storeInfo.city}</li>
              <li>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {storeInfo.whatsappDisplay}
                </a>
              </li>
              {storeInfo.email && (
                <li>
                  <a
                    href={`mailto:${storeInfo.email}`}
                    className="transition-colors hover:text-white"
                  >
                    {storeInfo.email}
                  </a>
                </li>
              )}
              <li className="text-white/50">
                {storeInfo.hours.weekday}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
