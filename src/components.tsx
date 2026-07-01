'use client';
import React, { useState, useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE } from './data/productCatalog';
import { targetToHref } from './lib/navMap';
import { useNav } from './hooks/useNav';
import type { NavTarget } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────────────────────

type BtnProps = {
  children: ReactNode;
  variant?: string;
  size?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  style?: CSSProperties;
  disabled?: boolean;
};
export const Btn = ({ children, variant = 'primary', size = 'md', onClick, type = 'button', style, disabled }: BtnProps) => {
  const [hover, setHover] = useState(false);
  const base = {
    fontFamily: "'Inter',sans-serif",
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 0,
    borderRadius: 0,
    transition: 'background 200ms cubic-bezier(.4,0,.2,1), color 200ms, border-color 200ms, transform 80ms',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    opacity: disabled ? 0.5 : 1,
  };
  const sizes = {
    sm: { fontSize: 12, padding: '10px 18px' },
    md: { fontSize: 14, padding: '14px 26px' },
    lg: { fontSize: 14, padding: '18px 36px' },
  };
  const palettes = {
    primary:         { base: { background: '#1A1A1A', color: '#FFFFFF' },                                  hover: { background: '#BD480C', color: '#FFFFFF' } },
    yellow:          { base: { background: '#F5C344', color: '#1A1A1A' },                                  hover: { background: '#FF5E13', color: '#FFFFFF' } },
    orange:          { base: { background: '#FF5E13', color: '#FFFFFF' },                                  hover: { background: '#BD480C', color: '#FFFFFF' } },
    outline:         { base: { background: 'transparent', color: '#1A1A1A', border: '2px solid #1A1A1A' }, hover: { background: '#1A1A1A', color: '#FFFFFF', border: '2px solid #1A1A1A' } },
    'outline-light': { base: { background: 'transparent', color: '#F5C344', border: '2px solid #F5C344' }, hover: { background: '#F5C344', color: '#1A1A1A', border: '2px solid #F5C344' } },
    ghost:           { base: { background: 'transparent', color: '#1A1A1A' },                              hover: { background: 'rgba(0,0,0,0.06)', color: '#1A1A1A' } },
  };
  const p = palettes[variant] || palettes.primary;
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...sizes[size], ...(hover ? p.hover : p.base), ...style }}
    >
      {children}
    </button>
  );
};

type MegaProps = {
  children: ReactNode;
  variant?: string;
  onClick?: () => void;
  style?: CSSProperties;
  fontSize?: number;
};
export const Mega = ({ children, variant = 'yellow', onClick, style, fontSize = 28 }: MegaProps) => {
  const [hover, setHover] = useState(false);
  const palettes = {
    yellow: { base: { background: '#F5C344', color: '#1A1A1A' }, hover: { background: '#FF5E13', color: '#FFFFFF' } },
    orange: { base: { background: '#FF5E13', color: '#FFFFFF' }, hover: { background: '#BD480C', color: '#FFFFFF' } },
    dark:   { base: { background: '#1A1A1A', color: '#FFFFFF' }, hover: { background: '#BD480C', color: '#FFFFFF' } },
    'outline-dark': { base: { background: 'transparent', color: '#1A1A1A', border: '3px solid #1A1A1A' }, hover: { background: '#1A1A1A', color: '#F5C344', border: '3px solid #1A1A1A' } },
  };
  const p = palettes[variant] || palettes.yellow;
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize, letterSpacing: '0.04em', textTransform: 'uppercase',
        padding: '18px 40px', border: 0, borderRadius: 0, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 14, whiteSpace: 'nowrap',
        transition: 'all 200ms cubic-bezier(.4,0,.2,1)',
        ...(hover ? p.hover : p.base), ...style,
      }}
    >
      {children}
    </button>
  );
};

type DataLabelProps = {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
  size?: number;
};
export const DataLabel = ({ children, color = '#4E4635', style, size = 12 }: DataLabelProps) => (
  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, fontSize: size, letterSpacing: '0.2em', textTransform: 'uppercase', color, ...style }}>{children}</span>
);

