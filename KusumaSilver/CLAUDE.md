# Kusuma Silver — Claude Context

> **For Claude:** Update this file at the end of every session where milestones are completed or conventions change. Keep the Milestone Status and Project Structure sections current.

## Project Overview
Customer-facing e-commerce website for **Kusuma Silver**, a premium Balinese 925 sterling silver jewelry brand. **Bilingual: Indonesian (id) + English (en)**. Tagline: "Perhiasan Perak 925 Asli dari Bali" / "Authentic 925 Silver Jewelry from Bali".

**Do not hardcode text strings in components** — always use `getT(locale)` from `lib/i18n.ts`.

---

## Tech Stack
| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| Fonts | Cormorant Garamond (headings) + Plus Jakarta Sans (body) via Google Fonts |
| i18n | Custom `lib/i18n.ts` + `lib/translations/{id,en}.ts` |
| CMS | Sanity (Studio at /studio) |
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

### Bilingual / i18n
- All pages live under `app/[locale]/` (locale = `id` | `en`)
- `middleware.ts` redirects `/` → `/id` (default locale)
- **Server components:** `const t = getT(locale)` — pass `locale` down from page params
- **Client components:** Receive `locale` or `t` as props from server boundary
- Translations are in `lib/translations/id.ts` and `lib/translations/en.ts`
- Type: `Translation` from `lib/i18n.ts`

### Tailwind v4
CSS-based config in `app/globals.css` inside `@theme inline`. No `tailwind.config.ts`.

Color tokens: `espresso`, `espresso-mid`, `stone`, `silver`, `ivory`, `ivory-dark`, `gold`, `text`, `text-light`.
Font vars: `--font-cormorant` (headings, `font-heading`), `--font-jakarta` (body, `font-body`).

**Always use token classes** (e.g. `bg-espresso`, `text-gold`) — never hardcode hex.

### Path Alias
`@/` maps to project root.

### Routing
```
/                    → redirect to /id
/[locale]/           → Home
/[locale]/koleksi    → Collections catalog
/[locale]/koleksi/[kategori]        → Category page
/[locale]/koleksi/[kategori]/[slug] → Piece detail page
/[locale]/custom-order              → Custom Order page
/[locale]/reseller                  → Reseller Program
/[locale]/tentang-kami              → About
/[locale]/kontak                    → Contact
/studio/[[...tool]]                 → Sanity Studio (no locale prefix)
```

### Orders / CTA
- **All order CTAs** link to WhatsApp via `getWhatsAppLink(whatsapp, message)` from `lib/sanity-data.ts`
- **No Shopee integration** — this brand is WhatsApp-only
- Message template (id): `Halo, saya tertarik dengan ${product.name}. Bisa info lebih lanjut?`
- Message template (en): `Hello, I'm interested in ${product.nameEn}. Could you provide more details?`

### Product Images
Multiple images stored as array of Sanity `image` assets (`images[]` in schema). `urlFor()` from `lib/sanity.ts` converts to CDN URL. Detail page shows first image prominently + thumbnail strip.

### Logo
lucide `Gem` icon (white) inside dark espresso rounded square (`bg-espresso`). On dark backgrounds, use `bg-white/20`. Component: `components/ui/LogoIcon.tsx`.

### SSG / generateStaticParams
Every `app/[locale]/...` page exports:
```typescript
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map(locale => ({ locale }));
}
```
Nested pages combine locale with content slugs.

---

