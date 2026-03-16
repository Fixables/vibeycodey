import { MessageCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';

const SHOPEE_STORE_URL = 'https://shopee.co.id/baligreenhouse278';

export async function CTABanner() {
  const storeInfo = await getStoreInfo();
  const shopeeUrl = storeInfo.shopeeStoreUrl ?? SHOPEE_STORE_URL;
  return (
    <section className="py-16 md:py-20 bg-[#2C5F2E]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-5xl mb-6">🌿</div>
        <h2
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: 'var(--font-lora, Lora, serif)' }}
        >
          Mau pesan atau ada pertanyaan?
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
          Belanja di Shopee atau chat kami langsung di WhatsApp — respon cepat dan ramah!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            as="a"
            href={shopeeUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            className="bg-orange-500 hover:bg-orange-400 text-white gap-2 focus:ring-orange-500"
          >
            <ShoppingBag className="w-5 h-5" />
            Belanja di Shopee
          </Button>
          <Button
            as="a"
            href={getWhatsAppLink(storeInfo.whatsapp, 'Halo Bali Greenhouse, saya ingin bertanya tentang produk dan melakukan pemesanan.')}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            className="bg-[#25D366] hover:bg-[#1ebe5d] text-white gap-2 focus:ring-[#25D366]"
          >
            <MessageCircle className="w-5 h-5" />
            Chat WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
}
