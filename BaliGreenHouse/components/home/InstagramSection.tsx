import { Instagram } from 'lucide-react';
import { getStoreInfo } from '@/lib/sanity-data';

export async function InstagramSection() {
  const storeInfo = await getStoreInfo();
  const handle = storeInfo.socialMedia?.instagram;
  if (!handle) return null;

  return (
    <section className="py-16 md:py-20 bg-[#F7F3EC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center mx-auto mb-5">
          <Instagram className="w-8 h-8 text-white" />
        </div>
        <h2
          className="text-2xl md:text-3xl font-bold text-[#2C5F2E] mb-2"
          style={{ fontFamily: 'var(--font-lora, Lora, serif)' }}
        >
          Ikuti Kami di Instagram
        </h2>
        <p className="text-[#6B7280] mb-6">
          Lihat inspirasi berkebun, tips tanaman, dan produk terbaru kami setiap hari.
        </p>
        <a
          href={`https://instagram.com/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          <Instagram className="w-5 h-5" />
          @{handle}
        </a>
      </div>
    </section>
  );
}