## Project Structure
```
app/
  layout.tsx              # Root passthrough layout
  page.tsx                # Redirects to /id
  globals.css             # Tailwind v4 @theme + base styles
  icon.tsx                # Favicon (ImageResponse)
  opengraph-image.tsx     # OG image (1200×630)
  robots.ts
  sitemap.ts              # Locale-aware sitemap
  studio/[[...tool]]/page.tsx    # Sanity Studio
  [locale]/
    layout.tsx            # Fonts, metadata, Navbar, Footer, sticky WA button
    page.tsx              # Home page
    koleksi/
      page.tsx            # Collections catalog
      [kategori]/
        page.tsx          # Category detail
        [slug]/
          page.tsx        # Piece detail (multi-image, specs, WA CTA)
    custom-order/page.tsx
    reseller/page.tsx
    tentang-kami/page.tsx
    kontak/page.tsx

components/
  layout/                 # NavbarServer (server), Navbar (client, locale switcher), Footer
  ui/                     # Button, Badge, Card, SectionHeader, LogoIcon, LocaleSwitcher
  home/                   # HeroSection, FeaturedCollections, CraftsmanshipStory,
                          #   FeaturedPieces, CustomOrderHighlight, WhyKusumaSection,
                          #   Testimonials, InstagramSection, CTABanner
  catalog/                # PieceCard, PieceGrid, CategoryGrid, CollectionClient, SearchFilter
  contact/                # ContactForm

lib/
  sanity.ts               # createClient + urlFor()
  sanity-data.ts          # All GROQ queries, getWhatsAppLink, getStoreInfo (React cache)
  i18n.ts                 # Locale type, getT(), SUPPORTED_LOCALES
  translations/
    id.ts                 # Indonesian strings
    en.ts                 # English strings
    index.ts              # Barrel export
  utils.ts                # formatPrice(), cn()

types/
  index.ts                # Locale, Product, Category, StoreInfo, Testimonial, CustomOrderStep

sanity/
  sanity.config.ts        # Studio config (title: Kusuma Silver Studio)
  schemaTypes/            # category, product, storeInfo, testimonial, customOrderStep
  scripts/seed.ts         # Jewelry seed data

middleware.ts             # Locale detection, redirects / → /id
```

---

## Brand / Design System

### Colors (defined in `app/globals.css`)
| Token | Hex | Usage |
|---|---|---|
| `espresso` | `#1E1A16` | Primary dark — nav, headings, CTAs |
| `espresso-mid` | `#3D352D` | Hover states |
| `stone` | `#8C8276` | Borders, muted elements |
| `silver` | `#C4C4C4` | Decorative accents |
| `ivory` | `#F8F4EE` | Page background |
| `ivory-dark` | `#EDE8DF` | Card backgrounds, borders |
| `gold` | `#B8922A` | Price highlights, badges |
| `text` | `#1A1A1A` | Body text |
| `text-light` | `#7A7068` | Muted warm text |

### Typography
- **Headings:** Cormorant Garamond — `font-heading` class, CSS var `--font-cormorant`
- **Body:** Plus Jakarta Sans — `font-body` class, CSS var `--font-jakarta`

---

## Data Layer
All data from **Sanity CMS** at build time. Key types in `types/index.ts`:
- `Product` — bilingual (name/nameEn, description/descriptionEn), images[] array, jewelry specs (material, weight, sizes, stone, craftingTime, isCustomizable), no shopeeUrl
- `Category` — bilingual (name/nameEn, description/descriptionEn)
- `StoreInfo` — bilingual tagline, no shopeeStoreUrl, has tiktok, aboutContentEn, resellerContent*
- `Testimonial` — bilingual (content/contentEn)
- `CustomOrderStep` — bilingual (title/titleEn, description/descriptionEn)

Environment variables (`.env.local` + Vercel):
```
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk...   # seed script only
```

Seed: `npx tsx sanity/scripts/seed.ts`

---

## Milestone Status
- **M1 — Foundation & Home Page:** COMPLETE (Kusuma Silver brand)
- **M2 — Sanity CMS Integration:** COMPLETE
- **M3 — Collections / Catalog:** COMPLETE (PieceCard, CollectionClient, category + detail pages)
- **M4 — SEO Polish:** COMPLETE (sitemap, robots, OG image, favicon, metadataBase)
- **M5 — Bilingual i18n:** COMPLETE (middleware, lib/i18n, translations, locale switcher)
- **M6 — Inner Pages:** COMPLETE (custom-order, reseller, tentang-kami, kontak)
- **M7 — Admin Panel, Payments:** Future

---

## Deployment
- Statically generated at build time
- Vercel deploy hook → Sanity webhook for auto-redeploy on CMS publish
- After initial deploy: add Sanity environment variables in Vercel dashboard
