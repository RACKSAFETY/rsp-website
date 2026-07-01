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
- [ ] **Privacy Policy + Terms pages** — footer links currently go nowhere.
- [ ] Verify/remove unverified trust claims (24-hour response, lifetime warranty, business
      hours, year established) before they're load-bearing.

## Content (business data to fill)
- [ ] **Part numbers / prices / lead times** — `sku` + `leadTime` are `TODO` across the
      catalog; per-size prices unset. (Blocks the admin line-item quoting phase.)
- [ ] **Hero stats** — `SITE.stats` currently shows site-sourced claims (35+ yrs, 100+
      installers, nationwide, in-house engineering); confirm or replace.
- [ ] **About page** narrative (history, team, by-the-numbers) still `[PLACEHOLDER]`.
- [ ] **Resources / blog + FAQ** are invented placeholder copy — replace with real content
      (then add FAQPage schema; don't mark up invented answers).
- [ ] **Upgrade 4 low-res photos** — wire-mesh-partitions (580×300), building-column-
      protectors (235×300), forklift-wheel-stops (a Handle It shot, not A-SAFE), and
      guide-rail / v-divider (distributor, not exact partner). See the SEO / enrichment docs.
- [ ] Wire-deck per-size UDL capacities are *typical* — verify real ratings + add part #s
      (`WIRE_DECK_PARTS` in `src/data/productCatalog.ts`).

## Admin quoting — next phase (content-first; no full DB migration)
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
