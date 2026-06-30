import type { QuoteRecord } from '@/src/types';

// ─────────────────────────────────────────────────────────────────────────────
// Quote persistence stub. Today it just logs the inquiry on the server. This is
// the single place to wire real persistence later — a database (Vercel Postgres /
// Neon), an email notification, and/or a CRM forward — without touching the API
// route or the contact form.
// ─────────────────────────────────────────────────────────────────────────────
export async function saveQuote(record: QuoteRecord): Promise<QuoteRecord> {
  // TODO: persist `record` (DB insert), then notify/forward (email, CRM).
  console.log('[quote] received', record);
  return record;
}
