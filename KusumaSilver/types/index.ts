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
  socialMedia?: { instagram?: string; tiktok?: string };
  mapsEmbedUrl?: string;
  aboutContent?: unknown[];
  aboutContentEn?: unknown[];
  resellerContent?: unknown[];
  resellerContentEn?: unknown[];
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
