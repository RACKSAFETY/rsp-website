# Catalog Enrichment — 2026-07-01

Unattended research + enrichment pass on the RSP product catalog. All work is in the
working tree (build passes, **not committed** — commit when you're ready).

## What changed

### 1. Every remaining product page is now real (25 products)
All products that were `desc: 'TODO'` / `specs: [['TODO','TODO']]` now carry a
researched description + 4–5 technical spec rows + standard sizes, written in the
existing "industrial editorial" voice. Sourced from real manufacturer spec sheets.

| Group | Products | Source |
|---|---|---|
| Solid steel decking | Punched Decking, Solid Corrugated Decking | DACS 2023 catalog (Punch Deck / Solid Rack Deck) |
| Column & upright protectors | Upright, Universal, Steel Bolt-on, Corner Column, HDPE | Handle It (handleitinc.com) |
| Dividers | M-Divider, V-Divider, Single Arm Divider | Madix / SJF / Speedrack (real named styles) |
| Fall protection | Netting, Safety Straps, Mesh Backing | Adrian's Safety Solutions, RSP RackBack, WireCrafters |
| Repair kits | Damo Pro Single-Leg, Double-Leg, Slant | Damotech (damotech.com) |
| Warehouse protection | Guide Rail, Pedestrian Rail, Hand Rail, Forklift Wheel Stops, Building Column Protectors, Wire Storage Cages, Wire Security Cage, Wire Mesh Partitions, Industrial Safety Fence | Save-ty Yellow, A-SAFE, Column Sentry, WireCrafters/Husky |

### 2. All 6 services now have real descriptions
Tear Downs & Removal, Safety Audits, Buy & Sell Used, Installation, Repairs &
Remediation, Re-Engineering — grounded in what racksafetyproducts.com actually
offers (in-house structural engineer, 100+ installer network, RMI-certified kits,
RMI/ANSI MH16.1 + OSHA-aligned audits).

### 3. Filterable "Available Sizes" tables — the wire-deck treatment, generalized
`ProductPart` now supports **`height`** and **`length`** (previously only
depth/width/capacity). The size table + filter buttons on the product page render
**only the dimensions each product actually uses**, so height- and length-based
products get the same click-to-filter size table wire decks have. Fully backward-
compatible (wire decks unchanged).

Products that now show a size table:
- **New:** Upright Protector, Steel Bolt-on, Corner Column Protector (heights);
  Netting, Mesh Backing (width × height); Safety Straps (lengths)
- **Retrofitted existing:** Column Guards (12/18/24″), End of Aisle Protectors
  (42/48″), Repair Kit – S (24–84″)

Other sized products (bollards, guard rail, WorldRam, flue keeper, other repair
kits) keep their sizes in spec rows — say the word and I'll give them tables too.

### 4. Fixed a broken compliance filter (bonus)
The catalog's Compliance sidebar filter compared the button key (`'nfpa'`/`'osha'`/
`'ansi'`) against full labels like `'NFPA 13'`, so it matched **nothing**. Changed the
match to be case-insensitive substring — the filter now works. New products carry
`OSHA` (rails, fall protection), `NFPA 13` (punched deck), and `ANSI MH16.1` (Damo
kits) tags, so the filter is actually useful now.

### Files touched
- `src/data/productCatalog.ts` — 25 products + 6 services + 3 size-table retrofits
- `src/types.ts` — `ProductPart` gains `height?` / `length?`
- `src/screens/ProductScreen.tsx` — dynamic dimension table/filters
- `src/screens/CatalogScreen.tsx` — compliance filter match fix
- `~/.claude/settings.json` — allow-listed WebSearch/WebFetch (stops the approval prompts)

---

## Suggested additional products
Consolidated from the manufacturer research (deduped against what's already in the
catalog). Ranked roughly by fit + revenue pull for a pallet-rack safety company.

### New category worth adding — Signage & Compliance
On-brand because it ties directly to the Safety Audit service (RMI/ANSI requires
posted capacities) and is high-margin / repeat-purchase.
- **Rack Load Capacity Signs & Placards** — RMI/ANSI MH16.1 requires posted capacities; direct upsell from audits/remediation.
- **Aisle-End & Rack Location / Barcode Labels** — supports the 5S systems the audit already promotes.
- **Floor Tape & Aisle Marking Kits** — defines pedestrian/aisle zones; cheap, high-volume consumable.
- **Convex Safety Mirrors** — eliminate forklift blind spots at aisle intersections and dock corners.

