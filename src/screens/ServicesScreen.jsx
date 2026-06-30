import React, { useState } from 'react';
import {
  Mega, DataLabel, Pill, CautionStripe, Icon, hwStyle, SectionHeader,
} from '../components.jsx';
import { SERVICES } from '../data/productCatalog.js';

// Caution intensity locked to "low" per design decision.
const CAUTION = { opacity: 0.10, bandH: 6, period: 60 };

export default function ServicesScreen({ onNav }) {
  return (
    <div className="rsp-fade-up">
      {/* HERO — charcoal caution band */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#F9F9F9' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `repeating-linear-gradient(45deg, #F1C041 0 ${CAUTION.period / 2}px, #F9F9F9 ${CAUTION.period / 2}px ${CAUTION.period}px)`,
          opacity: 0.20,
        }} />
        <CautionStripe height={CAUTION.bandH} period={CAUTION.period} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />

        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '96px 32px 88px' }}>
          <Pill kind="yellow" style={{ fontSize: 11, marginBottom: 24 }}>PRODUCT-FIRST, ENGINEERING-LED</Pill>
          <h1 style={{
            fontFamily: "'Anton',sans-serif", fontWeight: 400,
            fontSize: 'clamp(64px, 9vw, 140px)', lineHeight: 0.86,
            textTransform: 'uppercase', margin: 0,
          }}>
            <span style={{ display: 'block', ...hwStyle({ fill: '#1A1A1A', shadow: '#F5C344' }) }}>Warehouse</span>
            <span style={{ display: 'block', ...hwStyle({ fill: '#D9530F', shadow: '#1A1A1A' }) }}>Safety Services</span>
          </h1>
          <p style={{
            fontFamily: "'Inter',sans-serif", fontSize: 18, lineHeight: 1.6,
            color: '#1A1A1A', maxWidth: 580, margin: '32px 0 0',
            borderLeft: '3px solid #F5C344', paddingLeft: 18,
          }}>
            Beyond the box: tear downs, audits, installation, repairs, re-engineering, and used-rack
            sourcing. The people who spec your gear also help you land it — safely and on time.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
            <Mega variant="yellow" onClick={() => onNav('contact')}>Request a Service</Mega>
            <Mega variant="outline-dark" onClick={() => onNav('catalog')} style={{ borderColor: '#1A1A1A', color: '#1A1A1A' }}>View Catalog</Mega>
          </div>
        </div>
      </section>

      {/* SERVICE GRID */}
      <section style={{ padding: '120px 32px', background: '#F3F3F3' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionHeader
            eyebrow="SERVICES"
            title="What We Do"
            right={<a onClick={() => onNav('contact')} style={{ cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1A1A1A', textDecorationThickness: 2 }}>Talk to Us →</a>}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {SERVICES.map((s) => <ServiceCard key={s.slug} {...s} onNav={onNav} />)}
          </div>
        </div>
      </section>

      {/* CTA CLOSER */}
      <section style={{ background: '#1A1A1A', color: '#FFFFFF', padding: '120px 32px', position: 'relative', overflow: 'hidden' }}>
        <CautionStripe height={6} opacity={0.5} period={32} style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
        <CautionStripe height={6} opacity={0.5} period={32} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
        <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <DataLabel color="#F5C344" style={{ display: 'block', marginBottom: 24 }}>NEXT STEP</DataLabel>
          <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 64, lineHeight: 1, textTransform: 'uppercase', margin: '0 0 24px', ...hwStyle({ fill: '#FFFFFF', shadow: '#D9530F' }) }}>
            Have a project in mind?
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, lineHeight: 1.6, color: '#C8C6C5', maxWidth: 640, margin: '0 auto 48px' }}>
            Tell us about your site and what you need done. We'll route you to the right person and
            scope it out — no call trees, no runaround.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Mega variant="orange" onClick={() => onNav('contact')}>Get in Touch →</Mega>
          </div>
        </div>
      </section>
    </div>
  );
}

const ServiceCard = ({ slug, icon, title, desc, cta, onNav }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={() => onNav('contact', slug)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="rsp-card-hover"
      style={{
        background: hover ? '#1A1A1A' : '#FFFFFF',
        color: hover ? '#FFFFFF' : '#1A1A1A',
        border: '2px solid #1A1A1A',
        padding: 28,
        display: 'flex', flexDirection: 'column', gap: 14,
        cursor: 'pointer',
        minHeight: 280,
      }}
    >
      <Icon name={icon} size={32} fill={hover ? 1 : 0} style={{ color: hover ? '#F5C344' : '#D9530F' }} />
      <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 28, lineHeight: 0.95, textTransform: 'uppercase', margin: 0, color: 'inherit' }}>{title}</h3>
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
