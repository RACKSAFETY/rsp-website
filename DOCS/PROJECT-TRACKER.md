# RSP Website — Project Tracker

Loose ends and follow-ups. Updated 2026-06-30 (after the quote backend, /admin lead
inbox, and the wire-deck size configurator).

## Do Now (deploy correctness)

- [ ] Set **`NEXT_PUBLIC_SITE_URL`** in Vercel env vars to the real domain so canonical
      tags and `sitemap.xml` are correct (currently defaults to `racksafetyproducts.com`).
- [ ] Confirm the Vercel project **Framework Preset = Next.js** and the old **Output
      Directory = `dist`** override is cleared (`vercel.json` pins the framework; verify
      the dashboard doesn't override it).
- [ ] Decide the production domain plan: keep on `*.vercel.app` vs. point
      `racksafetyproducts.com` (or a staging subdomain) at Vercel via DNS.
- [ ] Delete the `ZZ-VERIFY-TEST` test lead from `quotes` if still present (Neon SQL:
      `DELETE FROM quotes WHERE company='ZZ-VERIFY-TEST';` — or use Delete at `/admin`).

## Quote backend — DONE this session ✅

- [x] `saveQuote()` persists to **Neon Postgres** (`quotes` table, auto-created).
      `DATABASE_URL` connected in Vercel; verified end-to-end in production.
- [x] Lead inbox at **`/admin`** (Basic Auth via `middleware.ts`; `ADMIN_USER` /
      `ADMIN_PASSWORD` set in Vercel): status pipeline (new → contacted → quoted →
      won/lost), clickable status-count filters, per-row delete.
- [ ] (Optional) turn on **email alerts**: set `RESEND_API_KEY`, `QUOTE_NOTIFY_EMAIL`,
      `QUOTE_FROM_EMAIL` in Vercel (code is already wired, currently inert).
- [ ] (Optional) CSV export / extra filters on `/admin`.

## Admin quoting — next phase (decided: content-first, no full DB migration)

- [ ] Build line-item quoting in the admin: a `parts` table (seeded from the catalog's
      `ProductPart` data) + a `quote_items` table + a quote-builder UI. Keep the product
      catalog in code/static — only the transactional layer goes in the DB.
- [ ] Prerequisite: real **part numbers + prices** per product/size (see Content).

## Content (placeholders to replace before launch)

- [ ] **~20 products still on placeholders** — DACS decking, Handle It protectors,
      DAMOTECH repair kits, Save-ty / WireCrafters / A-SAFE rails/cages/fences: need
      specs + photos from each manufacturer's site. (18 WWMH/RSP products were filled
      this session with real specs; 25 got real photos.)
- [ ] **Part numbers / pricing / lead times** are `TODO` across the catalog — business data.
- [ ] **Wire-deck sizes**: 9 industry-standard sizes (depths 36/42/48 × widths 46/52/58)
      are seeded with **typical** UDL capacities — verify real capacities and add per-size
      part #s + prices (`WIRE_DECK_PARTS` in `src/data/productCatalog.ts`).
- [ ] **Low-res product photos**: several WWMH shots are ~150–490px thumbnails — replace
      with higher-res versions for the product detail pages.
- [ ] Hero stats in `SITE.stats` (EST., SKUs, DCs SERVED, LEAD TIME) are `TODO`.
- [ ] **About page** narrative blocks (company history, team, by-the-numbers) are flagged
      `[PLACEHOLDER]` in `AboutScreen`.
- [ ] Home "Editor's Picks", Resources articles, and FAQ answers are invented placeholder copy.
- [ ] Verify business claims: 24-hour response, lifetime component warranty, business hours,
      year established.

## Lower Priority (tech debt / polish)

- [ ] Apply the `ProductPart` size configurator to other products (solid steel decking,
      pallet supports, etc.) once their sizes are known.
- [ ] Add a real 1200×630 OpenGraph image (currently falls back to the logo).
- [ ] Tighten TypeScript toward `strict` per-file over time.
- [ ] (Optional) Migrate Google Fonts from the CSS `@import` to `next/font`.
- [ ] (Optional) Convert `src/data/nfpa13FlueRules.js` to TypeScript.