### Fall Protection (extends existing line)
- **Self-Closing Pallet Rack Safety Gates** (pick-face) — protect pickers at open elevated rack faces.
- **Mezzanine Safety Gates** (pivot / vertical-lift) — guard elevated loading edges.
- **Bolt-Down Safety Swing Gate** — fill guardrail openings at stair tops / mezzanine access.

### Protection & Barriers (extends existing line)
- **Loading Dock Bumpers** — absorb trailer impact at the dock; extends impact protection into receiving.
- **Polymer Pedestrian Barrier** (A-SAFE iFlex) — memory-flex option for high-impact aisles where steel transfers damage to the floor.
- **Rack-End / Row-End Barrier** — dedicated end-of-aisle guard for the most-hit rack points.
- **Row Spacers** (back-to-back rack) — stabilize and keep rows uniform.

### Decking (add-ons to existing line)
- **Wire Deck Waterfall & Back-Stop Accessories** — prevent product roll-off; direct add-on to Pro Deck / wire decking.
- **Punch Deck Plus** — FM-approved flat cap over Punch Deck for point-load/wheeled items.

### Repair & Installation add-ons
- **Anchor, Shim & Floor-Fixing Kits** — consumables the install crews already use; easy stock item.
- **Seismic / Oversized Base Plates** — essential in CA seismic zones; aligns with the re-engineering service.
- **DAMO FLEX Modular Upright Repair Kit** — for taller/heavier uprights beyond Damo Pro's range.
- **Shallow-Profile Upright Protector** — tight-aisle option that sits between the standard and universal protectors.

### Storage / Enclosures (extends WireCrafters line)
- **Tenant Storage Lockers** — multi-tenant wire lockers (self-storage / apartment basements).
- **Server / Data-Center Colocation Cages** — premium spec of the security cage with lift-off ceiling.
- **Driver Access / Delivery Cages** — vestibule enclosure with pass-through window.

### New product line
- **Cantilever Rack** — long/bulky loads (pipe, lumber); broadens the used-rack buy/sell + installation business beyond selective pallet rack.

---

## Still open (business data + assets I can't source)
These are intentionally left as visible `TODO` — they need you, not the web:
- **SKUs / part numbers** — every product still `sku: 'TODO'` (varies by channel/mfg).
- **Pricing** — per-size `price` is unset; the quote-builder uses a placeholder $/unit.
- **Lead times** — every product `leadTime: 'TODO'`.
- **Hero stat tiles** (`SITE.stats`) — still TODO. Research surfaced usable claims to
  confirm: *"35+ years in the rack industry," "100+ cross-trained installers
  nationwide," in-house structural engineer, Flue Guard US Patents 9604783 / 9604784,*
  HQ Aliso Viejo CA. (Better as About-page copy than raw stat tiles — your call.)
- **Product photos** — DONE (2026-07-01): all 24 remaining products now carry real
  partner photos in `public/assets/products/photos/` (see "Product photos" below).

## Product photos (added 2026-07-01)
All 24 previously-placeholder products now show a real product photo, pulled from the
manufacturer/partner pages (source URL logged per image during download). Build verifies
**53/53 catalog images resolve, 0 missing**. `guide-rail` was recompressed from a 2 MB PNG
to a 93 KB WebP. Rights: confirm per-partner use is covered (you indicated it is).

A few worth swapping for better/official assets when you have them:
- **wire-mesh-partitions** — only a 580×300 image was published (lower-res than the rest).
- **building-column-protectors** — 235×300 (SentryPro gallery); small.
- **forklift-wheel-stops** — photo is a Handle It steel wheel stop; `mfg` is set to
  "Handle It, A-SAFE" to match (RSP sells Handle It). Swap in an A-SAFE polymer shot if
  you'd rather feature that option.
- **guide-rail** / **v-divider** — sourced from a reputable distributor (rackandshelf.com),
  not the exact partner, because the partner pages served only JS placeholders.

## Confidence notes (verify before print)
Most specs are high-confidence (pulled from mfg spec sheets). Lower-confidence items:
- **Forklift Wheel Stops** — 42″ length is category-typical; A-SAFE markets low-level
  polymer ground barriers rather than a labeled "wheel stop," so the polymer option is
  framed as an equivalent, not an exact SKU.
- **Damo Pro Slant** — confirmed as a Damo Pro configuration but has no dedicated spec
  sheet; inherits the shared Damo Pro specs. Column widths (3″/4″) are category-standard
  (Damotech kits are made-to-measure, not fixed SKUs).
- **Dividers (M / V / Single-Arm)** — real named styles; profiles/mounting sourced, but
  sizing is custom (no fixed size grid), so specs describe function not dimensions.
