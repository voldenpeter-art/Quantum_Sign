// S4 — klassisk motståndare på detektornivå. Ersätter källan med en garanterat
// klassisk modell (aldrig kvantkorrelerad) och kör den genom SAMMA
// detektorpipeline med instrumentparametrar trimmade mot värsta fallet
// (C-rapporten §6.1, B-rapporten §8 punkt S4). Motståndaren tillåts närma sig
// den klassiska gränsen men aldrig bryta den — annars är nollan meningslös
// (C-rapporten §6.1, kategorifel-varningen).

import type { EventStream } from '../types/events';
import type { RunConfig } from '../types/config';
import type { Rng } from '../sim/rng';
import { generateEventStream, computeConditionEffects } from '../sim';
import { blockBootstrapS3 } from './S3_block';

const CLASSICAL_CHSH_BOUND_DECOHERENCE = 1 - 1 / Math.SQRT2; // visibility → 1/√2

function withAdversarialDetector(config: RunConfig): RunConfig {
  return {
    ...config,
    detector: {
      ...config.detector,
      // "Aktivt trimmad": instrumentartefakterna som kan fejka signal (§4.4 i
      // B-rapporten) knuffas uppåt inom sina kalibreringsosäkerheter.
      afterpulseProb: Math.min(0.5, config.detector.afterpulseProb * 1.5),
      crosstalkProb: Math.min(0.5, config.detector.crosstalkProb * 1.5),
    },
  };
}

export function generateS4(config: RunConfig, rng: Rng): EventStream {
  let adversaryConfig = withAdversarialDetector(config);

  if (config.source === 'singleEmitter') {
    // A-rapporten §7: S4 = full simulering av termisk källa (den enda källan
    // som legitimt kan fejka en dipp via dödtidsartefakt i FEL mätarkitektur —
    // här körs den ändå genom den korrekta korskorrelationspipelinen).
    adversaryConfig = { ...adversaryConfig, source: 'thermal' };
  } else if (config.source === 'memoryEcho') {
    // Minneslös klassisk referens: ingen inbyggd eko-mekanism.
    adversaryConfig = { ...adversaryConfig, source: 'coherent' };
  }

  const rngFork = rng.fork();

  if (config.source === 'entangled') {
    // Klassisk LHV-motståndare: samma korrelationsmodell, men visibility
    // takas vid Bell-gränsen 1/√2 — motståndaren får aldrig bryta CHSH ≤ 2.
    const configuredDecoherence = computeConditionEffects(
      config.sourceRateHz,
      config.detector.darkCountRateHz,
      config.conditions,
    ).decoherence;
    return generateEventStream(adversaryConfig, rngFork, {
      decoherence: Math.max(configuredDecoherence, CLASSICAL_CHSH_BOUND_DECOHERENCE),
    });
  }

  return generateEventStream(adversaryConfig, rngFork);
}

// ---- NAMNGIVEN S4-MOTSTÅNDARFAMILJ (P2, feedback 2026-07-29) --------------
// S4 var tidigare EN modell (lhvCapped). En äkta S4 ska vara en FAMILJ av
// namngivna klassiska motståndare som var för sig kan efterlikna signalen på
// olika sätt; vittnet måste slå DEM ALLA (värsta fallet bär). Varje medlem här
// är BEVISLIGT klassisk för CHSH (E[S] ≤ 2) och R_CS (≤ 1) och därmed en giltig
// nollmodell — inga påhittade parametrar (CLAUDE.md §2).
//
// TODO(rapport): setting-dependent-loss och coincidence-window-bias kräver
// käll-/detektor-knappar plattformen inte har (inställningsberoende effektivitet
// resp. fönsterselektion) — utelämnade hellre än fejkade. Se granskningens P2.
export type S4AdversaryName =
  | 'lhvCapped' // LHV vid Bell-gränsen (V ≤ 1/√2) — basmodellen ovan
  | 'uncorrelated' // V = 0: arm/inställnings-struktur finns men noll korrelation (accidentals-analog)
  | 'detectorTrimmed' // lhvCapped + hårdare detektorartefakter (afterpulse/crosstalk/dödtid upp)
  | 'selectionStress'; // lhvCapped + block-ombytesbootstrap (urvals-/analysstress; f.d. Layer2)

/** Motståndare giltiga för de entangled-baserade vittnena (C:s S, B:s R_CS). */
export const S4_CHSH_ADVERSARIES: S4AdversaryName[] = [
  'lhvCapped',
  'uncorrelated',
  'detectorTrimmed',
  'selectionStress',
];

export function generateS4Adversary(
  name: S4AdversaryName,
  config: RunConfig,
  rng: Rng,
): EventStream {
  switch (name) {
    case 'lhvCapped':
      return generateS4(config, rng);
    case 'uncorrelated': {
      // Full defasning → E(a,b) = 0. Behåll entangled-strukturen (armar/
      // inställningar) men sätt visibility till noll; för enkanalskällor räcker
      // en okorrelerad klassisk källa (coherent).
      if (config.source === 'entangled') {
        return generateEventStream(withAdversarialDetector(config), rng.fork(), { decoherence: 1 });
      }
      return generateEventStream({ ...withAdversarialDetector(config), source: 'coherent' }, rng.fork());
    }
    case 'detectorTrimmed': {
      const trimmed: RunConfig = {
        ...config,
        detector: {
          ...config.detector,
          afterpulseProb: Math.min(0.6, config.detector.afterpulseProb * 2 + 0.02),
          crosstalkProb: Math.min(0.6, config.detector.crosstalkProb * 2 + 0.02),
          deadTimeNs: config.detector.deadTimeNs * 1.5,
        },
      };
      return generateS4(trimmed, rng);
    }
    case 'selectionStress': {
      const base = generateS4(config, rng.fork());
      return blockBootstrapS3(base, rng.fork(), Math.max(0.5, base.duration / 40));
    }
  }
}
