'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Btn, DataLabel, Pill, Icon, hwStyle, CautionStripe } from '../components';
import { SITE } from '../data/productCatalog';
import { useNav, FLUE_CALC_KEY } from '../hooks/useNav';

// Caution intensity locked to "low": opacity 0.10, period 60.
const CAUTION = { opacity: 0.10, period: 60 };

// Maps a routing payload → form pre-fill. Service tiles, footer wholesale link,
// product Spec PDF buttons, and the resources referral block all funnel here.
function requestLabelFor(requestType) {
  if (!requestType) return null;
  if (requestType.startsWith('spec-')) {
    return `Request: Quote for ${requestType.replace('spec-', '')}`;
  }
  // Flue calculator result — payload is 'flue-calc:' + encoded JSON summary.
  if (requestType.startsWith('flue-calc:')) {
    try {
      const s = JSON.parse(decodeURIComponent(requestType.slice('flue-calc:'.length)));
      return [
        `Flue space screening (NFPA 13, ${s.edition} ed.)`,
        `Commodity: ${s.commodity}`,
        `Rack type: ${s.rackType}`,
        `Sprinkler protection: ${s.sprinkler}`,
        `Storage height: ${s.storageHeightFt} ft · Ceiling: ${s.ceilingHeightFt} ft · Aisle: ${s.aisleWidthFt} ft`,
        `Required transverse flue: ${s.transverseFlueIn} in`,
        `Required longitudinal flue: ${s.longitudinalRequired ? `${s.longitudinalFlueIn} in` : 'not required'}`,
        s.citations && s.citations.length ? `Citations: ${s.citations.join(', ')}` : null,
      ].filter(Boolean).join('\n');
    } catch {
      return 'Request: Flue space screening — calculator result';
    }
  }
  return {
    'tear-downs':     'Service inquiry: Pallet Rack Tear Downs & Removal',
    'safety-audits':  'Service inquiry: Warehouse & Pallet Rack Safety Audits',
    'buy-sell-used':  'Service inquiry: Buy & Sell Used Pallet Racks',
    'installation':   'Service inquiry: Pallet Rack Installation',
    'repairs':        'Service inquiry: Pallet Rack Repairs & Remediation',
    're-engineering': 'Service inquiry: Pallet Rack Re-Engineering',
    wholesale:        'Wholesale / Distributor inquiry',
    referrer:         'Referral from fire marshal / safety consultant',
    'catalog-pdf':    'Request: 2026 Product Catalog (PDF)',
  }[requestType] || null;
}

