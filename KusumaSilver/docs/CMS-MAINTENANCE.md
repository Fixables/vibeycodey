# CMS — developer maintenance guide

Companion to `docs/CMS-GUIDE.md` (which is written for the shop owner). This
file covers how the content layer is put together and how to change it safely.

---

## 1. Where things live

```
sanity.config.ts              Studio config — desk structure, document actions.
                              At the project root because the Sanity CLI
                              requires it there.
sanity.cli.ts                 Loads .env.local so CLI commands work unaided.
sanity/schemaTypes/
  index.ts                    Registers every document and object type.
  homePage.ts …               One file per page singleton.
  product.ts, category.ts     Shop content.
  storeInfo.ts                Site Settings (kept its original type name).
  order.ts                    Written by the checkout API; never edited by hand.
  objects/
    locale.ts                 localeString / localeText.
    image.ts                  imageField() / sizedImageField() / imageMember().
    seo.ts                    Per-page search & sharing.
    navItem.ts                One menu or footer link.
    lists.ts                  Repeatable list items (stats, values, steps, …).
    sections.ts               Home page section types.
sanity/scripts/migrations/    One numbered, idempotent script per data change.

lib/sanity.ts                 Client + image URL builder.
lib/sanity-data.ts            All GROQ queries and the raw → typed mappers.
lib/home-content.ts           Merges the CMS document over the built-in copy.
lib/site-settings.ts          Resolves Site Settings into menu/footer/chrome.
lib/image.ts                  buildImage() — the only place image URLs are made.
lib/metadata.ts               metadataFromSeo() for generateMetadata.
lib/catalog.ts                categoryLabel(), localizedValue(), parseSizes().
```

---

## 2. Rules that keep this safe

**Blank is always valid.** Every content field is optional. `lib/home-content.ts`
merges the CMS document over the built-in translations, so an empty field falls
back to the shipped copy rather than rendering a gap. Preserve this when adding
fields — it is what makes the CMS safe for a non-technical owner.

**Readers accept both the old and the new shape.** `pickLocalized()` reads a
`localeString` object *and* a legacy `foo` / `fooEn` pair. Array-backed lists
(`steps`, `values`, `stats`, `gallery`) fall back to the old numbered fields when
the array is empty. This is what lets a schema change ship before its migration.

**Never rename or retype a field in place.** Add the new field, teach the reader
both shapes, migrate, and only then remove the old field — in a later commit.

**Images stay inline, never a named object type.** Photos in the dataset are
stored with `_type: 'image'`. Wrapping them in a named object type would change
`_type` and the Studio would show every existing photo as "Unknown type". That is
why `imageField()` and `imageMember()` return an inline
`{ type: 'image', fields: [...] }` — the extra fields simply start out empty.

**GROQ has no comment syntax.** `//` inside a query string is a parse error. Keep
notes above the template literal. (`safeFetch` logs failures, so this shows up
loudly in the build output rather than silently degrading.)

**Presentation belongs in components, not queries.** Queries return raw image
objects; components decide the size and shape and call `buildImage()`.

---

## 3. How images work

`lib/image.ts` is the only place that builds a Sanity image URL.

The important detail: **Sanity only applies the hotspot when the URL requests a
width *and* a height with `fit=crop`.** The previous code requested width alone
and let CSS `object-cover` crop from the centre, so dragging the hotspot in the
Studio did nothing at all. `buildImage()` always sends both when an aspect is
given, which is what makes the owner's focal point take effect.

It also adds `auto=format` (WebP/AVIF), `quality=80`, a `srcset` across six
breakpoints, and returns the asset's `lqip` for the blur-up.

To add an image slot:

1. Add the field with `imageField({...})` (fixed frame) or `sizedImageField({...})`
   (owner picks the shape).
2. Add it to the query — the projection must include
   `hotspot, crop, alt, caption, asset->metadata` . Use `IMAGE_PROJECTION`.
3. Resolve it with `buildImage(source, { width, aspect, fallbackAlt, locale })`.
4. Render with `<ImageSlot image={…} sizes="…" />`.

