import React from 'react';
import LegalDoc, { type LegalSection } from './LegalDoc';
import { SITE } from '../data/productCatalog';

// NOTE: This is a solid, accurate starting point that reflects how the site
// actually handles data (the quote form → Neon Postgres, hosted on Vercel, with
// optional Resend email). It is not a substitute for legal counsel — have an
// attorney review before you rely on it, and update it if you add analytics,
// cookies, advertising pixels, or newsletter processing.

const CONTACT_LINES = [SITE.company, ...SITE.address, SITE.email, SITE.phone];

const SECTIONS: LegalSection[] = [
  {
    heading: 'Information We Collect',
    blocks: [
      { p: 'We collect information in two ways: information you provide directly, and information collected automatically when you use the site.' },
      { ul: [
        'Information you provide — When you submit a quote or contact request, we collect the details you enter, such as your name, company, email address, phone number, and any project or site information you include in your message.',
        'Information collected automatically — Like most websites, our hosting and infrastructure providers automatically log basic technical data such as your IP address, browser type, device information, and the pages you visit. This helps us keep the site secure and running reliably.',
      ] },
    ],
  },
  {
    heading: 'How We Use Your Information',
    blocks: [
      { p: 'We use the information we collect to:' },
      { ul: [
        'Respond to your quote requests, questions, and service inquiries;',
        'Prepare quotes and fulfill orders for products and services;',
        'Operate, maintain, secure, and improve our website;',
        'Communicate with you about your request or an active project; and',
        'Comply with our legal and regulatory obligations.',
      ] },
      { p: 'We do not sell your personal information.' },
    ],
  },
  {
    heading: 'How We Share Information',
    blocks: [
      { p: 'We share information only as needed to operate our business, including with:' },
      { ul: [
        'Service providers who host our website, database, and email on our behalf and are bound to protect the information they process for us;',
        'Professional advisors, and where required to comply with applicable law, a legal process, or a lawful request from a government authority; and',
        'A successor entity in connection with a merger, acquisition, or sale of business assets.',
      ] },
    ],
  },
  {
    heading: 'Data Retention & Security',
    blocks: [
      { p: 'We retain the information you provide for as long as necessary to respond to your request, fulfill an order, and meet our legal and business requirements, after which we take steps to delete or de-identify it. We use reasonable administrative and technical safeguards to protect information, though no method of transmission or storage is completely secure.' },
    ],
  },
  {
    heading: 'Your Choices & Rights',
    blocks: [
      { p: 'You may contact us at any time to ask what information we hold about you, to request a correction, or to ask us to delete it, and we will respond consistent with applicable law.' },
      { p: 'California residents — Under the California Consumer Privacy Act (CCPA/CPRA), you have the right to know what personal information we collect, to request access to or deletion of that information, and to not be discriminated against for exercising these rights. Because we do not sell or share personal information for cross-context behavioral advertising, no opt-out of sale is required. To make a request, contact us using the details below.' },
    ],
  },
  {
    heading: 'Third-Party Links',
    blocks: [
      { p: 'Our site may link to third-party websites or manufacturer resources that we do not control. This Privacy Policy does not apply to those sites, and we encourage you to review their privacy practices.' },
    ],
  },
  {
    heading: "Children's Privacy",
    blocks: [
      { p: 'Our website and services are intended for businesses and are not directed to children under 16. We do not knowingly collect personal information from children.' },
    ],
  },
  {
    heading: 'Changes to This Policy',
    blocks: [
      { p: 'We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date above. Material changes will be reflected on this page.' },
    ],
  },
  {
    heading: 'Contact Us',
    blocks: [
      { p: 'If you have questions about this Privacy Policy or how we handle your information, contact us at:' },
      { lines: CONTACT_LINES },
    ],
  },
];

export default function PrivacyScreen() {
  return (
    <LegalDoc
      kicker="PRIVACY"
      title="Privacy Policy"
      updated="July 1, 2026"
      intro={[
        'This Privacy Policy explains how Rack Safety Products, LLC ("Rack Safety Products," "we," "us," or "our") collects, uses, and protects information when you visit our website or request a quote, product, or service from us.',
      ]}
      sections={SECTIONS}
    />
  );
}
