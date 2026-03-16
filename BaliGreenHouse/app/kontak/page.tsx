import { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { StoreInfo } from '@/components/contact/StoreInfo';
import { LocationMap } from '@/components/contact/LocationMap';
import { getStoreInfo } from '@/lib/sanity-data';

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description: 'Hubungi Bali Greenhouse melalui WhatsApp, email, atau kunjungi toko kami di Kerobokan, Bali.',
};

export default async function KontakPage() {
  const storeInfo = await getStoreInfo();
  return (
    <div className="bg-[#F7F3EC] min-h-screen">
      <div className="bg-[#2C5F2E] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl font-bold text-white mb-3"
            style={{ fontFamily: 'var(--font-lora, Lora, serif)' }}
          >
            Hubungi Kami
          </h1>
          <p className="text-white/70 text-lg">
            Kami siap membantu — respon cepat dan ramah!
          </p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white rounded-3xl p-8 border border-[#A8C5A0]/30 shadow-sm">
            <ContactForm whatsapp={storeInfo.whatsapp} />
          </div>
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-[#A8C5A0]/30 shadow-sm">
              <StoreInfo />
            </div>
            <LocationMap />
          </div>
        </div>
      </div>
    </div>
  );
}
