import Link from 'next/link';
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

  const shopLinks = [
    { href: `/${locale}/koleksi/cincin`, label: t.chrome.navRings },
    { href: `/${locale}/koleksi/kalung`, label: t.chrome.navNecklaces },
    { href: `/${locale}/koleksi/gelang`, label: t.chrome.navBracelets },
    { href: `/${locale}/koleksi/anting`, label: t.chrome.navEarrings },
  ];

  const atelierLinks = [
    { href: `/${locale}/tentang-kami`, label: t.chrome.navStory, external: false },
    { href: `/${locale}/custom-order`, label: t.chrome.navBespoke, external: false },
    { href: `/${locale}/kontak`, label: t.chrome.navContact, external: false },
    ...(storeInfo.socialMedia?.instagram
      ? [
          {
            href: `https://instagram.com/${storeInfo.socialMedia.instagram}`,
            label: 'Instagram',
            external: true,
          },
        ]
      : []),
  ];

  const headingClass =
    'text-[11px] font-semibold uppercase tracking-[0.14em] text-accent';
  const linkClass =
    'text-[13px] text-ink-soft/55 transition-colors hover:text-ink-soft';

  return (
    <footer className="bg-ink text-ink-soft">
      <div className="grid grid-cols-1 gap-10 px-5 pt-12 sm:grid-cols-2 sm:px-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:pt-16">
        {/* Brand */}
        <div>
          <div className="font-heading text-[22px] font-medium tracking-[0.2em]">
            {storeInfo.name.toUpperCase()}
          </div>
          <div className="mt-2 text-[9px] font-medium tracking-[0.42em] text-ink-soft/50">
            {t.chrome.wordmarkSub}
          </div>
          <p className="mt-5 max-w-[280px] text-[13px] leading-relaxed text-ink-soft/55">
            {t.footerV3.blurb}
          </p>
        </div>

        {/* Shop */}
        <div>
          <h3 className={headingClass}>{t.footerV3.shop}</h3>
          <ul className="mt-4 space-y-2.5">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Atelier */}
        <div>
          <h3 className={headingClass}>{t.footerV3.atelier}</h3>
          <ul className="mt-4 space-y-2.5">
            {atelierLinks.map((link) =>
              link.external ? (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ) : (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className={headingClass}>{t.footerV3.contact}</h3>
          <ul className="mt-4 space-y-2.5 text-[13px] text-ink-soft/55">
            <li>
              {storeInfo.address}
              {storeInfo.city ? `, ${storeInfo.city}` : ''}
            </li>
            <li>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ink-soft"
              >
                {storeInfo.whatsappDisplay}
              </a>
            </li>
            {storeInfo.email && (
              <li>
                <a href={`mailto:${storeInfo.email}`} className="transition-colors hover:text-ink-soft">
                  {storeInfo.email}
                </a>
              </li>
            )}
            <li className="text-ink-soft/40">{storeInfo.hours.weekday}</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-ink-soft/15 px-5 py-[22px] text-[11px] text-ink-soft/40 sm:flex-row sm:px-10 lg:mt-16">
        <span>{t.footerV3.copyright}</span>
        <span>{t.footerV3.rights}</span>
      </div>
    </footer>
  );
}
