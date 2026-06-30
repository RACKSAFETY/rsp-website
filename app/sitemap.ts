import type { MetadataRoute } from 'next';
import { PRODUCT_CATALOG } from '@/src/data/productCatalog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.racksafetyproducts.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ['', '/catalog', '/services', '/resources', '/about', '/contact'];

  const staticEntries = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));

  const productEntries = PRODUCT_CATALOG.map((p) => ({
    url: `${SITE_URL}/products/${p.id}`,
    lastModified: now,
  }));

  return [...staticEntries, ...productEntries];
}
