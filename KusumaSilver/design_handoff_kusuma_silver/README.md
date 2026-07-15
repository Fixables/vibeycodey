# Handoff: Kusuma Silver — Luxury E-commerce Redesign

## Overview
A redesign of **Kusuma Silver**, a North Balinese handmade 925 sterling silver jewelry store based in Singaraja, Buleleng (North Bali). The goal is a more serious, luxurious, editorial identity that keeps the store's North Bali heritage front and center, and turns the current WhatsApp-only site into a **fully working e-commerce store** (browse → product → cart → checkout).

The redesign was chosen from three explored directions; the winning direction ("3a") is: an **editorial atelier** look — warm ivory paper (`#F1EDE4`) + near-black ink (`#141416`) + terracotta accent (`#A85A32`), Cormorant Garamond display serif over Plus Jakarta Sans, **sharp corners everywhere** (no border-radius — a deliberate luxury/seriousness decision), thin 1px hairline rules, and an asymmetric "catalogue" grid.

## About the Design Files
The files in this bundle are **design references created in HTML** — an interactive prototype showing the intended look, copy, and behavior. They are **not production code to copy directly**. The task is to **recreate this design in the target codebase's existing environment**.

There is already a real codebase for this store: a **Next.js (App Router) + TypeScript + Tailwind CSS + Sanity CMS** project (folder `KusumaSilver/`, formerly styled with a charcoal/silver/terracotta rounded theme). It already has:
- `app/[locale]/` routing with ID/EN locales (`lib/i18n.ts`, `lib/translations/{id,en}.ts`)
- Sanity-backed data (`lib/sanity-data.ts`, products/categories/testimonials/storeInfo)
- Pages: home, `koleksi` (catalog), `koleksi/[kategori]/[slug]` (product), `custom-order`, `tentang-kami` (about), `kontak` (contact)
- Components under `components/` (layout, home, catalog, contact, ui)
- `formatPrice()` in `lib/utils.ts`, WhatsApp link helpers

**Recommended approach:** apply this new visual direction to that existing Next.js app rather than rebuilding from scratch. Reuse its i18n, Sanity data layer, and routing; replace the styling/layout and **add the missing cart + checkout**. Tailwind maps cleanly to the tokens below.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, copy, and interactions are all specified. Recreate the UI faithfully using the codebase's Tailwind setup and component patterns. Exact hex values, font sizes, and letter-spacing are given in Design Tokens and per-component notes.

## Global Layout & Chrome (every page)

**Utility bar** (top, full width): background `#141416`, text `rgba(246,244,239,.75)`, 11px / weight 500 / letter-spacing .08em, padding `9px 40px`, space-between.
- Left: `EN | ID` language toggle (active = `#F6F4EF` weight 600, inactive = `rgba(246,244,239,.45)`).
- Center: shipping message, uppercase, letter-spacing .18em.
- Right: `IDR | USD` currency toggle (same active/inactive styling).

**Header/nav** (sticky, `top:0`, `z-index:50`): background `#F1EDE4`, bottom border `1px solid #141416`.
- Row 1, 3-column grid (`1fr auto 1fr`), padding `20px 40px 16px`:
  - Left: search icon (Lucide `search`, 18px, stroke 1.5) + "SEARCH" label (11px, letter-spacing .1em, `rgba(20,20,22,.65)`).
  - Center: wordmark "KUSUMA SILVER" — Cormorant Garamond, 30px, weight 500, letter-spacing .22em, `#141416`; sub-line "NORTH BALI · EST. SINGARAJA" 9px, weight 500, letter-spacing .42em, `rgba(20,20,22,.5)`, margin-top 4px. Clicking wordmark → home.
  - Right: account icon (Lucide `user`), heart/wishlist (Lucide `heart`), cart (Lucide `shopping-bag`) all 19px stroke 1.5. Cart shows a count badge when non-empty: absolute top-right, `#141416` bg, `#F1EDE4` text, 9px weight 600, 15px min square (sharp corners).
