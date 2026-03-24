export type Locale = 'id' | 'en';

export interface Category {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  productCount?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  category: string;
  price: number;
  priceDisplay: string;
  description: string;
  descriptionEn: string;
  images: string[];
  imageUrl?: string;
  material?: string;
  weight?: number;
  sizes?: string;
  stone?: string;
  craftingTime?: string;
  isCustomizable?: boolean;
  featured?: boolean;
  inStock: boolean;
}

export interface StoreInfo {
  name: string;
  tagline: string;
  taglineEn: string;
  address: string;
  city: string;
  whatsapp: string;
  whatsappDisplay: string;
  email?: string;
  hours: { weekday: string; weekend: string };
  socialMedia?: { instagram?: string; tiktok?: string; facebook?: string };
  mapsEmbedUrl?: string;
  aboutContent?: unknown[];
  aboutContentEn?: unknown[];
}

export interface Testimonial {
  id: string;
  name: string;
  location?: string;
  content: string;
  contentEn?: string;
  rating?: number;
}

export interface CustomOrderStep {
  id: string;
  stepNumber: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
}

export interface HomePageContent {
  heroHeadline?: string;
  heroHeadlineEn?: string;
  heroSubtext?: string;
  heroSubtextEn?: string;
  heroImage?: string;
  heroCtaLabel?: string;
  heroCtaLabelEn?: string;
  collectionsTitle?: string;
  collectionsTitleEn?: string;
  collectionsSubtitle?: string;
  collectionsSubtitleEn?: string;
  craftsmanshipTitle?: string;
  craftsmanshipTitleEn?: string;
  craftsmanshipBody?: string;
  craftsmanshipBodyEn?: string;
  craftsmanshipImage?: string;
  ctaBannerTitle?: string;
  ctaBannerTitleEn?: string;
  ctaBannerSubtext?: string;
  ctaBannerSubtextEn?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface AboutPageContent {
  pageTitle?: string;
  pageTitleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  content?: unknown[];
  contentEn?: unknown[];
  heroImage?: string;
  values?: Array<{
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
  }>;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ContactPageContent {
  pageTitle?: string;
  pageTitleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  introText?: string;
  introTextEn?: string;
  seoTitle?: string;
  seoDescription?: string;
}
