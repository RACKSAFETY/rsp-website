'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Btn, Mega, DataLabel, Pill, CautionStripe, Icon, hwStyle, FAQItem, SectionHeader,
} from '../components';
import ComplianceCalculator from '../components/ComplianceCalculator';
import { SERVICES, SITE } from '../data/productCatalog';
import { useNav } from '../hooks/useNav';

// Caution intensity is locked to "low" per design decision.
const CAUTION = { opacity: 0.10, bandH: 6, period: 60 };

// Reads the ?section deep-link param and scrolls to it. Isolated in its own Suspense
// boundary so useSearchParams doesn't force the whole homepage to client-render (SSR).
function SectionScroller() {
  const section = useSearchParams().get('section');
  useEffect(() => {
    if (section) document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [section]);
  return null;
}

export default function HomeScreen() {
  const onNav = useNav();

  return (
    <div className="rsp-fade-up">
      <Suspense fallback={null}><SectionScroller /></Suspense>
      <HeroCaution onNav={onNav} />

      {/* FEATURED SOLUTIONS — Bento */}
      <section className="rsp-px rsp-py" style={{ padding: '120px 32px', background: '#F9F9F9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeader
            title="Featured Solutions"
            right={<a onClick={() => onNav('catalog')} style={{ cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1A1A1A', textDecorationThickness: 2 }}>See All Solutions →</a>}
          />
          <div className="rsp-stack" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            <BigBentoCard onNav={onNav} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <SmallBentoCard
                tag="BEST VALUE"
                tagColor="#D9530F"
                title="Rack Decking"
                desc="Wire mesh and solid steel decking solutions for all load types."
                icon="grid_view"
                onClick={() => onNav('product', 'pro-deck-50')}
              />
              <SmallBentoCard
                tag="NEW ARRIVAL"
                tagColor="#F5C344"
                title="Column Guards"
                desc="Protect your uprights from forklift impact with heavy-duty guards."
                icon="verified_user"
                variant="dark"
                onClick={() => onNav('product', 'column-guards')}
              />
            </div>
          </div>
        </div>
      </section>

      <ServicesSection onNav={onNav} />

      <div id="calculator" style={{ scrollMarginTop: 80 }}>
        <ComplianceCalculator />
      </div>

      <WhyRSPPillars />

      {/* EDITOR'S PICKS */}
      <section className="rsp-px rsp-py" style={{ padding: '120px 32px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 56, lineHeight: 1, textTransform: 'uppercase', margin: 0 }}>From the Field</h2>
            <div style={{ flex: 1, height: 4, background: '#1A1A1A' }}></div>
            <DataLabel color="#D9530F">UPDATED OCT 2026</DataLabel>
          </div>
          <div className="rsp-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 48 }}>
            <article
              onClick={() => onNav('resources')}
              style={{ borderRight: '2px solid #E2E2E2', paddingRight: 32, cursor: 'pointer' }}
            >
              <div style={{ aspectRatio: '3/4', border: '2px solid #1A1A1A', overflow: 'hidden', position: 'relative', marginBottom: 14, background: '#2A2A2A' }}>
                <img src="/assets/imagery/inspection-editorial.svg" alt="Warehouse inspector reviewing rack plans"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)', transition: 'filter 500ms' }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = 'grayscale(0)')}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = 'grayscale(1)')}
                />
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <Pill kind="red">SAFETY ALERT</Pill>
                </div>
              </div>
              <DataLabel color="#D9530F" style={{ marginBottom: 10, display: 'block' }}>SAFETY AUDIT · MARCH 24, 2026</DataLabel>
              <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 32, lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 12px' }}>The Hidden Cost of Rack Mismanagement</h3>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.6, color: '#4E4635', margin: 0 }}>
                Why "good enough" safety is actually costing your distribution center thousands in annual insurance premiums.
              </p>
            </article>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {[
                ['NFPA 13: What Every Safety Manager Needs to Know', 'STANDARDS UPDATE', 'MARCH 20, 2026', 'Navigating the complexities of fire sprinkler clearance in high-pile storage environments.', 'flue-guard.svg'],
                ['Seismic Safety: Beyond the Anchor Bolt', 'COMPLIANCE UPDATE', 'MARCH 12, 2026', 'New regulations for rack systems in high-activity seismic zones across the West Coast.', 'post-protector.svg'],
                ['Rack Decking: Mesh vs. Solid Steel', 'PROCUREMENT GUIDE', 'FEBRUARY 29, 2026', 'The definitive performance guide for selecting the right shelf surface for your specific load types.', 'wire-decking.svg'],
              ].map(([h, cat, dt, d, img], i) => (
                <article
                  key={i}
                  className="rsp-stack"
                  onClick={() => onNav('resources')}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, paddingBottom: 28, borderBottom: i < 2 ? '1px solid #E2E2E2' : 0, cursor: 'pointer' }}
                >
                  <div style={{ aspectRatio: '16/10', background: '#2A2A2A', border: '2px solid #1A1A1A', overflow: 'hidden' }}>
                    <img src={`/assets/products/${img}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)', transition: 'filter 400ms' }}
                      onMouseEnter={(e) => (e.currentTarget.style.filter = 'grayscale(0)')}
                      onMouseLeave={(e) => (e.currentTarget.style.filter = 'grayscale(1)')}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 6 }}>
                      <DataLabel color="#D9530F" size={10}>{cat}</DataLabel>
                      <DataLabel color="rgba(26,26,26,0.5)" size={10}>{dt}</DataLabel>
                    </div>
                    <h4 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 26, lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 8px' }}>{h}</h4>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.6, color: '#4E4635', margin: 0 }}>{d}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — Yellow flood */}
      <section className="rsp-px rsp-py" style={{ background: '#F5C344', padding: '120px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(26,26,26,0.05) 0 2px, transparent 2px 16px)', pointerEvents: 'none' }}></div>
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 64, lineHeight: 1, textTransform: 'uppercase', textAlign: 'center', margin: '0 0 56px', ...hwStyle({ fill: '#1A1A1A', shadow: '#D9530F' }) }}>
            Frequently Asked Questions
          </h2>
          <div className="rsp-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 56px' }}>
            <FAQItem
              q="What safety standards do you follow?"
              a="All products are engineered to meet or exceed NFPA 13 fire safety clearance, OSHA 1910.176 storage requirements, and ANSI MH16.1 structural standards. Compliance certificates ship with every order."
              theme="yellow" separator="heavy" initialOpen={true}
            />
            <FAQItem
              q="When will I get my quote?"
              a="We review every request quickly and follow up with a detailed quote. Flag an active safety violation in your notes and we'll prioritize it."
              theme="yellow" separator="heavy"
            />
            <FAQItem
              q="Am I a good candidate for flue guards?"
              a="If your warehouse stores Class III+ commodities in racks taller than 12 feet, NFPA 13 requires maintained transverse and longitudinal flue space. Flue guards are the standard physical solution."
              theme="yellow" separator="heavy"
            />
            <FAQItem
              q="What documents are required for audit?"
              a="A current rack engineering drawing, your facility's commodity classification, the most recent insurance inspection report, and any prior damage logs from your safety manager."
              theme="yellow" separator="heavy"
            />
          </div>
        </div>
      </section>

      {/* CTA — Charcoal closer */}
      <section className="rsp-px rsp-py" style={{ background: '#1A1A1A', color: '#FFFFFF', padding: '120px 32px', position: 'relative', overflow: 'hidden' }}>
        <CautionStripe height={6} opacity={0.5} period={32} style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
        <CautionStripe height={6} opacity={0.5} period={32} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
        <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <DataLabel color="#F5C344" style={{ display: 'block', marginBottom: 24 }}>NEXT STEP</DataLabel>
          <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 64, lineHeight: 1, textTransform: 'uppercase', margin: '0 0 24px', ...hwStyle({ fill: '#FFFFFF', shadow: '#D9530F' }) }}>
            Ready to upgrade your warehouse?
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, lineHeight: 1.6, color: '#C8C6C5', maxWidth: 640, margin: '0 auto 48px' }}>
            Download our 2026 Product Catalog and see how Rack Safety Products can protect your investment and your people.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Mega variant="orange" onClick={() => onNav('catalog')}>Download Catalog</Mega>
            <Mega variant="dark" onClick={() => onNav('contact')} style={{ background: 'transparent', color: '#F5C344', border: '3px solid #F5C344', padding: '15px 37px' }}>Get a Quote →</Mega>
          </div>
        </div>
      </section>
    </div>
  );
}

// Pushed: full-bleed caution-tape band behind a massive Anton wall-of-text.
const HeroCaution = ({ onNav }) => (
  <section style={{ position: 'relative', overflow: 'hidden', background: '#F9F9F9' }}>
    <div style={{
      position: 'absolute', inset: 0,
      background: `repeating-linear-gradient(45deg, #F1C041 0 ${CAUTION.period / 2}px, #F9F9F9 ${CAUTION.period / 2}px ${CAUTION.period}px)`,
      opacity: 0.20,
    }} />
    <CautionStripe height={CAUTION.bandH} period={CAUTION.period} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />

    <div className="rsp-px rsp-py" style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '120px 32px 96px' }}>
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
        <Pill kind="yellow" style={{ fontSize: 11 }}>RACK &amp; FIRE PROTECTION SPECIALISTS</Pill>
        <DataLabel color="#1A1A1A" size={10}>OSHA · NFPA 13 · ANSI MH16.1</DataLabel>
      </div>
      <h1 style={{
        fontFamily: "'Anton',sans-serif", fontWeight: 400,
        fontSize: 'clamp(40px, 11vw, 168px)', lineHeight: 0.86, letterSpacing: '0.005em',
        textTransform: 'uppercase', margin: '32px 0 32px',
      }}>
        <span style={{ display: 'block', ...hwStyle({ fill: '#1A1A1A', shadow: '#F5C344' }) }}>Rack &amp; Fire</span>
        <span style={{ display: 'block', ...hwStyle({ fill: '#D9530F', shadow: '#1A1A1A' }) }}>Protection</span>
        <span style={{ display: 'block', ...hwStyle({ fill: '#1A1A1A', shadow: '#D9530F' }) }}>Specialists</span>
      </h1>
      <div className="rsp-stack" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64, alignItems: 'flex-end' }}>
        <div>
          <p style={{
            fontFamily: "'Inter',sans-serif", fontSize: 18, lineHeight: 1.6,
            color: '#1A1A1A', maxWidth: 580, margin: 0,
            borderLeft: '3px solid #F5C344', paddingLeft: 18,
          }}>
            Engineered flue keepers, structural rack protection, and NFPA 13 spec support — from a team that's spent decades in the field. We help safety managers ship compliant warehouses, faster.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
            <Mega variant="yellow" onClick={() => onNav('catalog')}>View Catalog</Mega>
            <Mega variant="outline-dark" onClick={() => onNav('resources')} style={{ borderColor: '#1A1A1A', color: '#1A1A1A' }}>Safety Guides</Mega>
          </div>
        </div>
        <div className="rsp-stack-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#F5C344', border: '2px solid #F5C344' }}>
          {SITE.stats.filter(([, v]) => v && v !== 'TODO').map(([k, v]) => (
            <div key={k} style={{ background: '#1A1A1A', padding: '18px 20px' }}>
              <DataLabel color="rgba(245,195,68,0.6)" size={9}>{k}</DataLabel>
              <div style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 36, color: '#F5C344', lineHeight: 1, marginTop: 6 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const BigBentoCard = ({ onNav }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={() => onNav('product', 'flue-guard')}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="rsp-bento"
      style={{
        background: '#1A1A1A', color: '#FFFFFF', position: 'relative', border: '2px solid #1A1A1A',
        display: 'flex', cursor: 'pointer', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 16, right: 16, background: '#F5C344', color: '#1A1A1A', padding: '4px 12px', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', zIndex: 2 }}>SAFETY PICK</div>
      <div className="rsp-bento-half" style={{ width: '52%', padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 44, lineHeight: 0.95, textTransform: 'uppercase', color: '#FFFFFF', textShadow: '4px 4px 0 #D9530F', margin: '0 0 16px' }}>Flue Guard™ Systems</h3>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, lineHeight: 1.55, color: '#C8C6C5', margin: 0, maxWidth: 360 }}>
            Maintain critical fire safety spacing in your rack systems. Prevents pallets from encroaching on essential flue space.
          </p>
          <div className="rsp-stack-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 28, paddingTop: 18, borderTop: '1px solid rgba(245,195,68,0.3)' }}>
            <div><DataLabel color="rgba(245,195,68,0.6)" size={9}>STANDARD</DataLabel><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: '#F5C344', marginTop: 4 }}>NFPA 13</div></div>
            <div><DataLabel color="rgba(245,195,68,0.6)" size={9}>OFFSETS</DataLabel><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: '#F5C344', marginTop: 4 }}>3″ – 12″</div></div>
          </div>
        </div>
        <Btn variant="orange" style={{ alignSelf: 'flex-start', marginTop: 24 }}>Request a Quote →</Btn>
      </div>
      <div className="rsp-bento-half rsp-bento-img" style={{ width: '48%', overflow: 'hidden', background: '#2A2A2A', position: 'relative' }}>
        <img src="/assets/products/photos/flue-guard.jpg" alt="Flue Guard pallet rack flue space divider installed on a rack" style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transition: 'transform 500ms cubic-bezier(.4,0,.2,1), filter 500ms',
          transform: hover ? 'scale(1.04)' : 'scale(1)',
          filter: hover ? 'grayscale(0)' : 'grayscale(0.7)',
        }} />
      </div>
    </div>
  );
};

const SmallBentoCard = ({ tag, tagColor, title, desc, icon, variant = 'light', onClick }) => {
  const [hover, setHover] = useState(false);
  const isDark = variant === 'dark';
  const base = isDark
    ? { background: '#5F5E5E', color: '#FFFFFF' }
    : { background: '#FFFFFF', color: '#1A1A1A' };
  const hov = isDark
    ? { background: '#BD480C', color: '#FFFFFF' }
    : { background: '#F5C344', color: '#1A1A1A' };
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="rsp-card-hover"
      style={{
        ...((hover) ? hov : base),
        border: '2px solid #1A1A1A', padding: 24,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        flex: 1, cursor: 'pointer', minHeight: 200,
      }}
    >
      <div>
        <DataLabel color={tagColor} size={11} style={{ marginBottom: 8, display: 'block' }}>{tag}</DataLabel>
        <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 32, lineHeight: 1, textTransform: 'uppercase', margin: '0 0 8px', color: 'inherit' }}>{title}</h3>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.5, opacity: isDark ? 0.85 : 0.7, margin: 0, color: 'inherit' }}>{desc}</p>
      </div>
      <Icon name={icon} size={36} fill={variant === 'dark' ? 1 : 0} style={{ alignSelf: 'flex-end', marginTop: 16, color: 'inherit' }} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Services — product-first-with-services-upsell (positioning doc, §3).
