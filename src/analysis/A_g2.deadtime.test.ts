// G4 (Sprint 1-specens kronjuvel): dödtid ger en FALSK antibunching-dipp i
// AUTO-korrelation men lämnar KORS-korrelation orörd. Detta ÄR hela
// motiveringen till A-rapporten v0.2 §4.1:s BINDANDE krav att A endast får
// byggas på tvådetektor-korskorrelation (aldrig enkeldetektor-autokorrelation).
//
// Skilt från dödtidsinvarians-testet i sim/detector/detector.test.ts (som mäter
// mekaniken: minsta mellanrum per detektor). Här jämförs auto vs kors g²(0) på
// SAMMA eventström, med en dödtidsfri kalibreringskörning som referens — så
// tröskeln är MÄTT, inte påhittad (CLAUDE.md §2).

import { describe, it, expect } from 'vitest';
import { generateEventStream } from '../sim';
import { computeG2Curve } from './coincidence';
import { DEFAULT_CONFIG } from '../types/config';
import type { EventStream } from '../types/events';

function channelTimestamps(stream: EventStream, ch: 'D1' | 'D2'): number[] {
  return stream.events.filter((e) => e.channel === ch).map((e) => e.detectedT).sort((a, b) => a - b);
}

// SKRÄCKEXEMPEL — enkeldetektor-AUTO-korrelation. Får ALDRIG ligga i produktions-
// koden (src/analysis/A_g2.ts): A v0.2 §4.1 förbjuder autokorrelation som
// evidenskälla just för att dödtid fejkar en dipp här. Finns bara i testet för
// att DEMONSTRERA förbudet.
function g2AutoAtZero(d: number[], duration: number, binWidthS: number): number {
  return computeG2Curve(d, d, duration, [0], binWidthS, true)[0].g2;
}

// Produktionsvägens motor (samma computeG2Curve som A_g2.ts använder), men på de
// TVÅ oberoende HBT-kanalerna D1×D2 — den tillåtna, korrekta korskorrelationen.
function g2CrossAtZero(d1: number[], d2: number[], duration: number, binWidthS: number): number {
  return computeG2Curve(d1, d2, duration, [0], binWidthS, false)[0].g2;
}

describe('G4: dead-time fakes antibunching in auto- but not cross-correlation (A v0.2 §4.1)', () => {
  // Koherent källa, takt hög nog att medelintervallet (1/3 MHz ≈ 333 ns) är
  // mindre än dödtiden (500 ns) → garanterad pile-up. Alla andra bedragare
  // avstängda (loss/jitter/afterpulse/dark/crosstalk = 0) → isolerad dödtid.
  const baseConfig = {
    ...DEFAULT_CONFIG,
    seed: 7,
    duration: 0.05,
    source: 'coherent' as const,
    sourceRateHz: 3_000_000,
    conditions: { temperatureK: 100, fieldVoltage: 0, radiationDose: 1, activationEnergyEV: 1 },
    detector: { lossPct: 0, jitterPs: 0, deadTimeNs: 500, afterpulseProb: 0, afterpulseTauNs: 30, darkCountRateHz: 0, crosstalkProb: 0 },
  };
  const deadTimeS = baseConfig.detector.deadTimeNs * 1e-9;
  const binWidthS = 2 * deadTimeS; // τ=0-binnen täcker det dödtidsundertryckta området

  const withDeadTime = generateEventStream(baseConfig);
  const calibNoDeadTime = generateEventStream({
    ...baseConfig,
    detector: { ...baseConfig.detector, deadTimeNs: 0 },
  });

  const d1 = channelTimestamps(withDeadTime, 'D1');
  const d2 = channelTimestamps(withDeadTime, 'D2');
  const c1 = channelTimestamps(calibNoDeadTime, 'D1');
  const c2 = channelTimestamps(calibNoDeadTime, 'D2');

  const autoDeadTime = g2AutoAtZero(d1, baseConfig.duration, binWidthS);
  const crossDeadTime = g2CrossAtZero(d1, d2, baseConfig.duration, binWidthS);
  const autoCalib = g2AutoAtZero(c1, baseConfig.duration, binWidthS);
  const crossCalib = g2CrossAtZero(c1, c2, baseConfig.duration, binWidthS);

  it('generates guaranteed pile-up (mean interval < dead time)', () => {
    expect(d1.length).toBeGreaterThan(1000);
    expect(d2.length).toBeGreaterThan(1000);
  });

  it('calibration: WITHOUT dead time, both auto and cross g²(0) ≈ 1 (no dip from the config itself)', () => {
    expect(autoCalib).toBeGreaterThan(0.85);
    expect(autoCalib).toBeLessThan(1.15);
    expect(crossCalib).toBeGreaterThan(0.85);
    expect(crossCalib).toBeLessThan(1.15);
  });

  it('assertion 1 — dead-time drives AUTO g²(0) far below the dead-time-free baseline (fake antibunching)', () => {
    // Referens = kalibreringskörningens auto-g²(0) (≈1), inte en fri siffra.
    expect(autoDeadTime).toBeLessThan(autoCalib - 0.4);
    expect(autoDeadTime).toBeLessThan(0.3);
  });

  it('assertion 2 — CROSS g²(0) stays ≈ 1 despite identical dead time in the instrument chain', () => {
    expect(crossDeadTime).toBeGreaterThan(0.85);
    expect(crossDeadTime).toBeLessThan(1.15);
  });

  it('the discriminating fact: auto dips far below cross on the SAME stream (→ A must use cross only)', () => {
    expect(crossDeadTime - autoDeadTime).toBeGreaterThan(0.5);
  });
});
