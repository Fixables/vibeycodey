import Link from 'next/link';
import { PortableText } from 'next-sanity';
import { getStoreInfo } from '@/lib/sanity-data';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import type { Locale } from '@/types';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

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

const values = (locale: Locale) => [
  {
    num: '01',
    title: locale === 'en' ? 'Quality' : 'Kualitas',
    desc: locale === 'en' ? 'Certified 925 silver in every piece' : 'Perak 925 tersertifikasi di setiap karya',
  },
  {
    num: '02',
    title: locale === 'en' ? 'Integrity' : 'Integritas',
    desc: locale === 'en' ? 'Honest craftsmanship, transparent pricing' : 'Keahlian jujur, harga transparan',
  },
  {
    num: '03',
    title: locale === 'en' ? 'Artistry' : 'Seni',
    desc: locale === 'en' ? 'Traditional Balinese art in every design' : 'Seni Bali tradisional di setiap desain',
  },
  {
    num: '04',
    title: locale === 'en' ? 'Heritage' : 'Warisan',
    desc: locale === 'en' ? 'Preserving Balinese craft traditions' : 'Melestarikan tradisi kerajinan Bali',
  },
];

export default async function TentangKamiPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const storeInfo = await getStoreInfo();
  const t = getT(locale);

  const contentBlocks = locale === 'en'
    ? storeInfo.aboutContentEn || storeInfo.aboutContent
    : storeInfo.aboutContent;

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
            {t.about.title}
          </h1>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-silver-mid/30" />
            <div className="h-px w-2 bg-silver-bright/50" />
            <div className="h-px w-10 bg-silver-mid/30" />
          </div>
          <p className="mt-6 text-base text-warm-white/55 leading-relaxed">{t.about.subtitle}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Story */}
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px w-8 bg-silver-mid" />
            <h2 className="font-heading text-2xl font-light text-charcoal">
              {locale === 'en' ? 'Our Story' : 'Cerita Kami'}
            </h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-text-muted">
            {contentBlocks ? (
              <PortableText value={contentBlocks as Parameters<typeof PortableText>[0]['value']} />
            ) : (
              (locale === 'en' ? defaultAboutEn : defaultAboutId).map((p, i) => (
                <p key={i}>{p}</p>
              ))
            )}
          </div>
        </div>

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

        {/* Values — manifesto layout */}
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px w-8 bg-silver-mid" />
            <h2 className="font-heading text-2xl font-light text-charcoal">
              {locale === 'en' ? 'Our Values' : 'Nilai-Nilai Kami'}
            </h2>
          </div>
          <div className="divide-y divide-warm-white-dark">
            {values(locale).map((v) => (
              <div key={v.num} className="flex gap-8 py-7 first:pt-0 last:pb-0">
                <span className="font-heading text-sm font-medium text-silver-dark mt-0.5 w-6 shrink-0 tabular-nums">
                  {v.num}
                </span>
                <div>
                  <h3 className="font-heading text-base font-semibold text-charcoal">{v.title}</h3>
                  <p className="mt-1.5 text-sm text-text-muted leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/${locale}/koleksi`}
            className="rounded-lg bg-charcoal px-7 py-3.5 text-sm font-semibold text-warm-white transition-colors duration-200 hover:bg-charcoal-mid"
          >
            {t.collections.title}
          </Link>
          <Link
            href={`/${locale}/kontak`}
            className="rounded-lg border border-charcoal px-7 py-3.5 text-sm font-semibold text-charcoal transition-all duration-200 hover:bg-charcoal hover:text-warm-white"
          >
            {t.nav.contact}
          </Link>
        </div>
      </div>
    </div>
  );
}
