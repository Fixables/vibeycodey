import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { CTABanner } from '@/components/home/CTABanner';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <WhyChooseUs />
      <CTABanner />
    </>
  );
}
