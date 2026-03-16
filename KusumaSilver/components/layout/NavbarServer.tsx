import { getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';
import { Navbar } from './Navbar';
import type { Locale } from '@/types';

interface NavbarServerProps {
  locale: Locale;
}

export async function NavbarServer({ locale }: NavbarServerProps) {
  const storeInfo = await getStoreInfo();
  const waMessage =
    locale === 'en'
      ? 'Hello, I am interested in Kusuma Silver jewelry. Could you provide more information?'
      : 'Halo, saya tertarik dengan perhiasan Kusuma Silver. Bisa info lebih lanjut?';
  const whatsappLink = getWhatsAppLink(storeInfo.whatsapp, waMessage);

  return (
    <Navbar
      locale={locale}
      whatsappLink={whatsappLink}
      storeName={storeInfo.name}
    />
  );
}
