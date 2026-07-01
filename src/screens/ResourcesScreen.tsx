'use client';
import React, { useState } from 'react';
import {
  Btn, DataLabel, Pill, CautionStripe, Icon, hwStyle, FAQItem, SectionHeader,
} from '../components';
import { useNav } from '../hooks/useNav';
import { RESOURCES_FAQS } from '../data/faqs';
import type { NavTarget } from '../types';

// Caution intensity locked to "low" — bg opacity 0.08 / 0.18 ≈ 0.44.
const CAUTION_BG_OPACITY = 0.08 / 0.18;

// Featured guides — factual, evergreen topics that link to a real destination
// (the calculator, an audit request, or a category page). No dated "articles".
const FEATURED_GUIDES: {
  cat: string; kind: string; h: string; d: string; img: string; cta: string; nav: [NavTarget, string];
}[] = [
  {
    cat: 'FIRE PROTECTION', kind: 'yellow',
    h: 'In-Rack Flue Space, Explained',
    d: 'Sprinklers can only stop a rack fire if water reaches it. NFPA 13 calls for a nominal 6-inch transverse flue and longitudinal flues in many rack layouts — here\'s how to keep them clear.',
    img: '/assets/products/photos/flue-guard.jpg',
    cta: 'Try the flue calculator', nav: ['home', 'calculator'],
  },
  {
    cat: 'INSPECTION', kind: 'orange',
    h: 'How Often to Inspect Your Rack',
    d: 'Trained-staff visual checks, a periodic expert inspection, and an immediate look after any forklift hit. What to tag — and when to bring in an outside audit.',
    img: '/assets/imagery/photos/rack-inspection.webp',
    cta: 'Request a safety audit', nav: ['contact', 'safety-audits'],
  },
];

const GUIDE_STRIPS: { cat: string; h: string; img: string; cta: string; nav: [NavTarget, string] }[] = [
  {
    cat: 'OSHA 1910.176', h: 'Safe Storage & Material-Handling Basics',
    img: '/assets/imagery/photos/warehouse-aisle.jpg',
    cta: 'Browse rack protection', nav: ['category', 'pallet-rack-protection'],
  },
  {
    cat: 'REPAIR VS. REPLACE', h: 'When a Damaged Upright Can Be Saved',
    img: '/assets/products/photos/repair-kit-structural.webp',
    cta: 'See repair kits', nav: ['category', 'pallet-rack-repair-kits'],
  },
  {
    cat: 'DECKING', h: 'Solid vs. Wire Decking for Fire Compliance',
    img: '/assets/products/photos/bulk-rack-wire-decking.webp',
    cta: 'Compare decking', nav: ['category', 'pallet-rack-decking'],
  },
];

// What our safety audit reviews — mirrors the Safety Audits service (no downloads promised).
const AUDIT_COVERS: [string, string][] = [
  ['warning', 'Frame, upright & beam damage'],
  ['layers', 'Flue space & aisle clearances'],
  ['build', 'Base plates, anchors & hardware'],
  ['fact_check', 'Load capacity & overloading'],
  ['description', 'A documented punch list of fixes'],
];

