import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { CraftsmanshipStory } from '@/components/home/CraftsmanshipStory';
import { FeaturedPieces } from '@/components/home/FeaturedPieces';
import { CustomOrderHighlight } from '@/components/home/CustomOrderHighlight';
import { WhyKusumaSection } from '@/components/home/WhyKusumaSection';
import { Testimonials } from '@/components/home/Testimonials';
import { InstagramSection } from '@/components/home/InstagramSection';
import { CTABanner } from '@/components/home/CTABanner';
import { SUPPORTED_LOCALES } from '@/lib/i18n';
import type { Locale } from '@/types';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <>
      <HeroSection locale={locale} />
      <FeaturedCollections locale={locale} />
      <CraftsmanshipStory locale={locale} />
      <FeaturedPieces locale={locale} />
      <CustomOrderHighlight locale={locale} />
      <WhyKusumaSection locale={locale} />
      <Testimonials locale={locale} />
      <InstagramSection locale={locale} />
      <CTABanner locale={locale} />
    </>
  );
}
