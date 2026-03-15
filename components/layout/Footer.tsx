import Link from 'next/link';
import { Leaf, MapPin, Clock, Phone, Instagram, Facebook } from 'lucide-react';
import { storeInfo, getWhatsAppLink } from '@/data/store';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/katalog', label: 'Katalog Produk' },
  { href: '/tentang-kami', label: 'Tentang Kami' },
  { href: '/kontak', label: 'Hubungi Kami' },
];

export function Footer() {
  return (
    <footer className="bg-[#2C5F2E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg leading-none" style={{ fontFamily: 'var(--font-lora, Lora, serif)' }}>
                  Bali Greenhouse
                </div>
                <div className="text-[10px] text-[#A8C5A0] leading-none">Solusi Kebun Terlengkap</div>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Toko perlengkapan berkebun terpercaya di Bali. Kami menyediakan benih, pupuk, media tanam, dan alat berkebun berkualitas untuk semua kebutuhan Anda.
            </p>
            <div className="flex gap-3 mt-5">
              {storeInfo.socialMedia?.instagram && (
                <a
                  href={`https://instagram.com/${storeInfo.socialMedia.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {storeInfo.socialMedia?.facebook && (
                <a
                  href={`https://facebook.com/${storeInfo.socialMedia.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#A8C5A0] uppercase tracking-wider text-xs mb-4">
              Navigasi
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#A8C5A0] uppercase tracking-wider text-xs mb-4">
              Informasi Toko
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#A8C5A0]" />
                <span>{storeInfo.address}, {storeInfo.city}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#A8C5A0]" />
                <div>
                  <div>{storeInfo.hours.weekday}</div>
                  <div>{storeInfo.hours.weekend}</div>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-[#A8C5A0]" />
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {storeInfo.whatsappDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Bali Greenhouse. Semua hak dilindungi.</p>
          <p>Dibuat dengan ❤️ di Bali</p>
        </div>
      </div>
    </footer>
  );
}
