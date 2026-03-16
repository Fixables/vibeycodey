# Bali Greenhouse — Claude Context

> **For Claude:** Update this file at the end of every session where milestones are completed or conventions change. Keep the Milestone Status and Project Structure sections current.

## Project Overview
Customer-facing e-commerce website for **Bali Greenhouse**, a gardening supply store in Bali, Indonesia. All UI text is in **Bahasa Indonesia**. Tagline: "Solusi Lengkap untuk Kebun Anda".

**Do not change any user-facing text to English.** The site is intentionally in Indonesian.

---

## Tech Stack
| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Fonts | Lora (headings) + Plus Jakarta Sans (body) via Google Fonts |
| Deployment | Vercel |

---

## Dev Commands
```bash
npm run dev      # local dev server
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
```

---

## Critical Conventions

### Language
All user-visible strings must stay in Bahasa Indonesia. Never translate to English.

### Tailwind v4
Tailwind v4 uses CSS-based config — **there is no `tailwind.config.ts`**. All theme customization lives in `app/globals.css` inside the `@theme inline` block:

```css
@theme inline {
  --color-green-deep: #2C5F2E;
  --color-green-mid: #4A8C4F;
  /* ... */
}
```

Use the custom color tokens (`text-green-deep`, `bg-cream`, etc.) — do not hardcode hex values inline.

### Path Alias
`@/` maps to the project root. Use `@/components/...`, `@/lib/...`, etc.

