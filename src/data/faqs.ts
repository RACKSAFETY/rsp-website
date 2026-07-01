// ─────────────────────────────────────────────────────────────────────────────
// Resources-page FAQ. This is the SINGLE source of truth for both the visible
// FAQ (rendered in ResourcesScreen) and the FAQPage JSON-LD emitted in
// app/resources/page.tsx. Google requires FAQ markup to match the on-page text,
// so both read from this array — do not fork the copy.
//
// Every answer here must be factually accurate: real standards, real services,
// no invented warranties, SLAs, leasing programs, or shipping windows. If a fact
// isn't verified, leave it out rather than mark it up.
// ─────────────────────────────────────────────────────────────────────────────
export type Faq = { q: string; a: string };

export const RESOURCES_FAQS: Faq[] = [
  {
    q: 'What is NFPA 13 flue space, and why does it matter?',
    a: 'Flue space is the clear gap between stored pallets and rows of rack that lets sprinkler water reach a fire burning deep inside the racking. NFPA 13 calls for a nominal 6-inch transverse flue space between back-to-back rows, plus longitudinal flue space in many double-row and multi-row rack layouts. Blocked flues are one of the most commonly cited fire-code issues in rack storage. You can screen your own setup for free with our Flue Space Calculator.',
  },
  {
    q: 'How often should I inspect my pallet rack?',
    a: 'A common approach is routine visual checks by trained warehouse staff, a periodic inspection by a qualified expert (many operators schedule this at least once a year), and an immediate check after any forklift impact. Damaged uprights, loose anchors, bent beams, and missing safety clips should be tagged and addressed right away. If you would like an outside review, we offer warehouse and pallet-rack safety audits.',
  },
  {
    q: 'Can a damaged rack upright be repaired, or does it have to be replaced?',
    a: 'In many cases it can be repaired rather than replaced. We use RMI-certified repair kits and build a repair plan around your specific rack, restoring the damaged section to its original load-bearing integrity — engineered by our in-house structural engineer. This is usually faster and far less costly than tearing out and replacing whole rack bays after a forklift impact.',
  },
  {
    q: 'What standards govern warehouse rack and fire safety?',
    a: 'The three most relevant are NFPA 13 (sprinkler design and in-rack flue space for fire protection), OSHA 1910.176 (safe handling and storage of materials), and ANSI MH16.1 (the design, testing, and use standard for industrial steel storage racks). Our product specifications are mapped to these standards, and our team can help you match a fix to the specific code finding on your site.',
  },
  {
    q: 'Do you offer rack safety audits and inspections?',
    a: 'Yes. Our warehouse and pallet-rack safety audits review your racking for damage, overloading, flue-space and anchoring issues, and code compliance, and give you a documented punch list of what to fix. It is the fastest way to turn an insurance or fire-marshal finding into a clear remediation plan. Contact us to schedule one.',
  },
  {
    q: 'Do you install nationwide, and how do I get a quote?',
    a: 'We ship and install nationwide across the contiguous United States through our network of experienced rack installers — contact us for Alaska, Hawaii, or international projects. To get a quote, send us your site details using the Get a Quote form or the quote request on any product page, and we will scope it and follow up.',
  },
];
