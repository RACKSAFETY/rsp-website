// ─────────────────────────────────────────────────────────────────────────────
// Pure target → URL mapping. The single source of truth for how the old
// onNav(target, payload) destinations translate to real routes. Shared by the
// useNav() client hook and by TopNav/Footer <Link> hrefs.
// ─────────────────────────────────────────────────────────────────────────────
import type { NavTarget } from '@/src/types';

const DEFAULT_PRODUCT = 'flue-guard';

// Contact-form payloads that carry a large structured summary. These ride through
// a sessionStorage handoff (see useNav) instead of the URL, so targetToHref keeps
// the URL clean ('/contact') for them. Currently: the flue calculator result and
// the product-page custom spec builder.
export const HANDOFF_PREFIXES = ['flue-calc:', 'custom-req:'];
export const isHandoffPayload = (payload?: string | null): boolean =>
  !!payload && HANDOFF_PREFIXES.some((prefix) => payload.startsWith(prefix));

export function productPath(id: string): string {
  return `/products/${id}`;
}

export function targetToHref(target: NavTarget, payload?: string | null): string {
  switch (target) {
    case 'home':
      // payload is an on-page anchor id (e.g. 'calculator')
      return payload ? `/?section=${encodeURIComponent(payload)}` : '/';
    case 'catalog':
      // payload is a CATEGORIES id (e.g. 'flue')
      return payload ? `/catalog?category=${encodeURIComponent(payload)}` : '/catalog';
    case 'category':
      // payload is a CATEGORY_META slug (e.g. 'flue-products') → dedicated landing page
      return payload ? `/catalog/${payload}` : '/catalog';
    case 'product':
      return productPath(payload || DEFAULT_PRODUCT);
    case 'services':
      return '/services';
    case 'resources':
      return '/resources';
    case 'about':
      return '/about';
    case 'privacy':
      return '/privacy';
    case 'terms':
      return '/terms';
    case 'contact':
      // Large structured summaries are handed off via sessionStorage by useNav, so
      // the URL stays clean. Short request tokens ride a shareable query param.
      if (!payload || isHandoffPayload(payload)) return '/contact';
      return `/contact?request=${encodeURIComponent(payload)}`;
    default:
      return '/';
  }
}
