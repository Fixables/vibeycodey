import { StoreInfo } from '@/types';

export const storeInfo: StoreInfo = {
  name: 'Bali Greenhouse',
  tagline: 'Solusi Lengkap untuk Kebun Anda',
  address: 'Jl. Raya Kerobokan No. 88, Kerobokan Kelod',
  city: 'Badung, Bali 80361',
  whatsapp: '6281234567890',
  whatsappDisplay: '+62 812-3456-7890',
  email: 'info@baligreenhouse.id',
  hours: {
    weekday: 'Senin – Sabtu: 08.00 – 17.00 WITA',
    weekend: 'Minggu: 09.00 – 14.00 WITA',
  },
  socialMedia: {
    instagram: 'baligreenhouse',
    facebook: 'baligreenhouse',
  },
};

export function getWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${storeInfo.whatsapp}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}
