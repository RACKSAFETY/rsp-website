import type { Metadata } from 'next';
import { listQuotes } from '@/src/lib/quotes';
import RowActions from './RowActions';

// Always render fresh (live lead data); never cache or prerender.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Quote Requests — Admin',
  robots: { index: false, follow: false },
};

const TH: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 12px',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 11,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#F5C344',
  borderBottom: '2px solid #BD480C',
  whiteSpace: 'nowrap',
};

const TD: React.CSSProperties = {
  padding: '10px 12px',
  fontFamily: "'Inter', sans-serif",
  fontSize: 13,
  color: '#1A1A1A',
  borderBottom: '1px solid #E2E2E2',
  verticalAlign: 'top',
};

export default async function AdminPage() {
  const quotes = await listQuotes();

  return (
    <main style={{ minHeight: '100vh', background: '#F9F9F9', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 24 }}>
          <h1
            style={{
              fontFamily: "'Anton', sans-serif",
              fontWeight: 400,
              fontSize: 36,
              textTransform: 'uppercase',
              margin: 0,
              color: '#1A1A1A',
            }}
          >
            Quote Requests
          </h1>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              fontWeight: 700,
              color: '#BD480C',
            }}
          >
            {quotes.length} total
          </span>
        </div>

        {quotes.length === 0 ? (
          <div
            style={{
              background: '#FFFFFF',
              border: '2px dashed #DADADA',
              padding: 40,
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif",
              color: '#807662',
            }}
          >
            No quote requests yet. (If you just connected the database, submit a test on the
            contact form — it'll appear here.)
          </div>
        ) : (
          <div style={{ overflowX: 'auto', background: '#FFFFFF', border: '2px solid #1A1A1A' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 900 }}>
              <thead style={{ background: '#1A1A1A' }}>
                <tr>
                  <th style={TH}>Received</th>
                  <th style={TH}>Name</th>
                  <th style={TH}>Company</th>
                  <th style={TH}>Email</th>
                  <th style={TH}>Rack Config</th>
                  <th style={TH}>Type</th>
                  <th style={TH}>Notes</th>
                  <th style={TH}>Manage</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr key={q.id}>
                    <td style={{ ...TD, whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                      {new Date(q.receivedAt).toLocaleString('en-US')}
                    </td>
                    <td style={{ ...TD, fontWeight: 600 }}>{q.name}</td>
                    <td style={TD}>{q.company}</td>
                    <td style={TD}>
                      <a href={`mailto:${q.email}`} style={{ color: '#BD480C' }}>
                        {q.email}
                      </a>
                    </td>
                    <td style={TD}>{q.rackConfig || '—'}</td>
                    <td style={{ ...TD, whiteSpace: 'nowrap' }}>{q.requestType || '—'}</td>
                    <td style={{ ...TD, minWidth: 240, whiteSpace: 'pre-wrap' }}>{q.notes || '—'}</td>
                    <td style={{ ...TD, whiteSpace: 'nowrap' }}>
                      <RowActions id={q.id} status={q.status ?? 'new'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
