import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import type { Locale } from '@/types';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

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
    <div className="bg-ivory min-h-screen">
      {/* Hero */}
      <div className="bg-espresso py-20 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t.customOrder.title}
            subtitle={t.customOrder.subtitle}
            theme="dark"
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Description */}
        <div className="rounded-2xl border border-ivory-dark bg-white p-8 text-center shadow-sm">
          <p className="text-base leading-relaxed text-text-light">{t.customOrder.body}</p>
        </div>

        {/* Steps */}
        <div className="mt-12">
          <h2 className="font-heading text-center text-2xl font-semibold text-espresso sm:text-3xl">
            {locale === 'en' ? 'How It Works' : 'Cara Kerja Kami'}
          </h2>
          <div className="mt-8 space-y-6">
            {t.customOrder.steps.map((step, i) => (
              <div
                key={i}
                className="flex gap-5 rounded-2xl border border-ivory-dark bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-espresso font-heading text-xl font-semibold text-gold">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-espresso">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-light">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-espresso p-8 text-center">
          <h2 className="font-heading text-2xl font-semibold text-white">
            {locale === 'en' ? 'Ready to Start?' : 'Siap Memulai?'}
          </h2>
          <p className="mt-2 text-sm text-white/70">
            {locale === 'en'
              ? 'Contact us via WhatsApp and let\'s bring your dream jewelry to life.'
              : 'Hubungi kami via WhatsApp dan wujudkan perhiasan impian Anda.'}
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#20b958]"
          >
            <MessageCircle size={18} />
            {t.customOrder.cta}
          </a>
        </div>
      </div>
    </div>
  );
}
