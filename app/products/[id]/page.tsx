import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PRODUCT_CATALOG } from '@/src/data/productCatalog';
import ProductScreen from '@/src/screens/ProductScreen';

// Pre-render a static page for every product in the catalog.
export function generateStaticParams() {
  return PRODUCT_CATALOG.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = PRODUCT_CATALOG.find((x) => x.id === id);
  if (!p) return {};
  const description = p.desc?.startsWith('TODO')
    ? `${p.name} — ${p.catLabel} from Rack Safety Products.`
    : p.desc;
  return {
    title: p.name,
    description,
    alternates: { canonical: `/products/${p.id}` },
    openGraph: {
      title: `${p.name} — Rack Safety Products`,
      description,
      images: [p.img],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exists = PRODUCT_CATALOG.some((x) => x.id === id);
  if (!exists) notFound();
  return <ProductScreen productId={id} />;
}
