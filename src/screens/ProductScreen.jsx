import React, { useState } from 'react';
import {
  Btn, Mega, DataLabel, Pill, CautionStripe, Icon, hwStyle, SectionHeader,
} from '../components.jsx';
import { PRODUCT_CATALOG } from '../data/productCatalog.js';

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
      ['SKU', 'TODO'], // TODO-VERIFY: not listed on the live product page
      ['Lead Time', 'TODO'], // TODO-VERIFY: not listed on the live product page
    ],
    certs: [], // TODO-VERIFY: live product page cites no specific NFPA/OSHA/ANSI standard
    includes: ['Flue Guard™ divider', 'High-strength tek screws (for install)'],
    // Downloadable documents from the live Flue Guard™ product page.
    docs: [
      { label: 'Brochure', url: 'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:b8fa4fa9-c332-42e8-9393-732951a06a78' },
      { label: 'Spec Sheet', url: 'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:b2d81ee7-1871-4dec-b3fa-aa27fd3a3e65' },
    ],
    // Flue Guard™ vs Competition — [criterion, Flue Guard™, Competition].
    // TODO: fill in real comparison values once confirmed with the business.
    comparison: [
      ['TODO — criterion', 'TODO', 'TODO'],
      ['TODO — criterion', 'TODO', 'TODO'],
      ['TODO — criterion', 'TODO', 'TODO'],
      ['TODO — criterion', 'TODO', 'TODO'],
    ],
  },
};

// TODO-VERIFY: placeholder per-unit price used only for the quote-builder estimate.
const PLACEHOLDER_UNIT_PRICE = 47;

const qtyBtn = {
  background: '#1A1A1A', color: '#F5C344', border: 0, padding: '8px 12px',
  fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, letterSpacing: '0.14em',
  cursor: 'pointer', borderRadius: 0,
};

