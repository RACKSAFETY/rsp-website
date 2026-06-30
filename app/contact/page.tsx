import { Suspense } from 'react';
import type { Metadata } from 'next';
import ContactScreen from '@/src/screens/ContactScreen';

export const metadata: Metadata = {
  title: 'Request a Quote',
  description:
    'Request a precision quote from the Rack Safety Products engineering team. Response within 24 hours.',
  alternates: { canonical: '/contact' },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ContactScreen />
    </Suspense>
  );
}
