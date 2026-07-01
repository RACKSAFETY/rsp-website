import React from 'react';
import Link from 'next/link';
import { DataLabel, CautionStripe } from '../components';

// ─────────────────────────────────────────────────────────────────────────────
// LegalDoc — shared, server-rendered layout for the Privacy Policy and Terms of
// Service pages. Content is passed in as plain data (no interactivity), so these
// pages prerender as static HTML and stay easy to keep in sync.
// ─────────────────────────────────────────────────────────────────────────────
export type LegalBlock = { p: string } | { ul: string[] } | { lines: string[] };
export type LegalSection = { heading: string; blocks: LegalBlock[] };

const leadStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif", fontSize: 18, lineHeight: 1.65, color: '#1A1A1A',
  fontWeight: 500, margin: '0 0 16px',
};
const h2Style: React.CSSProperties = {
  fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 'clamp(22px, 3vw, 28px)',
  lineHeight: 1.05, textTransform: 'uppercase', color: '#1A1A1A',
  borderBottom: '2px solid #F5C344', paddingBottom: 8, margin: '0 0 16px',
};
const bodyStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif", fontSize: 15.5, lineHeight: 1.75, color: '#4E4635', margin: '0 0 14px',
};
const liStyle: React.CSSProperties = {
  fontFamily: "'Inter',sans-serif", fontSize: 15.5, lineHeight: 1.7, color: '#4E4635', marginBottom: 8,
};

export default function LegalDoc({
  kicker, title, updated, intro, sections, contactCta = true,
}: {
  kicker: string;
  title: string;
  updated: string;
  intro: string[];
  sections: LegalSection[];
  contactCta?: boolean;
}) {
  return (
    <div className="rsp-fade-up">
      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#F9F9F9' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(45deg, #F1C041 0 30px, #F9F9F9 30px 60px)',
          opacity: 0.20,
        }} />
        <div className="rsp-px rsp-py" style={{ position: 'relative', maxWidth: 900, margin: '0 auto', padding: '88px 32px 72px' }}>
          <DataLabel color="#D9530F" style={{ display: 'block', marginBottom: 16 }}>{kicker}</DataLabel>
          <h1 style={{
            fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 'clamp(40px, 8vw, 96px)',
            lineHeight: 0.9, textTransform: 'uppercase', margin: 0, color: '#1A1A1A',
          }}>{title}</h1>
          <DataLabel color="rgba(26,26,26,0.5)" size={11} style={{ display: 'block', marginTop: 20 }}>
            LAST UPDATED · {updated}
          </DataLabel>
        </div>
        <CautionStripe height={6} period={60} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
      </section>

      {/* BODY */}
      <section className="rsp-px rsp-py" style={{ background: '#FFFFFF', padding: '72px 32px 96px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {intro.map((t, i) => <p key={`intro-${i}`} style={leadStyle}>{t}</p>)}

          {sections.map((s) => (
            <div key={s.heading} style={{ marginTop: 44 }}>
              <h2 style={h2Style}>{s.heading}</h2>
              {s.blocks.map((b, i) => {
                if ('p' in b) return <p key={i} style={bodyStyle}>{b.p}</p>;
                if ('ul' in b) return (
                  <ul key={i} style={{ margin: '0 0 14px', paddingLeft: 22 }}>
                    {b.ul.map((li, j) => <li key={j} style={liStyle}>{li}</li>)}
                  </ul>
                );
                return (
                  <div key={i} style={{ margin: '4px 0 0' }}>
                    {b.lines.map((l, j) => (
                      <div key={j} style={{
                        fontFamily: "'Inter',sans-serif", fontSize: 15.5, lineHeight: 1.9,
                        color: '#1A1A1A', fontWeight: j === 0 ? 700 : 500,
                      }}>{l}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}

          {contactCta && (
            <div style={{
              marginTop: 56, paddingTop: 28, borderTop: '2px solid #1A1A1A',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap',
            }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: '#4E4635' }}>
                Questions about this page or a quote?
              </span>
              <Link href="/contact" style={{
                fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.16em',
                textTransform: 'uppercase', color: '#D9530F', textDecoration: 'none',
              }}>Get in touch →</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
