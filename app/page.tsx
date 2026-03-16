import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { InstagramSection } from '@/components/home/InstagramSection';
import { CTABanner } from '@/components/home/CTABanner';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <WhyChooseUs />
      <Testimonials />
      <InstagramSection />
      <CTABanner />
    </>
  );
}
