import type { Metadata } from 'next';
import ResourcesScreen from '@/src/screens/ResourcesScreen';

export const metadata: Metadata = {
  title: 'Warehouse Rack Safety Resources & Guides',
  description:
    'NFPA 13 flue space guidance, the flue compliance calculator, and warehouse rack safety resources from Rack Safety Products.',
  alternates: { canonical: '/resources' },
};

export default function Page() {
  return <ResourcesScreen />;
}
