# Kusuma Silver V2 — Claude Context

> **For Claude:** Update this file at the end of every session where milestones are completed or conventions change.

## Project Overview

Customer-facing e-commerce website for **Kusuma Silver**, a premium Balinese 925 sterling silver jewelry brand. **Bilingual: Indonesian (id) + English (en)**. Tagline: "Perhiasan Perak 925 Asli dari Bali" / "Authentic 925 Silver Jewelry from Bali".

**Do not hardcode text strings in components** — always use `getT(locale)` from `lib/i18n.ts`.
**Do not use emojis anywhere** — use text abbreviations or geometric/icon alternatives.
**Reseller page has been removed entirely** — do not re-add it anywhere.

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
- The `reseller` key has been removed from both translation files

### Tailwind v4
CSS-based config in `app/globals.css` inside `@theme inline`. No `tailwind.config.ts`.

#### New V2 Color Tokens (primary)
| Token | Hex | Usage |
|---|---|---|
| `charcoal` | `#18181B` | Hero/footer backgrounds, CTA buttons |
| `charcoal-mid` | `#27272A` | Hover dark states |
| `charcoal-light` | `#3F3F46` | Light dark surfaces |
| `silver-bright` | `#D4D4D8` | Primary silver accent — CTA on dark bg, stats |
| `silver-mid` | `#A1A1AA` | Secondary silver — borders, dividers, labels |
| `silver-dark` | `#71717A` | Muted silver — subtle borders |
| `warm-white` | `#FAF9F7` | Page background |
| `warm-white-dark` | `#EDEBE5` | Card backgrounds, borders |
| `warm-white-mid` | `#F3F1EC` | Alternate section backgrounds |
| `terracotta` | `#C47A52` | Earthy Balinese accent — use sparingly (prices, hover accents) |
| `terracotta-mid` | `#A86340` | Terracotta hover |
| `text` | `#18181B` | Primary body text |
| `text-muted` | `#71717A` | Muted body text |

