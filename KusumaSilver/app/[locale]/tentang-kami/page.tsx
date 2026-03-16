import Link from 'next/link';
import { PortableText } from 'next-sanity';
import { getStoreInfo } from '@/lib/sanity-data';
import { SectionHeader } from '@/components/ui/SectionHeader';
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

export default async function TentangKamiPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const storeInfo = await getStoreInfo();
  const t = getT(locale);

  const contentBlocks = locale === 'en'
    ? storeInfo.aboutContentEn || storeInfo.aboutContent
    : storeInfo.aboutContent;

  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero */}
      <div className="bg-espresso py-20 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t.about.title}
            subtitle={t.about.subtitle}
            theme="dark"
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Story */}
        <div className="rounded-2xl border border-ivory-dark bg-white p-8 shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-espresso">
            {locale === 'en' ? 'Our Story' : 'Cerita Kami'}
          </h2>
          <div className="mt-4 h-0.5 w-12 bg-gold" />

          <div className="mt-6 space-y-4 text-base leading-relaxed text-text-light">
            {contentBlocks ? (
              <PortableText value={contentBlocks as Parameters<typeof PortableText>[0]['value']} />
            ) : (
              (locale === 'en' ? defaultAboutEn : defaultAboutId).map((p, i) => (
                <p key={i}>{p}</p>
              ))
            )}
          </div>
        </div>

        {/* Values */}
        <div className="mt-10">
          <h2 className="font-heading text-center text-2xl font-semibold text-espresso">
            {locale === 'en' ? 'Our Values' : 'Nilai-Nilai Kami'}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { icon: '💎', title: locale === 'en' ? 'Quality' : 'Kualitas', desc: locale === 'en' ? 'Certified 925 silver in every piece' : 'Perak 925 tersertifikasi di setiap karya' },
              { icon: '🤝', title: locale === 'en' ? 'Integrity' : 'Integritas', desc: locale === 'en' ? 'Honest craftsmanship, transparent pricing' : 'Keahlian jujur, harga transparan' },
              { icon: '🎨', title: locale === 'en' ? 'Artistry' : 'Seni', desc: locale === 'en' ? 'Traditional Balinese art in every design' : 'Seni Bali tradisional di setiap desain' },
              { icon: '🌿', title: locale === 'en' ? 'Heritage' : 'Warisan', desc: locale === 'en' ? 'Preserving Balinese craft traditions' : 'Melestarikan tradisi kerajinan Bali' },
            ].map((value) => (
              <div key={value.title} className="rounded-2xl border border-ivory-dark bg-white p-5 shadow-sm">
                <div className="text-3xl">{value.icon}</div>
                <h3 className="font-heading mt-3 text-base font-semibold text-espresso">{value.title}</h3>
                <p className="mt-1 text-sm text-text-light">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/${locale}/koleksi`}
            className="rounded-lg bg-espresso px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-espresso-mid"
          >
            {t.collections.title}
          </Link>
          <Link
            href={`/${locale}/kontak`}
            className="rounded-lg border border-espresso px-7 py-3.5 text-sm font-semibold text-espresso transition-colors hover:bg-espresso hover:text-white"
          >
            {t.nav.contact}
          </Link>
        </div>
      </div>
    </div>
  );
}
