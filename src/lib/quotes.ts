import type { QuoteRecord } from '@/src/types';
import { neon } from '@neondatabase/serverless';
import { QUOTE_STATUSES, type QuoteStatus } from '@/src/lib/quoteStatus';

// ─────────────────────────────────────────────────────────────────────────────
// Quote persistence + notification.
//
// Everything here is GATED on environment variables, so this file is safe to
// deploy as-is: with nothing configured it just logs the inquiry on the server
// (the old stub behavior). The moment you add the env vars below, it activates —
// no code change needed beyond setting the vars (and a redeploy).
//
//   Postgres (Vercel Marketplace → Neon):
//     DATABASE_URL   (or POSTGRES_URL) — injected automatically when you create
//                    the database in the Vercel dashboard and link it to the project.
//
//   Email notification (optional, via Resend — https://resend.com):
//     RESEND_API_KEY     — your Resend API key
//     QUOTE_NOTIFY_EMAIL — inbox that should receive new-lead emails
//     QUOTE_FROM_EMAIL   — a Resend-verified sender address (e.g. quotes@yourdomain.com)
//
// saveQuote never throws: a DB or email hiccup must not fail the visitor's
// submission. Failures are logged; the record is always returned.
// ─────────────────────────────────────────────────────────────────────────────

const DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
const sql = DB_URL ? neon(DB_URL) : null;

let schemaReady = false;

async function ensureSchema(): Promise<void> {
  if (!sql || schemaReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS quotes (
      id            text PRIMARY KEY,
      received_at   timestamptz NOT NULL,
      name          text NOT NULL,
      company       text NOT NULL,
      email         text NOT NULL,
      rack_config   text,
      notes         text,
      request_type  text,
      source        text,
      status        text NOT NULL DEFAULT 'new'
    )
  `;
  // Backfill the status column on tables created before it was added.
  await sql`ALTER TABLE quotes ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new'`;
  schemaReady = true;
}

// Insert the record. Returns true if stored, false if no DB is configured.
async function persist(record: QuoteRecord): Promise<boolean> {
  if (!sql) return false;
  await ensureSchema();
  await sql`
    INSERT INTO quotes
      (id, received_at, name, company, email, rack_config, notes, request_type, source)
    VALUES
      (${record.id}, ${record.receivedAt}, ${record.name}, ${record.company},
       ${record.email}, ${record.rackConfig}, ${record.notes},
       ${record.requestType ?? null}, ${record.source ?? 'web'})
    ON CONFLICT (id) DO NOTHING
  `;
  return true;
}

// Email a notification via Resend's REST API (no SDK dependency). Returns true
// if sent, false if email isn't configured.
async function notify(record: QuoteRecord): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_NOTIFY_EMAIL;
  const from = process.env.QUOTE_FROM_EMAIL;
  if (!key || !to || !from) return false;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to,
      reply_to: record.email,
      subject: `New quote request — ${record.company} (${record.id})`,
      text: [
        `Quote request ${record.id}`,
        `Received: ${record.receivedAt}`,
        '',
        `Name:    ${record.name}`,
        `Company: ${record.company}`,
        `Email:   ${record.email}`,
        `Rack:    ${record.rackConfig || '—'}`,
        `Type:    ${record.requestType || '—'}`,
        `Source:  ${record.source || 'web'}`,
        '',
        'Notes:',
        record.notes || '(none)',
      ].join('\n'),
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  return true;
}

export async function saveQuote(record: QuoteRecord): Promise<QuoteRecord> {
  const [dbResult, mailResult] = await Promise.allSettled([persist(record), notify(record)]);

  const stored = dbResult.status === 'fulfilled' && dbResult.value === true;
  const mailed = mailResult.status === 'fulfilled' && mailResult.value === true;

  if (dbResult.status === 'rejected') console.error('[quote] DB insert failed', dbResult.reason);
  if (mailResult.status === 'rejected') console.error('[quote] email failed', mailResult.reason);

  // If neither destination is configured (or both failed), at least keep a
  // server log so the lead is recoverable from function logs.
  if (!stored && !mailed) {
    console.log('[quote] received (not persisted — DB/email not configured)', record);
  }

  return record;
}

// List recent quotes, newest first, for the admin view. Empty array if no DB
// is configured.
export async function listQuotes(limit = 200): Promise<QuoteRecord[]> {
  if (!sql) return [];
  await ensureSchema();
  const rows = (await sql`
    SELECT id, received_at, name, company, email, rack_config, notes, request_type, source, status
    FROM quotes
    ORDER BY received_at DESC
    LIMIT ${limit}
  `) as Array<{
    id: string;
    received_at: string;
    name: string;
    company: string;
    email: string;
    rack_config: string | null;
    notes: string | null;
    request_type: string | null;
    source: string | null;
    status: string | null;
  }>;
  return rows.map((r) => ({
    id: r.id,
    receivedAt: r.received_at,
    name: r.name,
    company: r.company,
    email: r.email,
    rackConfig: r.rack_config ?? '',
    notes: r.notes ?? '',
    requestType: r.request_type,
    source: r.source ?? 'web',
    status: r.status ?? 'new',
  }));
}

// Update a quote's pipeline status (validated against QUOTE_STATUSES).
export async function updateQuoteStatus(id: string, status: string): Promise<void> {
  if (!sql) return;
  if (!QUOTE_STATUSES.includes(status as QuoteStatus)) return;
  await ensureSchema();
  await sql`UPDATE quotes SET status = ${status} WHERE id = ${id}`;
}

// Permanently delete a quote.
export async function deleteQuote(id: string): Promise<void> {
  if (!sql) return;
  await ensureSchema();
  await sql`DELETE FROM quotes WHERE id = ${id}`;
}
