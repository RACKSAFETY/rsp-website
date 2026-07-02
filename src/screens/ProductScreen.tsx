'use client';
import React, { useState } from 'react';
import {
  Btn, Mega, DataLabel, Pill, CautionStripe, Icon, hwStyle, SectionHeader,
} from '../components';
import { PRODUCT_CATALOG, CATEGORY_META } from '../data/productCatalog';
import { useNav } from '../hooks/useNav';
import type { Product, NavTarget } from '../types';

// Rich per-product detail. Only products with a key here get a hand-built detail
// page; every other product in PRODUCT_CATALOG falls back to a default built from
// its own catalog `specs`/`desc` (see `detailData` below) — so scaffolded products
// still render, just with TODO specs until detail is authored here.
//
// `flue-guard` content is pulled from the live product page:
//   racksafetyproducts.com/benefits-of-pallet-rack-flue-spaces/flue-guard/
// Add real DETAIL_DATA entries for the rest of the catalog the same way.
const DETAIL_DATA = {
  'flue-guard': {
    hero: 'Our patented solution is the strongest and most cost-effective pallet rack flue space divider available on the market — maintaining consistent flue spacing, preventing pallet push-through, and keeping flue spaces open so sprinklers activate faster.',
    variants: ['12″ (6″ Flue)', '18″ (12″ Flue)', '24″ (18″ Flue)'],
    benefits: [
      {
        title: 'Improved Fire Protection',
        desc: 'Flue space dividers let heat escape to sprinklers for quicker activation and let water reach lower inventory levels. Fire spreads vertically through the flue space instead of horizontally to other racks and product.',
      },
      {
        title: 'Optimal Pallet Placement',
        desc: 'Maintains even offsets and centers loads on beams. Prevents pallet push-through and reduces the risk of injury or death from falling objects.',
      },
      {
        title: 'Minimizes Product Damage',
        desc: 'Flue Guard only has contact with the pallet — not the stored products — significantly minimizing damage.',
      },
      {
        title: 'Easy Installation & Compatibility',
        desc: 'Installs on new or retrofitted pallet rack systems, attaching with included high-strength tek screws for a quick, seamless install. Compatible with wire decking up to 2-gauge wire diameter.',
      },
      {
        title: 'Patented, Strong & Cost-Effective',
        desc: 'A patented design that is the strongest and most cost-effective pallet rack flue space divider on the market — an essential addition to any warehouse rack system.',
      },
    ],
    specs: [
      ['Available Sizes', '12″, 18″, 24″'],
      ['Flue Space', '6″, 12″, 18″ respectively'],
      ['Wire Decking Compatibility', 'Up to 2-gauge wire diameter'],
      ['Installation', 'High-strength tek screws (included)'],
      ['Application', 'New or retrofitted pallet rack'],
      ['Product Contact', 'Pallet only — minimizes damage to stored goods'],
    ],
    certs: [], // TODO-VERIFY: live product page cites no specific NFPA/OSHA/ANSI standard
    includes: ['Flue Guard™ divider', 'High-strength tek screws (for install)'],
    // Downloadable documents from the live Flue Guard™ product page.
    docs: [
      { label: 'Brochure', url: 'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:b8fa4fa9-c332-42e8-9393-732951a06a78' },
      { label: 'Spec Sheet', url: 'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:b2d81ee7-1871-4dec-b3fa-aa27fd3a3e65' },
    ],
    // Flue Guard™ vs Competition table hidden until real comparison values are confirmed.
    comparison: null,
  },
};

// Every size dimension a ProductPart can carry. The "Available Sizes" table + filter
// buttons render only the dimensions a given product's parts actually use — so height-
// based products (column guards, repair kits) and length-based ones (rails, end-of-aisle,
// straps) get the same filterable treatment as wire-deck depth × width × capacity.
type DimKey = 'depth' | 'width' | 'height' | 'length' | 'capacity';
const DIMENSIONS: { key: DimKey; label: string; head: string; btn: (v: number) => string; cell: (v: number) => string }[] = [
  { key: 'depth',    label: 'Depth',    head: 'Depth',          btn: (v) => `${v}″ D`, cell: (v) => `${v}″` },
  { key: 'width',    label: 'Width',    head: 'Width',          btn: (v) => `${v}″ W`, cell: (v) => `${v}″` },
  { key: 'height',   label: 'Height',   head: 'Height',         btn: (v) => `${v}″ H`, cell: (v) => `${v}″` },
  { key: 'length',   label: 'Length',   head: 'Length',         btn: (v) => `${v}″ L`, cell: (v) => `${v}″` },
  { key: 'capacity', label: 'Capacity', head: 'Capacity (UDL)', btn: (v) => `${v.toLocaleString()} lb`, cell: (v) => `${v.toLocaleString()} lb` },
];