export default function ResourcesScreen() {
  const onNav = useNav();
  return (
    <div className="rsp-fade-up">
      <section className="rsp-px" style={{ background: '#F9F9F9', padding: '72px 32px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(45deg, rgba(241,192,65,0.18) 0 30px, transparent 30px 60px)',
          opacity: CAUTION_BG_OPACITY,
        }}></div>
        <div className="rsp-stack" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 48, alignItems: 'center', position: 'relative', paddingBottom: 64 }}>
          <div>
            <DataLabel color="#1A1A1A" style={{ display: 'block', marginBottom: 16 }}>NFPA 13 · OSHA · ANSI MH16.1</DataLabel>
            <h1 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 'clamp(34px, 7.5vw, 112px)', lineHeight: 0.9, textTransform: 'uppercase', margin: 0, ...hwStyle({ fill: '#1A1A1A', shadow: '#D9530F' }) }}>
              Safety<br/>Resources
            </h1>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, lineHeight: 1.6, color: '#1A1A1A', maxWidth: 480, marginTop: 24 }}>
              Practical guidance on warehouse fire and rack safety — flue space, inspection, damage repair, and the standards behind them. Written by specialists who spec, engineer, and install the fixes.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 32, flexWrap: 'wrap' }}>
              <Btn variant="yellow" size="lg" onClick={() => onNav('home', 'calculator')}>Flue Space Calculator</Btn>
              <Btn variant="outline" size="lg" onClick={() => onNav('catalog')}>Browse the Catalog</Btn>
            </div>
          </div>
          <div style={{ border: '12px solid #F5C344', aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
            <img src="/assets/imagery/photos/warehouse-aisle.jpg" alt="Pallet rack storage aisle in a warehouse" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, background: '#1A1A1A', color: '#F5C344', padding: '6px 12px', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.2em' }}>PALLET RACK STORAGE</div>
          </div>
        </div>
        <CautionStripe height={6} period={60} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
      </section>

      <section className="rsp-px rsp-py" style={{ padding: '96px 32px', background: '#F9F9F9' }}>
        <div className="rsp-stack" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48 }}>
          <div>
            <SectionHeader eyebrow="SAFETY 101" title="Guides & Standards" right={<a onClick={() => onNav('contact')} style={{ cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1A1A1A', textDecorationThickness: 2 }}>Talk to an expert →</a>} />
            <div className="rsp-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
              {FEATURED_GUIDES.map((g) => (
                <GuideCard key={g.h} {...g} onClick={() => onNav(g.nav[0], g.nav[1])} />
              ))}
            </div>
            {GUIDE_STRIPS.map((g, i) => (
              <GuideStrip key={g.h} {...g} last={i === GUIDE_STRIPS.length - 1} onClick={() => onNav(g.nav[0], g.nav[1])} />
            ))}
          </div>

          <aside className="rsp-static" style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 92, alignSelf: 'flex-start' }}>
            <div style={{ background: '#1A1A1A', color: '#F5C344', padding: 24, border: '2px solid #1A1A1A' }}>
              <DataLabel color="#F5C344" style={{ marginBottom: 12, display: 'block' }}>FREE TOOL</DataLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Icon name="calculate" size={32} style={{ color: '#F5C344' }} />
                <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 26, lineHeight: 0.95, textTransform: 'uppercase', margin: 0, color: '#FFFFFF' }}>Flue Space Calculator</h3>
              </div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.55, color: '#C8C6C5', margin: '0 0 18px' }}>
                Screen your rack setup against NFPA 13 transverse and longitudinal flue space requirements — no login, free to use.
              </p>
              <Btn variant="yellow" size="md" onClick={() => onNav('home', 'calculator')} style={{ width: '100%', justifyContent: 'center' }}>
                Try the Calculator →
              </Btn>
            </div>
            <div style={{ border: '2px solid #1A1A1A', padding: 24, background: '#FFFFFF' }}>
              <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 26, textTransform: 'uppercase', margin: '0 0 14px' }}>What an Audit Covers</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
                {AUDIT_COVERS.map(([ic, t]) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#1A1A1A', fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', padding: '6px 0', borderBottom: '1px solid #E2E2E2' }}>
                    <Icon name={ic} size={20} style={{ color: '#D9530F' }} /><span>{t}</span>
                  </div>
                ))}
              </div>
              <Btn variant="primary" size="md" onClick={() => onNav('contact', 'safety-audits')} style={{ width: '100%', justifyContent: 'center' }}>
                Request an Audit →
              </Btn>
            </div>
          </aside>
        </div>
      </section>

      <section className="rsp-px rsp-py" style={{ background: '#1A1A1A', color: '#FFFFFF', padding: '96px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <CautionStripe height={4} period={24} opacity={0.7} style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
        <CautionStripe height={4} period={24} opacity={0.7} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
        <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative' }}>
          <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 'clamp(40px, 8vw, 84px)', lineHeight: 1, textTransform: 'uppercase', margin: '0 0 24px', ...hwStyle({ fill: '#F5C344', shadow: '#D9530F' }) }}>
            What is rack safety?
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, lineHeight: 1.6, color: '#C8C6C5', maxWidth: 680, margin: '0 auto 36px' }}>
            Rack safety is the practice of keeping industrial storage racking structurally sound and fire-code compliant — protecting uprights from forklift impact, keeping sprinkler flue spaces clear, anchoring and loading rack correctly, and repairing damage before it fails. We specialize in warehouse fire and life safety: engineered products, in-house structural engineering, and audits that turn a code finding into a fix.
          </p>
          <Btn variant="orange" size="lg" style={{ padding: '18px 36px' }} onClick={() => onNav('contact')}>Talk to a Specialist →</Btn>
        </div>
      </section>

      {/* Fire Marshal / Safety Consultant referral block — primary acquisition channel per positions doc §5 */}
      <section className="rsp-px rsp-py" style={{ background: '#F5C344', padding: '88px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(26,26,26,0.06) 0 2px, transparent 2px 18px)', pointerEvents: 'none' }} />
        <div className="rsp-stack" style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <DataLabel color="#D9530F" style={{ display: 'block', marginBottom: 14 }}>FOR FIRE MARSHALS &amp; SAFETY CONSULTANTS</DataLabel>
            <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 18px', ...hwStyle({ fill: '#1A1A1A', shadow: '#D9530F' }) }}>
              Refer with confidence.
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 17, lineHeight: 1.6, color: '#1A1A1A', margin: '0 0 16px', maxWidth: 540 }}>
              You flag the violation. We deliver the fix — fast, documented, and code-compliant. When an NFPA 13 finding lands on a facility, your client gets engineered flue keepers and a signed install sign-off, not a catalog runaround.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'A direct line to engineering — no call trees',
                'Spec library mapped to NFPA 13, OSHA 1910.176, ANSI MH16.1',
                'Photo-evidenced remediation reports for your file',
                'Co-branded inspection sign-offs available on request',
              ].map((l) => (
                <li key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500 }}>
                  <Icon name="check" size={16} weight={600} style={{ color: '#D9530F' }} />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
            <Btn variant="primary" size="lg" onClick={() => onNav('contact', 'referrer')}>Start a Referral →</Btn>
          </div>
          <div style={{ background: '#1A1A1A', color: '#FFFFFF', padding: 28, borderTop: '4px solid #D9530F' }}>
            <DataLabel color="#F5C344" style={{ display: 'block', marginBottom: 12 }}>SPEC LIBRARY · NO LOGIN</DataLabel>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.55, color: '#C8C6C5', margin: '0 0 18px' }}>
              Sending a client to us? Point them at the calculator and the flue keeper catalog — both designed to be referenced in an audit, not gated behind a sales wall.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
              <a onClick={() => onNav('home', 'calculator')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(245,195,68,0.08)', border: '1px solid rgba(245,195,68,0.3)', color: '#F5C344', cursor: 'pointer', textDecoration: 'none', fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                <span><Icon name="calculate" size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />Flue Compliance Calculator</span>
                <span>→</span>
              </a>
              <a onClick={() => onNav('catalog', 'flue')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(245,195,68,0.08)', border: '1px solid rgba(245,195,68,0.3)', color: '#F5C344', cursor: 'pointer', textDecoration: 'none', fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                <span><Icon name="layers" size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />Flue Keeper Catalog</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="rsp-px rsp-py" style={{ background: '#2A2A2A', color: '#FFFFFF', padding: '96px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 'clamp(36px, 6vw, 56px)', lineHeight: 1, textTransform: 'uppercase', borderBottom: '2px solid #F5C344', paddingBottom: 18, margin: '0 0 36px', color: '#FFFFFF' }}>
            Frequently Asked Questions
          </h2>
          <div className="rsp-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 64px' }}>
            {RESOURCES_FAQS.map((f, i) => (
              <FAQItem key={f.q} theme="dark" q={f.q} a={f.a} initialOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const GuideCard = ({ cat, h, d, img, kind, cta, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: 'pointer' }}
    >
      <div style={{ aspectRatio: '4/3', background: '#2A2A2A', border: '2px solid #1A1A1A', overflow: 'hidden', marginBottom: 14, position: 'relative' }}>
        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: hover ? 'grayscale(0)' : 'grayscale(1)', transition: 'filter 500ms' }} />
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
        <Pill kind={kind}>{cat}</Pill>
      </div>
      <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 26, lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 8px' }}>{h}</h3>
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.55, color: '#4E4635', margin: '0 0 10px' }}>{d}</p>
      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: hover ? '#D9530F' : '#1A1A1A', transition: 'color 200ms' }}>{cta} →</span>
    </article>
  );
};

const GuideStrip = ({ cat, h, img, cta, last, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24, padding: '18px 0', borderBottom: last ? 0 : '1px solid #E2E2E2', alignItems: 'center', cursor: 'pointer' }}
    >
      <div style={{ aspectRatio: '4/3', background: '#2A2A2A', overflow: 'hidden', border: '2px solid #1A1A1A' }}>
        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: hover ? 'grayscale(0)' : 'grayscale(1)', transition: 'filter 400ms' }} />
      </div>
      <div>
        <Pill kind="orange-dark">{cat}</Pill>
        <h4 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 22, lineHeight: 0.95, textTransform: 'uppercase', margin: '8px 0 6px', color: hover ? '#D9530F' : '#1A1A1A', transition: 'color 200ms' }}>{h}</h4>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: hover ? '#D9530F' : '#4E4635' }}>{cta} →</span>
      </div>
    </article>
  );
};
