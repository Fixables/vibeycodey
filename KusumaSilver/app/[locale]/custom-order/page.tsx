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
    <div className="bg-warm-white min-h-screen">
      {/* Page hero */}
      <div className="bg-charcoal py-20 sm:py-24 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-silver-mid/50" />
            <span className="text-xs font-medium text-silver-mid tracking-[0.15em] uppercase">
              {locale === 'en' ? 'Made to Order' : 'Dibuat Khusus'}
            </span>
            <div className="h-px w-10 bg-silver-mid/50" />
          </div>
          <SectionHeader
            title={t.customOrder.title}
            subtitle={t.customOrder.subtitle}
            theme="dark"
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Description */}
        <div className="rounded-2xl border border-warm-white-dark bg-white p-8 text-center shadow-sm">
          <p className="text-base leading-relaxed text-text-muted">{t.customOrder.body}</p>
        </div>

        {/* Steps */}
        <div className="mt-12">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px w-8 bg-silver-mid" />
            <h2 className="font-heading text-2xl font-light text-charcoal sm:text-3xl">
              {locale === 'en' ? 'How It Works' : 'Cara Kerja Kami'}
            </h2>
          </div>
          <div className="space-y-4">
            {t.customOrder.steps.map((step, i) => (
              <div
                key={i}
                className="flex gap-5 rounded-2xl border border-warm-white-dark bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-charcoal">
                  <span className="font-heading text-lg font-semibold text-silver-bright">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-charcoal">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-charcoal p-8 text-center">
          {/* Ornamental divider */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-10 bg-silver-mid/40" />
            <div className="h-1.5 w-1.5 rounded-full bg-silver-bright" />
            <div className="h-px w-10 bg-silver-mid/40" />
          </div>
          <h2 className="font-heading text-2xl font-light text-warm-white">
            {locale === 'en' ? 'Ready to Start?' : 'Siap Memulai?'}
          </h2>
          <p className="mt-2 text-sm text-warm-white/60">
            {locale === 'en'
              ? "Contact us via WhatsApp and let's bring your dream jewelry to life."
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
