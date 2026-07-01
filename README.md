# Rack Safety Products — Website

Marketing + product-catalog website for Rack Safety Products, built with
**Next.js (App Router)** and **TypeScript**, deployed on **Vercel**. SEO-first
(per-page metadata, canonical, sitemap, JSON-LD structured data, and category
landing pages) and fully mobile-responsive, with a small quote-inquiry backend.

## Requirements

- Node.js 18.18+ (works on 20/22/24)
- npm

## Commands

```bash
npm install      # install dependencies
npm run dev      # dev server → http://localhost:3000
npm run build    # production build (Next.js)
npm run start    # serve the production build locally
npm test         # run the NFPA flue-rules unit tests (Vitest)
npm run mobile-check   # Playwright mobile QA — run `npm run build && npm run start` first
```

## Project structure

```
app/                     # Next.js App Router — one folder per route
  layout.tsx             #   root layout: <html>/<body>, global CSS, TopNav + Footer
  page.tsx               #   "/"  (home)
  catalog/ services/ …   #   static routes
  products/[id]/         #   dynamic product pages (pre-rendered via generateStaticParams)
  catalog/[category]/    #   SEO category landing pages (pre-rendered; driven by CATEGORY_META)
  api/quote/route.ts     #   POST endpoint for the quote form
  admin/                 #   protected lead inbox (status pipeline, filters, delete)
  sitemap.ts robots.ts   #   generated SEO files
middleware.ts            # HTTP Basic Auth gate protecting /admin (deny-by-default)
src/
  components.tsx         # shared UI (TopNav, Footer, Btn, Icon, …) — 'use client'
  screens/               # page bodies (client components) reused by app/ routes
  components/Compliance…  # flue compliance calculator
  data/                  # productCatalog.ts (typed) + nfpa13FlueRules.js (engine + tests)
  hooks/useNav.ts        # navigation shim: onNav(target, payload) → next/navigation router
  lib/navMap.ts          # target → URL mapping (shared by useNav + nav links)
  lib/seo.ts             # JSON-LD builders (Organization/WebSite/Product/Breadcrumb/CollectionPage)
  lib/quotes.ts          # saveQuote/listQuotes/updateQuoteStatus/deleteQuote — Neon persistence + email
  lib/quoteStatus.ts     # lead pipeline statuses + colors (shared client/server)
  types.ts               # shared types (Product, ProductPart, NavTarget, QuoteRequest, …)
  styles/rsp.css         # design tokens + base styles (imported in app/layout.tsx)
public/assets/           # images, logos, product photos (served at /assets/...)
scripts/mobile-check.cjs # Playwright mobile-responsive check (overflow + hamburger)
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Absolute site origin used for canonical tags + sitemap. Set in Vercel to the real domain (defaults to `https://www.racksafetyproducts.com`). |
| `DATABASE_URL` (or `POSTGRES_URL`) | Neon Postgres connection (injected by the Vercel Neon integration). Quote submissions persist here; if unset, `saveQuote` falls back to logging. |
| `ADMIN_USER` / `ADMIN_PASSWORD` | Basic Auth credentials for `/admin`. If unset, `/admin` is locked (503) so leads are never exposed. |
| `RESEND_API_KEY` / `QUOTE_NOTIFY_EMAIL` / `QUOTE_FROM_EMAIL` | *(optional)* email a notification per new quote via Resend. |

## Deployment (Vercel)

The repo is connected to Vercel. `vercel.json` pins the framework to `nextjs`
(the project was originally a Vite app whose `dist` output directory caused build
failures). Pushes to `main` auto-deploy. Set `NEXT_PUBLIC_SITE_URL` in the project's
environment variables.

## Quote backend

The contact form POSTs to `/api/quote`, which validates the payload and calls
`saveQuote()` in `src/lib/quotes.ts`. Submissions persist to **Neon Postgres** (the
`quotes` table, auto-created on first write) and optionally email a notification via
Resend — both gated on env vars, so with nothing configured `saveQuote` falls back to
logging. Leads are managed at **`/admin`** (Basic Auth via `middleware.ts`): a status
pipeline (new → contacted → quoted → won/lost), clickable status-count filters, and
per-row delete. All persistence/notification lives in `saveQuote`, so the API route
and form don't change when you extend or swap the destination (e.g. add a CRM push).

## Notes

- TypeScript is intentionally **non-strict** (`tsconfig.json`) to keep the migration
  low-churn; tighten per-file over time. The well-tested NFPA engine
  (`src/data/nfpa13FlueRules.js`) is kept as JavaScript via `allowJs`.
- Vitest runs via `vite.config.js`; it is independent of the Next.js build.
- **Responsive:** desktop-first inline styles; the mobile layer lives in `src/styles/rsp.css`
  as `!important` utility classes (`rsp-stack`, `rsp-px`, `rsp-col`, …) gated behind
  `@media (max-width:768/820px)` and applied via `className`. Verify with `npm run mobile-check`.
- **Gotcha:** this repo sits in a OneDrive-synced folder, which occasionally corrupts Next's
  `.next` cache (`Cannot find module './NNN.js'` at runtime). `rm -rf .next` and rebuild if so.
