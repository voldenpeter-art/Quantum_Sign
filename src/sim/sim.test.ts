import { describe, it, expect } from 'vitest';
import { generateEventStream } from './index';
import { DEFAULT_CONFIG } from '../types/config';
import { analyzeA } from '../analysis/A_g2';
import { analyzeC } from '../analysis/C_chsh';
import type { AnalysisContext } from '../analysis/types';
import { Rng } from './rng';

describe('generateEventStream', () => {
  it('is deterministic for a fixed seed', () => {
    const config = { ...DEFAULT_CONFIG, seed: 42, duration: 5 };
    const a = generateEventStream(config);
    const b = generateEventStream(config);
    expect(a.events.length).toBe(b.events.length);
    expect(a.events.map((e) => e.detectedT)).toEqual(b.events.map((e) => e.detectedT));
  });

  it('singleEmitter shows antibunching: epsilon < 0 more often than not', () => {
    const config = {
      ...DEFAULT_CONFIG,
      seed: 7,
      duration: 60,
      source: 'singleEmitter' as const,
      sourceRateHz: 300,
      detector: { ...DEFAULT_CONFIG.detector, lossPct: 10, darkCountRateHz: 5 },
    };
    const stream = generateEventStream(config);
    const ctx: AnalysisContext = { stream, config, rng: new Rng(1), nullReplicates: 5 };
    const result = analyzeA(ctx);
    const epsilon = result.components.find((c) => c.key === 'epsilon')!.value;
    expect(epsilon).toBeLessThan(0.2); // klart under klassisk bunching-nivå
  });

  it('thermal source bunches: g2(0) roughly >= 1', () => {
    const config = {
      ...DEFAULT_CONFIG,
      seed: 3,
      duration: 60,
      source: 'thermal' as const,
      sourceRateHz: 300,
    };
    const stream = generateEventStream(config);
    const ctx: AnalysisContext = { stream, config, rng: new Rng(1), nullReplicates: 3 };
    const result = analyzeA(ctx);
    const g2 = result.components.find((c) => c.key === 'g2_0')!.value;
    expect(g2).toBeGreaterThan(0.8);
  });

  it('entangled source at default (optimal) CHSH angles violates S <= 2 without decoherence', () => {
    const config = {
      ...DEFAULT_CONFIG,
      seed: 11,
      duration: 40,
      source: 'entangled' as const,
      sourceRateHz: 400,
      conditions: { ...DEFAULT_CONFIG.conditions, fieldVoltage: 0 },
      detector: { ...DEFAULT_CONFIG.detector, lossPct: 5, jitterPs: 1000, darkCountRateHz: 2 },
    };
    const stream = generateEventStream(config);
    const ctx: AnalysisContext = { stream, config, rng: new Rng(2), nullReplicates: 3 };
    const result = analyzeC(ctx);
    const S = result.components.find((c) => c.key === 's_global')!.value;
    expect(S).toBeGreaterThan(2);
  });
});
