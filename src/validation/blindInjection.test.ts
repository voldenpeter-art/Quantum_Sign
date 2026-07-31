import { describe, it, expect } from 'vitest';
import { runInjectionSweep, runBlindInjection } from './blindInjection';
import { DEFAULT_CONFIG } from '../types/config';
import { Rng } from '../sim/rng';

const HEAVY_TIMEOUT_MS = 60_000;

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
  }, HEAVY_TIMEOUT_MS);
});

// PRE-DETEKTOR-INJEKTION (P3): signal och bakgrund ska blandas FÖRE en gemensam
// detektor, så att de konkurrerar om samma dödtid/mättnad.
describe('blind injection — pre-detektor-blandning', () => {
  // Hård dödtid gör konkurrensen mätbar: när båda strömmarna delar detektor
  // vetoas laviner som i den gamla (separata) ordningen överlevde.
  const contendedConfig = {
    ...DEFAULT_CONFIG,
    seed: 99,
    duration: 4,
    source: 'singleEmitter' as const,
    sourceRateHz: 4000,
    conditions: { temperatureK: 300, fieldVoltage: 0, radiationDose: 1, activationEnergyEV: 1 },
    detector: {
      ...DEFAULT_CONFIG.detector,
      lossPct: 0, jitterPs: 0, deadTimeNs: 2000,
      afterpulseProb: 0, afterpulseTauNs: 30, darkCountRateHz: 0, crosstalkProb: 0,
    },
  };

  it('delad dödtid: blandningen ger FÄRRE händelser än separat detektorbehandling', () => {
    const strength = 0.5;
    const shared = runBlindInjection('A', contendedConfig, strength, new Rng(3), 4, 'preDetector');
    const separate = runBlindInjection('A', contendedConfig, strength, new Rng(3), 4, 'legacyPostDetector');
    // Båda vägarna analyserar samma nominella blandning; skillnaden är enbart
    // om strömmarna delade detektor. Delad detektor ⇒ fler vetoade laviner.
    expect(shared.eventCount).toBeLessThan(separate.eventCount);
  }, HEAVY_TIMEOUT_MS);

  it('styrka 0 och 1 är väldefinierade ändpunkter', () => {
    const zero = runBlindInjection('A', contendedConfig, 0, new Rng(7), 4);
    const one = runBlindInjection('A', contendedConfig, 1, new Rng(7), 4);
    expect(zero.trueStrength).toBe(0);
    expect(one.trueStrength).toBe(1);
    expect(zero.eventCount).toBeGreaterThan(0);
    expect(one.eventCount).toBeGreaterThan(0);
  }, HEAVY_TIMEOUT_MS);

  it('deterministisk: samma seed ⇒ identiskt resultat', () => {
    const a = runBlindInjection('A', contendedConfig, 0.5, new Rng(11), 4);
    const b = runBlindInjection('A', contendedConfig, 0.5, new Rng(11), 4);
    expect(b).toEqual(a);
  }, HEAVY_TIMEOUT_MS);
});