#### Legacy Aliases (still compile, map to V2 values)
| Old Token | Maps To |
|---|---|
| `espresso` | `charcoal` (#18181B) |
| `espresso-mid` | `charcoal-mid` (#27272A) |
| `stone` | `silver-dark` (#71717A) |
| `silver` | `silver-bright` (#D4D4D8) |
| `ivory` | `warm-white` (#FAF9F7) |
| `ivory-dark` | `warm-white-dark` (#EDEBE5) |
| `gold` | `terracotta` (#C47A52) |
| `text-light` | `text-muted` (#71717A) |

**Prefer new token names in new code.** Legacy aliases exist so old components don't break.

Font vars: `--font-cormorant` (headings, `font-heading`), `--font-jakarta` (body, `font-body`).

### Path Alias
`@/` maps to project root.

### Routing (V2 — Reseller Removed)
```
/                    → redirect to /id
/[locale]/           → Home
/[locale]/koleksi    → Collections catalog
/[locale]/koleksi/[kategori]        → Category page
/[locale]/koleksi/[kategori]/[slug] → Piece detail page
/[locale]/custom-order              → Custom Order page
/[locale]/tentang-kami              → About
/[locale]/kontak                    → Contact
/studio/[[...tool]]                 → Sanity Studio (no locale prefix)
```

**The `/reseller` route has been completely deleted** — page, directory, schema fields, translations, sitemap entry, nav links.

### Orders / CTA
- **All order CTAs** link to WhatsApp via `getWhatsAppLink(whatsapp, message)` from `lib/sanity-data.ts`
- **No Shopee integration** — WhatsApp-only

### Logo
lucide `Gem` icon (white) inside dark charcoal rounded square (`bg-charcoal` or legacy `bg-espresso`). On dark backgrounds, use `bg-warm-white/10`. Component: `components/ui/LogoIcon.tsx`.

### Ornamental Dividers (Balinese)
Use between sections or as visual accents:
```tsx
<div className="flex items-center gap-4">
  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-silver-dark/40 to-transparent" />
  <div className="flex gap-1.5">
    <span className="h-1 w-1 rounded-full bg-silver-dark/50" />
    <span className="h-1 w-1 rounded-full bg-silver-mid/70" />
    <span className="h-1 w-1 rounded-full bg-silver-dark/50" />
  </div>
  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-silver-dark/40 to-transparent" />
</div>
```

### Category Icons
Do NOT use emoji icons in the UI. Replace emoji category icons with a 2-letter monogram box:
```tsx
<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warm-white-dark text-charcoal group-hover:bg-charcoal group-hover:text-silver-bright">
  <span className="font-heading text-base font-semibold tracking-wide">{displayName.slice(0, 2).toUpperCase()}</span>
</div>
```

---

## Project Structure
```
app/
  layout.tsx              # Root passthrough layout
  page.tsx                # Redirects to /id
  globals.css             # Tailwind v4 @theme + new V2 palette
  icon.tsx                # Favicon (ImageResponse)
  opengraph-image.tsx     # OG image (1200×630)
  robots.ts
  sitemap.ts              # Locale-aware sitemap (reseller removed)
  studio/[[...tool]]/page.tsx    # Sanity Studio
  [locale]/
    layout.tsx            # Fonts, metadata, Navbar, Footer, WA sticky button (uses real number from Sanity)
    page.tsx              # Home page
    koleksi/
      page.tsx            # Collections catalog
      [kategori]/
        page.tsx          # Category detail
        [slug]/
          page.tsx        # Piece detail (multi-image, specs, WA CTA)
    custom-order/page.tsx
    tentang-kami/page.tsx
    kontak/page.tsx
    # NOTE: reseller/ has been deleted entirely

components/
  layout/                 # NavbarServer (server), Navbar (client, locale switcher), Footer
  ui/                     # Button, Badge, Card, SectionHeader (with ornamental divider), LogoIcon, LocaleSwitcher
  home/                   # All redesigned with V2 palette — no emojis
  catalog/                # PieceCard, PieceGrid, CategoryGrid (no emoji icons), CollectionClient, SearchFilter
  contact/                # ContactForm

lib/
  sanity.ts               # createClient + urlFor()
  sanity-data.ts          # GROQ queries + getWhatsAppLink + getStoreInfo + getHomePageContent + getAboutPageContent + getContactPageContent
  i18n.ts                 # Locale type, getT(), SUPPORTED_LOCALES
  translations/
    id.ts                 # Indonesian strings (reseller key removed)
    en.ts                 # English strings (reseller key removed)
    index.ts              # Barrel export
  utils.ts                # formatPrice(), cn()

types/
  index.ts                # Locale, Product, Category, StoreInfo, Testimonial, CustomOrderStep, HomePageContent, AboutPageContent, ContactPageContent

sanity/
  sanity.config.ts        # Studio config — V2 structure with Beranda, Tentang Kami, Kontak, Informasi Toko singletons
  schemaTypes/            # category, product, storeInfo, testimonial, customOrderStep, homePage, aboutPage, contactPage
  scripts/seed.ts         # Jewelry seed data
```

---

## Sanity Studio Structure (V2)
The Studio sidebar now shows:
1. **Beranda** — home page hero/sections content (singleton)
2. **Tentang Kami** — about page content (singleton)
3. **Kontak** — contact page content (singleton)
4. **Informasi Toko** — WhatsApp, address, hours, social media (singleton)
5. **Kategori** — product categories
6. **Perhiasan** — product entries
7. **Testimoni** — testimonials
8. **Langkah Custom Order** — custom order steps

---

## Milestone Status
- **M1 — Foundation & Home Page:** COMPLETE
- **M2 — Sanity CMS Integration:** COMPLETE
- **M3 — Collections / Catalog:** COMPLETE
- **M4 — SEO Polish:** COMPLETE
- **M5 — Bilingual i18n:** COMPLETE
- **M6 — Inner Pages:** COMPLETE
- **M7 — V2 Redesign:** COMPLETE
  - New silver-elegant palette (charcoal + silver + warm-white + terracotta)
  - Reseller page fully removed
  - No emojis in UI
  - Expanded Sanity schemas (homePage, aboutPage, contactPage)
  - All pages updated with new palette
  - Ornamental Balinese dividers
  - Navbar "Bali Silver" subtext added
  - WA button fixed to use real Sanity number

---

## Deployment
- Statically generated at build time
- Vercel deploy hook → Sanity webhook for auto-redeploy on CMS publish
- Environment variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN` (seed only)
