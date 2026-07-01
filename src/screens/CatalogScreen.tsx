'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  DataLabel, Pill, CautionStripe, Icon, hwStyle, SectionHeader,
} from '../components';
import { PRODUCT_CATALOG, CATEGORIES, COMPLIANCE_FILTERS, SUBGROUPS } from '../data/productCatalog';
import { useNav } from '../hooks/useNav';

export default function CatalogScreen() {
  const onNav = useNav();
  const initialFilter = useSearchParams().get('category');
  // Empty `cats` = show all. Clicking a category turns that filter on;
  // unchecking everything returns to "all". Standard e-commerce filter behavior.
  const [cats, setCats] = useState(new Set(initialFilter ? [initialFilter] : []));
  const [comp, setComp] = useState(null);
  const [sort, setSort] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  const toggleCat = (id) => {
    const next = new Set(cats);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCats(next);
  };

  const filtered = PRODUCT_CATALOG.filter((p) => {
    if (cats.size > 0 && !cats.has(p.cat)) return false;
    if (comp && !p.compliance.some((c) => c.toLowerCase().includes(comp))) return false;
    return true;
  });

  const sorted = [...filtered];
  if (sort === 'lead') {
    sorted.sort((a, b) => {
      const order = { 'In Stock': 0, '1 Week': 1, '2 Weeks': 2, '3 Weeks': 3 };
      return (order[a.leadTime] ?? 9) - (order[b.leadTime] ?? 9);
    });
  } else if (sort === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Group results into ordered render blocks. A block = { key, label|null, items }.
  // Sub-group blocks come first (in CATEGORIES → SUBGROUPS order, so multi-category
  // selections stay stable); anything without a recognized sub-group falls into a
  // single trailing bucket. Items are sliced from `sorted`, so the active sort
  // mode still orders products correctly within each block.
  const blocks = [];
  const seen = new Set();
  CATEGORIES.forEach(([catId]) => {
    (SUBGROUPS[catId] || []).forEach((sg) => {
      const items = sorted.filter((p) => p.cat === catId && p.subGroup === sg);
      if (items.length) {
        blocks.push({ key: `${catId}:${sg}`, label: sg, items });
        items.forEach((p) => seen.add(p.id));
      }
    });
  });
  const ungrouped = sorted.filter((p) => !seen.has(p.id));
  if (ungrouped.length) {
    blocks.push({ key: 'ungrouped', label: blocks.length ? 'More Products' : null, items: ungrouped });
  }

  return (
    <div className="rsp-fade-up">
      <div style={{ background: '#F9F9F9', paddingTop: 24 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <CautionStripe height={12} period={32} />
        </div>
      </div>

      <section className="rsp-px" style={{ padding: '32px 32px 96px', background: '#F9F9F9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <button
            className="rsp-only-mobile"
            onClick={() => setShowFilters((s) => !s)}
            style={{ width: '100%', marginBottom: 20, padding: '13px 16px', background: '#1A1A1A', color: '#F5C344', border: 0, cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}
          >
            {showFilters ? '✕ Hide Filters' : '☰ Filters'}
          </button>
        </div>
        <div className="rsp-stack" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 40 }}>
          {/* Sidebar filters */}
          <aside className={showFilters ? 'rsp-static rsp-filters-open' : 'rsp-static rsp-filters'} style={{ position: 'sticky', top: 92, alignSelf: 'flex-start' }}>
            <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, color: '#D9530F', fontSize: 32, textTransform: 'uppercase', borderBottom: '2px solid #1A1A1A', paddingBottom: 12, margin: '0 0 22px' }}>Filters</h3>

            <DataLabel style={{ display: 'block', marginBottom: 12 }}>Product Category</DataLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {CATEGORIES.map(([id, l]) => (
                <FilterCheckbox key={id} label={l} checked={cats.has(id)} onChange={() => toggleCat(id)} />
              ))}
            </div>

            <DataLabel style={{ display: 'block', marginBottom: 12 }}>Compliance</DataLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {COMPLIANCE_FILTERS.map(([id, l]) => (
                <FilterRadio key={id} label={l} checked={comp === id} onChange={() => setComp(comp === id ? null : id)} />
              ))}
              {comp && (
                <button onClick={() => setComp(null)} style={{ marginTop: 4, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D9530F', background: 'transparent', border: 0, padding: 0, cursor: 'pointer', textAlign: 'left' }}>× Clear compliance</button>
              )}
            </div>

            <DataLabel style={{ display: 'block', marginBottom: 12 }}>Sort by</DataLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
              {[['relevance', 'Relevance'], ['lead', 'Shortest lead'], ['name', 'A–Z']].map(([id, l]) => (
                <FilterRadio key={id} label={l} checked={sort === id} onChange={() => setSort(id)} />
              ))}
            </div>

            <CautionStripe height={16} period={32} style={{ marginTop: 12, marginBottom: 10 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ width: 8, height: 8, background: '#2ECC71', borderRadius: 0 }}></span>
              <DataLabel color="#1A1A1A" size={10}>System Status: Active Monitoring</DataLabel>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#807662', marginTop: 8 }}>
              Showing <strong style={{ color: '#1A1A1A' }}>{sorted.length}</strong> of {PRODUCT_CATALOG.length} products
            </div>
          </aside>

          <div>
            <div style={{ marginBottom: 24 }}>
              <DataLabel color="#D9530F" style={{ display: 'block', marginBottom: 12 }}>{cats.size === 0 ? 'ALL CATEGORIES' : Array.from(cats).map((c) => CATEGORIES.find(([id]) => id === c)?.[1]).join(' · ')}</DataLabel>
              <h1 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 'clamp(34px, 7.2vw, 96px)', lineHeight: 0.9, textTransform: 'uppercase', margin: 0 }}>
                <span style={{ display: 'inline-block', ...hwStyle({ fill: '#1A1A1A', shadow: '#F5C344' }) }}>Industrial</span><br/>
                <span style={{ display: 'inline-block', ...hwStyle({ fill: '#D9530F', shadow: '#F5C344' }) }}>Safety Solutions</span>
              </h1>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 17, lineHeight: 1.6, color: '#4E4635', maxWidth: 580, margin: '20px 0 0' }}>
                Engineering the industry's most reliable rack protection, flue guards, and safety barriers for high-capacity warehouse environments.
              </p>
            </div>

            <div style={{
              borderTop: '2px solid #1A1A1A', borderBottom: '2px solid #1A1A1A',
              padding: '16px 0', display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap',
              marginBottom: 40,
            }}>
              {[
                ['verified', 'Premium Safety Grade'],
                ['local_shipping', 'National Distribution'],
                ['support_agent', 'Spec Support 7am–7pm PT'], // TODO-VERIFY: support hours
              ].map(([ic, l]) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name={ic} size={20} fill={1} style={{ color: '#D9530F' }} />
                  <DataLabel>{l}</DataLabel>
                </span>
              ))}
            </div>

            {sorted.length === 0 ? (
              <div style={{ padding: 80, textAlign: 'center', border: '2px dashed #807662' }}>
                <Icon name="search_off" size={48} style={{ color: '#807662' }} />
                <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 28, textTransform: 'uppercase', margin: '16px 0 8px' }}>No products match these filters</h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: '#4E4635' }}>Try widening your category selection or removing the compliance filter.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 48, marginBottom: 80 }}>
                {blocks.map((b) => (
                  <div key={b.key}>
                    {b.label && (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, borderBottom: '2px solid #1A1A1A', paddingBottom: 10, marginBottom: 20 }}>
                        <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 32, lineHeight: 1, textTransform: 'uppercase', margin: 0 }}>{b.label}</h2>
                        <DataLabel color="#807662" size={10}>{b.items.length} ITEM{b.items.length !== 1 ? 'S' : ''}</DataLabel>
                      </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                      {b.items.map((p) => <ProductCard key={p.id} p={p} onNav={onNav} />)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comparison Matrix hidden until real comparison data is entered (was all TODO). */}
            {false && (
            <div style={{ marginBottom: 32 }}>
              <SectionHeader
                title="Comparison Matrix"
                right={<DataLabel color="#D9530F">UPDATED TODO</DataLabel> /* TODO-VERIFY: matrix last-updated date */}
              />
              <div style={{ overflow: 'auto', border: '2px solid #1A1A1A' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#FFFFFF', minWidth: 720 }}>
                  <thead>
                    <tr>
                      {['Product Line', 'Compliance', 'Durability', 'Install Time', 'Lead Time'].map((h) => (
                        <th key={h} style={{ background: '#BD480C', color: '#FFFFFF', textAlign: 'left', padding: '14px 16px', fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 15, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* TODO: fill Compliance / Durability / Install / Lead cells once product specs are confirmed. */}
                    {[
                      ['Flue Guard™',                  ['outline', 'TODO'], 'TODO', 'TODO', 'TODO'],
                      ['Flue Keeper™',                 ['outline', 'TODO'], 'TODO', 'TODO', 'TODO'],
                      ['Flared Channel Wire Decking',  ['outline', 'TODO'], 'TODO', 'TODO', 'TODO'],
                      ['Column Guards',                ['outline', 'TODO'], 'TODO', 'TODO', 'TODO'],
                      ['Pallet Rack Netting',          ['outline', 'TODO'], 'TODO', 'TODO', 'TODO'],
                    ].map((row, i) => (
                      <tr key={i} style={{ background: i % 2 ? '#F3F3F3' : '#FFFFFF', borderTop: '1px solid #DDDDDD' }}>
                        <td style={{ padding: '14px 16px', fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 15 }}>{row[0]}</td>
                        <td style={{ padding: '14px 16px' }}><Pill kind={row[1][0]}>{row[1][1]}</Pill></td>
                        <td style={{ padding: '14px 16px', fontFamily: "'Inter',sans-serif", fontSize: 14, color: '#4E4635' }}>{row[2]}</td>
                        <td style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600 }}>{row[3]}</td>
                        <td style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600, color: row[4] === 'In Stock' ? '#2ECC71' : '#1A1A1A' }}>{row[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const FilterCheckbox = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: 14, color: checked ? '#1A1A1A' : '#4E4635', fontWeight: checked ? 600 : 400 }}>
    <input type="checkbox" checked={checked} onChange={onChange} style={{ width: 18, height: 18, accentColor: '#FF5E13', borderRadius: 0 }} />
    <span>{label}</span>
  </label>
);

const FilterRadio = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: 14, color: checked ? '#1A1A1A' : '#4E4635', fontWeight: checked ? 600 : 400 }}>
    <input type="radio" checked={checked} onChange={onChange} style={{ width: 18, height: 18, accentColor: '#1A1A1A' }} />
    <span>{label}</span>
  </label>
);

const ProductCard = ({ p, onNav }) => {
  const [hover, setHover] = useState(false);
  const highlight = p.highlight;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onNav('product', p.id)}
      className="rsp-card-hover"
      style={{
        border: '2px solid #1A1A1A',
        background: highlight ? '#BD480C' : (hover ? '#FFFAEC' : '#FFFFFF'),
        color: highlight ? '#FFFFFF' : '#1A1A1A',
        display: 'flex', flexDirection: 'column', position: 'relative', cursor: 'pointer',
      }}
    >
      {p.tag && (
        <div style={{
          position: 'absolute', top: 0, right: 0,
          padding: '6px 12px',
          background: p.tag[0] === 'yellow' ? '#F5C344' : '#1A1A1A',
          color: p.tag[0] === 'yellow' ? '#1A1A1A' : '#F5C344',
          fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase', zIndex: 2, border: '1px solid #1A1A1A',
        }}>{p.tag[1]}</div>
      )}
      <div style={{ aspectRatio: '1', background: highlight ? '#812900' : '#E8E8E8', overflow: 'hidden', borderBottom: '2px solid #1A1A1A', position: 'relative' }}>
        <img src={p.img} alt={p.name} style={{
          width: '100%', height: '100%', objectFit: /\.(jpe?g|png|webp)$/i.test(p.img) ? 'cover' : 'contain',
          padding: /\.(jpe?g|png|webp)$/i.test(p.img) ? 0 : 24,
          transition: 'transform 300ms, filter 300ms',
          transform: hover && !highlight ? 'scale(1.05)' : 'scale(1)',
          filter: highlight ? 'grayscale(1) brightness(0.4)' : (hover ? 'none' : 'grayscale(0.2)'),
        }} />
        {highlight && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', padding: 16 }}>
            <div style={{
              fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 24,
              color: '#FFFFFF', textTransform: 'uppercase',
              transform: 'rotate(-6deg)',
              border: '2px solid #FFFFFF', padding: '6px 14px', whiteSpace: 'nowrap',
              boxShadow: '4px 4px 0 #1A1A1A',
            }}>NEED A CUSTOM SPEC?</div>
          </div>
        )}
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div>
          {p.sku && p.sku !== 'TODO' && <DataLabel color={highlight ? '#FFDF9A' : '#807662'} size={10} style={{ display: 'block', marginBottom: 4 }}>{p.sku}</DataLabel>}
          <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 26, lineHeight: 0.95, textTransform: 'uppercase', margin: 0, color: highlight ? '#F5C344' : '#1A1A1A' }}>{p.name}</h3>
          {p.mfg && (
            <DataLabel color={highlight ? '#FFDF9A' : '#D9530F'} size={10} style={{ display: 'block', marginTop: 4 }}>MFG · {p.mfg}</DataLabel>
          )}
        </div>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.55, margin: 0, color: highlight ? '#FFDF9A' : '#4E4635', flex: 1 }}>{p.desc}</p>
        <div style={{ background: highlight ? 'rgba(0,0,0,0.2)' : '#F3F3F3', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
          {p.specs.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Inter',sans-serif", fontSize: 13 }}>
              <DataLabel color={highlight ? '#FFDF9A' : '#807662'} size={10}>{k}</DataLabel>
              <span style={{ fontWeight: 600, color: highlight ? '#F5C344' : (k === 'Compliance' ? '#2ECC71' : '#1A1A1A') }}>{v}</span>
            </div>
          ))}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onNav('product', p.id); }}
          style={{
            marginTop: 12, padding: '14px 0',
            background: highlight ? '#F5C344' : (hover ? '#1A1A1A' : '#BD480C'),
            color: highlight ? '#1A1A1A' : '#FFFFFF',
            border: 0, borderRadius: 0,
            fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.18em',
            textTransform: 'uppercase', cursor: 'pointer', transition: 'background 200ms',
          }}
        >
          {p.cta} →
        </button>
      </div>
    </div>
  );
};
