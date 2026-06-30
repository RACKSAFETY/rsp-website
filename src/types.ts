// ─────────────────────────────────────────────────────────────────────────────
// Shared domain types for the RSP site.
// ─────────────────────────────────────────────────────────────────────────────

// Top-level product category ids (must match CATEGORIES in data/productCatalog.ts).
export type CategoryId =
  | 'decking'
  | 'protection'
  | 'flue'
  | 'dividers'
  | 'fall'
  | 'repair-kits'
  | 'warehouse';

// Logical navigation destinations. The router URL each maps to lives in lib/navMap.ts.
export type NavTarget =
  | 'home'
  | 'catalog'
  | 'product'
  | 'services'
  | 'resources'
  | 'contact'
  | 'about';

// A specific orderable size/SKU of a product (e.g. a wire-deck size). This is
// where per-size part numbers and pricing live — the foundation for quoting.
export interface ProductPart {
  sku?: string; // part number (TODO until provided by the business)
  depth?: number; // inches
  width?: number; // inches
  capacity?: number; // lbs, UDL (industry-typical — TODO-VERIFY exact ratings)
  price?: number; // $/unit (TODO)
}

export interface Product {
  id: string;
  name: string;
  cat: CategoryId;
  catLabel: string;
  subGroup?: string;
  mfg?: string;
  tag?: [string, string] | null;
  img: string;
  sku: string;
  desc: string;
  specs: [string, string][];
  compliance: string[];
  pricePer: string;
  leadTime: string;
  cta: string;
  parts?: ProductPart[]; // size/part variants (e.g. wire-deck sizes)
}

export interface Service {
  slug: string;
  icon: string;
  title: string;
  desc: string;
  cta: string;
}

export interface SiteConfig {
  company: string;
  address: string[];
  phone: string;
  email: string;
  hours: string;
  timezone: string;
  stats: [string, string][];
}

// Payload the contact form sends to POST /api/quote.
export interface QuoteRequest {
  name: string;
  company: string;
  email: string;
  rackConfig: string;
  notes: string;
  requestType?: string | null;
  source?: string;
}

// A persisted quote inquiry (what saveQuote receives once a record is built).
export interface QuoteRecord extends QuoteRequest {
  id: string;
  receivedAt: string;
  status?: string; // lead pipeline status; see lib/quoteStatus.ts
}
