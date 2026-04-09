import { MessageCircle, MessageSquareText, PenSquare, Hammer, Package } from 'lucide-react';
import { getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import { ContactForm } from '@/components/contact/ContactForm';
import type { Locale } from '@/types';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

const stepIcons = [MessageSquareText, PenSquare, Hammer, Package];

export default async function CustomOrderPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const storeInfo = await getStoreInfo();
  const t = getT(locale);

  const waMessage =
    locale === 'en'
      ? 'Hello, I am interested in a custom order. Could you provide more details?'
      : 'Halo, saya tertarik dengan custom order. Bisa info lebih lanjut?';
  const waLink = getWhatsAppLink(storeInfo.whatsapp, waMessage);

  return (
    <div className="bg-warm-white min-h-screen pb-24">
      {/* Page hero — hammered texture */}
      <div
        className="relative overflow-hidden py-20 sm:py-24 text-center"
        style={{
          background: 'linear-gradient(145deg, #D8D5CE 0%, #C4C0B8 30%, #D0CCC4 55%, #B8B4AC 80%, #C8C4BC 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 6px 4px at 10% 20%, rgba(255,255,255,0.5) 0%, transparent 100%),
              radial-gradient(ellipse 4px 6px at 30% 60%, rgba(255,255,255,0.3) 0%, transparent 100%),
              radial-gradient(ellipse 8px 5px at 60% 35%, rgba(255,255,255,0.4) 0%, transparent 100%),
              radial-gradient(ellipse 5px 7px at 80% 70%, rgba(255,255,255,0.35) 0%, transparent 100%)
            `,
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1
            className="font-heading font-light text-charcoal"
            style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', lineHeight: '1.1' }}
          >
            {locale === 'en' ? 'Custom Bespoke Order' : 'Pesanan Khusus'}
          </h1>
          <p className="mt-3 text-sm text-charcoal/60 sm:text-base">
            {t.customOrder.subtitle}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Vertical centered icon steps */}
        <div className="space-y-12">
          {t.customOrder.steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-warm-white-dark bg-warm-white">
                  <Icon size={28} className="text-charcoal" strokeWidth={1.25} />
                </div>
                <h3 className="mt-4 font-heading text-xl font-semibold text-charcoal">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-text-muted leading-relaxed">
                  {step.description}
                </p>
                {i < t.customOrder.steps.length - 1 && (
                  <div className="mt-8 h-8 w-px bg-warm-white-dark" />
                )}
              </div>
            );
          })}
        </div>

        {/* Share Your Vision form */}
        <div className="mt-16">
          <h2 className="font-heading text-2xl font-light text-charcoal text-center">
            {locale === 'en' ? 'Share Your Vision' : 'Ceritakan Visi Anda'}
          </h2>
          <div className="mt-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={locale === 'en' ? 'Name' : 'Nama'}
                className="rounded-xl border border-warm-white-dark bg-warm-white px-4 py-3 text-sm text-text outline-none transition-colors focus:border-silver-mid placeholder:text-silver-dark"
              />
              <input
                type="email"
                placeholder="Email"
                className="rounded-xl border border-warm-white-dark bg-warm-white px-4 py-3 text-sm text-text outline-none transition-colors focus:border-silver-mid placeholder:text-silver-dark"
              />
            </div>
            <textarea
              placeholder={locale === 'en' ? 'Description (Optional)' : 'Deskripsi (Opsional)'}
              rows={3}
              className="w-full rounded-xl border border-warm-white-dark bg-warm-white px-4 py-3 text-sm text-text outline-none resize-none transition-colors focus:border-silver-mid placeholder:text-silver-dark"
            />
            {/* Upload zone */}
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-warm-white-dark bg-warm-white px-6 py-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="text-silver-dark">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
              <p className="text-sm font-medium text-charcoal">
                {locale === 'en' ? 'Upload Sketches or Inspiration Images' : 'Upload Sketsa atau Gambar Inspirasi'}
              </p>
              <p className="text-xs text-text-muted">
                {locale === 'en' ? '(Tap to browse files)' : '(Ketuk untuk cari file)'}
              </p>
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-silver-mid/30 py-3.5 text-sm font-semibold text-charcoal transition-all hover:bg-silver-mid/50"
            >
              {locale === 'en' ? 'Submit Request' : 'Kirim Permintaan'}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky bottom WhatsApp bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-warm-white/95 backdrop-blur-sm border-t border-warm-white-dark px-4 py-3 safe-area-inset-bottom">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-charcoal-light py-3.5 text-sm font-semibold text-warm-white transition-colors hover:bg-charcoal"
        >
          <MessageCircle size={18} strokeWidth={1.5} />
          {locale === 'en' ? 'Consult with an Artisan — Direct Chat' : 'Konsultasi dengan Pengrajin — Chat Langsung'}
        </a>
      </div>
    </div>
  );
}
