import Link from 'next/link';

// Branded 404 — server component, no client hooks needed.
export default function NotFound() {
  return (
    <section
      style={{
        background: '#1A1A1A',
        color: '#FFFFFF',
        padding: '120px 32px',
        textAlign: 'center',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#F5C344',
          marginBottom: 16,
        }}
      >
        Error 404 · Page Not Found
      </span>
      <h1
        style={{
          fontFamily: "'Anton',sans-serif",
          fontWeight: 400,
          fontSize: 'clamp(56px, 9vw, 120px)',
          lineHeight: 0.9,
          textTransform: 'uppercase',
          margin: '0 0 16px',
          color: '#FFFFFF',
          textShadow: '4px 4px 0 #D9530F, 6px 6px 0 #D9530F',
        }}
      >
        Off the Rack
      </h1>
      <p
        style={{
          fontFamily: "'Inter',sans-serif",
          fontSize: 16,
          lineHeight: 1.6,
          color: '#C8C6C5',
          maxWidth: 480,
          margin: '0 0 32px',
        }}
      >
        The page you're looking for doesn't exist or has moved. Let's get you back to safety.
      </p>
      <Link
        href="/"
        style={{
          fontFamily: "'Inter',sans-serif",
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          background: '#F5C344',
          color: '#1A1A1A',
          padding: '14px 26px',
          textDecoration: 'none',
        }}
      >
        ← Back to Home
      </Link>
    </section>
  );
}
