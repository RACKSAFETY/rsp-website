'use client';
import React, { useState } from 'react';
import {
  Btn, DataLabel, Pill, CautionStripe, Icon, hwStyle, FAQItem, SectionHeader,
} from '../components';
import { useNav } from '../hooks/useNav';

// Caution intensity locked to "low" — bg opacity 0.08 / 0.18 ≈ 0.44.
const CAUTION_BG_OPACITY = 0.08 / 0.18;

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
            <DataLabel color="#1A1A1A" style={{ display: 'block', marginBottom: 16 }}>EDITORIAL · UPDATED WEEKLY</DataLabel>
            <h1 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 'clamp(34px, 7.5vw, 112px)', lineHeight: 0.9, textTransform: 'uppercase', margin: 0, ...hwStyle({ fill: '#1A1A1A', shadow: '#D9530F' }) }}>
              Safety<br/>Resources
            </h1>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, lineHeight: 1.6, color: '#1A1A1A', maxWidth: 480, marginTop: 24 }}>
              The industry's most comprehensive database for warehouse compliance, rack maintenance, and operator safety standards.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 32 }}>
              <Btn variant="yellow" size="lg">Start 101 Guide</Btn>
              <Btn variant="outline" size="lg">Reliability Index</Btn>
            </div>
          </div>
          <div style={{ border: '12px solid #F5C344', aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
            <img src="/assets/imagery/warehouse-hero.svg" alt="Warehouse aisles with installed rack safety" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, background: '#1A1A1A', color: '#F5C344', padding: '6px 12px', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.2em' }}>FIELD PHOTO · IL</div>
          </div>
        </div>
        <CautionStripe height={6} period={60} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
      </section>

      <section className="rsp-px rsp-py" style={{ padding: '96px 32px', background: '#F9F9F9' }}>
        <div className="rsp-stack" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48 }}>
          <div>
            <SectionHeader title="From the Field" right={<DataLabel color="#D9530F">UPDATED OCT 2026</DataLabel>} />
            <div className="rsp-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
              {[
                ['OSHA GUIDE', 'APRIL 12, 2026', 'Why "Rack Guarding" Is No Longer Optional', 'New 2026 regulations mandate physical barriers for all high-traffic aisle end-frames. Here\'s how to retrofit.', 'flue-guard.svg', 'yellow'],
                ['CASE STUDY', 'MARCH 28, 2026', 'The $50K Critical Failure: A Lesson in Bolt Torque', 'How a mid-sized logistics hub avoided disaster by implementing a 30-day structural inspection.', 'post-protector.svg', 'orange'],
              ].map(([cat, dt, h, d, img, kind], i) => (
                <ArticleCard key={i} cat={cat} dt={dt} h={h} d={d} img={`/assets/products/${img}`} kind={kind} onClick={() => onNav('resources')} />
              ))}
            </div>
            {[
              ['STANDARDS UPDATE', 'The Flue Guard Revolution: Smoke Ventilation Data', 'inspection-editorial.svg'],
              ['PROCUREMENT GUIDE', 'Solid vs. Wire Decking: The Ultimate Cost Analysis', 'wire-decking.svg'],
              ['INSTALL HOW-TO', 'Anchor Patterns for Seismic Zones C, D & E', 'rack-decking.svg'],
            ].map(([cat, h, img], i) => (
              <ArticleStrip key={i} cat={cat} h={h} img={`/assets/${img.includes('editorial') ? 'imagery' : 'products'}/${img}`} last={i === 2} />
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
              <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 26, textTransform: 'uppercase', margin: '0 0 14px' }}>Safety 101</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[['check_circle', 'Core Compliance Checklist'], ['warning', 'Damage Assessment Guide'], ['description', 'Annual Audit Templates'], ['fact_check', 'Audit Sign-Off Forms']].map(([ic, t]) => (
                  <a key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#1A1A1A', textDecoration: 'none', fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', padding: '6px 0', borderBottom: '1px solid #E2E2E2', transition: 'color 200ms' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#D9530F')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#1A1A1A')}
                  >
                    <Icon name={ic} size={20} /><span>{t}</span><Icon name="arrow_forward" size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* FIRE-PRO REFERRAL — courts fire marshals & safety consultants per positioning doc §5 */}
      <section className="rsp-px rsp-py" style={{ background: '#F5C344', padding: '72px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(26,26,26,0.05) 0 2px, transparent 2px 16px)', pointerEvents: 'none' }}></div>
        <div className="rsp-stack" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 48, alignItems: 'center', position: 'relative' }}>
          <div>
            <DataLabel color="#1A1A1A" style={{ display: 'block', marginBottom: 14 }}>FOR FIRE MARSHALS &amp; SAFETY CONSULTANTS</DataLabel>
            <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 'clamp(40px, 4.4vw, 56px)', lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 14px', ...hwStyle({ fill: '#1A1A1A', shadow: '#D9530F' }) }}>
              Refer Your Clients Here
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, lineHeight: 1.6, color: '#1A1A1A', maxWidth: 560, margin: 0 }}>
              Flagged a flue space violation or rack damage on an inspection? Point your client at our spec library — we'll turn your write-up into a purchase-ready quote and loop you in on the engineering review.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Btn variant="primary" size="lg" onClick={() => onNav('contact', 'referrer')} style={{ justifyContent: 'center' }}>Start a Referral →</Btn>
            <Btn variant="outline" size="lg" onClick={() => onNav('catalog', 'flue')} style={{ justifyContent: 'center' }}>Browse Spec Library</Btn>
          </div>
        </div>
      </section>

      <section className="rsp-px rsp-py" style={{ background: '#1A1A1A', color: '#FFFFFF', padding: '96px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <CautionStripe height={4} period={24} opacity={0.7} style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
        <CautionStripe height={4} period={24} opacity={0.7} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
        <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative' }}>
          <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 84, lineHeight: 1, textTransform: 'uppercase', margin: '0 0 24px', ...hwStyle({ fill: '#F5C344', shadow: '#D9530F' }) }}>
            What is rack safety?
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 18, lineHeight: 1.6, color: '#C8C6C5', maxWidth: 640, margin: '0 auto 36px' }}>
            We are a community-powered resource dedicated to warehouse safety and industrial financial literacy. We bring together managers on our forum, share tips, and host the industry's most powerful safety calculator.
          </p>
          <Btn variant="orange" size="lg" style={{ padding: '18px 36px' }}>Join the Conversation</Btn>
        </div>
      </section>

      {/* Fire Marshal / Safety Consultant referral block — primary acquisition channel per positions doc §5 */}
      <section className="rsp-px rsp-py" style={{ background: '#F5C344', padding: '88px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(26,26,26,0.06) 0 2px, transparent 2px 18px)', pointerEvents: 'none' }} />
        <div className="rsp-stack" style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <DataLabel color="#D9530F" style={{ display: 'block', marginBottom: 14 }}>FOR FIRE MARSHALS &amp; SAFETY CONSULTANTS</DataLabel>
            <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 56, lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 18px', ...hwStyle({ fill: '#1A1A1A', shadow: '#D9530F' }) }}>
              Refer with confidence.
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 17, lineHeight: 1.6, color: '#1A1A1A', margin: '0 0 16px', maxWidth: 540 }}>
              You flag the violation. We deliver the fix — fast, documented, and code-compliant. When a NFPA 13 finding lands on a facility, your client gets engineered flue keepers and a signed install sign-off, not a catalog runaround.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Direct line to engineering — no AI chatbots, no call trees',
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
            <Btn variant="primary" size="lg" onClick={() => onNav('contact', 'referrer')}>Open a Referrer Account →</Btn>
          </div>
          <div style={{ background: '#1A1A1A', color: '#FFFFFF', padding: 28, borderTop: '4px solid #D9530F' }}>
            <DataLabel color="#F5C344" style={{ display: 'block', marginBottom: 12 }}>SPEC LIBRARY · NO LOGIN</DataLabel>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.55, color: '#C8C6C5', margin: '0 0 18px' }}>
              Sending a client to us? Point them at the calculator and the resource hub — both designed to be referenced in audits, not gated behind sales walls.
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
          <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 56, lineHeight: 1, textTransform: 'uppercase', borderBottom: '2px solid #F5C344', paddingBottom: 18, margin: '0 0 36px', color: '#FFFFFF' }}>
            Frequently Asked Questions
          </h2>
          <div className="rsp-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 64px' }}>
            <FAQItem theme="dark" q="How do I schedule a rack audit?" a="Schedule a comprehensive audit by contacting our certified safety inspectors through the Contact form or by calling our compliance hotline. We typically offer scheduling within 48–72 hours." initialOpen={true} />
            <FAQItem theme="dark" q="When can I reserve an audit?" a="Audit windows open Monday-Friday, with rush slots available within 48 hours for active safety violations." />
            <FAQItem theme="dark" q="Am I a good candidate for bulk leasing?" a="Distribution centers with 50+ bays of selective pallet rack and a multi-year safety budget typically realize 22% lower cost-of-protection through our leasing program." />
            <FAQItem theme="dark" q="What documents do I need for compliance?" a="Bring your rack engineering drawing, commodity classification, recent insurance inspection report, and prior damage logs. Our team handles the rest." />
            <FAQItem theme="dark" q="Do you ship outside the contiguous US?" a="Yes — we routinely ship to Alaska, Hawaii, Puerto Rico, and Canadian provinces. Lead times add 5–10 business days." />
            <FAQItem theme="dark" q="What's covered under your lifetime warranty?" a="All manufacturing defects on flue guards, post protectors, and column wraps for the life of the original installation. Damage from forklift impact is covered under our repair-or-replace program." />
          </div>
        </div>
      </section>
    </div>
  );
}

const ArticleCard = ({ cat, dt, h, d, img, kind, onClick }) => {
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
        <DataLabel color="rgba(26,26,26,0.5)" size={10}>{dt}</DataLabel>
      </div>
      <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 26, lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 8px' }}>{h}</h3>
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.55, color: '#4E4635', margin: 0 }}>{d}</p>
    </article>
  );
};

const ArticleStrip = ({ cat, h, img, last }) => {
  const [hover, setHover] = useState(false);
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24, padding: '18px 0', borderBottom: last ? 0 : '1px solid #E2E2E2', alignItems: 'center', cursor: 'pointer' }}
    >
      <div style={{ aspectRatio: '4/3', background: '#2A2A2A', overflow: 'hidden', border: '2px solid #1A1A1A' }}>
        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: hover ? 'grayscale(0)' : 'grayscale(1)', transition: 'filter 400ms' }} />
      </div>
      <div>
        <Pill kind="orange-dark">{cat}</Pill>
        <h4 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 22, lineHeight: 0.95, textTransform: 'uppercase', margin: '8px 0 0', color: hover ? '#D9530F' : '#1A1A1A', transition: 'color 200ms' }}>{h}</h4>
      </div>
    </article>
  );
};