// The six real service lines live in src/data/productCatalog.js (SERVICES);
// tiles route to the prefilled contact form, the section link to the Services hub.
// ─────────────────────────────────────────────────────────────────────────────
const ServicesSection = ({ onNav }) => {
  // Single-row horizontal slider so the six service tiles never wrap into an
  // uneven second row. Native swipe on touch; arrow buttons drive it on desktop.
  const scroller = useRef<HTMLDivElement>(null);
  const nudge = (dir) => scroller.current && scroller.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
  const arrowStyle = {
    width: 46, height: 46, border: '2px solid #1A1A1A', background: '#FFFFFF', color: '#1A1A1A',
    cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 0,
    transition: 'background 200ms, color 200ms',
  };
  const hov = (e, on) => { e.currentTarget.style.background = on ? '#1A1A1A' : '#FFFFFF'; e.currentTarget.style.color = on ? '#F5C344' : '#1A1A1A'; };
  return (
    <section className="rsp-px rsp-py" style={{ padding: '120px 32px', background: '#F3F3F3', borderTop: '2px solid #1A1A1A', borderBottom: '2px solid #1A1A1A' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionHeader
          eyebrow="SERVICES · PRODUCT-FIRST, ENGINEERING-LED"
          title="Beyond the Box"
          right={<a onClick={() => onNav('services')} style={{ cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1A1A1A', textDecorationThickness: 2 }}>All Services →</a>}
        />
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 17, lineHeight: 1.6, color: '#1A1A1A', maxWidth: 720, margin: '0 0 40px' }}>
          We're a product company first — but on every meaningful project, our customers want the people who specified the gear to also help land it. From tear downs to re-engineering, our service lines cover the full life of your rack system.
        </p>
        <div ref={scroller} className="rsp-hscroll" style={{ display: 'flex', gap: 20, overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: 4 }}>
          {SERVICES.map((s) => <ServiceTile key={s.slug} {...s} onNav={onNav} />)}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
          <button aria-label="Previous services" style={arrowStyle} onMouseEnter={(e) => hov(e, true)} onMouseLeave={(e) => hov(e, false)} onClick={() => nudge(-1)}>←</button>
          <button aria-label="Next services" style={arrowStyle} onMouseEnter={(e) => hov(e, true)} onMouseLeave={(e) => hov(e, false)} onClick={() => nudge(1)}>→</button>
        </div>
      </div>
    </section>
  );
};

const ServiceTile = ({ slug, icon, title, desc, cta, onNav }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={() => onNav('contact', slug)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="rsp-card-hover rsp-slide-card"
      style={{
        background: hover ? '#1A1A1A' : '#FFFFFF',
        color: hover ? '#FFFFFF' : '#1A1A1A',
        border: '2px solid #1A1A1A',
        padding: 28,
        display: 'flex', flexDirection: 'column', gap: 14,
        cursor: 'pointer',
        minHeight: 280,
        flex: '0 0 300px', scrollSnapAlign: 'start',
      }}
    >
      <Icon name={icon} size={32} fill={hover ? 1 : 0} style={{ color: hover ? '#F5C344' : '#D9530F' }} />
      <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 30, lineHeight: 0.95, textTransform: 'uppercase', margin: 0, color: 'inherit' }}>{title}</h3>
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.55, margin: 0, color: 'inherit', opacity: hover ? 0.9 : 0.78, flex: 1 }}>{desc}</p>
      <div style={{
        marginTop: 4, paddingTop: 12, borderTop: `1px solid ${hover ? 'rgba(245,195,68,0.4)' : 'rgba(26,26,26,0.15)'}`,
        fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: hover ? '#F5C344' : '#D9530F',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>{cta}</span>
        <span>→</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Why RSP — four unfair-advantage pillars (positioning doc, §4)
// ─────────────────────────────────────────────────────────────────────────────
const PILLARS = [
  {
    n: '01',
    title: 'Industry Experience',
    desc: 'Decades inside warehouses, distribution centers, and 3PLs. We know which racks fail, which inspectors look hardest, and which compliance shortcuts catch up with you.',
  },
  {
    n: '02',
    title: 'Engineering Knowledge',
    desc: 'Every spec we recommend is grounded in NFPA, OSHA, and ANSI standards — not catalog copy. When you ask "why this size flue keeper?" you get the actual answer.',
  },
  {
    n: '03',
    title: 'Supplier Relationships',
    desc: "We've spent years building relationships with the manufacturers who actually build this gear. That means real lead times, real custom sourcing, and real accountability.",
  },
  {
    n: '04',
    title: 'Niche Expertise',
    desc: 'Rack fire and structural safety is what we do — not a side bin in a general warehouse-supply catalog. You get specialists, not order-takers.',
  },
];

const WhyRSPPillars = () => (
  <section className="rsp-px rsp-py" style={{ padding: '120px 32px', background: '#FFFFFF' }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <SectionHeader
        eyebrow="WHY RACK SAFETY PRODUCTS"
        title="The Unfair Advantage"
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 0, border: '2px solid #1A1A1A' }}>
        {PILLARS.map((p, i) => (
          <div key={p.n} style={{
            padding: 28,
            borderRight: i < PILLARS.length - 1 ? '1px solid #1A1A1A' : 0,
            background: i % 2 === 0 ? '#FFFFFF' : '#F9F9F9',
            display: 'flex', flexDirection: 'column', gap: 12,
            minHeight: 260,
          }}>
            <DataLabel color="#D9530F" size={11}>{p.n}</DataLabel>
            <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 28, lineHeight: 0.95, textTransform: 'uppercase', margin: 0 }}>{p.title}</h3>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.6, color: '#4E4635', margin: 0 }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
