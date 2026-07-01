import type { Metadata } from 'next';
import ServicesScreen from '@/src/screens/ServicesScreen';

export const metadata: Metadata = {
  title: 'Pallet Rack Installation, Repairs & Safety Audits',
  description:
    'Pallet rack tear downs, safety audits, installation, repairs, re-engineering, and used rack buy/sell from Rack Safety Products.',
  alternates: { canonical: '/services' },
};

export default function Page() {
  return <ServicesScreen />;
}
