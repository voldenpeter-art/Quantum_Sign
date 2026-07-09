import { describe, it, expect } from 'vitest';
import { fisherCombinedPValue, evaluateCombinedEvidence, type CombinedPick } from './combine';
import type { SignatureResult } from './types';

function fakeResult(id: SignatureResult['id'], pValue: number, verdict: SignatureResult['verdict'] = 'suspect'): SignatureResult {
  return {
    id,
    verdict,
    verdictLabelSv: `${id}-${verdict}`,
    components: [{ key: 'headline', labelSv: 'headline', value: 1, pValue }],
    redFlags: [],
    nullsUsed: ['S1'],
    summarySv: '',
    floorNoteSv: '',
  };
}

describe('fisherCombinedPValue', () => {
  it('combines two moderate p-values into a smaller combined p', () => {
    const combined = fisherCombinedPValue([0.05, 0.05]);
    expect(combined).toBeLessThan(0.05);
    expect(combined).toBeGreaterThan(0);
  });

  it('stays close to 1 when combining two non-significant p-values', () => {
    const combined = fisherCombinedPValue([0.9, 0.9]);
    expect(combined).toBeGreaterThan(0.8);
  });
});

describe('evaluateCombinedEvidence', () => {
  it('refuses to combine two picks from the same session (arvsregeln)', () => {
    const picks: CombinedPick[] = [
      { sessionId: 's1', sessionLabel: 'Session 1', signatureId: 'B', result: fakeResult('B', 0.001) },
      { sessionId: 's1', sessionLabel: 'Session 1', signatureId: 'D', result: fakeResult('D', 0.001) },
    ];
    const evidence = evaluateCombinedEvidence(picks);
    expect(evidence.verdict).toBe('insufficient');
    expect(evidence.reasonSv).toMatch(/rådata/);
  });

  it('combines two independent sessions into combined-strong when both are significant', () => {
    const picks: CombinedPick[] = [
      { sessionId: 's1', sessionLabel: 'Session 1', signatureId: 'A', result: fakeResult('A', 0.001, 'suspect') },
      { sessionId: 's2', sessionLabel: 'Session 2', signatureId: 'C', result: fakeResult('C', 0.001, 'suspect') },
    ];
    const evidence = evaluateCombinedEvidence(picks);
    expect(evidence.verdict).toBe('combined-strong');
    expect(evidence.fisherP).not.toBeNull();
    expect(evidence.fisherP!).toBeLessThan(1e-3);
  });

  it('requires at least two picks', () => {
    const picks: CombinedPick[] = [
      { sessionId: 's1', sessionLabel: 'Session 1', signatureId: 'A', result: fakeResult('A', 0.001) },
    ];
    expect(evaluateCombinedEvidence(picks).verdict).toBe('insufficient');
  });
});