- Row 2, centered nav, gap 40px, padding `0 40px 16px`, 12px / weight 500 / letter-spacing .14em, `#141416`: **Rings, Necklaces, Bracelets, Earrings, Pendants, Bespoke** (Bespoke colored `#A85A32`), **Our Story**. Category items filter the catalog; Bespoke → bespoke page; Our Story → story page.
- Hover on any link → `#A85A32`.

**Footer**: background `#141416`, text `#F6F4EF`, top border `1px solid #141416`.
- 4-column grid (`1.4fr 1fr 1fr 1.2fr`), gap 40px, padding `64px 40px 0`:
  1. Wordmark "KUSUMA SILVER" (Cormorant 22px, letter-spacing .2em) + tagline (9px letter-spacing .42em `rgba(246,244,239,.5)`) + blurb (13px `rgba(246,244,239,.55)`, max 280px).
  2. **Shop**: Rings / Necklaces / Bracelets / Earrings (→ catalog). Column heading 11px weight 600 letter-spacing .14em uppercase `#A85A32`.
  3. **Atelier**: Our Story / Bespoke / Contact / Instagram.
  4. **Contact**: address (Jl. Ahmad Yani, Singaraja, Buleleng, Bali 81116), phone (+62 812-3456-7890), email (hello@kusumasilver.com).
- Bottom bar: top border `1px solid rgba(246,244,239,.15)`, padding `22px 40px`, space-between, 11px `rgba(246,244,239,.4)`: "© 2026 Kusuma Silver · Singaraja, Bali Utara" and "All rights reserved".

**Floating WhatsApp button**: fixed bottom-right (`24px`), 54px square (sharp corners), `#141416` bg, `1px solid #F1EDE4` border, WhatsApp glyph `#F1EDE4` 26px, `z-index:60`.

**Language & currency are global state** affecting all copy and all prices site-wide. Persist both (localStorage or cookie/route) so they survive reloads.

## Screens / Views

### 1. Home
- **Purpose:** Establish the brand and route into the catalogue.
- **Layout / sections top→bottom:**
  1. **Split hero** — 2-col grid `58% / 42%`, `border-bottom:1px solid #141416`. Left: image (height 620px, `border-right:1px solid #141416`) — model wearing silver necklace, soft grey studio light. Right (padding `0 64px`, vertically centered): eyebrow "925 STERLING · NORTH BALI" (10px weight 500 letter-spacing .34em `#A85A32`); H1 Cormorant weight 300, 54px, line-height 1.1 — "Silver, forged the / *North Balinese way*" (second line italic weight 400); paragraph 14px/1.75 `rgba(20,20,22,.65)` max 360px; two buttons (primary dark "ENTER THE CATALOGUE", outline "OUR STORY"); coordinates line "SINGARAJA · 8°6′ S, 115°5′ E" 11px `rgba(20,20,22,.45)`.
  2. **The Catalogue (asymmetric grid)** — padding `80px 40px`. Header row: H2 "The Catalogue" (Cormorant 34px weight 400) + "VIEW ALL PIECES" link (11px weight 600 letter-spacing .16em, underlined via bottom border). Grid: outer `border:1px solid #141416`, 3 columns `38% / 24% / 38%`, internal hairline dividers.
     - Col 1: large product image (480px) + caption bar (name Cormorant 18px, meta "№ 014 · RING" 11px `rgba(20,20,22,.5)`, price right).
     - Col 2 (stacked): a "TECHNIQUE" text cell (label 10px letter-spacing .3em `#A85A32`; text Cormorant 22px "Filigree, granulation, open-flame forging") over a smaller product image (240px) + caption.
     - Col 3: product image (360px) + caption, then an "ORIGIN" text cell ("Singaraja, Buleleng — 8°6′ S, 115°5′ E").
     - Each product cell links to its product page; image scales 1.04 on hover (`transition:transform .5s`).
  3. **Heritage band** — 2-col grid, background `#141416`. Left (padding `88px 72px`, `#F6F4EF`): eyebrow "HERITAGE"; H2 Cormorant 38px "Forged above the Lovina coastline"; paragraph `rgba(246,244,239,.6)` max 400px; three stats (925 / 3 / 100%) with labels STERLING SILVER / GENERATIONS / HAND-FORGED (Cormorant 34px numerals, labels 10px letter-spacing .2em). Right: artisan image (min-height 460px).
  4. **Manifesto** — background `#141416`, centered, padding `96px 40px`, top border `rgba(246,244,239,.12)`. Eyebrow "MANIFESTO" flanked by hairlines; quote Cormorant weight 300 34px/1.4 max 760px: "We don't make jewelry for a season. We forge it for generations."; attribution "— THE KUSUMA FAMILY, SINGARAJA" 11px letter-spacing .2em.

