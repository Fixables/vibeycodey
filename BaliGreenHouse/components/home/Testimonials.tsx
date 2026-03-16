import { Star } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getTestimonials } from '@/lib/sanity-data';

export async function Testimonials() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Kata Pelanggan Kami"
          subtitle="Kepercayaan mereka adalah kebanggaan kami"
          className="mb-10"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#F7F3EC] rounded-2xl p-6 border border-[#A8C5A0]/30 flex flex-col gap-4"
            >
              {t.rating && (
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.rating! ? 'fill-[#C8952A] text-[#C8952A]' : 'text-[#A8C5A0]'}`}
                    />
                  ))}
                </div>
              )}
              <p className="text-[#2A2A2A] text-sm leading-relaxed flex-1">"{t.content}"</p>
              <div>
                <p className="font-semibold text-[#2C5F2E] text-sm">{t.name}</p>
                {t.location && (
                  <p className="text-[#6B7280] text-xs mt-0.5">{t.location}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
