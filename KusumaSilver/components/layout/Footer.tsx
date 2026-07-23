import Link from 'next/link';
import { getCategories, getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';
import { resolveChrome, type ResolvedLink } from '@/lib/site-settings';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface FooterProps {
  locale: Locale;
}

/** Internal links use next/link for client navigation; external ones do not. */
function FooterLink({ link, className }: { link: ResolvedLink; className: string }) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export async function Footer({ locale }: FooterProps) {
  const t = getT(locale);
  const [storeInfo, categories] = await Promise.all([getStoreInfo(locale), getCategories(locale)]);
  const chrome = resolveChrome(storeInfo, categories, locale, t);
  const waLink = getWhatsAppLink(storeInfo.whatsapp);

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
            {chrome.wordmarkSub}
          </div>
          <p className="mt-5 max-w-[280px] text-[13px] leading-relaxed text-ink-soft/55">
            {chrome.footerBlurb}
          </p>
        </div>

        {/* Shop */}
        <div>
          <h3 className={headingClass}>{t.footerV3.shop}</h3>
          <ul className="mt-4 space-y-2.5">
            {chrome.footerShopLinks.map((link) => (
              <li key={link.href}>
                <FooterLink link={link} className={linkClass} />
              </li>
            ))}
          </ul>
        </div>

        {/* Atelier */}
        <div>
          <h3 className={headingClass}>{t.footerV3.atelier}</h3>
          <ul className="mt-4 space-y-2.5">
            {chrome.footerAtelierLinks.map((link) => (
              <li key={link.href}>
                <FooterLink link={link} className={linkClass} />
              </li>
            ))}
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
        <span>{chrome.copyright}</span>
        <span>{t.footerV3.rights}</span>
      </div>
    </footer>
  );
}
