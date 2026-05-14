/* =============================================================================
   Unit tests for the NFPA 13 flue-space engine.
   =============================================================================
   These assert the numeric outputs and matched rule IDs against the NFPA 13
   2013 edition. They are intentionally tight: if someone bumps EDITION and a
   required value changes, these fail loudly and must be updated to match the
   new edition's text — that is the guardrail, not a nuisance.
   ========================================================================== */
import { describe, it, expect } from 'vitest';
import {
  evaluateFlueSpace,
  normalizeInputs,
  NFPA13_FLUE_RULES,
  EDITION,
} from './nfpa13FlueRules.js';

const base = {
  commodityClass: 'class-3',
  rackType: 'double-row',
  sprinklerScheme: 'control-mode',
  storageHeightFt: 20,
  ceilingHeightFt: 30,
  aisleWidthFt: 8,
};

describe('evaluateFlueSpace — transverse flue (always nominal 6 in.)', () => {
  it('Class I–IV ≤ 25 ft → 6 in, cites §16.1.10.2', () => {
    const r = evaluateFlueSpace({ ...base, commodityClass: 'class-3', storageHeightFt: 20 });
    expect(r.transverseFlueIn).toBe(6);
    expect(r.matchedRuleIds).toContain('transverse-class1-4-le25');
    expect(r.governingCitations).toContain('NFPA 13 (2013) §16.1.10.2');
  });

  it('Class I–IV > 25 ft → 6 in, cites §16.1.11.1', () => {
    const r = evaluateFlueSpace({ ...base, commodityClass: 'class-4', storageHeightFt: 30 });
    expect(r.transverseFlueIn).toBe(6);
    expect(r.matchedRuleIds).toContain('transverse-class1-4-gt25');
    expect(r.governingCitations).toContain('NFPA 13 (2013) §16.1.11.1');
  });

  it('Plastics ≤ 25 ft → 6 in, cites §17.1.9.2', () => {
    const r = evaluateFlueSpace({ ...base, commodityClass: 'group-a-plastic', storageHeightFt: 18 });
    expect(r.transverseFlueIn).toBe(6);
    expect(r.matchedRuleIds).toContain('transverse-plastic-le25');
    expect(r.governingCitations).toContain('NFPA 13 (2013) §17.1.9.2');
  });

  it('Rubber > 25 ft → 6 in, cites §17.1.10.1.1', () => {
    const r = evaluateFlueSpace({ ...base, commodityClass: 'rubber', storageHeightFt: 32 });
    expect(r.transverseFlueIn).toBe(6);
    expect(r.matchedRuleIds).toContain('transverse-plastic-gt25');
    expect(r.governingCitations).toContain('NFPA 13 (2013) §17.1.10.1.1');
  });
});