### 2. Catalog (`koleksi`)
- **Purpose:** Browse/filter/search all pieces.
- **Layout:**
  - Dark page header (`#141416`, centered, padding `56px 40px`): eyebrow "THE CATALOGUE"; H1 Cormorant 300 46px "Every Piece, Numbered"; subtitle max 520px.
  - Controls (max-width 1280px, padding `36px 40px 0`): search input inside `1px solid #141416` box, white bg, search icon left; then filter chips (All / Rings / Necklaces / Bracelets / Earrings / Pendants) — each `1px solid #141416`, 11px weight 600 letter-spacing .12em; active chip = `#141416` bg / `#F1EDE4` text, inactive = transparent / `#141416`. Result count line 11px `rgba(20,20,22,.5)`.
  - Product grid: 4 columns, gap 20px, padding `28px 40px 80px`. Card = `1px solid #141416`, white bg, column flex. Image cell aspect 1/1 with bottom hairline; "№" meta badge top-left (`#141416` bg, `#F1EDE4`, 9px letter-spacing .14em); image scales on hover. Body padding `16px 16px 18px`: name Cormorant 17px; category label 10px letter-spacing .14em uppercase `rgba(20,20,22,.45)`; price (pushed to bottom) 13px weight 600; **ADD TO BAG** button full-width dark (`#141416`/`#F1EDE4`, 11px letter-spacing .14em).
  - Empty state: centered "No pieces match your search." (localized).

### 3. Product detail (`koleksi/[kategori]/[slug]`)
- **Purpose:** View a piece, choose size/qty, add to bag or buy now.
- **Layout:** max-width 1280px, padding `24px 40px 80px`.
  - Breadcrumb: CATALOGUE / <CATEGORY> / <Name> (11px, active segment `#141416` weight 500).
  - 2-col grid `1fr 1fr`, gap 48px:
    - Left: main image (aspect 1/1, `1px solid #141416`) + 3 thumbnail images (grid of 3, aspect 1/1, bordered).
    - Right (flex column, left-aligned): meta line "№ 014 · RING" (10px weight 600 letter-spacing .2em `#A85A32`); H1 Cormorant weight 500 40px; price Cormorant 26px; description 14px/1.75 `rgba(20,20,22,.65)`; **Size** selector (label 10px uppercase; chips `1px solid #141416`, active = dark fill); **quantity stepper** (bordered −/n/+) beside full-width **ADD TO BAG** (dark); **BUY NOW** outline full-width (adds to cart then jumps to checkout); spec table (Material / Origin / Technique / Lead time) as hairline-separated rows (label 11px uppercase `rgba(20,20,22,.55)`, value 13px weight 500).

### 4. Cart
- **Purpose:** Review bag, adjust quantities, proceed to checkout.
- **Layout:** max-width 1080px, padding `48px 40px 80px`. H1 Cormorant 40px "Your Bag" + item count.
  - 2-col grid `1fr 340px`, gap 40px:
    - Left (line items, top border hairline): each row grid `96px 1fr auto` — thumbnail (96px square bordered), name (Cormorant 19px) + meta "№ · Size X" + qty stepper, and right column with line total (Cormorant 18px) + "Remove" (11px underlined). Below: "← Continue shopping".
    - Right (Order Summary card, `1px solid #141416`, white, padding 28px): "Order Summary" (Cormorant 22px); Subtotal; Shipping (free when subtotal ≥ threshold — see logic); Total (Cormorant 26px) after a top hairline; **CHECKOUT** dark button; "Secure payment · encrypted checkout" line with lock icon.
  - Empty state: bordered panel, "Your bag is empty" (Cormorant 26px) + body + "ENTER THE CATALOGUE" button.

