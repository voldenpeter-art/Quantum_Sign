// Smoke-/kontraktstester för B/D/E/F + kompatibilitetsgrinden + p⁽²⁾-hjälparen
// (feedback 2026-07-29: B/D/E/F och kompatibilitet saknade täckning).

import { describe, it, expect } from 'vitest';
import { generateEventStream } from '../sim';
import { DEFAULT_CONFIG } from '../types/config';
import { Rng } from '../sim/rng';
import type { AnalysisContext, SignatureResult, Verdict } from './types';
import { analyzeB } from './B_polarization';
import { analyzeD } from './D_invariant';
import { analyzeE } from './E_lowDim';
import { analyzeF } from './F_memory';
import { isSignatureCompatible, notApplicableResult } from './compatibility';
import { pSquared, empiricalTail, resolutionInsufficient } from './stats';
import { analyzeA } from './A_g2';

const ALLOWED: Verdict[] = ['notApplicable', 'none', 'classical', 'structural', 'suspect', 'strong'];

const entangledConfig = {
  ...DEFAULT_CONFIG,
  seed: 31,
  duration: 15,
  source: 'entangled' as const,
  sourceRateHz: 300,
  detector: { ...DEFAULT_CONFIG.detector, lossPct: 5 },
};
const stream = generateEventStream(entangledConfig);

describe('B/D/E/F return well-formed results on an entangled stream', () => {
  const analyzers = { B: analyzeB, D: analyzeD, E: analyzeE, F: analyzeF } as const;
  for (const [id, fn] of Object.entries(analyzers)) {
    it(`${id} yields a valid SignatureResult`, () => {
      const ctx: AnalysisContext = { stream, config: entangledConfig, rng: new Rng(5), nullReplicates: 6 };
      const res: SignatureResult = fn(ctx);
      expect(res.id).toBe(id);
      expect(ALLOWED).toContain(res.verdict);
      expect(res.components.length).toBeGreaterThan(0);
      expect(res.nullsUsed.length).toBeGreaterThan(0);
    });
  }

  it('D/E/F are capped at structural (never suspect/strong — quantum-neutral)', () => {
    for (const fn of [analyzeD, analyzeE, analyzeF]) {
      const ctx: AnalysisContext = { stream, config: entangledConfig, rng: new Rng(9), nullReplicates: 6 };
      const res = fn(ctx);
      expect(res.verdict).not.toBe('suspect');
      expect(res.verdict).not.toBe('strong');
    }
  });
});

describe('compatibility gate', () => {
  const thermalConfig = { ...DEFAULT_CONFIG, source: 'thermal' as const };
  it('C is not applicable to a thermal source', () => {
    expect(isSignatureCompatible('C', stream, thermalConfig).compatible).toBe(false);
  });
  it('C is applicable to an entangled source', () => {
    expect(isSignatureCompatible('C', stream, entangledConfig).compatible).toBe(true);
  });
  it('A is applicable to every source (virtual split)', () => {
    expect(isSignatureCompatible('A', stream, thermalConfig).compatible).toBe(true);
  });
  it('notApplicableResult is verdict=notApplicable with no components', () => {
    const res = notApplicableResult('C', 'x');
    expect(res.verdict).toBe('notApplicable');
    expect(res.components.length).toBe(0);
    expect(res.redFlags.length).toBe(0);
  });
});

describe('per-familj-redovisning + insufficientResolution', () => {
  const seConfig = {
    ...DEFAULT_CONFIG, seed: 41, duration: 15, source: 'singleEmitter' as const, sourceRateHz: 300,
    detector: { ...DEFAULT_CONFIG.detector, lossPct: 5, darkCountRateHz: 5 },
  };
  const seStream = generateEventStream(seConfig);

  it('A reports one NullFamilyResult per null family with coherent fields', () => {
    const res = analyzeA({ stream: seStream, config: seConfig, rng: new Rng(3), nullReplicates: 20 } as AnalysisContext);
    expect(res.nullFamilyResults).toBeDefined();
    expect(res.nullFamilyResults!.length).toBe(4); // A_NULLS = S1,S2,S3,S4
    for (const nf of res.nullFamilyResults!) {
      expect(nf.replicates).toBe(20);
      expect(nf.pResolution).toBeCloseTo(1 / 21, 6);
      expect(nf.pEmpirical).toBeGreaterThan(0);
      expect(nf.pEmpirical).toBeLessThanOrEqual(1);
      expect(nf.exceedances).toBeGreaterThanOrEqual(0);
    }
  });

  it('insufficientResolution is true at low replicates, false at high', () => {
    const low = analyzeA({ stream: seStream, config: seConfig, rng: new Rng(3), nullReplicates: 6 } as AnalysisContext);
    const high = analyzeA({ stream: seStream, config: seConfig, rng: new Rng(3), nullReplicates: 150 } as AnalysisContext);
    expect(low.insufficientResolution).toBe(true); // golv 1/7 ≈ 0.14 > 1e-2
    expect(high.insufficientResolution).toBe(false); // golv 1/151 ≈ 0.0066 < 1e-2
  });
});

describe('empiricalTail + resolutionInsufficient', () => {
  it('counts exceedances in the dangerous direction and reports resolution', () => {
    const t = empiricalTail(0.1, [0.2, 0.3, 0.05, 0.4], 'greater'); // ≥ 0.1: 0.2,0.3,0.4 = 3
    expect(t.exceedances).toBe(3);
    expect(t.replicates).toBe(4);
    expect(t.pEmpirical).toBeCloseTo(4 / 5, 6);
    expect(t.pResolution).toBeCloseTo(1 / 5, 6);
  });
  it('resolutionInsufficient compares the p⁽²⁾ resolution to the 1e-2 floor', () => {
    expect(resolutionInsufficient([1 / 16, 1 / 16, 1 / 16])).toBe(true); // 0.0625 > 1e-2
    expect(resolutionInsufficient([1 / 201, 1 / 201, 1 / 201])).toBe(false); // 0.005 < 1e-2
  });
});

describe('pSquared (p⁽²⁾-regeln)', () => {
  it('returns the second-smallest p over families', () => {
    expect(pSquared([0.001, 0.5, 0.9])).toBe(0.5);
    expect(pSquared([0.9, 0.02, 0.3, 0.01])).toBe(0.02);
  });
  it('degenerates to the single value / to 1 at the edges', () => {
    expect(pSquared([0.2])).toBe(0.2);
    expect(pSquared([])).toBe(1);
  });
  it('with two families equals the larger (must beat both)', () => {
    expect(pSquared([0.001, 0.4])).toBe(0.4);
  });
});
