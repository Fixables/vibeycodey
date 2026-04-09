import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';
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
      <div className="relative bg-charcoal py-24 sm:py-32">
        <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-silver-mid/12 to-transparent hidden lg:block" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-silver-mid/40" />
            <span className="text-[10px] font-medium text-silver-mid/70 tracking-[0.25em] uppercase">
              {locale === 'en' ? 'Made to Order' : 'Dibuat Khusus'}
            </span>
            <div className="h-px w-10 bg-silver-mid/40" />
          </div>
          <h1
            className="font-heading font-light text-warm-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.1' }}
          >
            {t.customOrder.title}
          </h1>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-silver-mid/30" />
            <div className="h-px w-2 bg-silver-bright/50" />
            <div className="h-px w-10 bg-silver-mid/30" />
          </div>
          <p className="mt-6 text-base text-warm-white/55 leading-relaxed max-w-xl mx-auto">
            {t.customOrder.subtitle}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Description */}
        <p className="text-base leading-relaxed text-text-muted text-center max-w-2xl mx-auto">
          {t.customOrder.body}
        </p>

        {/* Divider */}
        <div className="my-14 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-silver-dark/30 to-transparent" />
          <div className="flex gap-1.5">
            <span className="h-1 w-1 rounded-full bg-silver-dark/40" />
            <span className="h-1 w-1 rounded-full bg-silver-mid/60" />
            <span className="h-1 w-1 rounded-full bg-silver-dark/40" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-silver-dark/30 to-transparent" />
        </div>

        {/* Steps — manifesto layout */}
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px w-8 bg-silver-mid" />
            <h2 className="font-heading text-2xl font-light text-charcoal sm:text-3xl">
              {locale === 'en' ? 'How It Works' : 'Cara Kerja Kami'}
            </h2>
          </div>
          <div className="divide-y divide-warm-white-dark">
            {t.customOrder.steps.map((step, i) => (
              <div key={i} className="flex gap-8 py-8 first:pt-0 last:pb-0">
                <span className="font-heading text-sm font-medium text-silver-dark mt-0.5 w-6 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-charcoal">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA block */}
        <div className="mt-16 rounded-2xl bg-charcoal px-8 py-12 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-10 bg-silver-mid/30" />
            <div className="h-px w-2 bg-silver-bright/50" />
            <div className="h-px w-10 bg-silver-mid/30" />
          </div>
          <h2 className="font-heading text-2xl font-light text-warm-white">
            {locale === 'en' ? 'Ready to Start?' : 'Siap Memulai?'}
          </h2>
          <p className="mt-3 text-sm text-warm-white/55">
            {locale === 'en'
              ? "Contact us via WhatsApp and let's bring your dream jewelry to life."
              : 'Hubungi kami via WhatsApp dan wujudkan perhiasan impian Anda.'}
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-silver-bright px-7 py-3.5 text-sm font-semibold text-charcoal transition-all duration-200 hover:bg-silver-mid"
          >
            <MessageCircle size={17} />
            {t.customOrder.cta}
          </a>
        </div>
      </div>
    </div>
  );
}
