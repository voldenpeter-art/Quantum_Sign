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
import { pSquared } from './stats';

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
