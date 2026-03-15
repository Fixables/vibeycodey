import Link from 'next/link';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getWhatsAppLink } from '@/data/store';

export function HeroSection() {
  return (
    <section className="relative bg-[#2C5F2E] overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #A8C5A0 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #4A8C4F 0%, transparent 40%),
                            radial-gradient(circle at 60% 80%, #A8C5A0 0%, transparent 35%)`,
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 text-[#A8C5A0] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#C8952A] rounded-full" />
            Toko Berkebun #1 di Bali
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: 'var(--font-lora, Lora, serif)' }}
          >
            Solusi Berkebun{' '}
            <span className="text-[#C8952A]">Terlengkap</span>{' '}
            di Bali
          </h1>
          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
            Dari benih hingga peralatan — semua tersedia untuk mendukung kebun impian Anda.
            Kualitas terpercaya, harga bersahabat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button as="a" href="/katalog" size="lg" variant="secondary" className="gap-2">
              Lihat Katalog
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              as="a"
              href={getWhatsAppLink('Halo, saya ingin bertanya tentang produk Bali Greenhouse')}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#2C5F2E] gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Hubungi Kami
            </Button>
          </div>
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20">
            {[
              { value: '500+', label: 'Jenis Produk' },
              { value: '1000+', label: 'Pelanggan Puas' },
              { value: '8+', label: 'Kategori Tanaman' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-[#C8952A]">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 60L1440 60L1440 20C1200 60 720 0 0 40L0 60Z" fill="#F7F3EC" />
        </svg>
      </div>
    </section>
  );
}
