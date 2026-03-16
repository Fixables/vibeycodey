import { getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';
import { Navbar } from './Navbar';

export async function NavbarServer() {
  const storeInfo = await getStoreInfo();
  const whatsappLink = getWhatsAppLink(
    storeInfo.whatsapp,
    'Halo, saya ingin bertanya tentang produk Bali Greenhouse'
  );
  return <Navbar whatsappLink={whatsappLink} />;
}
