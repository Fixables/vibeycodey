import { Metadata } from 'next';
import { Leaf, Heart, Sprout, Users } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { getWhatsAppLink } from '@/data/store';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Bali Greenhouse — toko perlengkapan berkebun terpercaya di Bali. Kami berkomitmen menyediakan produk berkualitas untuk mendukung pertanian dan berkebun di Bali.',
};

const values = [
  {
    icon: Leaf,
    title: 'Produk Berkualitas',
    description: 'Kami selalu mengutamakan kualitas dalam setiap produk yang kami jual.',
  },
  {
    icon: Heart,
    title: 'Pelanggan Utama',
    description: 'Kepuasan dan kepercayaan pelanggan adalah inti dari semua yang kami lakukan.',
  },
  {
    icon: Sprout,
    title: 'Mendukung Pertumbuhan',
    description: 'Kami tidak hanya menjual produk, tetapi juga mendukung perjalanan berkebun Anda.',
  },
  {
    icon: Users,
    title: 'Komunitas Lokal',
    description: 'Bangga menjadi bagian dari komunitas petani dan penghobi tanaman di Bali.',
  },
];

export default function TentangKamiPage() {
  return (
    <div className="bg-[#F7F3EC]">
      <div className="bg-[#2C5F2E] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">🌿</div>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-lora, Lora, serif)' }}
          >
            Tentang Bali Greenhouse
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Tumbuh Bersama, Berkembang Bersama
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#A8C5A0]/30">
          <SectionHeader title="Cerita Kami" align="left" className="mb-6" />
          <div className="space-y-4 text-[#2A2A2A] leading-relaxed">
            <p>
              Bali Greenhouse lahir dari kecintaan mendalam terhadap alam dan dunia berkebun.
              Berawal dari sebuah toko kecil di Kerobokan, kami telah berkembang menjadi
              salah satu destinasi perlengkapan berkebun terpercaya di Bali.
            </p>
            <p>
              Kami memahami betul kebutuhan para pecinta tanaman di Bali — dari petani
              profesional yang membutuhkan pupuk berkualitas tinggi, hingga pemula yang
              baru memulai perjalanan berkebun di balkon rumah mereka.
            </p>
            <p>
              Dengan lebih dari 500 jenis produk yang kami kurasi langsung dari merek-merek
              terpercaya, kami berkomitmen untuk menjadi mitra terbaik dalam setiap langkah
              perjalanan berkebun Anda.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <SectionHeader
          title="Nilai-Nilai Kami"
          subtitle="Prinsip yang memandu kami setiap hari"
          className="mb-10"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-6 border border-[#A8C5A0]/30 text-center"
              >
                <div className="w-12 h-12 bg-[#2C5F2E]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-[#2C5F2E]" />
                </div>
                <h3 className="font-bold text-[#2C5F2E] mb-2">{value.title}</h3>
                <p className="text-[#6B7280] text-sm">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#2C5F2E] py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2
            className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-lora, Lora, serif)' }}
          >
            Siap Mulai Berkebun?
          </h2>
          <p className="text-white/80 mb-8">
            Kunjungi katalog kami atau hubungi tim kami untuk konsultasi gratis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button as="a" href="/katalog" variant="secondary" size="md">
              Lihat Katalog
            </Button>
            <Button
              as="a"
              href={getWhatsAppLink('Halo, saya ingin konsultasi tentang berkebun')}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="md"
              className="border-white text-white hover:bg-white hover:text-[#2C5F2E]"
            >
              Konsultasi Gratis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
