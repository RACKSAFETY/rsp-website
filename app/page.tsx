import { Suspense } from 'react';
import type { Metadata } from 'next';
import HomeScreen from '@/src/screens/HomeScreen';

export const metadata: Metadata = {
  title: { absolute: 'Rack Safety Products | Pallet Rack Flue, Decking & Protection' },
  description:
    'Rack Safety Products supplies pallet rack flue products, decking, protection, and warehouse safety systems — engineered for NFPA 13 and OSHA compliance.',
  alternates: { canonical: '/' },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomeScreen />
    </Suspense>
  );
}