`sizes` should describe how wide the slot actually renders, or the browser will
download a larger file than it needs.

**Client components cannot call `buildImage()`** — it imports the Sanity client,
which must not reach the browser bundle. Resolve on the server and pass the
result down (see `Product.card` in `lib/sanity-data.ts`).

---

## 4. Ordering

Categories and products use `@sanity/orderable-document-list`, which stores a
lexicographic `orderRank` string. Queries sort by it:

```groq
*[_type == "product"] | order(orderRank asc, _createdAt desc) { … }
```

The `_createdAt` tiebreaker keeps ordering deterministic for documents that have
never been dragged. Categories additionally fall back to the legacy `order`
number, which is kept hidden so nothing was lost.

Everything else (menu links, steps, values, figures, gallery, panels) is an array
of embedded objects — GROQ preserves array order, so no sorting is needed. Each
item carries a `hidden` boolean that the resolvers filter out.

---

## 5. Migrations

`sanity/scripts/migrations/`, numbered and idempotent. Every one supports a dry
run and only writes with `--apply`.

| Script | What it does | Status |
|---|---|---|
| `fix-store-info-id.ts` | Moves the Site Settings document to `_id: 'storeInfo'` | **Must run first** · applied to production 2026-07-22 |
| `002-locale-and-lists.ts` | `foo`/`fooEn` → `{id, en}`; numbered fields → arrays | Applied 2026-07-22 |
| `003-order-rank.ts` | Seeds `orderRank` for categories and products | Applied 2026-07-22 |

**A note on the heritage figures.** The production `homePage` never held
`statSilverValue` / `statGenValue` / `statHandValue` — only the labels were in
Sanity, and the numbers (925, 3, 100%) came from the built-in copy. The first run
of 002 therefore skipped `stats` entirely, leaving the owner with no editable
list. 002 now seeds the numbers from `lib/translations` when the fields are
absent, and was re-run. If you write a similar migration, check that the source
fields actually exist in production rather than assuming the schema was filled in.

### Running them

```bash
# 0. The export command needs an interactive CLI login (the API token in
#    .env.local is NOT enough). Without this, step 1 fails with
#    "You must login first" — and it is easy to miss that line scrolling past.
npx sanity login

# 1. Back up first — this is the rollback plan.
npx sanity dataset export production backup-$(date +%Y%m%d).tar.gz

# 2. Dry run. Read the output.
npx tsx sanity/scripts/migrations/fix-store-info-id.ts

# 3. Apply.
npx tsx sanity/scripts/migrations/fix-store-info-id.ts --apply
```

Then 002, then 003, dry run before each.

### Why 001 comes first

The Site Settings document in production was created with an auto-generated id
(`cRCWWHCoYT1iLGWlkMau12`) while the Studio's menu opens the fixed id
`storeInfo`. The owner was editing an *empty second document* while the site read
the real one. Migration 002 also looks the document up by its canonical id, so it
finds nothing until 001 has run.

`getStoreInfo()` uses `coalesce(*[_id == "storeInfo"][0], *[_type == "storeInfo"][0])`,
so the site is correct both before and after.

### Verifying a migration

```bash
npx tsx sanity/scripts/migrations/<script>.ts     # re-run dry: should report "already migrated"
npm run build                                     # no "[sanity] query failed" lines
```

Then open the Studio and confirm no document shows "Unknown field" or an
incompatible-value warning, and walk both locales of every page.

**Rollback:** `npx sanity dataset import backup-<date>.tar.gz production --replace`.

---

## 6. Checks to run after any content-layer change

```bash
npx tsc --noEmit                 # types
npm run lint                     # 2 pre-existing warnings in Button.tsx are expected
npx sanity schema validate       # schema errors and warnings
npm run build                    # watch for "[sanity] query failed" — see below
```

`safeFetch` in `lib/sanity-data.ts` logs every failed query to the server console
before falling back. A broken query therefore shows up as repeated
`[sanity] query failed` lines during the build instead of silently serving
built-in defaults. Treat any such line as a build failure.

