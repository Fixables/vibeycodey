import Link from 'next/link';
import { Instagram, MessageCircle, Facebook } from 'lucide-react';
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
    { href: `/${locale}/tentang-kami`, label: t.nav.about },
    { href: `/${locale}/kontak`, label: t.nav.contact },
  ];

  return (
    <footer className="bg-charcoal text-warm-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warm-white/10">
                <LogoIcon size={36} bare />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-lg font-semibold leading-none">{storeInfo.name}</span>
                <span className="text-[10px] text-silver-mid tracking-[0.15em] uppercase leading-tight">
                  Bali Silver
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm text-warm-white/55 leading-relaxed">{t.footer.tagline}</p>
            <div className="mt-5 flex gap-2.5">
              {storeInfo.socialMedia?.instagram && (
                <a
                  href={`https://instagram.com/${storeInfo.socialMedia.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-warm-white/10 text-warm-white/60 transition-colors hover:bg-warm-white/20 hover:text-warm-white"
                >
                  <Instagram size={17} />
                </a>
              )}
              {(storeInfo.socialMedia as { facebook?: string } | undefined)?.facebook && (
                <a
                  href={(storeInfo.socialMedia as { facebook?: string }).facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-warm-white/10 text-warm-white/60 transition-colors hover:bg-warm-white/20 hover:text-warm-white"
                >
                  <Facebook size={17} />
                </a>
              )}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-warm-white/10 text-warm-white/60 transition-colors hover:bg-warm-white/20 hover:text-warm-white"
              >
                <MessageCircle size={17} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-silver-mid">
              {t.footer.nav}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-white/60 transition-colors hover:text-warm-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-silver-mid">
              {t.footer.contact}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-warm-white/60">
              <li>{storeInfo.address}, {storeInfo.city}</li>
              <li>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-warm-white"
                >
                  {storeInfo.whatsappDisplay}
                </a>
              </li>
              {storeInfo.email && (
                <li>
                  <a
                    href={`mailto:${storeInfo.email}`}
                    className="transition-colors hover:text-warm-white"
                  >
                    {storeInfo.email}
                  </a>
                </li>
              )}
              <li className="text-warm-white/40">
                {storeInfo.hours.weekday}
              </li>
            </ul>
          </div>
        </div>

        {/* Ornamental divider */}
        <div className="mt-12 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-silver-dark/40 to-transparent" />
          <div className="flex gap-1.5">
            <span className="h-1 w-1 rounded-full bg-silver-dark/50" />
            <span className="h-1 w-1 rounded-full bg-silver-mid/70" />
            <span className="h-1 w-1 rounded-full bg-silver-dark/50" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-silver-dark/40 to-transparent" />
        </div>

        <div className="mt-6 text-center text-xs text-warm-white/30">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
