// ─────────────────────────────────────────────────────────────────────────────
// Structured data (schema.org JSON-LD) builders. Rendered server-side into the
// page HTML so Google/Bing and AI crawlers get explicit entity + product data.
// ─────────────────────────────────────────────────────────────────────────────
import { SITE } from '@/src/data/productCatalog';
import type { Product } from '@/src/types';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.racksafetyproducts.com';

const TELEPHONE = '+1-951-395-0280'; // E.164-ish, from SITE.phone
const abs = (path: string) => (path?.startsWith('http') ? path : `${SITE_URL}${path}`);

// Sitewide: Organization (the brand entity) + WebSite, linked by @id.
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE.company,
        url: SITE_URL,
        logo: `${SITE_URL}/assets/logos/rsp-logo-color.png`,
        email: SITE.email,
        telephone: TELEPHONE,
        address: {
          '@type': 'PostalAddress',
          streetAddress: '27141 Aliso Creek Road, Suite #200',
          addressLocality: 'Aliso Viejo',
          addressRegion: 'CA',
          postalCode: '92656',
          addressCountry: 'US',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: TELEPHONE,
          email: SITE.email,
          contactType: 'sales',
          areaServed: 'US',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Rack Safety Products',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };
}

// Product page: Product entity (no price → no Offer; still valid + useful context).
export function productJsonLd(p: Product) {
  const description = p.desc?.startsWith('TODO') ? `${p.name} — ${p.catLabel} from Rack Safety Products.` : p.desc;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description,
    image: abs(p.img),
    category: p.catLabel,
    url: `${SITE_URL}/products/${p.id}`,
    brand: { '@type': 'Brand', name: p.mfg || 'Rack Safety Products' },
    manufacturer: { '@id': `${SITE_URL}/#organization` },
  };
}

// Product page breadcrumb: Home › Catalog › Product (no category pages yet).
export function breadcrumbJsonLd(p: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Catalog', item: `${SITE_URL}/catalog` },
      { '@type': 'ListItem', position: 3, name: p.name },
    ],
  };
}
