// Lead pipeline statuses. Kept in its own module (no server imports) so it can
// be shared by both server code (validation) and client components (the picker).
export const QUOTE_STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost'] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];
