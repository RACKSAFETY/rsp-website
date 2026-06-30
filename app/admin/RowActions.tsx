'use client';

import { useTransition } from 'react';
import { QUOTE_STATUSES, STATUS_COLORS } from '@/src/lib/quoteStatus';
import { setQuoteStatusAction, deleteQuoteAction } from './actions';

export default function RowActions({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();
  const color = STATUS_COLORS[status] ?? '#807662';

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', opacity: pending ? 0.5 : 1 }}>
      <select
        defaultValue={status}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          startTransition(() => setQuoteStatusAction(id, next));
        }}
        aria-label="Lead status"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '5px 8px',
          border: `2px solid ${color}`,
          color,
          background: '#FFFFFF',
          borderRadius: 0,
          cursor: pending ? 'wait' : 'pointer',
        }}
      >
        {QUOTE_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (window.confirm('Delete this quote permanently?')) {
            startTransition(() => deleteQuoteAction(id));
          }
        }}
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '5px 10px',
          border: '2px solid #1A1A1A',
          background: '#1A1A1A',
          color: '#FFFFFF',
          cursor: pending ? 'wait' : 'pointer',
        }}
      >
        Delete
      </button>
    </div>
  );
}
