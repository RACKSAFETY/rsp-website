import type { Metadata } from 'next';
import ResourcesScreen from '@/src/screens/ResourcesScreen';
import { faqJsonLd } from '@/src/lib/seo';
import { RESOURCES_FAQS } from '@/src/data/faqs';

export const metadata: Metadata = {
  title: 'Warehouse Rack Safety Resources & Guides',
  description:
    'NFPA 13 flue space guidance, the free flue compliance calculator, rack inspection and repair guides, and answers to common warehouse rack safety questions.',
  alternates: { canonical: '/resources' },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(RESOURCES_FAQS)) }}
      />
      <ResourcesScreen />
    </>
  );
}
