import type { Metadata } from 'next';
import { Lora, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { NavbarServer } from '@/components/layout/NavbarServer';
import { Footer } from '@/components/layout/Footer';

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://baligreenhouse.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Bali Greenhouse — Solusi Berkebun Terlengkap di Bali',
    template: '%s | Bali Greenhouse',
  },
  description:
    'Toko perlengkapan berkebun terpercaya di Bali. Benih, pupuk, media tanam, alat berkebun, pot, dan pestisida. Harga terjangkau, pengiriman ke seluruh Bali.',
  keywords: ['toko berkebun bali', 'benih bali', 'pupuk bali', 'alat berkebun', 'greenhouse bali', 'toko tanaman bali'],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Bali Greenhouse',
    url: BASE_URL,
    title: 'Bali Greenhouse — Solusi Berkebun Terlengkap di Bali',
    description: 'Toko perlengkapan berkebun terpercaya di Bali. Benih, pupuk, media tanam, alat berkebun, pot, dan pestisida.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bali Greenhouse — Solusi Berkebun Terlengkap di Bali',
    description: 'Toko perlengkapan berkebun terpercaya di Bali. Benih, pupuk, media tanam, alat berkebun, pot, dan pestisida.',
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${lora.variable} ${plusJakartaSans.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <NavbarServer />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
