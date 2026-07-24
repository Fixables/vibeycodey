import type { Metadata } from 'next';
import Link from 'next/link';
import { getAboutContent } from '@/lib/sanity-data';
import { resolveAbout } from '@/lib/home-content';
import { metadataFromSeo } from '@/lib/metadata';
import { SUPPORTED_LOCALES, getT } from '@/lib/i18n';
import { ImageSlot } from '@/components/ui/ImageSlot';
import { RichText } from '@/components/ui/RichText';
import { shapeClass } from '@/lib/image';
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
  const doc = await getAboutContent();
  const about = resolveAbout(doc, locale, getT(locale));
  return metadataFromSeo(doc?.seo as Seo | undefined, locale, {
    title: about.heroTitle,
    description: about.lede,
  });
}

export default async function TentangKamiPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getT(locale);
  const about = resolveAbout(await getAboutContent(), locale, t);

  return (
    <div>
      {/* Image hero with scrim */}
      <section className="relative h-[420px] border-b border-ink lg:h-[520px]">
        <ImageSlot
          image={about.heroImage}
          alt={t.storyV3.heroImageAlt}
          priority
          sizes="100vw"
          className="h-full"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(20,20,22,.72) 0%, rgba(20,20,22,.15) 60%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1280px] px-5 pb-12 sm:px-10">
            <p className="text-[10px] font-medium tracking-[0.34em] text-gold-warm">
              {about.heroEyebrow}
            </p>
            <h1 className="mt-4 max-w-[640px] font-heading text-[36px] font-light leading-[1.12] text-ink-soft sm:text-[56px]">
              {about.heroTitle}
            </h1>
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="mx-auto max-w-[820px] px-5 py-16 sm:px-10 lg:py-20">
        <p className="font-heading text-[22px] font-light leading-[1.5] text-ink sm:text-[26px]">
          {about.lede}
        </p>
        <div className="mt-8 space-y-6 text-[15px] leading-[1.85] text-ink/70">
          {[0, 1].map((i) => (
            <RichText key={i} value={about.bodyRich[i]} fallback={<p>{about.body[i]}</p>} />
          ))}
        </div>
      </section>

      {/* Gallery — two-up by default, widening to three when the owner adds more */}
      {about.gallery.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-5 sm:px-10">
          <div
            className={`grid gap-5 ${
              about.gallery.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
            }`}
          >
            {about.gallery.map((image, i) => (
              <ImageSlot
                key={image.src}
                image={image}
                alt={i === 0 ? t.storyV3.galleryAlt1 : t.storyV3.galleryAlt2}
                sizes="(min-width: 640px) 50vw, 100vw"
                // The box matches the shape the owner chose, so object-cover
                // does not crop the photo a second time.
                className={`${shapeClass(image.shape)} border border-ink`}
              />
            ))}
          </div>
        </section>
      )}

      {(about.bodyRich[2] || about.body[2]) && (
        <section className="mx-auto max-w-[820px] px-5 pt-14 sm:px-10">
          <RichText
            value={about.bodyRich[2]}
            fallback={<p>{about.body[2]}</p>}
            className="text-[15px] leading-[1.85] text-ink/70"
          />
        </section>
      )}

      {/* Values band */}
      <section className="mt-16 border-y border-ink bg-ink lg:mt-20">
        <div className="mx-auto grid max-w-[1280px] gap-px sm:grid-cols-3">
          {about.values.map((value) => (
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
          {about.ctaTitle}
        </h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={`/${locale}/koleksi`}
            className="bg-ink px-8 py-4 text-xs font-semibold tracking-[0.16em] text-paper transition-colors hover:bg-accent"
          >
            {about.ctaCatalogue}
          </Link>
          <Link
            href={`/${locale}/custom-order`}
            className="border border-ink px-8 py-4 text-xs font-semibold tracking-[0.16em] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {about.ctaBespoke}
          </Link>
        </div>
      </section>
    </div>
  );
}
