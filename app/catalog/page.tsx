import { Suspense } from 'react';
import type { Metadata } from 'next';
import CatalogScreen from '@/src/screens/CatalogScreen';

export const metadata: Metadata = {
  title: 'Pallet Rack Decking, Protection & Flue Products',
  description:
    'Browse pallet rack decking, protection, flue products, dividers, fall protection, repair kits, and warehouse safety products.',
  alternates: { canonical: '/catalog' },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CatalogScreen />
    </Suspense>
  );
}
