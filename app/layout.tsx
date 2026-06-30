import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/src/styles/rsp.css';
import { TopNav, Footer } from '@/src/components';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.racksafetyproducts.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Rack Safety Products — Pallet Rack Safety, Flue Products & Warehouse Protection',
    template: '%s — Rack Safety Products',
  },
  description:
    'Pallet rack flue products, decking, protection, repair kits, and warehouse safety — engineered for NFPA 13 and OSHA compliance.',
  openGraph: {
    type: 'website',
    siteName: 'Rack Safety Products',
    url: SITE_URL,
    title: 'Rack Safety Products',
    description:
      'Pallet rack safety, flue products, and warehouse protection engineered for NFPA 13 and OSHA compliance.',
    images: ['/assets/logos/rsp-logo-color.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ background: '#F9F9F9', minHeight: '100vh' }}>
          <TopNav />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
