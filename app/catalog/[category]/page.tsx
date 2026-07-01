import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CATEGORY_META, categoryBySlug, PRODUCT_CATALOG } from '@/src/data/productCatalog';
import CategoryScreen from '@/src/screens/CategoryScreen';
import { categoryJsonLd, categoryBreadcrumbJsonLd } from '@/src/lib/seo';

// Pre-render a static page for every category.
export function generateStaticParams() {
  return Object.values(CATEGORY_META).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const id = categoryBySlug(category);
  if (!id) return {};
  const meta = CATEGORY_META[id];
  return {
    title: meta.h1,
    description: meta.metaDescription,
    alternates: { canonical: `/catalog/${meta.slug}` },
    openGraph: { title: `${meta.h1} — Rack Safety Products`, description: meta.metaDescription },
  };
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const id = categoryBySlug(category);
  if (!id) notFound();
  const products = PRODUCT_CATALOG.filter((p) => p.cat === id);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd(id, products)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryBreadcrumbJsonLd(id)) }} />
      <CategoryScreen category={id} />
    </>
  );
}
