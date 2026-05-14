/* =============================================================================
   NFPA 13 — Rack Storage Flue-Space Ruleset
   =============================================================================
   Pure data + pure functions. No React imports — safe to unit test directly.

   This module is a SCREENING ruleset. It answers one question: what nominal
   transverse and longitudinal flue spaces does NFPA 13 require for a given rack
   arrangement? It is NOT a full NFPA 13 design (no sprinkler hydraulics, no
   commodity classification). A licensed fire protection engineer must confirm
   any real design.

   HOW TO EDIT
   -----------
   • Each entry in NFPA13_FLUE_RULES is ONE provision. Keep it that way — one
     provision per rule keeps the file auditable line-by-line against the book.
   • `when(i)` is a predicate over NORMALIZED inputs (see normalizeInputs). It
     must return a boolean and must not throw on weird input.
   • `citation` is the section number only (e.g. '§16.1.10.2'). `note` is a
     short paraphrase — never paste verbatim standard text (the source PDF is a
     licensed copy).
   • `verified: true` means "checked against the edition named in EDITION below."
     It does NOT mean PE-reviewed.

   HOW TO BUMP THE EDITION
   -----------------------
   The 2016+ editions renumbered the storage chapters. To move to a newer
   edition: update EDITION, then re-check every rule's `minFlueIn` + `citation`
   against the new text and keep/clear `verified` accordingly. The unit tests in
   nfpa13FlueRules.test.js assert the current numbers, so a value change will
   fail loudly until the tests are updated to match.
   ========================================================================== */

export const STANDARD = 'NFPA 13';
export const EDITION = '2013';

// Commodity class → governing rack-storage chapter in the 2013 edition.
// Chapter 16 = Class I–IV commodities. Chapter 17 = plastic & rubber commodities.
const COMMODITY_CHAPTER = {
  'class-1': 16,
  'class-2': 16,
  'class-3': 16,
  'class-4': 16,
  'group-a-plastic': 17,
  'rubber': 17,
};

export const COMMODITY_OPTIONS = [
  ['class-1', 'Class I — Noncombustible'],
  ['class-2', 'Class II — Combustible, in ordinary containers'],
  ['class-3', 'Class III — Wood / paper / natural fiber'],
  ['class-4', 'Class IV — Class I–III with some plastics'],
  ['group-a-plastic', 'Group A Plastics'],
  ['rubber', 'Rubber'],
];

export const RACK_TYPE_OPTIONS = [
  ['single-row', 'Single-row rack'],
  ['double-row', 'Double-row rack'],
  ['multiple-row', 'Multiple-row rack'],
];

export const SPRINKLER_OPTIONS = [
  ['control-mode', 'Traditional Ceiling Control Mode (density/area or CMSA)'],
  ['in-rack', 'In-rack sprinklers'],
  ['esfr', 'ESFR'],
];

// Input bounds, in feet. normalizeInputs clamps to these.
const BOUNDS = {
  storageHeightFt: { min: 5, max: 45 },
  ceilingHeightFt: { min: 8, max: 50 },
  aisleWidthFt: { min: 2, max: 16 },
};

const STANDING_DISCLAIMER =
  `Screening estimate based on ${STANDARD}, ${EDITION} edition — not a substitute ` +
  `for a full NFPA 13 analysis or a licensed fire protection engineer.`;

