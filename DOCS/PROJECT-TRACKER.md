# RSP Website — Project Tracker

Loose ends and follow-ups. Updated **2026-07-01** (catalog enrichment + partner photos,
mobile-responsive pass, SEO / structured-data pass, and category landing pages).

## Done this session (2026-07-01) ✅
- **Catalog fully enriched** — every remaining product + all 6 services got real,
  researched copy, specs, standard sizes, and compliance tags; all 24 placeholder
  products got real partner photos. Customer-facing "TODO" text scrubbed from every page.
- **Fully mobile-responsive** — hamburger nav, single-column stacking, trimmed padding,
  collapsible catalog filters. Verified with `npm run mobile-check` (Playwright).
- **SEO / structured data** — JSON-LD (Organization + WebSite sitewide, Product +
  BreadcrumbList per product, CollectionPage + ItemList per category); homepage SSR
  restored (was client-rendered); keyword-rich titles; robots disallows `/admin` + `/api`.
- **7 category landing pages** at `/catalog/<slug>` (`CATEGORY_META`) with internal
  linking (nav, footer, "Shop by Category" band, product breadcrumbs) + sitemap entries.
- Homepage Featured Solutions now uses the real Flue Guard photo (was a `.svg` placeholder).
- Details: `DOCS/CATALOG-ENRICHMENT-2026-07-01.md`, `DOCS/SEO-2026-07-01.md`.

## Do Now (deploy correctness)
- [ ] Set **`NEXT_PUBLIC_SITE_URL`** in Vercel to the real origin — canonical tags,
      `sitemap.xml`, and all JSON-LD use it (defaults to `https://www.racksafetyproducts.com`).
- [ ] Confirm Vercel **Framework Preset = Next.js** and the old `dist` Output Directory
      override is cleared (`vercel.json` pins it; verify the dashboard doesn't override).
- [ ] Decide the production-domain plan (stay on `*.vercel.app` vs. point the domain /
      a staging subdomain at Vercel).
- [ ] Delete the `ZZ-VERIFY-TEST` test lead from `quotes` if still present.

## Before launch — site replacement / SEO migration
*(This build is intended to REPLACE racksafetyproducts.com.)*
- [ ] **301 redirects: old URLs → new** (`/products/<id>`, `/catalog/<slug>`, …). The old
      site uses different paths; without redirects, existing rankings drop. Crawl the old
      site to build the map (`next.config.mjs` `redirects()` or `vercel.json`).
- [ ] Verify the production domain in **Google Search Console**, submit `/sitemap.xml`,
      watch Coverage + Core Web Vitals after cutover, and validate schema in the Rich
      Results Test.
- [ ] **Core Web Vitals** — move Google Fonts from the CSS `@import` (render-blocking) to
      `next/font`; adopt `next/image` (or lazy-load + compress) for the ~50 `<img>` tags.
- [x] **Privacy Policy + Terms pages** — DONE (2026-07-01). Live at `/privacy` and `/terms`
      (server-rendered static; `PrivacyScreen`/`TermsScreen` share a `LegalDoc` layout).
      Footer "Privacy Policy" / "Terms of Service" links now resolve (were dead `<span>`s);
      "Compliance Standards" now points to `/resources`. Added `privacy`/`terms` to `NavTarget`
      + navMap, and both to the sitemap. Content is grounded in real site behavior (quote form
      → Neon/Vercel, CCPA section since RSP is CA-based, and a Terms disclaimer that the flue
      calculator / safety guides are informational, not certified engineering advice).
      ⚠️ These are accurate starting drafts, NOT attorney-reviewed — have counsel review before
      relying on them, and update the Privacy Policy if analytics/cookies/ad pixels or real
      newsletter processing are ever added (the footer newsletter + search inputs are currently
      inert, so the policy does not claim them).
- [ ] Verify/remove unverified trust claims (24-hour response, lifetime warranty, business
      hours, year established) before they're load-bearing.

## Content (business data to fill)
- [ ] **Part numbers / prices / lead times** — `sku` + `leadTime` are `TODO` across the
      catalog; per-size prices unset. (Blocks the admin line-item quoting phase.)
- [ ] **Hero stats** — `SITE.stats` currently shows site-sourced claims (35+ yrs, 100+
      installers, nationwide, in-house engineering); confirm or replace.
- [ ] **About page** narrative (history, team, by-the-numbers) still `[PLACEHOLDER]`.
- [x] **Resources / blog + FAQ** — DONE (2026-07-01). Fake dated "articles" → an evergreen
      **Guides & Standards** hub (NFPA 13 flue space, inspection cadence, repair-vs-replace,
      OSHA/ANSI) linking to real pages (calculator, category pages, audit request). FAQ rewritten
      to 6 factual Q&As (`src/data/faqs.ts`, shared source of truth) + **FAQPage JSON-LD**
      (`faqJsonLd` in seo.ts, emitted in `app/resources/page.tsx`). Also cleaned up on that
      screen: dead "download" links → "What an Audit Covers" list; deduped the two fire-marshal
      referral blocks → one; fixed off-brand "industrial financial literacy / forum" copy.
      **User decisions baked in — do NOT reintroduce:** no lifetime-warranty claim (dropped),
      no response-time SLA (just "contact us"), shipping worded "nationwide, contiguous US;
      contact us for AK/HI/intl." Verified in the prerendered HTML (schema present, 6 questions,
      0 fabricated claims). If real warranty terms / an SLA are ever confirmed, add them back
      to `faqs.ts` (visible copy + schema stay in sync automatically).