### Contact / CTA
- **Product "Pesan" button** links to `shopeeUrl` (the product's specific Shopee listing set by admin). Falls back to WhatsApp if `shopeeUrl` is not set. This applies in ProductCard, FeaturedProducts, and the product detail page.
- **General WhatsApp contact** is used everywhere else (navbar, hero, contact page) via `getWhatsAppLink(whatsapp, message?)` from `lib/sanity-data.ts`. The WhatsApp number comes from `getStoreInfo()`.

### Product Images
Images are stored as native Sanity `image` assets (drag-and-drop in Studio), **not** plain URL strings. The `image` field in the product schema uses `type: 'image'` with hotspot enabled. `urlFor()` from `lib/sanity.ts` converts the Sanity image reference to a CDN URL. `cdn.sanity.io` is whitelisted in `next.config.ts` for `next/image`.

### Logo
The site logo is the lucide `Leaf` icon (white, `w-5 h-5`) inside a green rounded square (`w-9 h-9 bg-[#2C5F2E] rounded-lg`). On dark/green backgrounds (Footer), use `bg-white/20` instead. Do not replace with a custom SVG — the user prefers the lucide Leaf.

### About Page Content
The "Cerita Kami" section on `/tentang-kami` is driven by `storeInfo.aboutContent` (Portable Text array) from Sanity. Falls back to hardcoded default paragraphs if not set in CMS. Uses `<PortableText>` from `next-sanity` to render.

### Testimonials
The `testimonial` Sanity document type powers the home page Testimonials section. The component returns `null` if no testimonials exist — safe to leave empty initially.

---

## Project Structure
```
app/
  layout.tsx              # Root layout — font loading, metadata; uses NavbarServer
  page.tsx                # Home page (Hero, Categories, Products, WhyChooseUs, Testimonials, Instagram, CTA)
  opengraph-image.tsx     # Auto-generated OG image (1200×630) via Next.js ImageResponse
  globals.css             # Tailwind v4 @theme config + base styles
  studio/[[...tool]]/
    page.tsx              # Embedded Sanity Studio (force-dynamic)
  katalog/
    page.tsx              # Full catalog listing (search + filter)
    [kategori]/
      page.tsx            # Category detail page (SSG)
      [slug]/
        page.tsx          # Product detail page (SSG) — breadcrumb, image, description, Pesan CTA
  tentang-kami/page.tsx
  kontak/page.tsx

components/
  layout/                 # NavbarServer (server wrapper), Navbar (client), Footer
  ui/                     # Button, Badge, Card, SectionHeader, LogoIcon
  home/                   # HeroSection, FeaturedCategories (with product counts),
                          #   FeaturedProducts (uses ProductCard), WhyChooseUs,
                          #   Testimonials, InstagramSection, CTABanner
  catalog/                # ProductCard (links to detail page + Shopee/WA Pesan),
                          #   ProductGrid, CategoryGrid (with product counts),
                          #   CatalogClient, SearchFilter
  contact/                # ContactForm, StoreInfo, LocationMap (two-location toggle)

sanity/
  sanity.config.ts        # Studio config
  schemaTypes/            # category.ts, product.ts, storeInfo.ts, testimonial.ts, index.ts
  scripts/seed.ts         # One-time seed

lib/
  sanity.ts               # createClient + urlFor() image URL builder
  sanity-data.ts          # getCategories, getCategoryBySlug, getProducts, getFeaturedProducts,
                          #   getProductsByCategory, getProductBySlug, getAllProductSlugs,
                          #   getTestimonials, getStoreInfo (React cache), getWhatsAppLink
  utils.ts                # formatPrice(), cn()

types/
  index.ts                # Product, Category, StoreInfo, Testimonial interfaces
```

---

## Brand / Design System

### Colors (defined in `app/globals.css`)
| Token | Hex | Usage |
|---|---|---|
| `green-deep` | `#2C5F2E` | Primary brand, headings, CTAs |
| `green-mid` | `#4A8C4F` | Hover states, accents |
| `green-light` | `#A8C5A0` | Subtle backgrounds, borders |
| `cream` | `#F7F3EC` | Page background |
| `earth` | `#7B5E3A` | Warm accent, secondary text |
| `gold` | `#C8952A` | Highlights, badges, prices |
| `text` | `#2A2A2A` | Body text |
| `text-light` | `#6B7280` | Muted text |

### Typography
- **Headings:** Lora (serif) — CSS var `--font-lora`, class `font-heading`
- **Body:** Plus Jakarta Sans — CSS var `--font-jakarta`, class `font-body`

---

## Data Layer
All data comes from **Sanity CMS** at build time. Key types in `types/index.ts`:
- `Product` — id, name, slug, category, price, priceDisplay (derived), description, imageUrl (derived via `urlFor()`), shopeeUrl (optional), unit, featured, inStock
- `Category` — slug, name, description, icon, productCount (derived via GROQ back-reference count)
- `StoreInfo` — name, tagline, address, city, whatsapp, hours, socialMedia, shopeeStoreUrl, aboutContent (Portable Text), mapsEmbedUrl
- `Testimonial` — id, name, location, content, rating

Environment variables required (`.env.local` + Vercel dashboard):
```
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk...   # seed script only
```

To seed Sanity with initial data: `npx tsx sanity/scripts/seed.ts`

---

## Milestone Status
- **M1 — Foundation & Home Page:** COMPLETE
- **M2 — Sanity CMS Integration:** COMPLETE (data layer, Studio at /studio, seed script)
- **M3 — Catalog Search & Filter:** COMPLETE (CatalogClient with search + category tabs)
- **M4 — SEO Polish:** COMPLETE (sitemap, robots, OG metadata, metadataBase)
- **M5 — Real Images & UX Polish:** COMPLETE (native image upload, Shopee CTA, logo, map toggle)
- **M6 — Content & Product Depth:** COMPLETE
  - Individual product detail pages (`/katalog/[kategori]/[slug]`) with SSG
  - Testimonials section on home page (Sanity-driven, hides if empty)
  - Instagram follow section on home page (Sanity-driven, hides if no handle set)
  - About page "Cerita Kami" editable via Sanity Portable Text
  - Product count badges on category cards (home + catalog)
  - Shopee store link in footer (set via `storeInfo.shopeeStoreUrl` in Sanity)
  - Branded OG image auto-generated at `/opengraph-image`
  - `LogoIcon` updated with `bare` mode for dark backgrounds
  - Bug fix: FeaturedProducts now uses `ProductCard` (consistent Shopee/WA logic)
  - Bug fix: Footer now uses `LogoIcon` instead of lucide Leaf
- **M7+ — Admin Panel, Payments:** Future

---

## Deployment & CMS Setup

### Vercel + Sanity Webhook (auto-redeploy on publish)
The site is statically generated — content is fetched at build time. To keep the live site in sync with Sanity:
1. In Vercel: **Settings → Git → Deploy Hooks** → create a hook, copy the URL
2. In [manage.sanity.io](https://manage.sanity.io): project → **API → Webhooks** → paste the URL, trigger on **Create, Update, Delete** events only
- After setup, publishing in Sanity triggers an automatic Vercel redeploy (~1–2 min)
- To redeploy manually: Vercel dashboard → Deployments → Redeploy

### Sanity Collaborators
To give someone (e.g. a team member) edit access to the CMS:
- Go to [manage.sanity.io](https://manage.sanity.io) → project → **Members → Invite members**
- Assign role **Editor**; they log in at `/studio` with their own Sanity account
