import { MapPin, Clock, MessageCircle, Mail } from 'lucide-react';
import { getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';
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

  const contactItems = [
    {
      icon: MapPin,
      label: t.contact.address,
      content: `${storeInfo.address}, ${storeInfo.city}`,
      href: undefined,
    },
    {
      icon: Clock,
      label: t.contact.hours,
      content: [storeInfo.hours.weekday, storeInfo.hours.weekend].filter(Boolean).join(' · '),
      href: undefined,
    },
    {
      icon: MessageCircle,
      label: t.contact.whatsapp,
      content: storeInfo.whatsappDisplay,
      href: waLink,
    },
    ...(storeInfo.email
      ? [{ icon: Mail, label: t.contact.email, content: storeInfo.email, href: `mailto:${storeInfo.email}` }]
      : []),
  ];

  return (
    <div className="bg-warm-white min-h-screen">
      {/* Page hero */}
      <div className="relative bg-charcoal py-24 sm:py-32">
        <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-silver-mid/12 to-transparent hidden lg:block" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-silver-mid/40" />
            <span className="text-[10px] font-medium text-silver-mid/70 tracking-[0.25em] uppercase">
              Kusuma Silver
            </span>
            <div className="h-px w-10 bg-silver-mid/40" />
          </div>
          <h1
            className="font-heading font-light text-warm-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.1' }}
          >
            {t.contact.title}
          </h1>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-silver-mid/30" />
            <div className="h-px w-2 bg-silver-bright/50" />
            <div className="h-px w-10 bg-silver-mid/30" />
          </div>
          <p className="mt-6 text-base text-warm-white/55 leading-relaxed">{t.contact.subtitle}</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Contact Form */}
          <ContactForm locale={locale} whatsapp={storeInfo.whatsapp} />

          {/* Store Info */}
          <div className="space-y-6">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px w-8 bg-silver-mid" />
                <h2 className="font-heading text-xl font-light text-charcoal">
                  {locale === 'en' ? 'Find Us' : 'Temukan Kami'}
                </h2>
              </div>
              <div className="divide-y divide-warm-white-dark">
                {contactItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-charcoal/5">
                        <Icon size={18} className="text-charcoal" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-silver-dark mb-1">
                          {item.label}
                        </div>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.href.startsWith('http') ? '_blank' : undefined}
                            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-sm text-text transition-colors hover:text-terracotta"
                          >
                            {item.content}
                          </a>
                        ) : (
                          <div className="text-sm text-text">{item.content}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {storeInfo.mapsEmbedUrl && (
              <div className="overflow-hidden rounded-2xl border border-warm-white-dark">
                <iframe
                  src={storeInfo.mapsEmbedUrl}
                  width="100%"
                  height="240"
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