export default function ProductScreen({ productId }: { productId: string }) {
  const onNav = useNav();
  const p = PRODUCT_CATALOG.find((x) => x.id === productId) || PRODUCT_CATALOG[0];
  const [variant, setVariant] = useState(0);
  const [filters, setFilters] = useState<Record<DimKey, number | null>>({
    depth: null, width: null, height: null, length: null, capacity: null,
  });

  const detailData = DETAIL_DATA[p.id] || {
    // Fallback for scaffolded products — no invented certs (TODO until authored).
    hero: p.desc, variants: ['Standard'], specs: p.specs, certs: [], includes: [],
  };

  // Size/part variants with click-to-filter on any dimension the parts actually use.
  const parts = p.parts ?? [];
  const hasParts = parts.length > 0;
  const uniq = (key: DimKey) =>
    [...new Set(parts.map((x) => x[key]).filter((v): v is number => typeof v === 'number'))].sort((a, b) => a - b);
  // Only the dimensions that vary across this product's parts get a filter + table column.
  const activeDims = DIMENSIONS.filter((d) => uniq(d.key).length > 0);
  const filteredParts = parts.filter((x) =>
    activeDims.every((d) => filters[d.key] == null || x[d.key] === filters[d.key]),
  );
  const hasActiveFilter = activeDims.some((d) => filters[d.key] != null);

  // SKUs and lead times aren't entered yet ('TODO' in the catalog) — never show that
  // literal to customers; hide the label or fall back to neutral copy instead.
  const skuLabel = p.sku && p.sku !== 'TODO' ? p.sku : null;
  const leadLabel = p.leadTime && p.leadTime !== 'TODO' ? p.leadTime : 'By quote';
  const hasSku = parts.some((x) => x.sku && x.sku !== 'TODO');

  const related = PRODUCT_CATALOG.filter((x) => x.id !== p.id).slice(0, 3);

  return (
    <div className="rsp-fade-up">
      <div className="rsp-px" style={{ background: '#F9F9F9', padding: '24px 32px 16px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#807662' }}>
            <a onClick={() => onNav('home')} style={{ cursor: 'pointer', color: '#807662', textDecoration: 'none' }}>HOME</a>
            <span>/</span>
            <a onClick={() => onNav('catalog')} style={{ cursor: 'pointer', color: '#807662', textDecoration: 'none' }}>CATALOG</a>
            <span>/</span>
            <a onClick={() => onNav('category', CATEGORY_META[p.cat]?.slug)} style={{ cursor: 'pointer', color: '#D9530F', textDecoration: 'none' }}>{p.catLabel.toUpperCase()}</a>
            {skuLabel && (
              <>
                <span>/</span>
                <span style={{ color: '#1A1A1A' }}>{skuLabel}</span>
              </>
            )}
          </div>
          <button onClick={() => onNav('catalog')} style={{ background: 'transparent', border: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1A1A1A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            ← Back to catalog
          </button>
        </div>
      </div>

      <section className="rsp-px" style={{ padding: '24px 32px 96px', background: '#F9F9F9' }}>
        <div className="rsp-stack" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56 }}>
          {/* LEFT — Image + thumbnails */}
          <div>
            <div style={{ position: 'relative', border: '2px solid #1A1A1A', background: '#FFFFFF', aspectRatio: '1', overflow: 'hidden' }}>
              <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: /\.(jpe?g|png|webp)$/i.test(p.img) ? 'cover' : 'contain', padding: /\.(jpe?g|png|webp)$/i.test(p.img) ? 0 : 48 }} />
              <div style={{ position: 'absolute', top: 16, left: 16 }}>
                <Pill kind="yellow">{p.tag ? p.tag[1] : 'STANDARD'}</Pill>
              </div>
              {skuLabel && (
                <div style={{ position: 'absolute', bottom: 16, right: 16, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#807662' }}>
                  FIG. {skuLabel}
                </div>
              )}
              <CautionStripe height={6} period={28} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
            </div>

            <div className="rsp-stack-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 16 }}>
              {[p.img, '/assets/imagery/warehouse-hero.svg', '/assets/imagery/inspection-editorial.svg', p.img].map((src, i) => (
                <div key={i} style={{ border: '2px solid #1A1A1A', aspectRatio: '1', overflow: 'hidden', background: '#FFFFFF', cursor: 'pointer', opacity: i === 0 ? 1 : 0.55, transition: 'opacity 200ms' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = i === 0 ? '1' : '0.55')}
                >
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.4)' }} />
                </div>
              ))}
            </div>

            {detailData.includes.length > 0 && (
              <div style={{ marginTop: 32, border: '2px solid #1A1A1A', padding: 24, background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #DDDDDD', paddingBottom: 10, marginBottom: 14 }}>
                  <DataLabel color="#D9530F">WHAT'S IN THE BOX</DataLabel>
                  <Icon name="inventory_2" size={20} style={{ color: '#D9530F' }} />
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {detailData.includes.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: "'Inter',sans-serif", fontSize: 14 }}>
                      <Icon name="check" size={16} style={{ color: '#2ECC71' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* RIGHT — Details + quote builder */}
          <div>
            <DataLabel color="#D9530F" style={{ display: 'block', marginBottom: 12 }}>{p.catLabel.toUpperCase()}{p.mfg ? ` · MFG ${p.mfg.toUpperCase()}` : ' · SAFETY PICK'}</DataLabel>
            <h1 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 'clamp(34px, 6vw, 80px)', lineHeight: 0.88, textTransform: 'uppercase', margin: '0 0 16px', ...hwStyle({ fill: '#1A1A1A', shadow: '#F5C344' }) }}>
              {p.name}
            </h1>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, lineHeight: 1.55, color: '#1A1A1A', margin: '0 0 24px', borderLeft: '3px solid #D9530F', paddingLeft: 14, maxWidth: 540 }}>
              {detailData.hero}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
              {detailData.certs.map((c) => (
                <Pill key={c} kind="green" style={{ fontSize: 11, padding: '6px 12px' }}>
                  <Icon name="verified" size={14} fill={1} />
                  {c}
                </Pill>
              ))}
            </div>

            {hasParts ? (
              <div style={{ marginBottom: 24 }}>
                <DataLabel style={{ display: 'block', marginBottom: 10 }}>Filter Sizes</DataLabel>
                {activeDims.map((g) => (
                  <div key={g.key} style={{ marginBottom: 10 }}>
                    <DataLabel color="#807662" size={10} style={{ display: 'block', marginBottom: 6 }}>{g.label}</DataLabel>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {uniq(g.key).map((v) => {
                        const isOn = filters[g.key] === v;
                        return (
                          <button
                            key={v}
                            onClick={() => setFilters((f) => ({ ...f, [g.key]: isOn ? null : v }))}
                            style={{
                              padding: '8px 14px',
                              background: isOn ? '#1A1A1A' : '#FFFFFF',
                              color: isOn ? '#F5C344' : '#1A1A1A',
                              border: '2px solid #1A1A1A', borderRadius: 0, cursor: 'pointer',
                              fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700,
                              letterSpacing: '0.08em',
                            }}
                          >
                            {g.btn(v)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ marginBottom: 24 }}>
                <DataLabel style={{ display: 'block', marginBottom: 8 }}>SELECT VARIANT</DataLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {detailData.variants.map((v, i) => (
                    <button
                      key={v}
                      onClick={() => setVariant(i)}
                      style={{
                        padding: '10px 16px',
                        background: variant === i ? '#1A1A1A' : '#FFFFFF',
                        color: variant === i ? '#F5C344' : '#1A1A1A',
                        border: '2px solid #1A1A1A', borderRadius: 0, cursor: 'pointer',
                        fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        transition: 'background 200ms, color 200ms',
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <CustomSpecBuilder p={p} activeDims={activeDims} leadLabel={leadLabel} onNav={onNav} />

            {detailData.docs && detailData.docs.length > 0 && (
              <div style={{ marginTop: 32, border: '2px solid #1A1A1A', padding: 24, background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #DDDDDD', paddingBottom: 10, marginBottom: 14 }}>
                  <DataLabel color="#D9530F">DOCUMENTS</DataLabel>
                  <Icon name="description" size={20} style={{ color: '#D9530F' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {detailData.docs.map((doc) => (
                    <a
                      key={doc.label}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                        padding: '12px 14px', border: '2px solid #1A1A1A', background: '#F3F3F3',
                        color: '#1A1A1A', textDecoration: 'none',
                        fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 700,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        transition: 'background 200ms, color 200ms',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#1A1A1A'; e.currentTarget.style.color = '#F5C344'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#F3F3F3'; e.currentTarget.style.color = '#1A1A1A'; }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Icon name="download" size={18} />
                        {doc.label}
                      </span>
                      <span>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Benefits — only rendered for products with a benefits list */}
        {detailData.benefits && detailData.benefits.length > 0 && (
          <div style={{ maxWidth: 1280, margin: '96px auto 0' }}>
            <SectionHeader title="Key Benefits" eyebrow="WHY IT MATTERS" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 0, border: '2px solid #1A1A1A' }}>
              {detailData.benefits.map((b, i) => (
                <div key={b.title} style={{
                  padding: 28,
                  borderRight: '1px solid #1A1A1A',
                  borderBottom: '1px solid #1A1A1A',
                  background: i % 2 === 0 ? '#FFFFFF' : '#F9F9F9',
                  display: 'flex', flexDirection: 'column', gap: 12,
                  minHeight: 220,
                }}>
                  <DataLabel color="#D9530F" size={11}>{String(i + 1).padStart(2, '0')}</DataLabel>
                  <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 26, lineHeight: 0.95, textTransform: 'uppercase', margin: 0 }}>{b.title}</h3>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.6, color: '#4E4635', margin: 0 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spec Table */}
        <div style={{ maxWidth: 1280, margin: '96px auto 0' }}>
          <SectionHeader title="Technical Specifications" eyebrow={skuLabel ? `SKU ${skuLabel}` : p.catLabel.toUpperCase()} />
          <div className="rsp-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '2px solid #1A1A1A', background: '#FFFFFF' }}>
            {detailData.specs.map(([k, v], i) => (
              <div key={k} style={{
                display: 'grid', gridTemplateColumns: '1fr 1.4fr',
                borderBottom: i < detailData.specs.length - 2 ? '1px solid #DDDDDD' : 0,
                borderRight: i % 2 === 0 ? '1px solid #DDDDDD' : 0,
              }}>
                <div style={{ padding: '14px 20px', background: '#F3F3F3' }}>
                  <DataLabel color="#807662" size={11}>{k}</DataLabel>
                </div>
                <div style={{ padding: '14px 20px', fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available sizes / parts — only for products that carry a parts list */}
        {hasParts && (
          <div style={{ maxWidth: 1280, margin: '48px auto 0' }}>
            <SectionHeader
              title="Available Sizes & Parts"
              eyebrow={`SHOWING ${filteredParts.length} OF ${parts.length}`}
              right={
                hasActiveFilter ? (
                  <button
                    onClick={() => setFilters({ depth: null, width: null, height: null, length: null, capacity: null })}
                    style={{
                      background: 'transparent', border: 0, cursor: 'pointer',
                      fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.16em', textTransform: 'uppercase', color: '#BD480C',
                    }}
                  >
                    × Clear filters
                  </button>
                ) : undefined
              }
            />
            <div style={{ overflow: 'auto', border: '2px solid #1A1A1A' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#FFFFFF', minWidth: 560 }}>
                <thead>
                  <tr>
                    {[...(hasSku ? ['Part #'] : []), ...activeDims.map((d) => d.head), 'Price'].map((h) => (
                      <th key={h} style={{ background: '#1A1A1A', color: '#F5C344', textAlign: 'left', padding: '12px 16px', fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredParts.map((part, i) => (
                    <tr key={activeDims.map((d) => part[d.key]).join('x') || i} style={{ background: i % 2 ? '#F3F3F3' : '#FFFFFF', borderTop: '1px solid #DDDDDD' }}>
                      {hasSku && <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: part.sku ? '#1A1A1A' : '#807662' }}>{part.sku ?? '—'}</td>}
                      {activeDims.map((d) => (
                        <td key={d.key} style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{typeof part[d.key] === 'number' ? d.cell(part[d.key] as number) : '—'}</td>
                      ))}
                      <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: '#807662' }}>{part.price ? `$${part.price.toLocaleString()}` : 'Quote'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#807662', marginTop: 10 }}>
              Sizes shown are industry-standard; capacities are typical UDL figures. Exact ratings, part numbers, and pricing are confirmed with your engineered quote.
            </p>
          </div>
        )}

        {/* Flue Guard vs Competition — only rendered for products with a comparison table */}
        {detailData.comparison && (
          <div style={{ maxWidth: 1280, margin: '96px auto 0' }}>
            <SectionHeader title={`${p.name} vs Competition`} eyebrow="HEAD-TO-HEAD" />
            <div style={{ overflow: 'auto', border: '2px solid #1A1A1A' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#FFFFFF', minWidth: 600 }}>
                <thead>
                  <tr>
                    {['Criterion', p.name, 'Competition'].map((h, i) => (
                      <th key={i} style={{ background: i === 1 ? '#1A1A1A' : '#BD480C', color: i === 1 ? '#F5C344' : '#FFFFFF', textAlign: 'left', padding: '14px 16px', fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 15, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detailData.comparison.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 ? '#F3F3F3' : '#FFFFFF', borderTop: '1px solid #DDDDDD' }}>
                      <td style={{ padding: '14px 16px', fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 15 }}>{row[0]}</td>
                      <td style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600, color: '#D9530F' }}>{row[1]}</td>
                      <td style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600, color: '#807662' }}>{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Related */}
        <div style={{ maxWidth: 1280, margin: '96px auto 0' }}>
          <SectionHeader title="Pair It With" eyebrow="ENGINEER-RECOMMENDED" right={<a onClick={() => onNav('catalog')} style={{ cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1A1A1A' }}>Full Catalog →</a>} />
          <div className="rsp-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {related.map((r) => (
              <div key={r.id} onClick={() => { onNav('product', r.id); window.scrollTo(0, 0); }} style={{ cursor: 'pointer', border: '2px solid #1A1A1A', background: '#FFFFFF', transition: 'background 200ms' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F5C344')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
              >
                <div style={{ aspectRatio: '4/3', background: '#E8E8E8', overflow: 'hidden', borderBottom: '2px solid #1A1A1A' }}>
                  <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: /\.(jpe?g|png|webp)$/i.test(r.img) ? 'cover' : 'contain', padding: /\.(jpe?g|png|webp)$/i.test(r.img) ? 0 : 24 }} />
                </div>
                <div style={{ padding: 18 }}>
                  <DataLabel color="#D9530F" size={10}>{r.catLabel.toUpperCase()}</DataLabel>
                  <h4 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 24, lineHeight: 1, textTransform: 'uppercase', margin: '6px 0 4px' }}>{r.name}</h4>
                  {r.sku && r.sku !== 'TODO' && <DataLabel color="#807662" size={10}>{r.sku}</DataLabel>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rsp-px rsp-py" style={{ background: '#1A1A1A', color: '#FFFFFF', padding: '96px 32px', position: 'relative', overflow: 'hidden' }}>
        <CautionStripe height={6} period={28} opacity={0.6} style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
        <div className="rsp-stack" style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <DataLabel color="#F5C344" style={{ display: 'block', marginBottom: 16 }}>NOT SURE WHAT FITS?</DataLabel>
            <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 56, lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 18px', ...hwStyle({ fill: '#FFFFFF', shadow: '#D9530F' }) }}>
              Let our engineers spec it.
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, lineHeight: 1.6, color: '#C8C6C5', margin: 0, maxWidth: 540 }}>
              Send a rack drawing or a photo. We'll return a per-bay layout with quantities, install notes, and a detailed quote.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Mega variant="orange" onClick={() => onNav('contact')}>Request a Quote →</Mega>
            <Mega variant="outline-dark" onClick={() => onNav('resources')} style={{ borderColor: '#F5C344', color: '#F5C344' }}>Read NFPA 13 Guide</Mega>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom Spec Builder — replaces the old quantity-slider "quote builder" (which
// showed a fabricated per-unit price). RSP makes many made-to-order parts, so
// this captures the custom spec instead: dimensions, quantity, material/finish,
// load rating, and mounting/compatibility. On submit it assembles a summary and
// hands off to the contact form via the sessionStorage handoff (same mechanism
// as the flue calculator), which prefills the notes and flows into /api/quote.
// ─────────────────────────────────────────────────────────────────────────────
const specInputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: '2px solid #1A1A1A', borderRadius: 0,
  fontFamily: "'Inter',sans-serif", fontSize: 14, outline: 'none', background: '#FFFFFF',
  boxSizing: 'border-box',
};

const specLabelStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: '#807662',
};

type CustomSpecBuilderProps = {
  p: Product;
  activeDims: typeof DIMENSIONS;
  leadLabel: string;
  onNav: (target: NavTarget, payload?: string | null) => void;
};

function CustomSpecBuilder({ p, activeDims, leadLabel, onNav }: CustomSpecBuilderProps) {
  const [dims, setDims] = useState<Record<string, string>>({});
  const [dimsFreeform, setDimsFreeform] = useState('');
  const [qty, setQty] = useState('');
  const [material, setMaterial] = useState('');
  const [loadRating, setLoadRating] = useState('');
  const [mounting, setMounting] = useState('');
  const [notes, setNotes] = useState('');

  const hasDimInputs = activeDims.length > 0;
  // If capacity is already a dimension axis, it covers the load requirement —
  // don't also show a separate "target load rating" field.
  const hasCapacityDim = activeDims.some((d) => d.key === 'capacity');

  const buildAndGo = () => {
    const dimSummary = hasDimInputs
      ? activeDims
          .map((d) => {
            const v = dims[d.key]?.trim();
            return v ? `${d.label} ${v}${d.key === 'capacity' ? ' lb' : ' in'}` : null;
          })
          .filter(Boolean)
          .join(', ')
      : dimsFreeform.trim();

    const payload = {
      product: p.name,
      productId: p.id,
      dims: dimSummary,
      qty: qty.trim(),
      material: material.trim(),
      loadRating: loadRating.trim(),
      mounting: mounting.trim(),
      notes: notes.trim(),
    };
    onNav('contact', 'custom-req:' + encodeURIComponent(JSON.stringify(payload)));
  };

  return (
    <div style={{ border: '2px solid #1A1A1A', background: '#FFFFFF', padding: 0 }}>
      <div className="rsp-wrap" style={{ background: '#1A1A1A', color: '#F5C344', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <DataLabel color="#F5C344">CUSTOM SPEC BUILDER</DataLabel>
        <DataLabel color="rgba(245,195,68,0.6)" size={10}>MADE-TO-ORDER · FREE QUOTE</DataLabel>
      </div>
      <div style={{ padding: 20 }}>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.55, color: '#4E4635', margin: '0 0 18px' }}>
          Need a custom version of the {p.name}? Tell us the specs and we&apos;ll quote a made-to-order run. Every field is optional — send what you know and our engineers fill the gaps.
        </p>

        <DataLabel color="#807662" size={10} style={{ display: 'block', marginBottom: 8 }}>CUSTOM DIMENSIONS</DataLabel>
        {hasDimInputs ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {activeDims.map((d) => (
              <label key={d.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={specLabelStyle}>{d.label}{d.key === 'capacity' ? ' (lb)' : ' (in)'}</span>
                <input
                  inputMode="decimal"
                  value={dims[d.key] ?? ''}
                  onChange={(e) => setDims((s) => ({ ...s, [d.key]: e.target.value }))}
                  placeholder="—"
                  style={specInputStyle}
                />
              </label>
            ))}
          </div>
        ) : (
          <input
            value={dimsFreeform}
            onChange={(e) => setDimsFreeform(e.target.value)}
            placeholder="e.g. 52 in L × 46 in W × 4 in H"
            style={{ ...specInputStyle, marginBottom: 16 }}
          />
        )}

        <div style={{ display: 'grid', gridTemplateColumns: hasCapacityDim ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <SpecField label="Est. quantity" value={qty} onChange={setQty} placeholder="e.g. 200" />
          {!hasCapacityDim && (
            <SpecField label="Target load rating" value={loadRating} onChange={setLoadRating} placeholder="e.g. 2,500 lb UDL" />
          )}
        </div>

        <SpecField label="Material · gauge · finish" value={material} onChange={setMaterial} placeholder="e.g. 12-ga steel, hot-dip galvanized" style={{ marginBottom: 12 }} />
        <SpecField label="Mounting · compatibility" value={mounting} onChange={setMounting} placeholder="e.g. Teardrop rack, 3&quot; beam, bolt-on" style={{ marginBottom: 12 }} />

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
          <span style={specLabelStyle}>Application / notes</span>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What does this custom version need to do?"
            style={{ ...specInputStyle, resize: 'vertical', minHeight: 72 }}
          />
        </label>

        <Btn variant="primary" size="lg" onClick={buildAndGo} style={{ width: '100%', justifyContent: 'center' }}>
          Build Custom Request →
        </Btn>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => onNav('contact', 'spec-' + p.name)}
            style={{ background: 'transparent', border: 0, cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, color: '#807662', textDecoration: 'underline', padding: 0 }}
          >
            Just need it as-is? Request a standard quote →
          </button>
          <DataLabel color="#807662" size={10}>LEAD TIME · {leadLabel}</DataLabel>
        </div>
      </div>
    </div>
  );
}

const SpecField = ({ label, value, onChange, placeholder, style = {} }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
    <span style={specLabelStyle}>{label}</span>
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={specInputStyle} />
  </label>
);
