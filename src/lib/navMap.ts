// ─────────────────────────────────────────────────────────────────────────────
// Pure target → URL mapping. The single source of truth for how the old
// onNav(target, payload) destinations translate to real routes. Shared by the
// useNav() client hook and by TopNav/Footer <Link> hrefs.
// ─────────────────────────────────────────────────────────────────────────────
import type { NavTarget } from '@/src/types';

const DEFAULT_PRODUCT = 'flue-guard';

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
    case 'product':
      return productPath(payload || DEFAULT_PRODUCT);
    case 'services':
      return '/services';
    case 'resources':
      return '/resources';
    case 'about':
      return '/about';
    case 'contact':
      // The large 'flue-calc:' summary is handed off via sessionStorage by useNav,
      // so the URL stays clean. Short request tokens ride a shareable query param.
      if (!payload || payload.startsWith('flue-calc:')) return '/contact';
      return `/contact?request=${encodeURIComponent(payload)}`;
    default:
      return '/';
  }
}
