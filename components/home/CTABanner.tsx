import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getWhatsAppLink } from '@/data/store';

export function CTABanner() {
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
          Chat kami langsung di WhatsApp — respon cepat dan ramah!
        </p>
        <Button
          as="a"
          href={getWhatsAppLink('Halo Bali Greenhouse, saya ingin bertanya tentang produk dan melakukan pemesanan.')}
          target="_blank"
          rel="noopener noreferrer"
          size="lg"
          className="bg-[#25D366] hover:bg-[#1ebe5d] text-white gap-2 focus:ring-[#25D366]"
        >
          <MessageCircle className="w-5 h-5" />
          Chat WhatsApp Sekarang
        </Button>
      </div>
    </section>
  );
}
