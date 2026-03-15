import { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { StoreInfo } from '@/components/contact/StoreInfo';

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description: 'Hubungi Bali Greenhouse melalui WhatsApp, email, atau kunjungi toko kami di Kerobokan, Bali.',
};

export default function KontakPage() {
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
            <ContactForm />
          </div>
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-[#A8C5A0]/30 shadow-sm">
              <StoreInfo />
            </div>
            <div className="bg-white rounded-3xl overflow-hidden border border-[#A8C5A0]/30 shadow-sm">
              <div className="aspect-video bg-gradient-to-br from-[#A8C5A0]/30 to-[#2C5F2E]/10 flex items-center justify-center">
                <div className="text-center text-[#6B7280]">
                  <div className="text-4xl mb-2">📍</div>
                  <p className="text-sm font-medium">Peta Lokasi</p>
                  <p className="text-xs">Kerobokan, Badung, Bali</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
