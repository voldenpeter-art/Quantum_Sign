import { describe, it, expect } from 'vitest';
import { runInjectionSweep } from './blindInjection';
import { DEFAULT_CONFIG } from '../types/config';
import { Rng } from '../sim/rng';

describe('runInjectionSweep', () => {
  it('detects singleEmitter antibunching (A) more often at higher injection strength', () => {
    const config = {
      ...DEFAULT_CONFIG,
      seed: 5,
      duration: 30,
      source: 'singleEmitter' as const,
      sourceRateHz: 300,
      detector: { ...DEFAULT_CONFIG.detector, lossPct: 10, darkCountRateHz: 5 },
    };
    const results = runInjectionSweep('A', config, [0, 1], new Rng(1), 5);
    const [low, high] = results;
    expect(low.trueStrength).toBe(0);
    expect(high.trueStrength).toBe(1);
    // Vid styrka 0 (ren klassisk baslinje) ska A inte slå ut positivt.
    expect(low.detected).toBe(false);
  });
});
