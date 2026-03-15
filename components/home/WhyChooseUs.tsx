import { ShieldCheck, Tag, MessageCircle, Truck } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Produk Terpercaya',
    description: 'Kami hanya menjual produk berkualitas dari merek terpercaya yang sudah teruji di lapangan.',
  },
  {
    icon: Tag,
    title: 'Harga Terjangkau',
    description: 'Harga bersahabat untuk semua kalangan, dari pemula hingga petani profesional.',
  },
  {
    icon: MessageCircle,
    title: 'Konsultasi Gratis',
    description: 'Tim kami siap membantu Anda memilih produk yang tepat sesuai kebutuhan kebun Anda.',
  },
  {
    icon: Truck,
    title: 'Pengiriman ke Seluruh Bali',
    description: 'Kami melayani pengiriman ke seluruh wilayah Bali dengan cepat dan aman.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-20 bg-[#F7F3EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Mengapa Memilih Kami?"
          subtitle="Kepercayaan Anda adalah prioritas utama kami"
          className="mb-12"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div key={reason.title} className="bg-white rounded-2xl p-6 border border-[#A8C5A0]/30 text-center">
                <div className="w-14 h-14 bg-[#2C5F2E]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7 text-[#2C5F2E]" />
                </div>
                <h3 className="font-bold text-[#2C5F2E] text-lg mb-2" style={{ fontFamily: 'var(--font-lora, Lora, serif)' }}>
                  {reason.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{reason.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
