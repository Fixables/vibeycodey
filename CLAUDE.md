# Bali Greenhouse — Claude Context

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
WhatsApp is the **only** contact mechanism. There is no email form submission. All CTAs open a WhatsApp link via `getWhatsAppLink(whatsapp, message?)` from `lib/sanity-data.ts`. The WhatsApp number comes from `getStoreInfo()` and must be passed as the first argument.

---

## Project Structure
```
app/
  layout.tsx          # Root layout — font loading, metadata; uses NavbarServer
  page.tsx            # Home page
  globals.css         # Tailwind v4 @theme config + base styles
  studio/[[...tool]]/
    page.tsx          # Embedded Sanity Studio (force-dynamic)
  katalog/
    page.tsx          # Full catalog listing
    [kategori]/
      page.tsx        # Category detail page (SSG via generateStaticParams)
  tentang-kami/page.tsx
  kontak/page.tsx

components/
  layout/             # NavbarServer (server wrapper), Navbar (client), Footer
  ui/                 # Primitives: Button, Badge, Card, SectionHeader
  home/               # HeroSection, FeaturedCategories, FeaturedProducts,
                      #   WhyChooseUs, CTABanner
  catalog/            # ProductCard (whatsapp prop), ProductGrid (whatsapp prop),
                      #   CategoryGrid, SearchFilter
  contact/            # ContactForm (whatsapp prop, 'use client'), StoreInfo

sanity/
  sanity.config.ts    # Studio config (projectId, dataset, structure)
  schemaTypes/        # category.ts, product.ts, storeInfo.ts, index.ts
  scripts/seed.ts     # One-time seed from static data

lib/
  sanity.ts           # createClient — Sanity API client
  sanity-data.ts      # getCategories, getCategoryBySlug, getProducts,
                      #   getFeaturedProducts, getProductsByCategory,
                      #   getStoreInfo (React cache), getWhatsAppLink(whatsapp, msg?)
  utils.ts            # formatPrice(), cn()

types/
  index.ts            # Product, Category, StoreInfo interfaces
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
- `Product` — id, name, slug, category, price, priceDisplay (derived), description, etc.
- `Category` — slug, name, description, icon
- `StoreInfo` — name, tagline, address, city, whatsapp, hours, socialMedia, etc.

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
- **M2 — Sanity CMS Integration:** COMPLETE (data layer swapped, Studio at /studio, seed script ready)
- **M3 — Catalog Search & Filter:** Not started
- **M4 — SEO Polish:** Not started
- **M5 — Real Images:** Not started
- **M6+ — Admin Panel, DB, Payments:** Future