---

## 7. Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | client + server | Sanity project |
| `NEXT_PUBLIC_SANITY_DATASET` | client + server | Defaults to `production` |
| `SANITY_API_TOKEN` | **server only** | Read access for a private dataset; write access for migrations |
| `SANITY_REVALIDATE_SECRET` | server only | Shared secret for `POST /api/revalidate` |
| `NEXT_PUBLIC_SITE_URL` | optional | Pins the public base URL. Leave unset on Vercel — see below |
| `NEXT_PUBLIC_EXCHANGE_RATE_IDR_PER_USD` | client | USD display rate (default 16000) |

Midtrans and commerce variables are documented in `.env.example`.

### The public base URL

`lib/site-url.ts` resolves the canonical origin used by the sitemap, robots.txt
and every absolute URL in social share cards. It was previously hardcoded to
`https://kusumasilver.com` while the site actually ran at
`kusumasilver.vercel.app`, so the sitemap advertised URLs that did not resolve.

Resolution order:

1. `NEXT_PUBLIC_SITE_URL`, if set.
2. `VERCEL_PROJECT_PRODUCTION_URL`, which Vercel sets automatically and which
   **follows a custom domain once one is attached**.
3. `http://localhost:3000` for local development.

**Moving to kusumasilver.com therefore needs no code change** — attach the domain
in Vercel and the URLs follow. Only set `NEXT_PUBLIC_SITE_URL` if you need to
pin an origin that Vercel does not know about.

Deliberately *not* `VERCEL_URL`: that is a unique per-deployment hostname, and
using it would put throwaway preview URLs into the production sitemap.

Whatever the final origin is, it must also be a CORS origin on the Sanity
project for live preview to work there (§12).

The Sanity CLI reads these from `.env.local` via `sanity.cli.ts`. Without that
file the CLI reports the misleading error *"Invalid studio config format"* —
because `projectId` comes back undefined.

---

## 8. Running the Studio locally

```bash
npm run dev      # then open http://localhost:3000/studio
```

