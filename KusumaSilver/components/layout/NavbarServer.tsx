import { getCategories, getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';
import { resolveChrome } from '@/lib/site-settings';
import { getT } from '@/lib/i18n';
import { Navbar } from './Navbar';
import type { Locale } from '@/types';

interface NavbarServerProps {
  locale: Locale;
}

/**
 * Resolves the menu on the server. The menu comes from Site Settings — where a
 * link points at a category *document* rather than a typed-out address — so
 * renaming or reordering categories in the Studio is reflected here without a
 * code change, and a link can never point at a page that does not exist.
 */
export async function NavbarServer({ locale }: NavbarServerProps) {
  const [storeInfo, categories] = await Promise.all([getStoreInfo(locale), getCategories(locale)]);
  const chrome = resolveChrome(storeInfo, categories, locale, getT(locale));

  const waMessage =
    locale === 'en'
      ? 'Hello, I am interested in Kusuma Silver jewelry. Could you provide more information?'
      : 'Halo, saya tertarik dengan perhiasan Kusuma Silver. Bisa info lebih lanjut?';

  return (
    <Navbar
      locale={locale}
      whatsappLink={getWhatsAppLink(storeInfo.whatsapp, waMessage)}
      storeName={storeInfo.name}
      logo={chrome.logo}
      wordmarkSub={chrome.wordmarkSub}
      navLinks={chrome.mainNav}
    />
  );
}
