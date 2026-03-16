import { Check, MessageCircle } from 'lucide-react';
import { getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import type { Locale } from '@/types';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function ResellerPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const storeInfo = await getStoreInfo();
  const t = getT(locale);

  const waMessage =
    locale === 'en'
      ? 'Hello, I am interested in becoming a Kusuma Silver reseller. Could you provide more information?'
      : 'Halo, saya tertarik menjadi reseller Kusuma Silver. Bisa info lebih lanjut?';
  const waLink = getWhatsAppLink(storeInfo.whatsapp, waMessage);

  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero */}
      <div className="bg-espresso py-20 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t.reseller.title}
            subtitle={t.reseller.subtitle}
            theme="dark"
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Benefits */}
        <div className="rounded-2xl border border-ivory-dark bg-white p-8 shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-espresso">
            {locale === 'en' ? 'Reseller Benefits' : 'Keuntungan Reseller'}
          </h2>
          <ul className="mt-6 space-y-4">
            {t.reseller.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold">
                  <Check size={12} className="text-white" />
                </div>
                <span className="text-sm leading-relaxed text-text">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Why partner */}
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: '💰',
              title: locale === 'en' ? 'Great Margins' : 'Margin Menarik',
              desc: locale === 'en' ? 'Competitive pricing for resellers' : 'Harga kompetitif untuk reseller',
            },
            {
              icon: '📦',
              title: locale === 'en' ? 'Fast Shipping' : 'Pengiriman Cepat',
              desc: locale === 'en' ? 'Reliable delivery across Indonesia' : 'Pengiriman terpercaya se-Indonesia',
            },
            {
              icon: '🤝',
              title: locale === 'en' ? 'Full Support' : 'Dukungan Penuh',
              desc: locale === 'en' ? 'Marketing materials & guidance' : 'Materi pemasaran & panduan',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-ivory-dark bg-white p-6 text-center shadow-sm"
            >
              <div className="text-4xl">{item.icon}</div>
              <h3 className="font-heading mt-3 text-base font-semibold text-espresso">{item.title}</h3>
              <p className="mt-1 text-sm text-text-light">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-espresso p-8 text-center">
          <h2 className="font-heading text-2xl font-semibold text-white">
            {locale === 'en' ? 'Join Our Network' : 'Bergabung Sekarang'}
          </h2>
          <p className="mt-2 text-sm text-white/70">
            {locale === 'en'
              ? 'Contact us via WhatsApp to discuss the reseller program.'
              : 'Hubungi kami via WhatsApp untuk mendiskusikan program reseller.'}
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#20b958]"
          >
            <MessageCircle size={18} />
            {t.reseller.cta}
          </a>
        </div>
      </div>
    </div>
  );
}
