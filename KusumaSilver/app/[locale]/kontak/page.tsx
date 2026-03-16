import { MapPin, Clock, MessageCircle, Mail } from 'lucide-react';
import { getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ContactForm } from '@/components/contact/ContactForm';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import type { Locale } from '@/types';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function KontakPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const storeInfo = await getStoreInfo();
  const t = getT(locale);
  const waLink = getWhatsAppLink(storeInfo.whatsapp);

  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero */}
      <div className="bg-espresso py-20 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t.contact.title}
            subtitle={t.contact.subtitle}
            theme="dark"
          />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <ContactForm locale={locale} whatsapp={storeInfo.whatsapp} />

          {/* Store Info */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-ivory-dark bg-white p-6 shadow-sm">
              <h2 className="font-heading text-xl font-semibold text-espresso mb-4">
                {locale === 'en' ? 'Find Us' : 'Temukan Kami'}
              </h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-espresso/5">
                    <MapPin size={20} className="text-espresso" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-text-light mb-0.5">
                      {t.contact.address}
                    </div>
                    <div className="text-sm text-text">
                      {storeInfo.address}, {storeInfo.city}
                    </div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-espresso/5">
                    <Clock size={20} className="text-espresso" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-text-light mb-0.5">
                      {t.contact.hours}
                    </div>
                    <div className="text-sm text-text">{storeInfo.hours.weekday}</div>
                    <div className="text-sm text-text">{storeInfo.hours.weekend}</div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10">
                    <MessageCircle size={20} className="text-[#25D366]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-text-light mb-0.5">
                      {t.contact.whatsapp}
                    </div>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-espresso transition-colors hover:text-gold"
                    >
                      {storeInfo.whatsappDisplay}
                    </a>
                  </div>
                </li>
                {storeInfo.email && (
                  <li className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-espresso/5">
                      <Mail size={20} className="text-espresso" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-text-light mb-0.5">
                        {t.contact.email}
                      </div>
                      <a
                        href={`mailto:${storeInfo.email}`}
                        className="text-sm text-espresso transition-colors hover:text-gold"
                      >
                        {storeInfo.email}
                      </a>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Map if available */}
            {storeInfo.mapsEmbedUrl && (
              <div className="overflow-hidden rounded-2xl border border-ivory-dark shadow-sm">
                <iframe
                  src={storeInfo.mapsEmbedUrl}
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Store location"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
