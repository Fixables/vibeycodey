'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, MessageCircle, Leaf } from 'lucide-react';
import { storeInfo, getWhatsAppLink } from '@/data/store';
import { Button } from '@/components/ui/Button';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/katalog', label: 'Katalog' },
  { href: '/tentang-kami', label: 'Tentang Kami' },
  { href: '/kontak', label: 'Kontak' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#A8C5A0]/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-[#2C5F2E] rounded-lg flex items-center justify-center group-hover:bg-[#4A8C4F] transition-colors">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-[#2C5F2E] text-lg leading-none" style={{ fontFamily: 'var(--font-lora, Lora, serif)' }}>
                Bali Greenhouse
              </div>
              <div className="text-[10px] text-[#6B7280] leading-none">Solusi Kebun Terlengkap</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#2A2A2A] hover:text-[#2C5F2E] font-medium transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            <Button
              as="a"
              href={getWhatsAppLink('Halo, saya ingin bertanya tentang produk Bali Greenhouse')}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              variant="primary"
              className="gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-[#2A2A2A] hover:bg-[#A8C5A0]/20 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-[#A8C5A0]/30 px-4 py-4">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2.5 px-3 rounded-lg text-[#2A2A2A] hover:bg-[#A8C5A0]/20 hover:text-[#2C5F2E] font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-[#A8C5A0]/30">
              <Button
                as="a"
                href={getWhatsAppLink('Halo, saya ingin bertanya tentang produk Bali Greenhouse')}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                variant="primary"
                className="w-full"
              >
                <MessageCircle className="w-4 h-4" />
                Chat WhatsApp
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