**First-time setup:** localhost must be allowed to talk to the Sanity project.
In [sanity.io/manage](https://sanity.io/manage) → your project → **API** → **CORS
origins**, add `http://localhost:3000` with credentials allowed. Without it the
Studio loads but shows *"Connect this studio to your project"*.

The Studio has its own layout at `app/studio/layout.tsx`. It exists because the
root layout is a passthrough that renders no `<html>`/`<body>` — those come from
`app/[locale]/layout.tsx`, which the Studio route never passes through. Without
it Next fails with *"Missing `<html>` and `<body>` tags in the root layout"*.

---

## 9. Deployment

Unchanged: push to the deployed branch and Vercel builds. Content changes do not
need a deploy — pages revalidate every 60 seconds, and the Sanity webhook calls
`POST /api/revalidate` (header `x-revalidate-secret`) on publish to make it
immediate.

A **schema** change does need a deploy, because the Studio is served from the
Next.js app at `/studio`.

---

## 10. Known limitations

- **Preview needs the site origin configured** in production — see §12. Without
  `SANITY_STUDIO_PREVIEW_ORIGIN` the preview pane falls back to the Studio's own
  origin, which is correct for the embedded Studio at `/studio` but not if the
  Studio is ever deployed separately.
- **Legacy fields are still present.** Migration 002 adds the new shapes but
  deliberately leaves `heroTitleEn`, `step1Title`, `value1Head`, `statSilver`
  and friends in the documents as a safety net. Remove them, and the matching
  fallbacks in `lib/home-content.ts`, once the new shape has been live a while.
- **Types are hand-written.** `types/index.ts` is maintained by hand. `sanity
  typegen generate` can derive them from the schema and queries, but that needs
  the GROQ strings wrapped in `defineQuery` first.
- **Product images have no per-image shape.** All product photos are square, by
  design — a per-piece aspect would break the alignment of the catalogue grid.
- **Order documents show customer PII** (name, phone, address) to anyone with
  Studio access. Fine for a single-owner shop; revisit if staff accounts are added.
- **`sizes` is still free text** on a product (`"6, 7, 8, 9"`), parsed by
  `parseSizes()`. A structured variant model was explicitly out of scope.

---

## 12. Live preview (Presentation)

The Studio's **Preview** tab shows the real site with unpublished content
applied, plus click-to-edit overlays.

| Piece | File |
|---|---|
| Draft-aware fetch + live updates | `lib/sanity.live.ts` (`defineLive`) |
| Turn draft mode on | `app/api/draft-mode/enable/route.ts` |
| Turn draft mode off | `app/api/draft-mode/disable/route.ts` |
| Overlays + live stream | `<VisualEditing />` and `<SanityLive />` in `app/[locale]/layout.tsx` |
| Studio tool + page mapping | `presentationTool({...})` in `sanity.config.ts` |

### The two fetch paths — the thing to understand before editing

`lib/sanity-data.ts` has **two** fetchers, and picking the wrong one breaks the
build:

- **`safeFetch`** → `sanityFetch`, draft-aware. **React Server Components only.**
  It reads the draft-mode cookie, so it needs a request scope.
- **`safeFetchStatic`** → the plain client, published only. For anything without
  a request: `generateStaticParams`, `app/sitemap.ts`, and API route handlers.

Get this wrong and you see one of:

- `draftMode was called outside a request scope` — a build-time caller used
  `safeFetch`. Move it to `safeFetchStatic` (this is why `getCategorySlugs` and
  `getStoreInfoStatic` exist alongside `getCategories` / `getStoreInfo`).
- `defineLive can only be used in React Server Components` — a **client**
  component imported something from `lib/sanity-data.ts`, dragging the
  server-only live client into the browser bundle. This is why
  `getWhatsAppLink` lives in `lib/whatsapp.ts`: two client-side forms use it.
  Never import from `lib/sanity-data.ts` in a `'use client'` file.

### Static generation is preserved

Adding preview did **not** make the site dynamic. Pages still prerender (`●` in
the build output) with `revalidate = 60`; Next serves them dynamically only for
requests carrying the draft-mode cookie. Check the build output stays `●` after
touching the data layer.

### Security properties, and how to re-verify them

- `/api/draft-mode/enable` returns **401** without Sanity's signed secret, so a
  visitor cannot switch themselves into draft mode:
  `curl -o /dev/null -w "%{http_code}" localhost:3000/api/draft-mode/enable`
- `/api/draft-mode/disable?redirect=…` only follows same-site paths; `//evil.com`
  and `https://evil.com` both fall back to `/`.
- **Stega must not leak.** Click-to-edit works by hiding invisible characters in
  strings. It is enabled only in draft mode — confirm published HTML is clean:
  ```bash
  curl -s localhost:3000/id | grep -c $'​'   # expect 0
  ```
- `browserToken` is only sent to the browser while draft mode is on. It reuses
  `SANITY_API_TOKEN`; if that token ever gains write scope, issue a separate
  read-only Viewer token for the browser.

### Environment

`SANITY_STUDIO_PREVIEW_ORIGIN` — the site's origin, e.g.
`https://kusumasilver.com`. Optional for the embedded Studio at `/studio`
(it defaults to the Studio's own origin, which is the same site). Set it if the
Studio is ever hosted separately from the website.

The site origin must also be a **CORS origin** on the Sanity project
(sanity.io/manage → API), with credentials allowed — including
`http://localhost:3000` for local work.

## 11. Suggested next steps

1. ~~Run the three migrations against production~~ — done 2026-07-22.
2. ~~Add the Presentation tool~~ — done 2026-07-23.
3. Fill in the new Site Settings fields — especially the **Google Maps link**,
   which is currently unset, so the contact page map never renders.
4. Add photo descriptions to the existing pieces; none currently have any.
5. Once settled, drop the legacy fields and their fallbacks.
6. Wrap queries in `defineQuery` and switch to generated types.
