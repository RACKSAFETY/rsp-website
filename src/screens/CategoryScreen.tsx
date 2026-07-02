'use client';
import React from 'react';
import { DataLabel, CautionStripe, Mega, SectionHeader, hwStyle } from '../components';
import { PRODUCT_CATALOG, CATEGORIES, SUBGROUPS, CATEGORY_META } from '../data/productCatalog';
import { ProductCard } from './CatalogScreen';
import { useNav } from '../hooks/useNav';
import type { CategoryId } from '../types';

// Dedicated category landing page: keyword-rich hero + the products in the category
// (grouped by sub-group where one exists) + cross-links to the other categories.
export default function CategoryScreen({ category }: { category: CategoryId }) {
  const onNav = useNav();
  const meta = CATEGORY_META[category];
  const products = PRODUCT_CATALOG.filter((p) => p.cat === category);

  const blocks: { label: string | null; items: typeof products }[] = [];
  const seen = new Set<string>();
  (SUBGROUPS[category] || []).forEach((sg) => {
    const items = products.filter((p) => p.subGroup === sg);
    if (items.length) {
      blocks.push({ label: sg, items });
      items.forEach((p) => seen.add(p.id));
    }
  });
  const ungrouped = products.filter((p) => !seen.has(p.id));
  if (ungrouped.length) blocks.push({ label: blocks.length ? 'More Products' : null, items: ungrouped });

  const others = CATEGORIES.filter(([id]) => id !== category);

  return (
    <div className="rsp-fade-up">
      {/* Breadcrumb */}
      <div className="rsp-px" style={{ background: '#F9F9F9', padding: '24px 32px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#807662' }}>
          <a onClick={() => onNav('home')} style={{ cursor: 'pointer', color: '#807662', textDecoration: 'none' }}>HOME</a>
          <span>/</span>
          <a onClick={() => onNav('catalog')} style={{ cursor: 'pointer', color: '#807662', textDecoration: 'none' }}>CATALOG</a>
          <span>/</span>
          <span style={{ color: '#D9530F' }}>{meta.h1.toUpperCase()}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="rsp-px rsp-py" style={{ padding: '40px 32px 48px', background: '#F9F9F9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <DataLabel color="#D9530F" style={{ display: 'block', marginBottom: 12 }}>{products.length} PRODUCT{products.length !== 1 ? 'S' : ''}</DataLabel>
          <h1 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 'clamp(34px, 6.5vw, 84px)', lineHeight: 0.9, textTransform: 'uppercase', margin: 0, ...hwStyle({ fill: '#1A1A1A', shadow: '#F5C344' }) }}>{meta.h1}</h1>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 17, lineHeight: 1.6, color: '#4E4635', maxWidth: 660, margin: '20px 0 0', borderLeft: '3px solid #D9530F', paddingLeft: 16 }}>{meta.intro}</p>
        </div>
        <div style={{ maxWidth: 1280, margin: '24px auto 0' }}><CautionStripe height={10} period={32} /></div>
      </section>

      {/* Products */}
      <section className="rsp-px" style={{ padding: '8px 32px 96px', background: '#F9F9F9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48 }}>
          {blocks.map((b, i) => (
            <div key={i}>
              {b.label && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, borderBottom: '2px solid #1A1A1A', paddingBottom: 10, marginBottom: 20 }}>
                  <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 30, lineHeight: 1, textTransform: 'uppercase', margin: 0 }}>{b.label}</h2>
                  <DataLabel color="#807662" size={10}>{b.items.length} ITEM{b.items.length !== 1 ? 'S' : ''}</DataLabel>
                </div>
              )}
              <div className="rsp-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                {b.items.map((p) => <ProductCard key={p.id} p={p} onNav={onNav} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Other categories */}
      <section className="rsp-px rsp-py" style={{ padding: '72px 32px', background: '#F3F3F3', borderTop: '2px solid #1A1A1A' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeader eyebrow="KEEP BROWSING" title="Other Categories" right={<a onClick={() => onNav('catalog')} style={{ cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1A1A1A' }}>Full Catalog →</a>} />
          <div className="rsp-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {others.map(([id, label]) => (
              <a
                key={id}
                onClick={() => onNav('category', CATEGORY_META[id].slug)}
                style={{ cursor: 'pointer', border: '2px solid #1A1A1A', background: '#FFFFFF', padding: '18px 20px', textDecoration: 'none', color: '#1A1A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, transition: 'background 200ms' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F5C344')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
              >
                <span style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 20, lineHeight: 1, textTransform: 'uppercase' }}>{label}</span>
                <span>→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rsp-px rsp-py" style={{ background: '#1A1A1A', color: '#FFFFFF', padding: '96px 32px', position: 'relative', overflow: 'hidden' }}>
        <CautionStripe height={6} period={28} opacity={0.6} style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
        <div className="rsp-stack" style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <DataLabel color="#F5C344" style={{ display: 'block', marginBottom: 16 }}>NOT SURE WHAT FITS?</DataLabel>
            <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 'clamp(34px, 5vw, 56px)', lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 12px', ...hwStyle({ fill: '#FFFFFF', shadow: '#D9530F' }) }}>Let our engineers spec it.</h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, lineHeight: 1.6, color: '#C8C6C5', margin: 0, maxWidth: 540 }}>Send a rack drawing or a photo and we&apos;ll return a per-bay layout with quantities, install notes, and a detailed quote.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Mega variant="orange" onClick={() => onNav('contact')}>Request a Quote →</Mega>
          </div>
        </div>
      </section>
    </div>
  );
}