export default function ContactScreen() {
  const onNav = useNav();
  const searchParams = useSearchParams();
  // requestType comes from ?request=… ; the larger flue-calc summary is handed off
  // via sessionStorage (set by useNav) and consumed once here. Read in a useState
  // initializer so it's client-only and never causes a hydration mismatch.
  const [requestType] = useState<string | null>(() => {
    const fromQuery = searchParams.get('request');
    if (fromQuery) return fromQuery;
    if (typeof window !== 'undefined') {
      const stashed = sessionStorage.getItem(FLUE_CALC_KEY);
      if (stashed) {
        sessionStorage.removeItem(FLUE_CALC_KEY);
        return stashed;
      }
    }
    return null;
  });
  const prefillLabel = requestLabelFor(requestType);
  const [form, setForm] = useState({
    name: '', company: '', email: '', rackConfig: 'Teardrop Pallet Rack',
    notes: prefillLabel ? `${prefillLabel}\n\n` : '',
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quoteId, setQuoteId] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Wholesale link scrolls to the distributor aside; everything else scrolls to the form.
  useEffect(() => {
    if (!requestType) return;
    const target = requestType === 'wholesale' ? 'wholesale' : 'quote-form';
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [requestType]);

  const errors = {
    name:    !form.name.trim() ? 'Required' : null,
    company: !form.company.trim() ? 'Required' : null,
    email:   !form.email.trim() ? 'Required' :
             !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) ? 'Enter a valid email' : null,
  };
  const isValid = !errors.name && !errors.company && !errors.email;

  const set = (k, v) => setForm({ ...form, [k]: v });
  const blur = (k) => setTouched({ ...touched, [k]: true });

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, company: true, email: true });
    if (!isValid) return;
    setSubmitError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, requestType, source: 'web' }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setQuoteId(data.id);
        setSubmitted(true);
      } else {
        setSubmitError(data.error || 'Something went wrong submitting your request. Please try again or call us.');
      }
    } catch {
      setSubmitError('Network error — please try again, or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rsp-fade-up">
      <section style={{ background: '#F9F9F9', color: '#1A1A1A', padding: '72px 32px 96px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0,
          background: `repeating-linear-gradient(45deg, rgba(245,195,68,0.12) 0 ${CAUTION.period / 2}px, transparent ${CAUTION.period / 2}px ${CAUTION.period}px)`,
          opacity: CAUTION.opacity * 5,
        }}></div>
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '38%', background: '#1A1A1A', clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
          <Pill kind="yellow" style={{ fontSize: 11, marginBottom: 24 }}>REQUEST SPECIFICATION</Pill>
          <h1 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 'clamp(72px, 9vw, 140px)', lineHeight: 0.85, textTransform: 'uppercase', margin: 0, color: '#1A1A1A' }}>
            Get a<br/>
            <span style={{ color: '#D9530F' }}>Precision Quote</span>
          </h1>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, lineHeight: 1.6, color: '#1A1A1A', maxWidth: 480, marginTop: 32, borderLeft: '3px solid #F5C344', paddingLeft: 16 }}>
            Industrial-grade protection shouldn't be a guessing game. Our engineering team provides exact specifications for your warehouse layout within 24 hours.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 32 }}>
            <Btn variant="yellow" size="lg" onClick={() => document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Start My Quote</Btn>
            <Btn variant="outline" size="lg" onClick={() => onNav('catalog')}>View Samples</Btn>
          </div>
        </div>
        <CautionStripe height={6} period={60} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
      </section>

      <section id="quote-form" style={{ padding: '64px 32px', background: '#F9F9F9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '300px 1fr', gap: 32, alignItems: 'flex-start' }}>
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ background: '#1A1A1A', color: '#FFFFFF', padding: 28, borderBottom: '4px solid #F5C344' }}>
              <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, color: '#F5C344', fontSize: 30, textTransform: 'uppercase', margin: '0 0 20px' }}>Safety Contact</h3>
              {[
                ['place', 'HEADQUARTERS', ...SITE.address],
                ['call', 'COMPLIANCE DIRECT', SITE.phone],
                ['mail', 'ENGINEER SUPPORT', SITE.email],
                ['schedule', `HOURS (${SITE.timezone})`, SITE.hours],
              ].map((blk, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
                  <Icon name={blk[0]} size={20} style={{ color: '#F5C344', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <DataLabel color="rgba(255,255,255,0.6)" size={10} style={{ display: 'block', marginBottom: 4 }}>{blk[1]}</DataLabel>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.5, fontWeight: blk[1].includes('DIRECT') ? 700 : 400 }}>
                      {blk.slice(2).map((l, j) => <div key={j}>{l}</div>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#E8E8E8', padding: 20, borderLeft: '4px solid #D9530F' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #807662', paddingBottom: 10, marginBottom: 14 }}>
                <DataLabel color="#D9530F">STANDARD COMPLIANCE</DataLabel>
                <span style={{ background: '#1A1A1A', color: '#F5C344', padding: '4px 10px', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.14em' }}>ANSI MH16.1</span>
              </div>
              {/* TODO-VERIFY: confirm these trust claims (response time, warranty terms) with the business. */}
              {[['verified', 'Structural Integrity First'], ['warning', '24-Hour Engineering Response'], ['shield', 'Lifetime Component Warranty']].map(([ic, t]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                  <Icon name={ic} size={18} style={{ color: '#D9530F' }} />
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13 }}>{t}</span>
                </div>
              ))}
            </div>
            <div style={{ background: '#F5C344', color: '#1A1A1A', padding: 20, borderLeft: '4px solid #1A1A1A' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(26,26,26,0.3)', paddingBottom: 10, marginBottom: 12 }}>
                <DataLabel color="#1A1A1A">DISTRIBUTOR / OEM</DataLabel>
                <Icon name="layers" size={20} style={{ color: '#1A1A1A' }} />
              </div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.55, color: '#1A1A1A', margin: '0 0 14px' }}>
                Stocking programs, OEM components, and wholesale pricing for qualified distributors. Tell us about your accounts and target volume.
              </p>
              <Btn variant="primary" size="sm" onClick={() => document.getElementById('wholesale')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} style={{ width: '100%', justifyContent: 'center' }}>
                Start Wholesale Inquiry →
              </Btn>
            </div>
          </aside>

          <div>
          {prefillLabel && !submitted && (
            <div style={{ background: '#1A1A1A', color: '#F5C344', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, borderLeft: '4px solid #F5C344' }}>
              <Icon name="check_circle" size={20} fill={1} style={{ color: '#F5C344' }} />
              <div style={{ flex: 1 }}>
                <DataLabel color="rgba(245,195,68,0.7)" size={10} style={{ display: 'block', marginBottom: 2 }}>PRE-FILLED FROM YOUR LAST CLICK</DataLabel>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>{prefillLabel}</span>
              </div>
            </div>
          )}
          {submitted ? (
            <div style={{ background: '#FFFFFF', border: '2px solid #1A1A1A', padding: 64, textAlign: 'center', minHeight: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ background: '#2ECC71', color: '#FFFFFF', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <Icon name="check" size={48} weight={700} />
              </div>
              <DataLabel color="#2ECC71" style={{ marginBottom: 12, display: 'block' }}>QUOTE REQUEST LOGGED · #{quoteId}</DataLabel>
              <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 48, textTransform: 'uppercase', margin: '0 0 12px', ...hwStyle({ fill: '#1A1A1A', shadow: '#2ECC71' }) }}>Quote request received</h2>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, color: '#4E4635', maxWidth: 480, lineHeight: 1.6 }}>
                Our engineering team will review your request and respond within <strong>24 hours</strong>. A confirmation has been sent to <strong style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14 }}>{form.email}</strong>.
              </p>
              <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
                <Btn variant="primary" onClick={() => { setSubmitted(false); setQuoteId(''); setSubmitError(''); setForm({ name: '', company: '', email: '', rackConfig: 'Teardrop Pallet Rack', notes: '' }); setTouched({}); }}>Submit another</Btn>
                <Btn variant="outline" onClick={() => onNav('home')}>← Back to home</Btn>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate style={{ background: '#FFFFFF', border: '2px solid #1A1A1A', padding: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <FormField
                label="Full Name" placeholder="John Doe" value={form.name}
                onChange={(v) => set('name', v)} onBlur={() => blur('name')}
                error={touched.name && errors.name}
              />
              <FormField
                label="Company Name" placeholder="Industrial Logistics Inc." value={form.company}
                onChange={(v) => set('company', v)} onBlur={() => blur('company')}
                error={touched.company && errors.company}
              />
              <FormField
                label="Email Address" placeholder="j.doe@company.com" type="email" value={form.email}
                onChange={(v) => set('email', v)} onBlur={() => blur('email')}
                error={touched.email && errors.email}
              />
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <DataLabel color="#1A1A1A">Rack Configuration</DataLabel>
                <select value={form.rackConfig} onChange={(e) => set('rackConfig', e.target.value)} style={{ padding: '14px', border: '2px solid #1A1A1A', borderRadius: 0, fontFamily: "'Inter',sans-serif", fontSize: 15, background: '#FFFFFF', outline: 'none' }}>
                  <option>Teardrop Pallet Rack</option>
                  <option>Structural / Bolt-thru</option>
                  <option>Cantilever Rack</option>
                  <option>Push-Back / Drive-In</option>
                  <option>Mixed / Multi-system</option>
                </select>
              </label>

              <label style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <DataLabel color="#1A1A1A">Project Specifications &amp; Notes</DataLabel>
                <textarea rows={5} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Describe your warehouse layout, flue space requirements, and any existing safety violations that need correction..." style={{ padding: 14, border: '2px solid #1A1A1A', borderRadius: 0, fontFamily: "'Inter',sans-serif", fontSize: 15, outline: 'none', resize: 'vertical', minHeight: 120 }}></textarea>
              </label>

              <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 24, paddingTop: 16, borderTop: '1px solid #DDDDDD', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 24, letterSpacing: '0.04em', textTransform: 'uppercase',
                    padding: '16px 32px', border: 0, borderRadius: 0,
                    cursor: submitting ? 'wait' : 'pointer',
                    background: submitting ? '#BD480C' : '#F5C344',
                    color: submitting ? '#FFFFFF' : '#1A1A1A',
                    display: 'inline-flex', alignItems: 'center', gap: 12,
                    transition: 'background 200ms, color 200ms',
                  }}
                  onMouseEnter={(e) => { if (!submitting) { e.currentTarget.style.background = '#FF5E13'; e.currentTarget.style.color = '#FFFFFF'; } }}
                  onMouseLeave={(e) => { if (!submitting) { e.currentTarget.style.background = '#F5C344'; e.currentTarget.style.color = '#1A1A1A'; } }}
                >
                  {submitting ? <>Submitting… <Icon name="progress_activity" size={22} /></> : <>Request Quote <Icon name="arrow_forward" size={22} /></>}
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 220 }}>
                  <Icon name="shield" size={20} fill={1} style={{ color: '#2ECC71' }} />
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#4E4635', lineHeight: 1.4 }}>
                    We'll only use your details to prepare your quote — never shared with third parties.
                  </span>
                </div>
              </div>
              {!isValid && Object.keys(touched).length > 0 && (
                <div style={{ gridColumn: '1/-1', background: '#FFF4F2', border: '2px solid #E74C3C', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon name="error" size={20} fill={1} style={{ color: '#E74C3C' }} />
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: '#1A1A1A' }}>
                    Please fix the highlighted fields before submitting.
                  </span>
                </div>
              )}
              {submitError && (
                <div style={{ gridColumn: '1/-1', background: '#FFF4F2', border: '2px solid #E74C3C', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon name="error" size={20} fill={1} style={{ color: '#E74C3C' }} />
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: '#1A1A1A' }}>
                    {submitError}
                  </span>
                </div>
              )}
            </form>
          )}
          </div>
        </div>
      </section>

      <section style={{ background: '#2A2A2A', color: '#FFFFFF', padding: '96px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 20px, transparent 20px 40px)' }}></div>
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
          <div style={{ borderLeft: '4px solid #F5C344', paddingLeft: 20, marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 48, textTransform: 'uppercase', margin: '0 0 6px', color: '#FFFFFF' }}>Specify Your Protection</h2>
            <DataLabel color="#F5C344">HIGH-IMPACT SAFETY COMPONENTS</DataLabel>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 24 }}>
            <div onClick={() => onNav('product', 'flue-guard')} style={{ position: 'relative', border: '2px solid #1A1A1A', overflow: 'hidden', minHeight: 340, cursor: 'pointer' }}>
              <img src="/assets/products/flue-guard.svg" alt="Flue guard installation" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, objectFit: 'cover', filter: 'grayscale(1) brightness(0.5)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, background: 'linear-gradient(to top, rgba(0,0,0,0.92), transparent)' }}>
                <DataLabel color="#F5C344" style={{ marginBottom: 6, display: 'block' }}>CATEGORY A</DataLabel>
                <h3 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 32, textTransform: 'uppercase', color: '#FFFFFF', margin: '0 0 6px' }}>Flue Guard Systems</h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: '#FFDF9A', margin: 0 }}>Precision engineered to maintain NFPA fire safety clearances.</p>
              </div>
            </div>
            <SpecifyTile onClick={() => onNav('product', 'flared-channel-wire-decking')} bg="#E8E8E8" color="#1A1A1A" iconColor="#D9530F" titleColor="#D9530F" icon="layers" title="Wire Decking" desc="U-Channel structural support for maximum capacity." />
            <SpecifyTile onClick={() => onNav('product', 'column-guards')} bg="#F5C344" color="#1A1A1A" iconColor="#1A1A1A" titleColor="#1A1A1A" icon="warning" iconFill={1} title="Column Guards" desc="Prevent upright collapse from forklift impacts." />
            <div onClick={() => onNav('contact', 'catalog-pdf')} style={{ gridColumn: '2/-1', background: '#1A1A1A', border: '2px solid #1A1A1A', padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 200ms' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#BD480C')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#1A1A1A')}
            >
              <div>
                <h4 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 28, textTransform: 'uppercase', color: '#F5C344', margin: 0 }}>Download Catalog</h4>
                <DataLabel color="rgba(245,195,68,0.6)" style={{ marginTop: 4, display: 'block' }}>2026 TECHNICAL SPECS · PDF 12MB</DataLabel>
              </div>
              <Icon name="download" size={36} style={{ color: '#F5C344' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Distributor / OEM band — hybrid positioning (positions doc §1) */}
      <section id="wholesale" style={{ background: '#F5C344', padding: '88px 32px', position: 'relative', overflow: 'hidden', scrollMarginTop: 80 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(26,26,26,0.06) 0 2px, transparent 2px 18px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <DataLabel color="#D9530F" style={{ display: 'block', marginBottom: 14 }}>FOR DISTRIBUTORS &amp; OEM PARTNERS</DataLabel>
            <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 56, lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 18px', ...hwStyle({ fill: '#1A1A1A', shadow: '#D9530F' }) }}>
              Sell our gear under your roof.
            </h2>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 17, lineHeight: 1.6, color: '#1A1A1A', margin: '0 0 18px', maxWidth: 580 }}>
              We partner with rack integrators, MHE distributors, and warehouse-systems OEMs who need a specialist source for flue keepers, structural protection, and NFPA-compliant accessories.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: 580 }}>
              {[
                'Partner pricing with volume tiers',
                'Drop-ship and blind-ship programs',
                'Private-label and custom-spec sourcing',
                'Engineering support on quoted jobs',
              ].map((l) => (
                <li key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 500 }}>
                  <Icon name="check" size={16} weight={600} style={{ color: '#D9530F' }} />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: '#1A1A1A', color: '#FFFFFF', padding: 32, borderTop: '4px solid #D9530F' }}>
            <DataLabel color="#F5C344" style={{ display: 'block', marginBottom: 12 }}>OPEN A PARTNER ACCOUNT</DataLabel>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.5, color: '#C8C6C5', margin: '0 0 20px' }}>
              Tell us a bit about your business and we'll route you to the right partner manager within one business day.
            </p>
            <Btn variant="yellow" size="lg" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
              Start Partner Inquiry →
            </Btn>
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(245,195,68,0.25)', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,195,68,0.7)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Partner Direct</span>
              <span style={{ color: '#F5C344' }}>{SITE.email}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const FormField = ({ label, placeholder, value, onChange, onBlur, error, type = 'text' }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <DataLabel color="#1A1A1A">{label}</DataLabel>
      {error && <DataLabel color="#E74C3C" size={10}>{error}</DataLabel>}
    </div>
    <input
      type={type} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      style={{
        padding: '14px', borderRadius: 0,
        border: error ? '2px solid #E74C3C' : '2px solid #1A1A1A',
        fontFamily: "'Inter',sans-serif", fontSize: 15, outline: 'none',
        background: error ? '#FFF4F2' : '#FFFFFF',
        boxShadow: 'none',
        transition: 'border-color 200ms, background 200ms',
      }}
      onFocus={(e) => { if (!error) e.currentTarget.style.boxShadow = '0 0 0 2px #F5C344'; }}
      onBlurCapture={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
    />
  </label>
);

const SpecifyTile = ({ onClick, bg, color, iconColor, titleColor, icon, iconFill = 0, title, desc }) => (
  <div onClick={onClick} style={{ background: bg, color, padding: 24, border: '2px solid #1A1A1A', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', minHeight: 200 }}>
    <Icon name={icon} size={36} fill={iconFill} style={{ color: iconColor }} />
    <div>
      <h4 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 26, textTransform: 'uppercase', color: titleColor, margin: '0 0 8px' }}>{title}</h4>
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color, opacity: 0.85, margin: 0 }}>{desc}</p>
    </div>
  </div>
);
