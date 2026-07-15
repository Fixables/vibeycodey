import { MapPin, Phone, Mail, Clock } from 'lucide-react';
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

  const infoRows = [
    {
      icon: MapPin,
      label: t.contactV3.visitLabel,
      value: `${storeInfo.address}, ${storeInfo.city}`,
      href: undefined as string | undefined,
    },
    {
      icon: Phone,
      label: t.contactV3.callLabel,
      value: storeInfo.whatsappDisplay,
      href: waLink,
    },
    ...(storeInfo.email
      ? [
          {
            icon: Mail,
            label: t.contactV3.emailLabel,
            value: storeInfo.email,
            href: `mailto:${storeInfo.email}`,
          },
        ]
      : []),
    {
      icon: Clock,
      label: t.contactV3.hoursLabel,
      value: [storeInfo.hours.weekday, storeInfo.hours.weekend].filter(Boolean).join(' · '),
      href: undefined,
    },
  ];

  return (
    <div>
      {/* Dark header */}
      <section className="border-b border-ink bg-ink px-5 py-16 text-center sm:px-10 lg:py-20">
        <p className="text-[10px] font-medium tracking-[0.34em] text-accent">
          {t.contactV3.eyebrow}
        </p>
        <h1 className="mt-4 font-heading text-[36px] font-light text-ink-soft sm:text-[46px]">
          {t.contactV3.title}
        </h1>
        <p className="mx-auto mt-4 max-w-[460px] text-sm leading-relaxed text-ink-soft/60">
          {t.contactV3.subtitle}
        </p>
      </section>

      <div className="mx-auto grid max-w-[1180px] items-start gap-10 px-5 py-16 sm:px-10 lg:grid-cols-2 lg:gap-14 lg:py-20">
        {/* Info list + map */}
        <div>
          <ul className="border border-ink bg-card">
            {infoRows.map((row) => {
              const Icon = row.icon;
              return (
                <li key={row.label} className="flex gap-4 border-b border-ink/15 p-5 last:border-b-0">
                  <Icon size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink/55">
                      {row.label}
                    </p>
                    {row.href ? (
                      <a
                        href={row.href}
                        target={row.href.startsWith('http') ? '_blank' : undefined}
                        rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="mt-1 block text-sm leading-[1.6] text-ink transition-colors hover:text-accent"
                      >
                        {row.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm leading-[1.6] text-ink">{row.value}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {storeInfo.mapsEmbedUrl && (
            <div className="mt-5 border border-ink">
              <iframe
                src={storeInfo.mapsEmbedUrl}
                width="100%"
                height="240"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t.contactV3.mapTitle}
              />
            </div>
          )}
        </div>

        {/* Message form */}
        <div>
          <p className="text-[10px] font-semibold tracking-[0.3em] text-accent">
            {t.contactV3.formEyebrow}
          </p>
          <h2 className="mt-3 font-heading text-[28px] font-normal text-ink">
            {t.contactV3.formTitle}
          </h2>
          <div className="mt-7">
            <ContactForm locale={locale} whatsapp={storeInfo.whatsapp} />
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center border border-ink px-8 py-3.5 text-xs font-semibold tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {t.contactV3.whatsappCta}
          </a>
        </div>
      </div>
    </div>
  );
}
