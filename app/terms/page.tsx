import type { Metadata } from 'next';
import TermsScreen from '@/src/screens/TermsScreen';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms that govern use of the Rack Safety Products website, safety resources, the flue space calculator, and quote requests.',
  alternates: { canonical: '/terms' },
};

export default function Page() {
  return <TermsScreen />;
}