describe('evaluateFlueSpace — longitudinal flue', () => {
  it('single-row rack → not required (0), cites §3.9.3.7.5', () => {
    const r = evaluateFlueSpace({ ...base, rackType: 'single-row', storageHeightFt: 30 });
    expect(r.longitudinalFlueIn).toBe(0);
    expect(r.longitudinalRequired).toBe(false);
    expect(r.matchedRuleIds).toContain('longitudinal-single-row');
  });

  it('double-row ≤ 25 ft → not required (0), cites §16.1.10.1', () => {
    const r = evaluateFlueSpace({ ...base, rackType: 'double-row', storageHeightFt: 22 });
    expect(r.longitudinalFlueIn).toBe(0);
    expect(r.longitudinalRequired).toBe(false);
    expect(r.matchedRuleIds).toContain('longitudinal-class1-4-le25');
  });

  it('double-row > 25 ft, Class I–IV → 6 in, cites §16.1.11.1.1', () => {
    const r = evaluateFlueSpace({ ...base, rackType: 'double-row', storageHeightFt: 30 });
    expect(r.longitudinalFlueIn).toBe(6);
    expect(r.longitudinalRequired).toBe(true);
    expect(r.matchedRuleIds).toContain('longitudinal-class1-4-gt25-double');
    expect(r.governingCitations).toContain('NFPA 13 (2013) §16.1.11.1.1');
  });

  it('double-row > 25 ft, plastics → 6 in, cites §17.1.10.1', () => {
    const r = evaluateFlueSpace({
      ...base,
      commodityClass: 'group-a-plastic',
      rackType: 'double-row',
      storageHeightFt: 30,
    });
    expect(r.longitudinalFlueIn).toBe(6);
    expect(r.matchedRuleIds).toContain('longitudinal-plastic-gt25-double');
  });

  it('ESFR → longitudinal not required even for double-row > 25 ft', () => {
    const r = evaluateFlueSpace({
      ...base,
      rackType: 'double-row',
      sprinklerScheme: 'esfr',
      storageHeightFt: 30,
    });
    expect(r.longitudinalFlueIn).toBe(0);
    expect(r.longitudinalRequired).toBe(false);
    expect(r.matchedRuleIds).toContain('longitudinal-esfr-exempt');
    // The > 25 ft double-row rule must NOT also fire when ESFR is selected.
    expect(r.matchedRuleIds).not.toContain('longitudinal-class1-4-gt25-double');
  });

  it('multiple-row > 25 ft → no auto longitudinal value, emits an assumption', () => {
    const r = evaluateFlueSpace({ ...base, rackType: 'multiple-row', storageHeightFt: 30 });
    expect(r.longitudinalFlueIn).toBe(0);
    expect(r.assumptions.some((a) => a.includes('Multiple-row racks over 25 ft'))).toBe(true);
  });
});

describe('normalizeInputs', () => {
  it('raises ceiling height below storage height and flags an assumption', () => {
    const n = normalizeInputs({ ...base, storageHeightFt: 28, ceilingHeightFt: 20 });
    expect(n.ceilingHeightFt).toBe(28);
    expect(n.assumptions.some((a) => a.includes('Ceiling height was below storage height'))).toBe(true);
  });

  it('defaults an unrecognized commodity class to Class III', () => {
    const n = normalizeInputs({ ...base, commodityClass: 'banana' });
    expect(n.commodityClass).toBe('class-3');
    expect(n.commodityChapter).toBe(16);
  });

  it('clamps out-of-range numeric inputs to bounds', () => {
    const n = normalizeInputs({ ...base, storageHeightFt: 999, aisleWidthFt: -5 });
    expect(n.storageHeightFt).toBe(45);
    expect(n.aisleWidthFt).toBe(2);
  });

  it('flags a too-narrow single-row aisle', () => {
    const n = normalizeInputs({ ...base, rackType: 'single-row', aisleWidthFt: 3 });
    expect(n.assumptions.some((a) => a.includes('3.5 ft'))).toBe(true);
  });
});

describe('evaluateFlueSpace — metadata & robustness', () => {
  it('reports the edition and a standing disclaimer assumption', () => {
    const r = evaluateFlueSpace(base);
    expect(r.edition).toBe(EDITION);
    expect(r.assumptions.some((a) => a.includes('Screening estimate'))).toBe(true);
  });

  it('verified is true while every shipped rule is verified', () => {
    const r = evaluateFlueSpace(base);
    expect(r.verified).toBe(true);
    expect(r.verificationDetail.verified).toBe(r.verificationDetail.total);
  });

  it('skips a rule whose predicate throws, without crashing', () => {
    const bomb = {
      id: 'bomb',
      appliesTo: 'transverse',
      when: () => {
        throw new Error('bad hand-edit');
      },
      minFlueIn: 999,
      citation: '§x',
      note: '',
      verified: true,
    };
    NFPA13_FLUE_RULES.push(bomb);
    try {
      const r = evaluateFlueSpace(base);
      expect(r.matchedRuleIds).not.toContain('bomb');
      expect(r.transverseFlueIn).toBe(6);
    } finally {
      NFPA13_FLUE_RULES.pop();
    }
  });

  it('handles empty input by normalizing to safe defaults', () => {
    const r = evaluateFlueSpace({});
    expect(r.transverseFlueIn).toBe(6);
    expect(typeof r.longitudinalFlueIn).toBe('number');
    expect(r.matchedRuleIds.length).toBeGreaterThan(0);
  });
});
