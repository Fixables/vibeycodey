import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';

export async function StoreInfo() {
  const storeInfo = await getStoreInfo();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#2C5F2E] mb-4" style={{ fontFamily: 'var(--font-lora, Lora, serif)' }}>
        Informasi Toko
      </h2>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#2C5F2E]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin className="w-5 h-5 text-[#2C5F2E]" />
          </div>
          <div>
            <div className="font-semibold text-[#2A2A2A] text-sm mb-0.5">Alamat</div>
            <p className="text-[#6B7280] text-sm">{storeInfo.address}<br />{storeInfo.city}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#2C5F2E]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <Clock className="w-5 h-5 text-[#2C5F2E]" />
          </div>
          <div>
            <div className="font-semibold text-[#2A2A2A] text-sm mb-0.5">Jam Operasional</div>
            <p className="text-[#6B7280] text-sm">{storeInfo.hours.weekday}<br />{storeInfo.hours.weekend}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#2C5F2E]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <Phone className="w-5 h-5 text-[#2C5F2E]" />
          </div>
          <div>
            <div className="font-semibold text-[#2A2A2A] text-sm mb-0.5">WhatsApp</div>
            <a href={getWhatsAppLink(storeInfo.whatsapp)} target="_blank" rel="noopener noreferrer" className="text-[#2C5F2E] text-sm font-medium hover:underline">
              {storeInfo.whatsappDisplay}
            </a>
          </div>
        </div>
        {storeInfo.email && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#2C5F2E]/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail className="w-5 h-5 text-[#2C5F2E]" />
            </div>
            <div>
              <div className="font-semibold text-[#2A2A2A] text-sm mb-0.5">Email</div>
              <a href={`mailto:${storeInfo.email}`} className="text-[#2C5F2E] text-sm hover:underline">{storeInfo.email}</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
