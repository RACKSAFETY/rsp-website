import { NextResponse } from 'next/server';
import type { QuoteRequest, QuoteRecord } from '@/src/types';
import { saveQuote } from '@/src/lib/quotes';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// POST /api/quote — receives a contact/quote inquiry from the website form,
// validates it, builds a record, and hands it to saveQuote (today a stub).
export async function POST(request: Request) {
  let body: Partial<QuoteRequest>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const name = (body.name || '').trim();
  const company = (body.company || '').trim();
  const email = (body.email || '').trim();

  if (!name || !company || !email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'Name, company, and a valid email are required.' },
      { status: 400 },
    );
  }

  const record: QuoteRecord = {
    id: `RSP-${Date.now()}`,
    receivedAt: new Date().toISOString(),
    name,
    company,
    email,
    rackConfig: (body.rackConfig || '').trim(),
    notes: (body.notes || '').trim(),
    requestType: body.requestType ?? null,
    source: body.source || 'web',
  };

  await saveQuote(record);

  return NextResponse.json({ ok: true, id: record.id });
}