type PillProps = {
  children: ReactNode;
  kind?: string;
  style?: CSSProperties;
};
export const Pill = ({ children, kind = 'green', style }: PillProps) => {
  const m = {
    green:         { bg: '#2ECC71', fg: '#FFFFFF', border: '#2ECC71' },
    orange:        { bg: '#FF5E13', fg: '#FFFFFF', border: '#FF5E13' },
    'orange-dark': { bg: '#BD480C', fg: '#FFFFFF', border: '#BD480C' },
    yellow:        { bg: '#F5C344', fg: '#1A1A1A', border: '#1A1A1A' },
    dark:          { bg: '#1A1A1A', fg: '#F5C344', border: '#1A1A1A' },
    red:           { bg: '#E74C3C', fg: '#FFFFFF', border: '#E74C3C' },
    outline:       { bg: 'transparent', fg: '#1A1A1A', border: '#1A1A1A' },
  }[kind] || { bg: '#F5C344', fg: '#1A1A1A', border: '#1A1A1A' };
  return (
    <span style={{
      fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 10, letterSpacing: '0.18em',
      textTransform: 'uppercase', padding: '4px 10px', background: m.bg, color: m.fg, border: `1px solid ${m.border}`,
      display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', ...style,
    }}>{children}</span>
  );
};

type CautionStripeProps = {
  height?: number;
  opacity?: number;
  period?: number;
  style?: CSSProperties;
};
export const CautionStripe = ({ height = 12, opacity = 1, period = 40, style }: CautionStripeProps) => (
  <div style={{
    height,
    opacity,
    background: `repeating-linear-gradient(45deg, #F1C041 0 ${period / 2}px, #1A1A1A ${period / 2}px ${period}px)`,
    ...style,
  }} />
);

// Inline SVG icon set (replaces Material Symbols — more reliable than ligature font)
const ICON_PATHS = {
  search:           '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  search_off:       '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="m8 8 6 6M14 8l-6 6"/>',
  share:            '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  rss_feed:         '<path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1.5" fill="currentColor"/>',
  download:         '<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
  arrow_forward:    '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  add:              '<path d="M12 5v14M5 12h14"/>',
  remove:           '<path d="M5 12h14"/>',
  check:            '<path d="m5 12 5 5L20 7"/>',
  check_circle:     '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  verified:         '<path d="M12 2 14.5 4.2 17.7 4 18.5 7 21 8.8 19.6 11.7 21 14.6 18.5 16.4 17.7 19.4 14.5 19.2 12 21.4 9.5 19.2 6.3 19.4 5.5 16.4 3 14.6 4.4 11.7 3 8.8 5.5 7 6.3 4 9.5 4.2Z"/><path d="m8.5 12 2.5 2.5 4-5"/>',
  verified_user:    '<path d="M12 3 4 6v5c0 4.4 3.2 8.6 8 10 4.8-1.4 8-5.6 8-10V6Z"/><path d="m9 12 2.5 2.5L15 10"/>',
  shield:           '<path d="M12 3 4 6v6c0 4.5 3.4 8.7 8 10 4.6-1.3 8-5.5 8-10V6Z"/>',
  warning:          '<path d="m12 3 10 17H2Z"/><path d="M12 10v4"/><circle cx="12" cy="17" r=".5" fill="currentColor" stroke="none"/>',
  error:            '<circle cx="12" cy="12" r="9"/><path d="M12 7v6"/><circle cx="12" cy="16" r=".6" fill="currentColor" stroke="none"/>',
  place:            '<path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
  call:             '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  mail:             '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/>',
  schedule:         '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calculate:        '<rect x="5" y="3" width="14" height="18" rx="1"/><rect x="7.5" y="5.5" width="9" height="3" rx=".5"/><circle cx="8.5" cy="12.5" r=".7" fill="currentColor" stroke="none"/><circle cx="12" cy="12.5" r=".7" fill="currentColor" stroke="none"/><circle cx="15.5" cy="12.5" r=".7" fill="currentColor" stroke="none"/><circle cx="8.5" cy="16" r=".7" fill="currentColor" stroke="none"/><circle cx="12" cy="16" r=".7" fill="currentColor" stroke="none"/><circle cx="15.5" cy="16" r=".7" fill="currentColor" stroke="none"/>',
  grid_view:        '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  layers:           '<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  inventory_2:      '<rect x="3" y="7" width="18" height="14" rx="1"/><path d="M3 7l2-4h14l2 4M9 12h6"/>',
  description:      '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8Z"/><path d="M14 3v5h5M8 13h8M8 17h6"/>',
  fact_check:       '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="m6 8 2 2 4-4M6 14l2 2 4-4M15 9h4M15 15h4"/>',
  local_shipping:   '<rect x="2" y="7" width="11" height="9"/><path d="M13 10h4l3 3v3h-7"/><circle cx="6.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>',
  support_agent:    '<path d="M5 13v-2a7 7 0 0 1 14 0v2"/><rect x="3" y="13" width="4" height="6"/><rect x="17" y="13" width="4" height="6"/><path d="M19 19a3 3 0 0 1-3 3h-3"/>',
  progress_activity:'<path d="M12 3a9 9 0 1 0 9 9"/>',
};

