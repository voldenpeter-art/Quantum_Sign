// Karakteriseringstester för detektorstegen (feedback 2026-07-29: detektorsteg
// saknade egen täckning). Testar de fysikaliska invarianterna PER STEG, samt
// dokumenterar den kända begränsningen att den nuvarande linjära pipelinen
// applicerar dödtid FÖRE afterpulse/dark/crosstalk (så senare händelser inte
// dödtidsgrindas) — en medveten v1-avgränsning, inte en tyst bugg.

import { describe, it, expect } from 'vitest';
import type { PhotonEvent } from '../../types/events';
import { Rng } from '../rng';
import { applyLoss } from './loss';
import { applyDeadTime } from './deadTime';
import { detectorKeyOf } from './keys';
import { generateEventStream } from '../index';
import { DEFAULT_CONFIG } from '../../types/config';

function ev(id: number, t: number, channel: 'D1' | 'D2' = 'D1'): PhotonEvent {
  return { id, t, detectedT: t, channel, isBackground: false, flags: [] };
}

function minGapPerDetector(events: PhotonEvent[]): number {
  const byKey = new Map<string, number[]>();
  for (const e of events) {
    const k = detectorKeyOf(e);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k)!.push(e.detectedT);
  }
  let minGap = Infinity;
  for (const times of byKey.values()) {
    const sorted = [...times].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) minGap = Math.min(minGap, sorted[i] - sorted[i - 1]);
  }
  return minGap;
}

describe('applyLoss', () => {
  it('keeps everything at 0% loss and nothing at 100%', () => {
    const events = Array.from({ length: 200 }, (_, i) => ev(i, i * 0.01));
    expect(applyLoss(events, 0, new Rng(1)).length).toBe(200);
    expect(applyLoss(events, 100, new Rng(1)).length).toBe(0);
  });

  it('removes roughly the configured fraction (statistical, seeded)', () => {
    const events = Array.from({ length: 5000 }, (_, i) => ev(i, i * 0.001));
    const kept = applyLoss(events, 40, new Rng(123)).length;
    // förväntat ~3000 överlevande; tillåt ±5 % slack för stickprovsbrus
    expect(kept).toBeGreaterThan(2850);
    expect(kept).toBeLessThan(3150);
  });
});

describe('applyDeadTime (isolerad invariant)', () => {
  it('never leaves two accepted events on the same detector closer than the dead time', () => {
    const deadTimeNs = 100; // 100 ns
    const deadTimeS = deadTimeNs * 1e-9;
    // Täta händelser på D1 (10 ns isär) — de flesta ska vetoas.
    const events = Array.from({ length: 300 }, (_, i) => ev(i, i * 10e-9, 'D1'));
    const out = applyDeadTime(events, deadTimeNs);
    expect(minGapPerDetector(out)).toBeGreaterThanOrEqual(deadTimeS - 1e-15);
  });

  it('applies per detector, not globally (D1 and D2 do not block each other)', () => {
    const events = [ev(0, 0, 'D1'), ev(1, 10e-9, 'D2'), ev(2, 20e-9, 'D1')];
    // Med 100 ns dödtid: D1@0 accepteras, D2@10ns accepteras (annan detektor),
    // D1@20ns vetoas (< 100 ns efter D1@0).
    const out = applyDeadTime(events, 100);
    expect(out.map((e) => e.id).sort()).toEqual([0, 1]);
  });
});

describe('detector pipeline (helhet)', () => {
  it('is deterministic for a fixed seed', () => {
    const config = { ...DEFAULT_CONFIG, seed: 99, duration: 8 };
    const a = generateEventStream(config).events.map((e) => e.detectedT);
    const b = generateEventStream(config).events.map((e) => e.detectedT);
    expect(a).toEqual(b);
  });

  it('KÄND BEGRÄNSNING: dark counts läggs EFTER dödtid, så helhetsströmmen bryter '
    + 'per-detektor-dödtidsavståndet (regressionsvakt för v1-ordningen)', () => {
    // Ren källa utan förlust/jitter/afterpulse/crosstalk, men stark dödtid OCH
    // mycket höga mörkerräkningar → täta dark counts som passerar dödtidssteget.
    const config = {
      ...DEFAULT_CONFIG,
      seed: 5,
      duration: 10,
      source: 'coherent' as const,
      sourceRateHz: 30,
      detector: {
        ...DEFAULT_CONFIG.detector,
        lossPct: 0,
        jitterPs: 0,
        deadTimeNs: 500,
        afterpulseProb: 0,
        darkCountRateHz: 3000,
        crosstalkProb: 0,
      },
    };
    const stream = generateEventStream(config);
    const deadTimeS = config.detector.deadTimeNs * 1e-9;
    // Regressionsvakt: så länge dödtiden appliceras FÖRE dark counts kommer
    // helhetsströmmen ha par tätare än dödtiden. Om detta en dag åtgärdas med en
    // tillståndsbaserad motor ska testet uppdateras/tas bort.
    expect(minGapPerDetector(stream.events)).toBeLessThan(deadTimeS);
  });
});
