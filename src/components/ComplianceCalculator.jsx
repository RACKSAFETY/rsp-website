import React, { useState, useMemo } from 'react';
import { Icon, DataLabel, hwStyle } from '../components.jsx';
import {
  evaluateFlueSpace,
  COMMODITY_OPTIONS,
  RACK_TYPE_OPTIONS,
  SPRINKLER_OPTIONS,
  STANDARD,
  EDITION,
} from '../data/nfpa13FlueRules.js';

// Slider bounds mirror BOUNDS in nfpa13FlueRules.js; the engine clamps anyway.
const SLIDERS = {
  storageHeightFt: { min: 5, max: 45, step: 1, label: 'STORAGE HEIGHT' },
  ceilingHeightFt: { min: 8, max: 50, step: 1, label: 'CEILING HEIGHT' },
  aisleWidthFt: { min: 2, max: 16, step: 0.5, label: 'AISLE WIDTH' },
};

const labelFor = (options, value) => {
  const hit = options.find(([v]) => v === value);
  return hit ? hit[1] : value;
};

const selectStyle = {
  width: '100%', padding: '10px 12px', background: 'rgba(245,195,68,0.05)',
  color: '#F5C344', border: '1px solid #F5C344', borderRadius: 0,
  fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600,
};

// The native option popup renders on a light OS background — give the options
// an explicit charcoal background so the yellow select text stays readable.
const optionStyle = { background: '#1A1A1A', color: '#F5C344' };

const SelectRow = ({ label, value, options, onChange }) => (
  <div style={{ marginBottom: 18 }}>
    <DataLabel color="rgba(255,255,255,0.65)" size={10} style={{ display: 'block', marginBottom: 6 }}>{label}</DataLabel>
    <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
      {options.map(([v, l]) => <option key={v} value={v} style={optionStyle}>{l}</option>)}
    </select>
  </div>
);

const SliderRow = ({ field, value, onChange }) => {
  const cfg = SLIDERS[field];
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <DataLabel color="rgba(255,255,255,0.65)" size={10}>{cfg.label}</DataLabel>
        <DataLabel color="#F5C344" size={13} style={{ fontWeight: 700 }}>{value} FT</DataLabel>
      </div>
      <input
        type="range" min={cfg.min} max={cfg.max} step={cfg.step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <DataLabel color="rgba(255,255,255,0.35)" size={9}>{cfg.min} FT</DataLabel>
        <DataLabel color="rgba(255,255,255,0.35)" size={9}>{cfg.max} FT</DataLabel>
      </div>
    </div>
  );
};

const FlueResult = ({ label, value, required = true }) => (
  <div style={{ flex: 1, padding: '14px 16px', background: '#F5C344', color: '#1A1A1A' }}>
    <DataLabel color="rgba(26,26,26,0.7)" size={10} style={{ display: 'block' }}>{label}</DataLabel>
    <div style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: required ? 40 : 22, lineHeight: 1, marginTop: 6 }}>
      {required ? `${value} IN` : 'NOT REQUIRED'}
    </div>
  </div>
);