type IconProps = {
  name: string;
  size?: number;
  fill?: number;
  weight?: number;
  style?: CSSProperties;
};
export const Icon = ({ name, size = 24, fill = 0, weight = 400, style }: IconProps) => {
  const path = ICON_PATHS[name];
  if (!path) {
    return <span style={{ display: 'inline-block', width: size, height: size, ...style }} />;
  }
  const strokeWidth = weight >= 600 ? 2 : 1.75;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', ...style }}
      dangerouslySetInnerHTML={{ __html: path }}
    />
  );
};

// Headline weight is locked to "heavy" per the design decision (caution / low / heavy).
// Stacks 12 1px-incremented shadow layers so the offset reads as a continuous extruded slab
// rather than a stepped staircase.
export const hwStyle = ({ fill = '#1A1A1A', shadow = '#D9530F' } = {}) => {
  const layers = [];
  for (let i = 1; i <= 12; i++) layers.push(`${i}px ${i}px 0 ${shadow}`);
  return { color: fill, WebkitTextStroke: '0', textShadow: layers.join(', ') };
};

// ─────────────────────────────────────────────────────────────────────────────
// TopNav — sticky charcoal nav, gold accents
// ─────────────────────────────────────────────────────────────────────────────
export const TopNav = () => {
  const pathname = usePathname();
  const nav = useNav();
  const items = [
    ['catalog', 'Catalog'],
    ['catalog', 'Flue Products', 'flue'],
    ['catalog', 'Protection', 'protection'],
    ['services', 'Services'],
    ['resources', 'Resources'],
    ['about', 'About'],
  ];
  // Caution stripe under the nav only appears once scrolled — at the top it would
  // collide with the hero's own hazard band.
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#1A1A1A',
      borderBottom: '2px solid #F5C344',
    }}>
      <div className="rsp-px" style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        height: 72, padding: '0 32px',
      }}>
        <Link
          href="/"
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <img
            src="/assets/logos/rsp-logo.png"
            alt="Rack Safety Products"
            style={{ height: 40, display: 'block' }}
          />
        </Link>
        <div className="rsp-nav-desktop" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {items.map(([target, l, payload], i) => {
            const href = targetToHref(target as NavTarget, payload);
            const base = href.split('?')[0];
            const isActive = base === '/' ? pathname === '/' : pathname === base || pathname.startsWith(base + '/');
            return (
              <Link
                key={i}
                href={href}
                style={{
                  cursor: 'pointer', textDecoration: 'none',
                  color: isActive ? '#F5C344' : '#FFFFFF',
                  opacity: isActive ? 1 : 0.85,
                  fontFamily: "'Inter',sans-serif",
                  fontWeight: isActive ? 700 : 600,
                  fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase',
                  borderBottom: isActive ? '2px solid #F5C344' : '2px solid transparent',
                  paddingBottom: 4, whiteSpace: 'nowrap',
                  transition: 'color 200ms, opacity 200ms, border-color 200ms',
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = '#F5C344'; e.currentTarget.style.opacity = '1'; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.opacity = '0.85'; } }}
              >
                {l}
              </Link>
            );
          })}
          <Btn variant="yellow" size="sm" onClick={() => nav('contact')}>Get Quote</Btn>
        </div>
        <button
          className="rsp-nav-burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((o) => !o)}
          style={{ background: 'transparent', border: 0, cursor: 'pointer', color: '#F5C344', fontSize: 26, lineHeight: 1, padding: 4, alignItems: 'center', justifyContent: 'center' }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
      {menuOpen && (
        <div className="rsp-nav-panel" style={{ background: '#1A1A1A', borderTop: '1px solid rgba(245,195,68,0.3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 20px 20px' }}>
            {items.map(([target, l, payload], i) => (
              <Link
                key={i}
                href={targetToHref(target as NavTarget, payload)}
                onClick={() => setMenuOpen(false)}
                style={{ color: '#FFFFFF', textDecoration: 'none', fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '14px 2px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                {l}
              </Link>
            ))}
            <Btn variant="yellow" size="sm" onClick={() => { setMenuOpen(false); nav('contact'); }} style={{ marginTop: 16, justifyContent: 'center' }}>Get Quote</Btn>
          </div>
        </div>
      )}
      <div style={{ height: scrolled ? 4 : 0, overflow: 'hidden', transition: 'height 200ms cubic-bezier(.4,0,.2,1)' }}>
        <CautionStripe height={4} opacity={0.9} period={24} />
      </div>
    </nav>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────────
export const Footer = () => {
  const cols = [
    { h: 'Quick Links', items: [['Catalog', 'catalog'], ['Flue Products', 'catalog', 'flue'], ['Services', 'services'], ['Resources', 'resources'], ['About', 'about']] },
    { h: 'Support',     items: [['Privacy Policy'], ['Terms of Service'], ['Compliance Standards'], ['Wholesale Inquiries', 'contact', 'wholesale']] },
  ];
  return (
    <footer className="rsp-px" style={{ background: '#1A1A1A', color: '#FFFFFF', padding: '64px 32px 24px', borderTop: '4px solid #F5C344' }}>
      <div className="rsp-stack" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr', gap: 40 }}>
        <div>
          <h2 style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, color: '#F5C344', fontSize: 36, lineHeight: 0.95, textTransform: 'uppercase', margin: '0 0 14px' }}>
            Rack Safety<br/>Products
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: 320, margin: 0 }}>
            The industry standard for warehouse structural integrity and OSHA compliance.
          </p>
          <div style={{ position: 'relative', marginTop: 22, maxWidth: 320 }}>
            <input
              placeholder="Search catalog..."
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF', padding: '10px 36px 10px 14px', fontFamily: "'Inter',sans-serif",
                fontSize: 13, outline: 'none', borderRadius: 0,
              }}
            />
            <Icon name="search" size={18} style={{ position: 'absolute', right: 12, top: 11, color: 'rgba(255,255,255,0.4)' }} />
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <h5 style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.22em',
              color: '#F5C344', textTransform: 'uppercase',
              borderBottom: '1px solid rgba(245,195,68,0.25)', paddingBottom: 8, margin: '0 0 14px',
            }}>{c.h}</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {c.items.map(([label, target, anchor], i) => {
                const linkStyle: React.CSSProperties = {
                  cursor: target ? 'pointer' : 'default',
                  fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 500,
                  color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
                  transition: 'color 200ms',
                };
                return (
                  <li key={i}>
                    {target ? (
                      <Link
                        href={targetToHref(target as NavTarget, anchor)}
                        style={linkStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#F5C344')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                      >
                        {label}
                      </Link>
                    ) : (
                      <span style={linkStyle}>{label}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <div>
          <h5 style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.22em',
            color: '#F5C344', textTransform: 'uppercase',
            borderBottom: '1px solid rgba(245,195,68,0.25)', paddingBottom: 8, margin: '0 0 14px',
          }}>Newsletter</h5>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: '0 0 12px' }}>
            Get monthly safety compliance updates.
          </p>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex' }}>
            <input
              type="email"
              placeholder="Email"
              style={{
                flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF', padding: '10px 14px', fontFamily: "'Inter',sans-serif", fontSize: 13,
                outline: 'none', borderRadius: 0,
              }}
            />
            <button
              type="submit"
              style={{
                background: '#F5C344', color: '#1A1A1A', border: 0, padding: '0 18px',
                fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '0.18em',
                textTransform: 'uppercase', cursor: 'pointer',
              }}
            >Join</button>
          </form>
        </div>
      </div>
      <div style={{
        maxWidth: 1280, margin: '48px auto 0', paddingTop: 24,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
      }}>
        <DataLabel color="rgba(255,255,255,0.4)" size={10} style={{ letterSpacing: '0.22em' }}>
          © 2026 RACK SAFETY PRODUCTS LLC.  ALL RIGHTS RESERVED.
        </DataLabel>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <DataLabel color="rgba(255,255,255,0.5)" size={10}>{SITE.phone}</DataLabel>
          <Icon name="share" size={16} style={{ color: '#F5C344', cursor: 'pointer' }} />
          <Icon name="rss_feed" size={16} style={{ color: '#F5C344', cursor: 'pointer' }} />
        </div>
      </div>
    </footer>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FAQ accordion
// ─────────────────────────────────────────────────────────────────────────────
type FAQItemProps = {
  q: ReactNode;
  a: ReactNode;
  theme?: string;
  initialOpen?: boolean;
  separator?: string;
};
export const FAQItem = ({ q, a, theme = 'light', initialOpen = false, separator = 'thin' }: FAQItemProps) => {
  const [open, setOpen] = useState(initialOpen);
  const T = {
    light:  { ruleColor: '#1A1A1A', qColor: '#1A1A1A', aColor: '#4E4635', iconColor: '#1A1A1A' },
    yellow: { ruleColor: '#1A1A1A', qColor: '#1A1A1A', aColor: '#1A1A1A', iconColor: '#1A1A1A' },
    dark:   { ruleColor: 'rgba(255,255,255,0.2)', qColor: '#FFFFFF', aColor: '#C8C6C5', iconColor: '#F5C344' },
  }[theme];
  return (
    <div style={{
      borderBottom: `${separator === 'heavy' ? '2px' : '1px'} solid ${T.ruleColor}`,
      paddingBottom: 14,
    }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', background: 'transparent', border: 0, cursor: 'pointer', padding: '8px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
          textAlign: 'left', color: T.qColor,
        }}
      >
        <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 22, lineHeight: 1.1, textTransform: 'uppercase', color: T.qColor }}>{q}</span>
        <Icon name={open ? 'remove' : 'add'} size={26} style={{ color: T.iconColor, transition: 'transform 200ms', flexShrink: 0 }} />
      </button>
      <div className={`rsp-faq-body${open ? ' open' : ''}`} style={{
        paddingTop: open ? 10 : 0,
        fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.6, color: T.aColor,
      }}>
        {a}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Big screen-section header with rule + eyebrow
// ─────────────────────────────────────────────────────────────────────────────
type SectionHeaderProps = {
  title: ReactNode;
  eyebrow?: ReactNode;
  right?: ReactNode;
  rule?: string;
  color?: string;
  fontSize?: number;
};
export const SectionHeader = ({ title, eyebrow, right, rule = 'heavy', color = '#1A1A1A', fontSize = 56 }: SectionHeaderProps) => (
  <div className="rsp-col" style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32,
    paddingBottom: 16, marginBottom: 40,
    borderBottom: rule === 'heavy' ? '4px solid #1A1A1A' : rule === 'yellow' ? '2px solid #F5C344' : '2px solid #1A1A1A',
  }}>
    <div>
      {eyebrow && <DataLabel color="#D9530F" style={{ display: 'block', marginBottom: 8 }}>{eyebrow}</DataLabel>}
      <h2 className="rsp-h2" style={{ fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize, lineHeight: 1, textTransform: 'uppercase', margin: 0, color }}>{title}</h2>
    </div>
    {right}
  </div>
);
