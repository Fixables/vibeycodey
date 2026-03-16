export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  productCount?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  priceDisplay: string;
  description: string;
  imageUrl?: string;
  shopeeUrl?: string;
  unit?: string;
  featured?: boolean;
  inStock: boolean;
}

export interface StoreInfo {
  name: string;
  tagline: string;
  address: string;
  city: string;
  whatsapp: string;
  whatsappDisplay: string;
  email?: string;
  hours: {
    weekday: string;
    weekend: string;
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
  };
  mapsEmbedUrl?: string;
}
