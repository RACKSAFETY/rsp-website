'use client';
import React from 'react';
import { Btn, Mega, DataLabel, Pill, CautionStripe, Icon, hwStyle, SectionHeader } from '../components';
import { SITE } from '../data/productCatalog';
import { useNav } from '../hooks/useNav';

// Caution intensity locked to "low": period 60.
const CAUTION = { period: 60 };

// Clearly-marked placeholder for unverified company narrative. Swap the body
// text (and remove the dashed treatment) once real copy is confirmed.
const Placeholder = ({ label, children }) => (
  <div style={{ border: '2px dashed #BD480C', background: 'rgba(217,83,15,0.06)', padding: 22 }}>
    <DataLabel color="#BD480C" size={10} style={{ display: 'block', marginBottom: 8 }}>⚑ {label}</DataLabel>
    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.6, color: '#4E4635', margin: 0 }}>{children}</p>
  </div>
);

export default function AboutScreen() {
  const onNav = useNav();
  return (
    <div className="rsp-fade-up">
      {/* HERO — light, matches the rest of the site */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#F9F9F9' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `repeating-linear-gradient(45deg, #F1C041 0 ${CAUTION.period / 2}px, #F9F9F9 ${CAUTION.period / 2}px ${CAUTION.period}px)`,
          opacity: 0.20,
        }} />
        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '96px 32px 88px' }}>
          <Pill kind="yellow" style={{ fontSize: 11, marginBottom: 24 }}>RACK &amp; FIRE PROTECTION SPECIALISTS</Pill>
          <h1 style={{
            fontFamily: "'Anton',sans-serif", fontWeight: 400,
            fontSize: 'clamp(64px, 9vw, 140px)', lineHeight: 0.86,
            textTransform: 'uppercase', margin: 0,
          }}>
            <span style={{ display: 'block', ...hwStyle({ fill: '#1A1A1A', shadow: '#F5C344' }) }}>About</span>
            <span style={{ display: 'block', ...hwStyle({ fill: '#D9530F', shadow: '#1A1A1A' }) }}>Rack Safety</span>
            <span style={{ display: 'block', ...hwStyle({ fill: '#1A1A1A', shadow: '#D9530F' }) }}>Products</span>
          </h1>
          <p style={{
            fontFamily: "'Inter',sans-serif", fontSize: 18, lineHeight: 1.6,
            color: '#1A1A1A', maxWidth: 600, margin: '32px 0 0',
            borderLeft: '3px solid #F5C344', paddingLeft: 18,
          }}>
            Engineered flue keepers, structural rack protection, and NFPA 13 spec support — from a team
            that's spent decades in the field helping safety managers ship compliant warehouses.
          </p>
        </div>
        <CautionStripe height={6} period={60} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
      </section>

      {/* WHAT WE DO — verified positioning */}
      <section style={{ padding: '96px 32px', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeader title="What We Do" right={<DataLabel color="#D9530F">PRODUCT-FIRST · ENGINEERING-LED</DataLabel>} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              ['shield', 'Flue Protection', "Engineered flue keepers and guards that maintain NFPA 13 transverse and longitudinal flue space, so sprinklers activate and perform as designed."],
              ['verified_user', 'Structural Rack Protection', 'Column guards, post protectors, and rack decking that keep uprights and inventory safe from forklift impact and overload.'],
              ['fact_check', 'Spec & Compliance Support', 'Hands-on NFPA 13, OSHA, and ANSI MH16.1 spec support from people who have spent decades specifying and installing in the field.'],
            ].map(([ic, h, d]) => (
              <div key={h} style={{ border: '2px solid #1A1A1A', padding: 28, background: '#F9F9F9' }}>
                <Icon name={ic} size={32} fill={1} style={{ color: '#D9530F' }} />
                <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 26, lineHeight: 0.95, textTransform: 'uppercase', margin: '14px 0 10px' }}>{h}</h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.6, color: '#4E4635', margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
        <CautionStripe height={6} period={60} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
      </section>

      {/* OUR STORY — scaffolded; placeholders for unverified narrative */}
      <section style={{ padding: '96px 32px', background: '#F9F9F9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
          <div>
            <DataLabel color="#D9530F" style={{ display: 'block', marginBottom: 14 }}>OUR STORY</DataLabel>
            <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 'clamp(40px, 4.4vw, 56px)', lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 18px', ...hwStyle({ fill: '#1A1A1A', shadow: '#D9530F' }) }}>
              Built In<br/>The Field
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, lineHeight: 1.65, color: '#4E4635', margin: 0, maxWidth: 520 }}>
              Rack Safety Products is an engineering-led, product-first supplier of warehouse rack and
              fire-protection components. We help safety managers, distributors, and OEM partners keep
              high-capacity storage compliant, durable, and inspection-ready.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Placeholder label="PLACEHOLDER · COMPANY HISTORY">
              Add the founding story — when and why Rack Safety Products started, and the milestones
              that shaped it. (Founding year is currently unverified / TODO.)
            </Placeholder>
            <Placeholder label="PLACEHOLDER · TEAM &amp; EXPERTISE">
              Introduce the team — leadership, field/engineering experience, and certifications that set
              your people apart.
            </Placeholder>
            <Placeholder label="PLACEHOLDER · BY THE NUMBERS">
              Add verified stats — years in business, SKUs, distribution centers served, typical lead
              time. (These are still TODO in the product data.)
            </Placeholder>
          </div>
        </div>
      </section>

      {/* STANDARDS — yellow hazard band */}
      <section style={{ background: '#F5C344', color: '#1A1A1A', padding: '96px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(26,26,26,0.05) 0 2px, transparent 2px 16px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
          <DataLabel color="#1A1A1A" style={{ display: 'block', marginBottom: 16 }}>STANDARDS WE BUILD TO</DataLabel>
          <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 'clamp(40px, 4.4vw, 56px)', lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 36px', ...hwStyle({ fill: '#1A1A1A', shadow: '#D9530F' }) }}>
            Compliance Is The Product
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#F5C344', border: '2px solid #1A1A1A' }}>
            {[
              ['NFPA 13', 'Fire sprinkler clearance', 'Transverse & longitudinal flue space for high-pile storage.'],
              ['OSHA 1910.176', 'Materials handling & storage', 'Safe stacking, clearance, and housekeeping requirements.'],
              ['ANSI MH16.1', 'Industrial steel storage racks', 'Structural design, capacity, and load-application standards.'],
            ].map(([code, name, desc]) => (
              <div key={code} style={{ background: '#FFFFFF', padding: '28px 24px' }}>
                <div style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 30, color: '#D9530F', lineHeight: 1, marginBottom: 10 }}>{code}</div>
                <DataLabel color="#807662" size={10} style={{ display: 'block', marginBottom: 10 }}>{name}</DataLabel>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.6, color: '#4E4635', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <CautionStripe height={6} period={60} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
      </section>

      {/* CONTACT + CTA */}
      <section style={{ padding: '96px 32px', background: '#F9F9F9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <div>
            <DataLabel color="#D9530F" style={{ display: 'block', marginBottom: 14 }}>GET IN TOUCH</DataLabel>
            <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 'clamp(40px, 4.4vw, 56px)', lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 28px', ...hwStyle({ fill: '#1A1A1A', shadow: '#D9530F' }) }}>
              Talk To A<br/>Specialist
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                ['place', 'HEADQUARTERS', ...SITE.address],
                ['call', 'COMPLIANCE DIRECT', SITE.phone],
                ['mail', 'ENGINEER SUPPORT', SITE.email],
                ['schedule', `HOURS (${SITE.timezone})`, SITE.hours],
              ].map((blk, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <Icon name={blk[0]} size={22} style={{ color: '#D9530F', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <DataLabel color="#807662" size={10} style={{ display: 'block', marginBottom: 4 }}>{blk[1]}</DataLabel>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.5, color: '#1A1A1A', fontWeight: blk[1].includes('DIRECT') ? 700 : 400 }}>
                      {blk.slice(2).map((l, j) => <div key={j}>{l}</div>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#1A1A1A', color: '#FFFFFF', padding: 40, borderTop: '4px solid #F5C344' }}>
            <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 34, lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 14px', color: '#FFFFFF' }}>
              Need a Quote?
            </h3>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, lineHeight: 1.6, color: '#C8C6C5', margin: '0 0 28px' }}>
              Send us your warehouse layout and rack configuration. Our engineering team returns exact
              specifications within 24 hours, Monday through Friday.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Mega variant="yellow" onClick={() => onNav('contact')}>Request a Quote →</Mega>
              <Mega variant="outline-dark" onClick={() => onNav('catalog')} style={{ borderColor: '#F5C344', color: '#F5C344' }}>View Catalog</Mega>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