- [ ] **Upgrade 4 low-res photos** — wire-mesh-partitions (580×300), building-column-
      protectors (235×300), forklift-wheel-stops (a Handle It shot, not A-SAFE), and
      guide-rail / v-divider (distributor, not exact partner). See the SEO / enrichment docs.
- [ ] Wire-deck per-size UDL capacities are *typical* — verify real ratings + add part #s
      (`WIRE_DECK_PARTS` in `src/data/productCatalog.ts`).

## Admin quoting — next phase (content-first; no full DB migration)
- [x] **Custom Spec Builder on product pages** — DONE (2026-07-01). Replaced the product-page
      "quote builder" (a quantity slider that showed a **fabricated $47/unit** subtotal) with a
      `CustomSpecBuilder` in `src/screens/ProductScreen.tsx` that captures made-to-order specs:
      custom dimensions (auto-detected from the product's own `activeDims`; freeform for
      products without parts), quantity, material/gauge/finish, target load rating (hidden when
      capacity is already a dimension axis), and mounting/compatibility. On submit it assembles
      a summary and hands off to the contact form via the sessionStorage handoff (same mechanism
      as the flue calculator) → prefills the notes → `/api/quote` → Neon → `/admin`. Tagged
      `requestType = custom-req:<json>`. A secondary "request a standard quote" link (`spec-<name>`)
      still serves as-is buyers. Handoff plumbing generalized: `FLUE_CALC_KEY` → `HANDOFF_KEY`,
      shared `HANDOFF_PREFIXES`/`isHandoffPayload` in navMap. (This removes the last fabricated
      price from the site.)
- [ ] Line-item quoting in `/admin`: a `parts` table (seeded from `ProductPart`) +
      `quote_items` + a quote-builder UI. Catalog stays in code; only the transactional
      layer goes in the DB. Prerequisite: real part numbers + prices (Content, above).
- [ ] (Optional) email alerts: set `RESEND_API_KEY` / `QUOTE_NOTIFY_EMAIL` /
      `QUOTE_FROM_EMAIL` in Vercel (wired, currently inert). CSV export on `/admin`.

## Lower priority (polish / tech debt)
- [ ] Category pages: only 2 (Flue, Protection) are in the top nav — consider a catalog
      dropdown or more nav links; add per-category OpenGraph images.
- [ ] Real 1200×630 OpenGraph image (currently falls back to the logo).
- [ ] Apply the `ProductPart` size configurator to more products as sizes are confirmed.
- [ ] Tighten TypeScript toward `strict` per file; (optional) convert
      `src/data/nfpa13FlueRules.js` to TypeScript.