export default function ProductScreen({ onNav, productId }) {
  const p = PRODUCT_CATALOG.find((x) => x.id === productId) || PRODUCT_CATALOG[0];
  const [qty, setQty] = useState(50);
  const [variant, setVariant] = useState(0);

  const detailData = DETAIL_DATA[p.id] || {
    // Fallback for scaffolded products — no invented certs (TODO until authored).
    hero: p.desc, variants: ['Standard'], specs: p.specs, certs: [], includes: [],
  };

  const totalEstimate = qty * PLACEHOLDER_UNIT_PRICE;
  const related = PRODUCT_CATALOG.filter((x) => x.id !== p.id).slice(0, 3);

  return (
    <div className="rsp-fade-up">
      <div style={{ background: '#F9F9F9', padding: '24px 32px 16px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#807662' }}>
            <a onClick={() => onNav('home')} style={{ cursor: 'pointer', color: '#807662', textDecoration: 'none' }}>HOME</a>
            <span>/</span>
            <a onClick={() => onNav('catalog')} style={{ cursor: 'pointer', color: '#807662', textDecoration: 'none' }}>CATALOG</a>
            <span>/</span>
            <span style={{ color: '#A93800' }}>{p.catLabel.toUpperCase()}</span>
            <span>/</span>
            <span style={{ color: '#1A1A1A' }}>{p.sku}</span>
          </div>
          <button onClick={() => onNav('catalog')} style={{ background: 'transparent', border: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1A1A1A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            ← Back to catalog
          </button>
        </div>
      </div>

      <section style={{ padding: '24px 32px 96px', background: '#F9F9F9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56 }}>
          {/* LEFT — Image + thumbnails */}
          <div>
            <div style={{ position: 'relative', border: '2px solid #1A1A1A', background: '#FFFFFF', aspectRatio: '1', overflow: 'hidden' }}>
              <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 48 }} />
              <div style={{ position: 'absolute', top: 16, left: 16 }}>
                <Pill kind="yellow">{p.tag ? p.tag[1] : 'STANDARD'}</Pill>
              </div>
              <div style={{ position: 'absolute', bottom: 16, right: 16, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#807662' }}>
                FIG. {p.sku}
              </div>
              <CautionStripe height={6} period={28} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 16 }}>
              {[p.img, '/assets/imagery/warehouse-hero.svg', '/assets/imagery/inspection-editorial.svg', p.img].map((src, i) => (
                <div key={i} style={{ border: '2px solid #1A1A1A', aspectRatio: '1', overflow: 'hidden', background: '#FFFFFF', cursor: 'pointer', opacity: i === 0 ? 1 : 0.55, transition: 'opacity 200ms' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = i === 0 ? 1 : 0.55)}
                >
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.4)' }} />
                </div>
              ))}
            </div>

            {detailData.includes.length > 0 && (
              <div style={{ marginTop: 32, border: '2px solid #1A1A1A', padding: 24, background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #DDDDDD', paddingBottom: 10, marginBottom: 14 }}>
                  <DataLabel color="#A93800">WHAT'S IN THE BOX</DataLabel>
                  <Icon name="inventory_2" size={20} style={{ color: '#A93800' }} />
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
            <DataLabel color="#A93800" style={{ display: 'block', marginBottom: 12 }}>{p.catLabel.toUpperCase()}{p.mfg ? ` · MFG ${p.mfg.toUpperCase()}` : ' · SAFETY PICK'}</DataLabel>
            <h1 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 0.88, textTransform: 'uppercase', margin: '0 0 16px', ...hwStyle({ fill: '#1A1A1A', shadow: '#F5C344' }) }}>
              {p.name}
            </h1>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, lineHeight: 1.55, color: '#1A1A1A', margin: '0 0 24px', borderLeft: '3px solid #A93800', paddingLeft: 14, maxWidth: 540 }}>
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

            <div style={{ border: '2px solid #1A1A1A', background: '#FFFFFF', padding: 0 }}>
              <div style={{ background: '#1A1A1A', color: '#F5C344', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <DataLabel color="#F5C344">QUOTE BUILDER</DataLabel>
                <DataLabel color="rgba(245,195,68,0.6)" size={10}>EST. $/UNIT — FINAL VIA SPEC</DataLabel>
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <DataLabel color="#807662">QUANTITY</DataLabel>
                    <DataLabel color="#1A1A1A" size={14} style={{ fontWeight: 700 }}>{qty.toLocaleString()} {p.pricePer}{qty !== 1 ? 's' : ''}</DataLabel>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={() => setQty(Math.max(1, qty - 10))} style={qtyBtn}>−10</button>
                    <input type="range" min="1" max="500" value={qty} onChange={(e) => setQty(parseInt(e.target.value))} style={{ flex: 1 }} />
                    <button onClick={() => setQty(Math.min(500, qty + 10))} style={qtyBtn}>+10</button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                  <div style={{ padding: 12, background: '#F3F3F3' }}>
                    <DataLabel color="#807662" size={10}>EST. SUBTOTAL</DataLabel>
                    <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 28, lineHeight: 1, marginTop: 4 }}>${totalEstimate.toLocaleString()}</div>
                  </div>
                  <div style={{ padding: 12, background: '#F3F3F3' }}>
                    <DataLabel color="#807662" size={10}>LEAD TIME</DataLabel>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 700, color: p.leadTime === 'In Stock' ? '#2ECC71' : '#1A1A1A', marginTop: 4 }}>{p.leadTime}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Btn variant="primary" size="lg" onClick={() => onNav('contact')} style={{ flex: 1, justifyContent: 'center' }}>
                    Request Engineered Quote →
                  </Btn>
                </div>
              </div>
            </div>

            {detailData.docs && detailData.docs.length > 0 && (
              <div style={{ marginTop: 32, border: '2px solid #1A1A1A', padding: 24, background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #DDDDDD', paddingBottom: 10, marginBottom: 14 }}>
                  <DataLabel color="#A93800">DOCUMENTS</DataLabel>
                  <Icon name="description" size={20} style={{ color: '#A93800' }} />
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
                  <DataLabel color="#A93800" size={11}>{String(i + 1).padStart(2, '0')}</DataLabel>
                  <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 26, lineHeight: 0.95, textTransform: 'uppercase', margin: 0 }}>{b.title}</h3>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.6, color: '#4E4635', margin: 0 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spec Table */}
        <div style={{ maxWidth: 1280, margin: '96px auto 0' }}>
          <SectionHeader title="Technical Specifications" eyebrow={`SKU ${p.sku}`} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '2px solid #1A1A1A', background: '#FFFFFF' }}>
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

        {/* Flue Guard vs Competition — only rendered for products with a comparison table */}
        {detailData.comparison && (
          <div style={{ maxWidth: 1280, margin: '96px auto 0' }}>
            <SectionHeader title={`${p.name} vs Competition`} eyebrow="HEAD-TO-HEAD" />
            <div style={{ overflow: 'auto', border: '2px solid #1A1A1A' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#FFFFFF', minWidth: 600 }}>
                <thead>
                  <tr>
                    {['Criterion', p.name, 'Competition'].map((h, i) => (
                      <th key={i} style={{ background: i === 1 ? '#1A1A1A' : '#A93800', color: i === 1 ? '#F5C344' : '#FFFFFF', textAlign: 'left', padding: '14px 16px', fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 15, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detailData.comparison.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 ? '#F3F3F3' : '#FFFFFF', borderTop: '1px solid #DDDDDD' }}>
                      <td style={{ padding: '14px 16px', fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 15 }}>{row[0]}</td>
                      <td style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600, color: '#A93800' }}>{row[1]}</td>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {related.map((r) => (
              <div key={r.id} onClick={() => { onNav('product', r.id); window.scrollTo(0, 0); }} style={{ cursor: 'pointer', border: '2px solid #1A1A1A', background: '#FFFFFF', transition: 'background 200ms' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F5C344')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
              >
                <div style={{ aspectRatio: '4/3', background: '#E8E8E8', overflow: 'hidden', borderBottom: '2px solid #1A1A1A' }}>
                  <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 24 }} />
                </div>
                <div style={{ padding: 18 }}>
                  <DataLabel color="#A93800" size={10}>{r.catLabel.toUpperCase()}</DataLabel>
                  <h4 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 24, lineHeight: 1, textTransform: 'uppercase', margin: '6px 0 4px' }}>{r.name}</h4>
                  <DataLabel color="#807662" size={10}>{r.sku}</DataLabel>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#1A1A1A', color: '#FFFFFF', padding: '96px 32px', position: 'relative', overflow: 'hidden' }}>
        <CautionStripe height={6} period={28} opacity={0.6} style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <DataLabel color="#F5C344" style={{ display: 'block', marginBottom: 16 }}>NOT SURE WHAT FITS?</DataLabel>
            <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 56, lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 18px', ...hwStyle({ fill: '#FFFFFF', shadow: '#A93800' }) }}>
              Let our engineers spec it.
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, lineHeight: 1.6, color: '#C8C6C5', margin: 0, maxWidth: 540 }}>
              Send a rack drawing or a photo. We'll return a per-bay layout with quantities, install notes, and a fixed-price quote within 24 hours.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Mega variant="orange" onClick={() => onNav('contact')}>Submit Spec Sheet →</Mega>
            <Mega variant="outline-dark" onClick={() => onNav('resources')} style={{ borderColor: '#F5C344', color: '#F5C344' }}>Read NFPA 13 Guide</Mega>
          </div>
        </div>
      </section>
    </div>
  );
}
