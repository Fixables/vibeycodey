import Link from 'next/link';
import { PortableText } from 'next-sanity';
import { getStoreInfo } from '@/lib/sanity-data';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import { ImageSlot } from '@/components/ui/ImageSlot';
import type { Locale } from '@/types';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

// Studio edits go live within ~60s without a rebuild.
export const revalidate = 60;

const defaultAboutId = [
  'Kusuma Silver lahir dari kecintaan kami terhadap seni kerajinan perak Bali yang telah diwariskan turun-temurun. Setiap perhiasan yang kami buat adalah perwujudan dari keahlian tangan pengrajin Bali yang berpengalaman.',
  'Kami menggunakan perak 925 berkualitas tinggi yang telah tersertifikasi, dipadukan dengan desain yang menggabungkan estetika tradisional Bali dengan sentuhan kontemporer.',
  'Visi kami adalah membawa keindahan kerajinan perak Bali ke seluruh dunia, sambil terus mendukung para pengrajin lokal Bali.',
];

const defaultAboutEn = [
  'Kusuma Silver was born from our love for Balinese silver craftsmanship that has been passed down through generations. Every piece of jewelry we create is an embodiment of the skill of experienced Balinese artisans.',
  'We use certified high-quality 925 silver, combined with designs that blend traditional Balinese aesthetics with contemporary touches.',
  'Our vision is to bring the beauty of Balinese silver craftsmanship to the world, while continuing to support local Balinese artisans.',
];

export default async function TentangKamiPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const storeInfo = await getStoreInfo();
  const t = getT(locale);

  const contentBlocks =
    locale === 'en' ? storeInfo.aboutContentEn || storeInfo.aboutContent : storeInfo.aboutContent;
  const paragraphs = locale === 'en' ? defaultAboutEn : defaultAboutId;

  const values = [
    { head: t.storyV3.valuesHead1, body: t.storyV3.valuesBody1 },
    { head: t.storyV3.valuesHead2, body: t.storyV3.valuesBody2 },
    { head: t.storyV3.valuesHead3, body: t.storyV3.valuesBody3 },
  ];

  return (
    <div>
      {/* Image hero with scrim */}
      <section className="relative h-[420px] border-b border-ink lg:h-[520px]">
        <ImageSlot alt={t.storyV3.heroImageAlt} className="h-full" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(20,20,22,.72) 0%, rgba(20,20,22,.15) 60%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1280px] px-5 pb-12 sm:px-10">
            <p className="text-[10px] font-medium tracking-[0.34em] text-gold-warm">
              {t.storyV3.eyebrow}
            </p>
            <h1 className="mt-4 max-w-[640px] font-heading text-[36px] font-light leading-[1.12] text-ink-soft sm:text-[56px]">
              {t.storyV3.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="mx-auto max-w-[820px] px-5 py-16 sm:px-10 lg:py-20">
        <p className="font-heading text-[22px] font-light leading-[1.5] text-ink sm:text-[26px]">
          {t.storyV3.lede}
        </p>
        <div className="mt-8 space-y-6 text-[15px] leading-[1.85] text-ink/70">
          {contentBlocks ? (
            <PortableText value={contentBlocks as Parameters<typeof PortableText>[0]['value']} />
          ) : (
            paragraphs.slice(0, 2).map((paragraph, i) => <p key={i}>{paragraph}</p>)
          )}
        </div>
      </section>

      {/* Two-up gallery */}
      <section className="mx-auto max-w-[1280px] px-5 sm:px-10">
        <div className="grid gap-5 sm:grid-cols-2">
          <ImageSlot alt={t.storyV3.galleryAlt1} className="aspect-square border border-ink" />
          <ImageSlot alt={t.storyV3.galleryAlt2} className="aspect-square border border-ink" />
        </div>
      </section>

      {!contentBlocks && (
        <section className="mx-auto max-w-[820px] px-5 pt-14 sm:px-10">
          <p className="text-[15px] leading-[1.85] text-ink/70">{paragraphs[2]}</p>
        </section>
      )}

      {/* Values band */}
      <section className="mt-16 border-y border-ink bg-ink lg:mt-20">
        <div className="mx-auto grid max-w-[1280px] gap-px sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.head} className="px-8 py-12 sm:px-10">
              <h2 className="font-heading text-[22px] font-normal text-ink-soft">{value.head}</h2>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-soft/60">{value.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 text-center sm:px-10 lg:py-20">
        <h2 className="font-heading text-[28px] font-normal text-ink lg:text-[34px]">
          {t.storyV3.ctaTitle}
        </h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={`/${locale}/koleksi`}
            className="bg-ink px-8 py-4 text-xs font-semibold tracking-[0.16em] text-paper transition-colors hover:bg-accent"
          >
            {t.storyV3.ctaCatalogue}
          </Link>
          <Link
            href={`/${locale}/custom-order`}
            className="border border-ink px-8 py-4 text-xs font-semibold tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {t.storyV3.ctaBespoke}
          </Link>
        </div>
      </section>
    </div>
  );
}
