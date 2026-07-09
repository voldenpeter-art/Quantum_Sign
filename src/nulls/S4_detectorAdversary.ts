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
