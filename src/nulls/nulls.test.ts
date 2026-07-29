// Bevarande-/förstörande-egenskaper för surrogatfamiljerna (CLAUDE.md §7,
// feedback 2026-07-29: null-egenskaper saknade täckning). Testar den PUBLIKA
// generateNull-dispatchern på både en polarisationsström (entangled) och en
// enkanalsström (coherent).

import { describe, it, expect } from 'vitest';
import { generateNull } from './index';
import { generateEventStream } from '../sim';
import { DEFAULT_CONFIG } from '../types/config';
import { Rng } from '../sim/rng';
import type { NullId } from '../types/signatures';

const polConfig = {
  ...DEFAULT_CONFIG,
  seed: 21,
  duration: 12,
  source: 'entangled' as const,
  sourceRateHz: 300,
  detector: { ...DEFAULT_CONFIG.detector, lossPct: 5 },
};
const singleConfig = {
  ...DEFAULT_CONFIG,
  seed: 22,
  duration: 12,
  source: 'coherent' as const,
  sourceRateHz: 300,
};

const polStream = generateEventStream(polConfig);
const singleStream = generateEventStream(singleConfig);

describe('S1 (shuffle) preserves marginals', () => {
  it('preserves total event count on a polarization stream', () => {
    const out = generateNull('S1', polStream, polConfig, new Rng(1));
    expect(out.events.length).toBe(polStream.events.length);
  });
  it('preserves total event count on a single-channel stream', () => {
    const out = generateNull('S1', singleStream, singleConfig, new Rng(1));
    expect(out.events.length).toBe(singleStream.events.length);
  });
});

describe('S2 (time-slide) preserves rates', () => {
  it('preserves total event count (only timing is shifted)', () => {
    const out = generateNull('S2', polStream, polConfig, new Rng(2));
    expect(out.events.length).toBe(polStream.events.length);
  });
});

describe('S3/S4/S5 produce non-empty surrogate streams', () => {
  for (const id of ['S3', 'S4', 'S5'] as NullId[]) {
    it(`${id} yields events`, () => {
      const out = generateNull(id, polStream, polConfig, new Rng(3));
      expect(out.events.length).toBeGreaterThan(0);
    });
  }
});

describe('surrogates are deterministic for a fixed rng seed', () => {
  for (const id of ['S1', 'S2', 'S3', 'S4', 'S5'] as NullId[]) {
    it(`${id} reproduces identical detectedT for the same seed`, () => {
      const a = generateNull(id, polStream, polConfig, new Rng(7)).events.map((e) => e.detectedT);
      const b = generateNull(id, polStream, polConfig, new Rng(7)).events.map((e) => e.detectedT);
      expect(a).toEqual(b);
    });
  }
});
