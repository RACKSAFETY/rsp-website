import type { Metadata } from 'next';
import AboutScreen from '@/src/screens/AboutScreen';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Rack Safety Products — rack and fire protection specialists helping warehouses meet NFPA 13, OSHA, and ANSI MH16.1 standards.',
  alternates: { canonical: '/about' },
};

export default function Page() {
  return <AboutScreen />;
}
