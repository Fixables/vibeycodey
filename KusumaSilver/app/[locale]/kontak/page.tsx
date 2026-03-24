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
    <div className="bg-warm-white min-h-screen">
      {/* Page hero */}
      <div className="bg-charcoal py-20 sm:py-24 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Ornamental label */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-silver-mid/50" />
            <span className="text-xs font-medium text-silver-mid tracking-[0.15em] uppercase">Kusuma Silver</span>
            <div className="h-px w-10 bg-silver-mid/50" />
          </div>
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
            <div className="rounded-2xl border border-warm-white-dark bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-silver-mid" />
                <h2 className="font-heading text-xl font-light text-charcoal">
                  {locale === 'en' ? 'Find Us' : 'Temukan Kami'}
                </h2>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-charcoal/5">
                    <MapPin size={20} className="text-charcoal" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-0.5">
                      {t.contact.address}
                    </div>
                    <div className="text-sm text-text">
                      {storeInfo.address}, {storeInfo.city}
                    </div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-charcoal/5">
                    <Clock size={20} className="text-charcoal" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-0.5">
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
                    <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-0.5">
                      {t.contact.whatsapp}
                    </div>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-charcoal transition-colors hover:text-terracotta"
                    >
                      {storeInfo.whatsappDisplay}
                    </a>
                  </div>
                </li>
                {storeInfo.email && (
                  <li className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-charcoal/5">
                      <Mail size={20} className="text-charcoal" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-0.5">
                        {t.contact.email}
                      </div>
                      <a
                        href={`mailto:${storeInfo.email}`}
                        className="text-sm text-charcoal transition-colors hover:text-terracotta"
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
              <div className="overflow-hidden rounded-2xl border border-warm-white-dark shadow-sm">
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