// ─────────────────────────────────────────────────────────────────────────────
// The ruleset. One provision per entry. See "HOW TO EDIT" above.
// All entries verified against the NFPA 13 2013 edition text.
// ─────────────────────────────────────────────────────────────────────────────
export const NFPA13_FLUE_RULES = [
  // ── Transverse flue — nominal 6 in. across every rack type, both chapters,
  //    both height tiers. Four near-identical provisions, cited separately.
  {
    id: 'transverse-class1-4-le25',
    appliesTo: 'transverse',
    when: (i) => i.commodityChapter === 16 && i.storageHeightFt <= 25,
    minFlueIn: 6,
    nominal: true,
    citation: '§16.1.10.2',
    note: 'Nominal 6 in. transverse flue spaces between loads and at rack uprights — single-, double-, and multiple-row racks.',
    verified: true,
  },
  {
    id: 'transverse-class1-4-gt25',
    appliesTo: 'transverse',
    when: (i) => i.commodityChapter === 16 && i.storageHeightFt > 25,
    minFlueIn: 6,
    nominal: true,
    citation: '§16.1.11.1',
    note: 'Nominal 6 in. transverse flue spaces between loads and at rack uprights — single-, double-, and multiple-row racks.',
    verified: true,
  },
  {
    id: 'transverse-plastic-le25',
    appliesTo: 'transverse',
    when: (i) => i.commodityChapter === 17 && i.storageHeightFt <= 25,
    minFlueIn: 6,
    nominal: true,
    citation: '§17.1.9.2',
    note: 'Nominal 6 in. transverse flue spaces between loads and at rack uprights — single-, double-, and multiple-row racks.',
    verified: true,
  },
  {
    id: 'transverse-plastic-gt25',
    appliesTo: 'transverse',
    when: (i) => i.commodityChapter === 17 && i.storageHeightFt > 25,
    minFlueIn: 6,
    nominal: true,
    citation: '§17.1.10.1.1',
    note: 'Nominal 6 in. transverse flue spaces between loads and at rack uprights — single-, double-, and multiple-row racks.',
    verified: true,
  },

  // ── Longitudinal flue — single-row racks have none by definition.
  {
    id: 'longitudinal-single-row',
    appliesTo: 'longitudinal',
    when: (i) => i.rackType === 'single-row',
    minFlueIn: 0,
    nominal: false,
    citation: '§3.9.3.7.5',
    note: 'Single-row racks have no longitudinal flue space by definition (depth up to 6 ft, no back-to-back loading).',
    verified: true,
  },

  // ── Longitudinal flue — ESFR removes the requirement regardless of height.
  {
    id: 'longitudinal-esfr-exempt',
    appliesTo: 'longitudinal',
    when: (i) => i.rackType !== 'single-row' && i.sprinklerScheme === 'esfr',
    minFlueIn: 0,
    nominal: false,
    citation: '§16.2 (slatted-shelf / ESFR provisions)',
    note: 'Longitudinal flue spaces are not required where ESFR sprinklers are used.',
    verified: true,
  },

  // ── Longitudinal flue — storage ≤ 25 ft: not required in double/multiple-row
  //    racks without solid shelves (this tool assumes open racks).
  {
    id: 'longitudinal-class1-4-le25',
    appliesTo: 'longitudinal',
    when: (i) =>
      i.commodityChapter === 16 &&
      i.rackType !== 'single-row' &&
      i.sprinklerScheme !== 'esfr' &&
      i.storageHeightFt <= 25,
    minFlueIn: 0,
    nominal: false,
    citation: '§16.1.10.1',
    note: 'In double- and multiple-row racks without solid shelves, a longitudinal flue space is not required for storage up to and including 25 ft.',
    verified: true,
  },
  {
    id: 'longitudinal-plastic-le25',
    appliesTo: 'longitudinal',
    when: (i) =>
      i.commodityChapter === 17 &&
      i.rackType !== 'single-row' &&
      i.sprinklerScheme !== 'esfr' &&
      i.storageHeightFt <= 25,
    minFlueIn: 0,
    nominal: false,
    citation: '§17.1.9.1',
    note: 'In double- and multiple-row racks without solid shelves, a longitudinal flue space is not required for storage up to and including 25 ft.',
    verified: true,
  },

  // ── Longitudinal flue — storage > 25 ft: nominal 6 in. required in double-row
  //    racks. (Multiple-row racks > 25 ft are governed by configuration-specific
  //    figures in the standard — flagged as an assumption, not auto-resolved.)
  {
    id: 'longitudinal-class1-4-gt25-double',
    appliesTo: 'longitudinal',
    when: (i) =>
      i.commodityChapter === 16 &&
      i.rackType === 'double-row' &&
      i.sprinklerScheme !== 'esfr' &&
      i.storageHeightFt > 25,
    minFlueIn: 6,
    nominal: true,
    citation: '§16.1.11.1.1',
    note: 'Nominal 6 in. longitudinal flue spaces shall be provided in double-row racks for storage over 25 ft.',
    verified: true,
  },
  {
    id: 'longitudinal-plastic-gt25-double',
    appliesTo: 'longitudinal',
    when: (i) =>
      i.commodityChapter === 17 &&
      i.rackType === 'double-row' &&
      i.sprinklerScheme !== 'esfr' &&
      i.storageHeightFt > 25,
    minFlueIn: 6,
    nominal: true,
    citation: '§17.1.10.1',
    note: 'Nominal 6 in. longitudinal flue spaces shall be provided in double-row racks for storage over 25 ft.',
    verified: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Pure helpers
// ─────────────────────────────────────────────────────────────────────────────

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// Coerce raw UI input into the normalized shape every rule predicate expects.
// Also collects human-readable assumption strings for anything it had to adjust
// or anything the tool can't fully resolve.
export function normalizeInputs(raw = {}) {
  const assumptions = [];

  const commodityClass = COMMODITY_CHAPTER[raw.commodityClass] ? raw.commodityClass : 'class-3';
  if (commodityClass !== raw.commodityClass) {
    assumptions.push('Unrecognized commodity class — defaulted to Class III.');
  }
  const commodityChapter = COMMODITY_CHAPTER[commodityClass];

  const rackType = RACK_TYPE_OPTIONS.some(([v]) => v === raw.rackType) ? raw.rackType : 'double-row';
  const sprinklerScheme = SPRINKLER_OPTIONS.some(([v]) => v === raw.sprinklerScheme)
    ? raw.sprinklerScheme
    : 'control-mode';

  let storageHeightFt = clamp(
    Number(raw.storageHeightFt) || BOUNDS.storageHeightFt.min,
    BOUNDS.storageHeightFt.min,
    BOUNDS.storageHeightFt.max,
  );
  let ceilingHeightFt = clamp(
    Number(raw.ceilingHeightFt) || BOUNDS.ceilingHeightFt.min,
    BOUNDS.ceilingHeightFt.min,
    BOUNDS.ceilingHeightFt.max,
  );
  if (ceilingHeightFt < storageHeightFt) {
    ceilingHeightFt = storageHeightFt;
    assumptions.push('Ceiling height was below storage height — raised to match storage height.');
  }

  const aisleWidthFt = clamp(
    Number(raw.aisleWidthFt) || BOUNDS.aisleWidthFt.min,
    BOUNDS.aisleWidthFt.min,
    BOUNDS.aisleWidthFt.max,
  );

  // Aisle-width sanity flags — these don't change flue space, but they signal
  // the arrangement may not match the rack-type assumptions in the standard.
  if (rackType === 'single-row' && aisleWidthFt < 3.5) {
    assumptions.push('Single-row racks assume aisles at least 3.5 ft wide (§3.9.3.7.5).');
  }
  if (sprinklerScheme === 'esfr' && aisleWidthFt < 7.5) {
    assumptions.push('ESFR slatted-shelf provisions assume aisles at least 7.5 ft wide.');
  }
  if (rackType === 'multiple-row' && storageHeightFt > 25) {
    assumptions.push(
      'Multiple-row racks over 25 ft are governed by configuration-specific figures in the standard — confirm longitudinal flue requirements with an engineer.',
    );
  }

  return {
    commodityClass,
    commodityChapter,
    rackType,
    sprinklerScheme,
    storageHeightFt,
    ceilingHeightFt,
    aisleWidthFt,
    assumptions,
  };
}

// Run a rule's predicate without letting a bad hand-edit crash the page.
function safeWhen(rule, inputs) {
  try {
    return rule.when(inputs) === true;
  } catch {
    return false;
  }
}

// For one flue direction: take the governing (largest) required value across
// all matched rules, plus the citations of the rule(s) that produced it.
function governing(matched, direction) {
  const rules = matched.filter((r) => r.appliesTo === direction);
  if (rules.length === 0) {
    return { minFlueIn: 0, citations: [], rules: [] };
  }
  const minFlueIn = Math.max(...rules.map((r) => r.minFlueIn));
  const governingRules = rules.filter((r) => r.minFlueIn === minFlueIn);
  return {
    minFlueIn,
    citations: governingRules.map((r) => `${STANDARD} (${EDITION}) ${r.citation}`),
    rules: governingRules,
  };
}

const unique = (arr) => [...new Set(arr)];

// ─────────────────────────────────────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────────────────────────────────────
export function evaluateFlueSpace(rawInputs) {
  const inputs = normalizeInputs(rawInputs);
  const matched = NFPA13_FLUE_RULES.filter((r) => safeWhen(r, inputs));

  const transverse = governing(matched, 'transverse');
  const longitudinal = governing(matched, 'longitudinal');

  const governingCitations = unique([...transverse.citations, ...longitudinal.citations]);
  const allVerified = matched.length > 0 && matched.every((r) => r.verified);

  const assumptions = [...inputs.assumptions, STANDING_DISCLAIMER];

  return {
    transverseFlueIn: transverse.minFlueIn,
    longitudinalFlueIn: longitudinal.minFlueIn,
    longitudinalRequired: longitudinal.minFlueIn > 0,
    governingCitations,
    matchedRuleIds: matched.map((r) => r.id),
    assumptions,
    verified: allVerified,
    verificationDetail: {
      total: matched.length,
      verified: matched.filter((r) => r.verified).length,
    },
    edition: EDITION,
    standard: STANDARD,
    inputsEcho: inputs,
  };
}
