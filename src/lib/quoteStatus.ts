// Lead pipeline statuses. Kept in its own module (no server imports) so it can
// be shared by both server code (validation) and client components (the picker).
export const QUOTE_STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost'] as const;
export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export const STATUS_COLORS: Record<string, string> = {
  new: '#807662',
  contacted: '#3D7DCA',
  quoted: '#BD480C',
  won: '#2ECC71',
  lost: '#E74C3C',
};
