import type { Metadata } from 'next';
import PrivacyScreen from '@/src/screens/PrivacyScreen';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Rack Safety Products collects, uses, shares, and protects the information you provide through our website and quote requests.',
  alternates: { canonical: '/privacy' },
};

export default function Page() {
  return <PrivacyScreen />;
}
