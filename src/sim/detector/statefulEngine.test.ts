// Invarianttester för den tillståndsbaserade detektormotorn (P3).
// Den BINDANDE invarianten: två accepterade laviner på samma detektor ligger
// aldrig närmare varandra än återhämtningstiden — oavsett om lavinen kom från
// en signalfoton, en mörkerräkning, en afterpuls eller crosstalk. Det är precis
// det den äldre kedjan INTE garanterar (se regressionsvakten i detector.test.ts).

import { describe, it, expect } from 'vitest';
import type { PhotonEvent } from '../../types/events';
import type { RunConfig } from '../../types/config';
import { DEFAULT_CONFIG } from '../../types/config';
import { generateEventStream } from '../index';
import { detectorKeyOf } from './keys';

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

const HEAVY_TIMEOUT_MS = 60_000;

/** Hård belastning: alla lavinkällor påslagna samtidigt. */
function stressConfig(over: Partial<RunConfig['detector']> = {}): RunConfig {
  return {
    ...DEFAULT_CONFIG,
    seed: 31337,
    duration: 2,
    source: 'coherent',
    sourceRateHz: 8_000,
    conditions: { temperatureK: 300, fieldVoltage: 0, radiationDose: 1, activationEnergyEV: 1 },
    detector: {
      lossPct: 0,
      jitterPs: 0,
      deadTimeNs: 1000,
      afterpulseProb: 0.2,
      afterpulseTauNs: 100,
      darkCountRateHz: 5000,
      crosstalkProb: 0.1,
      engine: 'stateful',
      ...over,
    },
  };
}

describe('tillståndsbaserad detektormotor — återhämtningsinvarianten', () => {
  it('BINDANDE: inga två accepterade laviner på samma detektor närmare än dödtiden', () => {
    const config = stressConfig();
    const stream = generateEventStream(config);
    const deadTimeS = config.detector.deadTimeNs * 1e-9;
    expect(stream.events.length).toBeGreaterThan(100);
    expect(minGapPerDetector(stream.events)).toBeGreaterThanOrEqual(deadTimeS - 1e-15);
  }, HEAVY_TIMEOUT_MS);

  it('invarianten håller ÄVEN när bara mörkerräkningar finns (ingen signal)', () => {
    const config = stressConfig({ darkCountRateHz: 20_000 });
    const stream = generateEventStream({ ...config, sourceRateHz: 1 });
    const deadTimeS = config.detector.deadTimeNs * 1e-9;
    expect(stream.events.length).toBeGreaterThan(50);
    expect(minGapPerDetector(stream.events)).toBeGreaterThanOrEqual(deadTimeS - 1e-15);
  }, HEAVY_TIMEOUT_MS);

  it('invarianten håller ÄVEN med enbart afterpulsing (afterpulser grindas också)', () => {
    const config = stressConfig({ darkCountRateHz: 0, crosstalkProb: 0, afterpulseProb: 0.9, afterpulseTauNs: 10 });
    const stream = generateEventStream(config);
    const deadTimeS = config.detector.deadTimeNs * 1e-9;
    expect(minGapPerDetector(stream.events)).toBeGreaterThanOrEqual(deadTimeS - 1e-15);
  }, HEAVY_TIMEOUT_MS);

  it('KONTRAST: legacy-motorn bryter invarianten på samma konfiguration', () => {
    const config = stressConfig({ engine: 'legacy' });
    const stream = generateEventStream(config);
    const deadTimeS = config.detector.deadTimeNs * 1e-9;
    expect(minGapPerDetector(stream.events)).toBeLessThan(deadTimeS);
  }, HEAVY_TIMEOUT_MS);
});

describe('tillståndsbaserad detektormotor — determinism och dödtidsmodell', () => {
  it('samma seed ⇒ bitidentisk ström', () => {
    const config = stressConfig();
    const a = generateEventStream(config).events.map((e) => e.detectedT);
    const b = generateEventStream(config).events.map((e) => e.detectedT);
    expect(a).toEqual(b);
  }, HEAVY_TIMEOUT_MS);

  it('paralyserbar dödtid accepterar färre laviner än icke-paralyserbar (retriggning)', () => {
    const nonParalyzable = generateEventStream(stressConfig({ deadTimeParalyzable: false })).events.length;
    const paralyzable = generateEventStream(stressConfig({ deadTimeParalyzable: true })).events.length;
    expect(paralyzable).toBeLessThan(nonParalyzable);
  }, HEAVY_TIMEOUT_MS);

  it('paralyserbar dödtid bryter inte invarianten', () => {
    const config = stressConfig({ deadTimeParalyzable: true });
    const stream = generateEventStream(config);
    const deadTimeS = config.detector.deadTimeNs * 1e-9;
    expect(minGapPerDetector(stream.events)).toBeGreaterThanOrEqual(deadTimeS - 1e-15);
  }, HEAVY_TIMEOUT_MS);

  it('utan dödtid emitteras alla lavinkällor (motorn tappar inget i onödan)', () => {
    const withDeadTime = generateEventStream(stressConfig()).events.length;
    const without = generateEventStream(stressConfig({ deadTimeNs: 0 })).events.length;
    expect(without).toBeGreaterThan(withDeadTime);
  }, HEAVY_TIMEOUT_MS);
});
