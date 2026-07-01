import React from 'react';
import LegalDoc, { type LegalSection } from './LegalDoc';
import { SITE } from '../data/productCatalog';

// NOTE: This is a solid, accurate starting point tailored to what the site does
// (informational catalog + non-binding quote requests + a flue calculator and
// safety guides). It is not a substitute for legal counsel — have an attorney
// review before you rely on it. The Governing Law section assumes California.

const CONTACT_LINES = [SITE.company, ...SITE.address, SITE.email, SITE.phone];

const SECTIONS: LegalSection[] = [
  {
    heading: 'Use of the Site',
    blocks: [
      { p: 'The Site is provided for general business and informational purposes — to present our products, services, and safety resources. You agree to use the Site lawfully and not to misuse it, interfere with its operation, attempt to gain unauthorized access, or use it in any way that could damage or impair it.' },
    ],
  },
  {
    heading: 'Product Information & Specifications',
    blocks: [
      { p: 'We work to keep product descriptions, dimensions, capacities, and specifications accurate, but this information is provided for general guidance and may contain errors, omissions, or updates. Product specifications, availability, and lead times are subject to change without notice. Nothing on the Site is a guarantee that a given product is suitable for your specific application.' },
    ],
  },
  {
    heading: 'Safety Resources & the Flue Space Calculator',
    blocks: [
      { p: 'Our guides, standards references (including NFPA 13, OSHA, and ANSI MH16.1 material), and the Flue Space Calculator are educational tools provided for general information only. They are not a substitute for a professional engineering evaluation, a certified inspection, or the requirements of your local authority having jurisdiction (AHJ), fire marshal, or insurer. You are responsible for verifying compliance for your specific facility with a qualified professional. Rack Safety Products is not liable for decisions made solely in reliance on these tools.' },
    ],
  },
  {
    heading: 'Quotes, Pricing & Orders',
    blocks: [
      { p: 'Requesting a quote through the Site does not create a binding contract. Quotes are estimates based on the information you provide, are subject to review and change, and expire as stated on the quote. Any resulting sale of products or services is governed by the specific quote, order confirmation, or written agreement between us, which will control in the event of a conflict with these Terms.' },
    ],
  },
  {
    heading: 'Intellectual Property',
    blocks: [
      { p: 'The Site and its content — including text, graphics, logos, product imagery, and the "Rack Safety Products" name and related marks — are owned by Rack Safety Products, LLC or its licensors and are protected by intellectual-property laws. You may view and print pages for your own internal business use, but you may not copy, republish, or use our content for commercial purposes without our prior written permission. Third-party product names and trademarks are the property of their respective owners.' },
    ],
  },
  {
    heading: 'Third-Party Links',
    blocks: [
      { p: 'The Site may contain links to third-party websites and resources. We provide these for convenience and do not endorse or take responsibility for their content, products, or practices.' },
    ],
  },
  {
    heading: 'Disclaimer of Warranties',
    blocks: [
      { p: 'The Site is provided "as is" and "as available," without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Site will be uninterrupted, error-free, or secure. This section addresses the Site itself; any warranty on products or services we sell is set out in the applicable quote, order, or agreement.' },
    ],
  },
  {
    heading: 'Limitation of Liability',
    blocks: [
      { p: 'To the fullest extent permitted by law, Rack Safety Products, LLC and its owners, employees, and suppliers will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, data, or business, arising out of or related to your use of the Site or these safety resources, even if we have been advised of the possibility of such damages.' },
    ],
  },
  {
    heading: 'Indemnification',
    blocks: [
      { p: 'You agree to indemnify and hold harmless Rack Safety Products, LLC from any claims, damages, or expenses arising out of your misuse of the Site or your violation of these Terms.' },
    ],
  },
  {
    heading: 'Governing Law',
    blocks: [
      { p: 'These Terms are governed by the laws of the State of California, without regard to its conflict-of-laws rules. Any dispute relating to the Site or these Terms will be subject to the exclusive jurisdiction of the state and federal courts located in California.' },
    ],
  },
  {
    heading: 'Changes to These Terms',
    blocks: [
      { p: 'We may update these Terms from time to time. Changes take effect when posted, and we will revise the "Last updated" date above. Your continued use of the Site after changes are posted means you accept the updated Terms.' },
    ],
  },
  {
    heading: 'Contact Us',
    blocks: [
      { p: 'Questions about these Terms? Contact us at:' },
      { lines: CONTACT_LINES },
    ],
  },
];

export default function TermsScreen() {
  return (
    <LegalDoc
      kicker="TERMS"
      title="Terms of Service"
      updated="July 1, 2026"
      intro={[
        'These Terms of Service ("Terms") govern your use of this website (the "Site"), operated by Rack Safety Products, LLC ("Rack Safety Products," "we," "us," or "our"). By accessing or using the Site, you agree to these Terms. If you do not agree, please do not use the Site.',
      ]}
      sections={SECTIONS}
    />
  );
}