### 5. Checkout
- **Purpose:** Collect contact + shipping + payment, place order.
- **Layout:** max-width 1080px, padding `48px 40px 80px`. Back-to-bag link; H1 Cormorant 40px "Checkout".
  - 2-col grid `1fr 360px`, gap 40px:
    - Left form, three sections each with a `#A85A32` uppercase eyebrow (11px letter-spacing .16em):
      - **Contact**: Full name (full width), Email, Phone (WhatsApp).
      - **Shipping address**: Street (full width), City, Postal code, Country (full width).
      - **Payment**: three selectable rows (`1px solid #141416`, radio dot fills `#141416` when selected, selected row bg `rgba(168,90,50,.08)`): Credit/Debit Card (Visa · Mastercard), Bank Transfer (BCA · Mandiri), WhatsApp Order (Pay on confirmation).
      - All inputs: `1px solid #141416`, white bg, padding `13px 14px`, 13px; focus → border `#141416` (already black; use subtle emphasis).
    - Right: Order Summary card mirroring cart totals + a per-line "name × qty / price" list; **PLACE ORDER** dark button; fine print note.
- On place order → clear cart, generate order number `KS-######`, go to Confirmation.

### 6. Confirmation
- Centered, max-width 640px, padding `96px 40px 120px`. Check icon in a 64px bordered square; eyebrow "ORDER PLACED"; H1 Cormorant 300 44px "Terima kasih"; body; "ORDER KS-######"; "BACK TO HOME" button.

### 7. Bespoke / Custom Order (`custom-order`)
- **Purpose:** Explain the commission process and capture an enquiry.
- **Layout:**
  - Dark split hero (2-col): left `#141416` panel (padding `88px 72px`, `#F6F4EF`) — eyebrow "BESPOKE"; H1 Cormorant 300 52px "One design, / *forged for you*"; intro paragraph; **START YOUR COMMISSION** button in `#A85A32` (text `#141416`) that smooth-scrolls to the form. Right: image (min-height 520px).
  - **The Process**: centered eyebrow "THE PROCESS" + H2 "Four steps, four to six weeks". Bordered 4-column grid: 01 Consult / 02 Design / 03 Forge / 04 Deliver — big faded Cormorant numerals (40px `rgba(20,20,22,.25)`), title Cormorant 20px, body 13px `rgba(20,20,22,.6)`.
  - **Enquiry form** (2-col `1fr 1fr`): left image (aspect 4/5), right form — eyebrow "BEGIN", H2 "Tell us what you have in mind", subtitle; fields: Full name (full width), Email, Phone, a **type** select (A ring / A necklace / A bracelet / Earrings / Something else), a **budget** select (Under Rp 1,000,000 / Rp 1–5,000,000 / Rp 5–15,000,000 / Rp 15,000,000+), message textarea; **SEND ENQUIRY** dark button + note. On submit → replace form with a bordered "Enquiry received" thank-you panel.

### 8. Our Story (`tentang-kami`)
- **Layout:**
  - Image hero (height 520px) with dark bottom gradient scrim (`rgba(20,20,22,.72)→.15`), overlay content bottom-left within max-width 1280px: eyebrow "OUR STORY" (`#E8C9A0`) + H1 Cormorant 300 56px "Three generations of North Balinese silver".
  - Narrative column (max 820px): lede Cormorant 300 26px/1.5; two body paragraphs 15px/1.85 `rgba(20,20,22,.7)`.
  - Two-up image gallery (max 1280px, 2 cols, aspect 1/1, bordered).
  - Third body paragraph.
  - Values band (`#141416`, 3 columns): Hand-forged / 925 never plated / Rooted in Buleleng — title Cormorant 22px, body `rgba(246,244,239,.6)`.
  - CTA: H2 "Own a piece of North Bali" + buttons ENTER THE CATALOGUE (dark) / Bespoke (outline).

