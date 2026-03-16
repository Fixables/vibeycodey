import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { getStoreInfo, getWhatsAppLink } from '@/lib/sanity-data';
import { getT } from '@/lib/i18n';
import type { Locale } from '@/types';

interface CTABannerProps {
  locale: Locale;
}

export async function CTABanner({ locale }: CTABannerProps) {
  const storeInfo = await getStoreInfo();
  const t = getT(locale);
  const waMessage =
    locale === 'en'
      ? 'Hello, I would like to order Kusuma Silver jewelry.'
      : 'Halo, saya ingin memesan perhiasan Kusuma Silver.';
  const waLink = getWhatsAppLink(storeInfo.whatsapp, waMessage);

  return (
    <section className="bg-espresso py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-semibold text-white sm:text-4xl">
          {t.cta.title}
        </h2>
        <p className="mt-4 text-base text-white/70">{t.cta.sub}</p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-[#25D366] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#20b958] hover:shadow-xl"
          >
            <MessageCircle size={18} />
            {t.cta.whatsapp}
          </a>
          <Link
            href={`/${locale}/koleksi`}
            className="flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/20"
          >
            {t.cta.browse}
          </Link>
        </div>
      </div>
    </section>
  );
}
