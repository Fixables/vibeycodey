import type { Metadata } from 'next';
import { getBespokeContent, getStoreInfo } from '@/lib/sanity-data';
import { resolveBespoke } from '@/lib/home-content';
import { metadataFromSeo } from '@/lib/metadata';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { RichText } from '@/components/ui/RichText';
import { BespokeForm } from '@/components/bespoke/BespokeForm';
import type { Locale, Seo } from '@/types';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

// Studio edits go live within ~60s without a rebuild.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const doc = await getBespokeContent();
  const bespoke = resolveBespoke(doc, locale, getT(locale));
  return metadataFromSeo(doc?.seo as Seo | undefined, locale, {
    title: `${bespoke.heroTitle1} ${bespoke.heroTitle2}`.trim(),
    description: bespoke.heroIntro,
  });
}

export default async function CustomOrderPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const storeInfo = await getStoreInfo();
  const t = getT(locale);
  const bespoke = resolveBespoke(await getBespokeContent(), locale, t);

  return (
    <div>
      {/* Dark split hero */}
      <section className="grid border-b border-ink lg:grid-cols-2">
        <div className="flex flex-col items-start justify-center bg-ink px-6 py-16 sm:px-12 lg:px-[72px] lg:py-[88px]">
          <p className="text-[10px] font-medium tracking-[0.34em] text-accent">
            {bespoke.heroEyebrow}
          </p>
          <h1 className="mt-5 font-heading text-[38px] font-light leading-[1.1] text-ink-soft sm:text-[52px]">
            {bespoke.heroTitle1}
            <br />
            <em className="font-normal">{bespoke.heroTitle2}</em>
          </h1>
          <RichText
            value={bespoke.heroIntroRich}
            fallback={<p>{bespoke.heroIntro}</p>}
            className="mt-6 max-w-[400px] text-sm leading-[1.75] text-ink-soft/65"
          />
          <a
            href="#commission"
            className="mt-9 inline-block bg-accent px-8 py-4 text-xs font-semibold tracking-[0.16em] text-ink transition-colors hover:bg-gold-warm"
          >
            {bespoke.heroCta}
          </a>
        </div>
        <ImageSlot
          image={bespoke.heroImage}
          alt={t.bespokeV3.heroImageAlt}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="min-h-[320px] border-t border-ink lg:min-h-[520px] lg:border-l lg:border-t-0"
        />
      </section>

      {/* The process */}
      <section className="px-5 py-16 sm:px-10 lg:py-20">
        <div className="text-center">
          <p className="text-[10px] font-semibold tracking-[0.3em] text-accent">
            {bespoke.processEyebrow}
          </p>
          <h2 className="mt-3 font-heading text-[28px] font-normal text-ink lg:text-[34px]">
            {bespoke.processTitle}
          </h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-[1180px] border border-ink sm:grid-cols-2 lg:grid-cols-4">
          {bespoke.steps.map((step, i) => (
            <div
              key={i}
              className="border-b border-ink p-7 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <span className="font-heading text-[40px] font-light leading-none text-ink/25">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-heading text-[20px] font-normal text-ink">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/60">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enquiry */}
      <section id="commission" className="scroll-mt-28 px-5 pb-20 sm:px-10">
        <div className="mx-auto grid max-w-[1180px] items-start gap-10 lg:grid-cols-2">
          <ImageSlot
            image={bespoke.formImage}
            alt={t.bespokeV3.formImageAlt}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="hidden aspect-[4/5] border border-ink lg:block"
          />
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] text-accent">
              {bespoke.formEyebrow}
            </p>
            <h2 className="mt-3 font-heading text-[28px] font-normal text-ink lg:text-[34px]">
              {bespoke.formTitle}
            </h2>
            <p className="mt-2 text-sm text-ink/60">{bespoke.formSub}</p>
            <div className="mt-8">
              <BespokeForm locale={locale} whatsapp={storeInfo.whatsapp} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
