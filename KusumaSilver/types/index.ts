export type Locale = 'id' | 'en';

export interface Category {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  productCount?: number;
  /** The category's own photo, or a borrowed product photo as a fallback. */
  cover: ResolvedImage | null;
  seo?: Seo;
}

/**
 * One value in a catalogue filter — a gemstone, a material, a size.
 * `slug` is the stable identifier used in filter state; `label` is what the
 * shopper reads, already resolved for the current language.
 */
export interface TaxonomyTerm {
  slug: string;
  label: string;
  /** Rupiah this option adds to the base price. Negative makes it cheaper. */
  priceAdjust: number;
  /** False when the owner has marked this option sold out. */
  inStock: boolean;
}

/** Ring sizes and lengths are not comparable, so sizes carry their group. */
export interface SizeTerm extends TaxonomyTerm {
  group: 'ring' | 'length' | 'other';
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
  /** Formatted description; render when present, else `description`. */
  bodyRich: PortableTextBlock[] | null;
  /** Raw CMS photos, for server components that resolve their own size. */
  images: SanityImage[];
  /**
   * The first photo, pre-resolved at catalogue-card size. Resolved server-side
   * so client components (the grid, the home strip) never touch the image
   * builder — see the note on `mapProduct` in lib/sanity-data.ts.
   */
  card: ResolvedImage | null;
  /** Per-product overrides for the spec table; fall back to the site defaults. */
  origin?: LocaleString;
  technique?: LocaleString;
  seo?: Seo;
  /** Filter values, resolved from the taxonomy lists (or legacy free text). */
  gemstones: TaxonomyTerm[];
  materials: TaxonomyTerm[];
  sizeOptions: SizeTerm[];
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

  // ---- Site chrome, all optional: blank falls back to the built-in wording ----
  logo?: ResolvedImage | null;
  wordmarkSub?: LocaleString;
  promoBar?: LocaleString;
  promoBarHidden?: boolean;
  /** Raw CMS menu entries; resolved to safe links by lib/site-settings.ts. */
  mainNav?: unknown[];
  footerShopLinks?: unknown[];
  footerAtelierLinks?: unknown[];
  footerBlurb?: LocaleString;
  copyright?: LocaleString;

  /** Defaults for the piece-page details table. */
  specOrigin?: LocaleString;
  specTechnique?: LocaleString;
  specMaterial?: LocaleString;
  specLeadTime?: LocaleString;

  defaultSeo?: Seo;
}

/**
 * A localized string as stored in Sanity: one value per locale. Page documents
 * written before the localeString migration still hold flat `foo` / `fooEn`
 * pairs, so readers accept either shape (see `pickLocalized` in lib/home-content).
 */
export interface LocaleString {
  id?: string;
  en?: string;
}

/**
 * One block of formatted text as Sanity stores it (Portable Text). Rendered by
 * `components/ui/RichText.tsx`; the shape is only ever passed through, never
 * constructed by hand.
 */
export interface PortableTextBlock {
  _type: string;
  _key?: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: { _type?: string; _key?: string; text?: string; marks?: string[] }[];
  markDefs?: { _type?: string; _key?: string; href?: string }[];
}

/** Bilingual formatted text. Same both-in-one-field reasoning as LocaleString. */
export interface LocaleRichText {
  id?: PortableTextBlock[];
  en?: PortableTextBlock[];
}

/** Sanity image reference plus the presentation data the frontend needs. */
export interface SanityImage {
  asset?: {
    _ref?: string;
    _id?: string;
    _type?: string;
    metadata?: {
      /** Base64 placeholder used for the blur-up while the photo loads. */
      lqip?: string;
      dimensions?: { width: number; height: number; aspectRatio: number };
    };
  };
  hotspot?: { x: number; y: number; width: number; height: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  /** Legacy documents may hold a plain string here instead of a LocaleString. */
  alt?: LocaleString | string;
  caption?: LocaleString | string;
  hidden?: boolean;
  shape?: ImageShape;
}

/** Owner-chosen image framing. Enumerated so no invalid ratio is expressible. */
export type ImageShape = 'original' | 'square' | 'landscape' | 'portrait';

/** Owner-chosen image display size. Enumerated for the same reason. */
export type ImageSize = 'small' | 'medium' | 'large' | 'full';

/**
 * A CMS image after `buildImage()` has resolved it: ready-to-render URLs with
 * the owner's crop and focal point already baked into them. Safe to pass to
 * client components — it holds no Sanity client state.
 */
export interface ResolvedImage {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  blurDataURL?: string;
  alt: string;
  caption?: string;
  /**
   * The shape the URL was cropped to. Components use it to size the box to
   * match, so CSS `object-cover` does not re-crop and undo the owner's choice.
   */
  shape?: ImageShape;
}

export interface Seo {
  title?: LocaleString;
  description?: LocaleString;
  shareImage?: SanityImage;
}