export default function ComplianceCalculator({ onNav }) {
  const [inputs, setInputs] = useState({
    commodityClass: 'class-3',
    rackType: 'double-row',
    sprinklerScheme: 'control-mode',
    storageHeightFt: 20,
    ceilingHeightFt: 30,
    aisleWidthFt: 8,
  });
  const set = (k, v) => setInputs((prev) => ({ ...prev, [k]: v }));

  const result = useMemo(() => evaluateFlueSpace(inputs), [inputs]);

  const badge = result.verified
    ? { text: `${STANDARD}-VERIFIED · ${EDITION} ED.`, bg: '#2ECC71', fg: '#FFFFFF' }
    : {
        text: `DRAFT · ${result.verificationDetail.verified}/${result.verificationDetail.total} VERIFIED`,
        bg: '#FF5E13', fg: '#FFFFFF',
      };

  const getMatchedSpecs = () => {
    const summary = {
      commodity: labelFor(COMMODITY_OPTIONS, inputs.commodityClass),
      rackType: labelFor(RACK_TYPE_OPTIONS, inputs.rackType),
      sprinkler: labelFor(SPRINKLER_OPTIONS, inputs.sprinklerScheme),
      storageHeightFt: result.inputsEcho.storageHeightFt,
      ceilingHeightFt: result.inputsEcho.ceilingHeightFt,
      aisleWidthFt: result.inputsEcho.aisleWidthFt,
      transverseFlueIn: result.transverseFlueIn,
      longitudinalFlueIn: result.longitudinalFlueIn,
      longitudinalRequired: result.longitudinalRequired,
      citations: result.governingCitations,
      edition: result.edition,
    };
    onNav('contact', 'flue-calc:' + encodeURIComponent(JSON.stringify(summary)));
  };

  return (
    <section style={{ background: '#1A1A1A', color: '#FFFFFF', padding: '120px 32px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(245,195,68,0.05) 0 30px, transparent 30px 60px)' }}></div>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start', position: 'relative' }}>

        {/* Calculator card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(245,195,68,0.3)', padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid rgba(245,195,68,0.25)', paddingBottom: 14, marginBottom: 18 }}>
            <Icon name="calculate" size={28} style={{ color: '#F5C344' }} />
            <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 26, textTransform: 'uppercase', margin: 0, color: '#FFFFFF', letterSpacing: '0.02em' }}>Flue Space Calculator</h3>
            <span style={{
              marginLeft: 'auto', background: badge.bg, color: badge.fg,
              fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700,
              letterSpacing: '0.14em', padding: '4px 8px', whiteSpace: 'nowrap',
            }}>{badge.text}</span>
          </div>

          {/* Inputs */}
          <SelectRow label="COMMODITY CLASS" value={inputs.commodityClass} options={COMMODITY_OPTIONS} onChange={(v) => set('commodityClass', v)} />
          <SelectRow label="RACK TYPE" value={inputs.rackType} options={RACK_TYPE_OPTIONS} onChange={(v) => set('rackType', v)} />
          <SelectRow label="SPRINKLER PROTECTION" value={inputs.sprinklerScheme} options={SPRINKLER_OPTIONS} onChange={(v) => set('sprinklerScheme', v)} />
          <SliderRow field="storageHeightFt" value={inputs.storageHeightFt} onChange={(v) => set('storageHeightFt', v)} />
          <SliderRow field="ceilingHeightFt" value={inputs.ceilingHeightFt} onChange={(v) => set('ceilingHeightFt', v)} />
          <SliderRow field="aisleWidthFt" value={inputs.aisleWidthFt} onChange={(v) => set('aisleWidthFt', v)} />

          {/* Results — transverse + longitudinal */}
          <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
            <FlueResult label="TRANSVERSE FLUE" value={result.transverseFlueIn} />
            <FlueResult label="LONGITUDINAL FLUE" value={result.longitudinalFlueIn} required={result.longitudinalRequired} />
          </div>

          <button
            onClick={getMatchedSpecs}
            style={{
              width: '100%', marginTop: 16, background: '#FF5E13', color: '#FFFFFF',
              border: 0, borderRadius: 0, padding: 14, fontFamily: "'Inter',sans-serif",
              fontWeight: 700, fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'background 200ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#BD480C')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#FF5E13')}
          >
            Get matched specs →
          </button>
        </div>

        {/* Marketing column + live detail */}
        <div>
          <DataLabel color="#D9530F" style={{ display: 'block', marginBottom: 16 }}>SCREENING TOOL · {STANDARD} ({EDITION} ED.)</DataLabel>
          <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 72, lineHeight: 0.92, textTransform: 'uppercase', margin: '0 0 24px', ...hwStyle({ fill: '#FFFFFF', shadow: '#D9530F' }) }}>
            Flue Space<br/>Screening
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', marginBottom: 16 }}>
            Enter your rack arrangement and get the nominal <strong style={{ color: '#F5C344' }}>TRANSVERSE</strong> and <strong style={{ color: '#F5C344' }}>LONGITUDINAL</strong> flue spaces NFPA 13 calls for — every result <strong style={{ color: '#F5C344' }}>CITED</strong> to the section that drives it.
          </p>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
            It&#39;s a screening estimate, not a stamped design. Use it to scope a job fast — then bring us the details and our team turns it into an engineered spec.
          </p>

          {/* Live detail — citations, assumptions, disclaimer (moved here to balance the layout) */}
          <div style={{ marginTop: 36 }}>
            {/* Governing citations */}
            {result.governingCitations.length > 0 && (
              <div style={{ paddingTop: 20, borderTop: '1px solid rgba(245,195,68,0.25)' }}>
                <DataLabel color="rgba(255,255,255,0.65)" size={10} style={{ display: 'block', marginBottom: 8 }}>GOVERNING CITATIONS</DataLabel>
                {result.governingCitations.map((c) => (
                  <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Icon name="description" size={14} style={{ color: '#F5C344', flexShrink: 0 }} />
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: '#F5C344' }}>{c}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Assumptions */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(245,195,68,0.25)' }}>
              <DataLabel color="rgba(255,255,255,0.65)" size={10} style={{ display: 'block', marginBottom: 8 }}>ASSUMPTIONS</DataLabel>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {result.assumptions.map((a, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontFamily: "'Inter',sans-serif", fontSize: 12, lineHeight: 1.5, color: 'rgba(255,255,255,0.7)' }}>
                    <span style={{ color: '#F5C344', flexShrink: 0 }}>›</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer strip */}
            <div style={{
              marginTop: 16, padding: '12px 14px',
              background: 'rgba(255,94,19,0.08)', borderLeft: '3px solid #FF5E13',
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <Icon name="warning" size={16} fill={1} style={{ color: '#FF5E13', flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11.5, lineHeight: 1.5, color: 'rgba(255,255,255,0.8)' }}>
                Screening estimate based on {STANDARD}, {EDITION} edition. Flue-space requirements are one
                part of a full NFPA 13 analysis — confirm against your AHJ&#39;s adopted edition and a
                licensed fire protection engineer before design or construction.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