### 9. Contact (`kontak`)
- **Layout:**
  - Dark header (`#141416`, centered): eyebrow "CONTACT"; H1 Cormorant 300 46px "Come find us"; subtitle.
  - 2-col grid `1fr 1fr`, gap 56px:
    - Left: bordered info list (hairline rows) — Visit (map-pin icon), Call/WhatsApp (phone icon), Email (mail icon), Hours (clock icon); icon color `#A85A32`, label 10px uppercase, value 14px/1.6. Below: map/storefront image (240px, bordered).
    - Right: eyebrow "MESSAGE US" + H2 "Send a message"; fields Full name (full width), Email, Phone, message textarea; **SEND MESSAGE** dark button + **CHAT ON WHATSAPP** outline button (WhatsApp glyph). On submit → bordered "Message sent" thank-you panel.

## Interactions & Behavior
- **Client-side routing** between the 9 views (in the prototype it's a single-page view switcher; in Next.js these are real routes). Every navigation scrolls to top.
- **Language toggle (EN/ID):** swaps ALL copy, nav labels, product names/descriptions, and form labels. Wire into existing `[locale]` routing + translation files.
- **Currency toggle (IDR/USD):** reprices every displayed price. Rate used in prototype: **1 USD = 16,000 IDR**. IDR format `Rp 350.000` (id-ID grouping); USD format `$22` (rounded whole dollars). Replace with a real FX source or fixed rate in production.
- **Add to bag:** from catalog card, product page (respects size + qty). Merges lines with same slug+size (sums qty). Updates header badge.
- **Cart:** qty steppers (min 1; removing below 1 deletes the line), Remove link, live subtotal/shipping/total.
- **Buy now:** adds current product then routes to checkout.
- **Checkout:** controlled form fields; payment method radio selection; Place Order → clears cart, sets order number, routes to confirmation.
- **Bespoke & Contact forms:** controlled fields; submit swaps the form for a thank-you state (no backend in prototype).
- **Hover:** links → `#A85A32`; product images scale to 1.04 over .5s; primary dark buttons → `#A85A32` bg; outline buttons → `#141416` fill / `#F1EDE4` text.
- **Bespoke hero CTA:** smooth-scrolls to the enquiry form (use `window.scrollTo`, not `scrollIntoView`, to avoid layout jumps).

## State Management
- `lang: 'en' | 'id'` (persist)
- `currency: 'idr' | 'usd'` (persist)
- `cart: Array<{ slug, qty, size }>` (persist; source of header badge, cart, checkout)
- Product page transient: `productId`, `qty`, `size`
- Catalog: `catFilter` (category slug or 'all'), `query` (search string)
- Checkout: `form` (name, email, phone, address, city, zip, country), `pay` ('card'|'bank'|'wa'), `orderNo`
- Bespoke form: `{ name, email, phone, type, budget, message }` + `sent` flag
- Contact form: `{ name, email, phone, message }` + `sent` flag
- **Shipping rule:** free when subtotal ≥ 2,000,000 IDR (≥ $150 USD-equivalent); otherwise 45,000 IDR (≈ $15). Free/`Rp 45.000` labels are localized.

## Design Tokens
**Colors**
- Paper / page bg: `#F1EDE4`
- Ink / primary / borders: `#141416`
- Light ink on dark: `#F6F4EF`
- Terracotta accent: `#A85A32`
- Warm gold (story eyebrow on photo): `#E8C9A0`
- Body text on paper: `rgba(20,20,22,.65)`–`.7`
- Muted labels on paper: `rgba(20,20,22,.45)`–`.55`
- Body text on ink: `rgba(246,244,239,.55)`–`.6`
- Hairline on ink: `rgba(246,244,239,.12)`–`.15`
- Card white: `#FFFFFF`
- Selected payment row bg: `rgba(168,90,50,.08)`

**Typography**
- Display / serif: **Cormorant Garamond** (weights 300/400/500/600; italics used) — headings, product names, prices, quotes.
- UI / sans: **Plus Jakarta Sans** (400/500/600/700) — nav, labels, body, buttons, forms.
- Notable sizes: hero H1 54px/300; page H1 40–46px; section H2 34–38px; product name 17–19px; price 13–26px; eyebrows 10–11px with letter-spacing .3–.4em uppercase; nav 12px letter-spacing .14em; buttons 11–12px weight 600 letter-spacing .14–.16em.

**Borders / corners / shadows**
- **Border radius: 0 everywhere.** No rounded corners. This is intentional.
- Standard border: `1px solid #141416` (hairlines on dark: `rgba(246,244,239,.12–.15)`).
- **No drop shadows.** Depth comes from color blocks and hairlines, not shadow.

**Spacing**
- Page gutter: 40px. Section vertical padding: 56–96px. Card padding: 16–28px. Grid gaps: 12–56px. Container max-widths: 1280px (wide), 1080px (cart/checkout), 820px (story prose), 640px (confirmation).

**Icons:** Lucide (search, user, heart, shopping-bag, map-pin, phone, mail, clock, check, minus/plus). WhatsApp uses its brand glyph. Stroke width 1.5–1.8.

## Assets
- **All imagery is placeholder** (drag-and-drop slots in the prototype). No final photography yet — the store will supply product shots, an artisan/atelier photo, a hero model shot, story images, and a storefront/map image. Design for: hero (portrait-ish, ~58% width), square product images, 4/5 bespoke images, 16/9-ish heritage and story images.
- Fonts via Google Fonts (Cormorant Garamond, Plus Jakarta Sans).
- Instagram: https://instagram.com/kusumasilver

## Product data (as used in the prototype — replace with Sanity)
8 pieces, IDR base prices; categories ring/necklace/bracelet/earring/pendant:
- Buleleng Carved Ring (Cincin Ukir Buleleng) — ring — Rp 350.000 — № 014 — sizes 6–10
- Crescent Moon Necklace (Kalung Bulan Sabit) — necklace — Rp 450.000 — № 008 — 40/45/50cm
- Woven Bali Bracelet (Gelang Anyaman Bali) — bracelet — Rp 280.000 — № 031 — S/M/L
- Frangipani Earrings (Anting Bunga Kamboja) — earring — Rp 320.000 — № 021 — one size
- Barong Motif Pendant (Liontin Motif Barong) — pendant — Rp 390.000 — № 017 — one size
- Classic Granulation Ring (Cincin Granulasi Klasik) — ring — Rp 425.000 — № 006 — sizes 6–10
- Temple Gate Cuff (Gelang Gapura Pura) — bracelet — Rp 520.000 — № 042 — S/M/L
- Lotus Drop Earrings (Anting Tetes Teratai) — earring — Rp 300.000 — № 025 — one size

(Both EN and ID names + descriptions exist in the prototype logic; lift the exact strings from `Kusuma Silver.dc.html` if useful, or re-author in Sanity.)

## Payments & backend (to implement in production)
- **Payment gateway:** Midtrans recommended for Indonesia (bank transfer, GoPay, cards); Stripe if primarily overseas. The three payment options in the design map to: card (gateway), bank transfer (VA), and WhatsApp order (manual/pay-on-confirmation — keep as the existing low-friction fallback).
- Order persistence, confirmation email + WhatsApp notification, inventory, and shipping calc are out of scope for the design but implied by the flow.

## Files
- `Kusuma Silver.dc.html` — the full interactive prototype (all 9 views, cart/checkout logic, EN/ID + IDR/USD toggles). Primary reference.
- `Homepage Directions.dc.html` — the three explored homepage directions (1a/1b/1c) and the refinements (2a, 3a) that led to the final design. Useful for understanding rationale; **3a is the chosen direction**.
- `current/` — faithful recreations of the *previous* site (Home, Koleksi, Piece Detail) for before/after reference.

> Note: the `.dc.html` files are an authoring format. Open them in a browser to view; read the markup/logic for exact values. Treat them as reference, not code to ship.

## Screenshots
Reference screenshots of each screen are in `screenshots/`:
- `01-home.png` — home (hero, asymmetric catalogue grid begins)
- `02-catalog.png` — catalog header + search/filter controls
- `03-product.png` — product detail (gallery, size selector)
- `04-cart.png` — cart with line items + order summary
- `05-checkout.png` — checkout form + order summary
- `06-bespoke.png` — bespoke hero + process
- `07-our-story.png` — story hero + narrative
- `08-contact.png` — contact info + message form
