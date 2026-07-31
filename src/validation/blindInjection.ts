// Blind injection-studie (CLAUDE.md §8, README v2.2). Blandar en klassisk
// baslinje med en känd mängd "signal" (given styrka ∈ [0,1], interpolerad via
// samma köll-/villkorsknappar som resten av plattformen — inte en separat
// injektionsmotor) och kör den FULLA analyspipelinen på blandningen. Styrkan
// avslöjas efter analys ("facit"), inte innan — pipeline ser bara händelseströmmen.
//
// TODO(rapport): detta är plattformens EGEN blindtest, inte en ersättning för
// riktig blindanalys med extern part (README v2.2, "Viktiga begränsningar").

import type { RunConfig, SourceType } from '../types/config';
import type { EventStream, PhotonEvent } from '../types/events';
import type { SignatureId } from '../types/signatures';
import type { Rng } from '../sim/rng';
import { generateEventStream, generateLatentEvents, applyDetector } from '../sim';
import { ANALYSIS_REGISTRY, type AnalysisContext, type Verdict } from '../analysis/registry';

/**
 * 'preDetector' (default, korrekt): latent signal + latent bakgrund slås ihop
 * FÖRE en gemensam detektor. 'legacyPostDetector': det tidigare, felaktiga
 * beteendet — behållet enbart för jämförelse mot historiska blindsvep.
 */
export type InjectionMixMode = 'preDetector' | 'legacyPostDetector';

function classicalVariantFor(source: SourceType): SourceType {
  switch (source) {
    case 'singleEmitter':
      return 'thermal';
    case 'memoryEcho':
      return 'coherent';
    default:
      return source; // thermal/coherent är redan klassiska; entangled hanteras via decoherence-override
  }
}

/**
 * PRE-DETEKTOR-BLANDNING (P3, granskningens P0-fynd). Tidigare kördes signal
 * och baslinje genom VAR SIN fullständig detektorkedja och slogs ihop efteråt.
 * Då konkurrerade de aldrig om samma dödtid, mättnad, afterpulsing eller
 * koincidensmatchning — injektionen blev renare än motsvarande verkliga
 * experiment, och därmed en för optimistisk detektionsförmåga.
 *
 * Rätt ordning: generera LATENT signal → generera LATENT bakgrund → slå ihop →
 * kör den gemensamma strömmen genom EN detektor. Facit (styrkan) finns aldrig i
 * händelseströmmen; den avslöjas först i poängsättningen efter analys.
 */
function generateInjectionMix(
  config: RunConfig,
  strength: number,
  rng: Rng,
  mode: InjectionMixMode,
): EventStream {
  const clampedStrength = Math.min(1, Math.max(0, strength));

  const signalConfig: RunConfig = {
    ...config,
    sourceRateHz: config.sourceRateHz * clampedStrength,
  };
  const baselineConfig: RunConfig = {
    ...config,
    source: classicalVariantFor(config.source),
    sourceRateHz: config.sourceRateHz * (1 - clampedStrength),
  };
  const baselineOverride = config.source === 'entangled' ? { decoherence: 1 } : undefined;

  if (mode === 'legacyPostDetector') {
    // Bevarad enbart för före/efter-jämförelse med historiska blindsvep.
    const signalStream = generateEventStream(signalConfig, rng.fork());
    const baselineStream = generateEventStream(baselineConfig, rng.fork(), baselineOverride);
    let nextId = 0;
    const relabel = (events: PhotonEvent[]) => events.map((e) => ({ ...e, id: nextId++ }));
    const events = [...relabel(signalStream.events), ...relabel(baselineStream.events)].sort(
      (a, b) => a.detectedT - b.detectedT,
    );
    return { events, duration: config.duration, seed: config.seed, sourceRate: config.sourceRateHz };
  }

  const signalLatent = generateLatentEvents(signalConfig, rng.fork());
  const baselineLatent = generateLatentEvents(baselineConfig, rng.fork(), baselineOverride);

  let nextId = 0;
  const merged = [...signalLatent.events, ...baselineLatent.events]
    .map((e) => ({ ...e, id: nextId++ })) // omnumrering raderar allt spår av ursprung
    .sort((a, b) => a.t - b.t);

  // EN gemensam detektor för den sammanslagna strömmen: nu delar signal och
  // bakgrund dödtid, mättnad och afterpulskö.
  return applyDetector(merged, config, signalLatent.effects, rng.fork());
}

export interface InjectionRunResult {
  signatureId: SignatureId;
  trueStrength: number;
  detectedVerdict: Verdict;
  detected: boolean;
  headlinePValue?: number;
  /** Antal detekterade händelser i blandningen — diagnostik för dödtidskonkurrens. */
  eventCount: number;
}

export function runBlindInjection(
  signatureId: SignatureId,
  config: RunConfig,
  strength: number,
  rng: Rng,
  nullReplicates: number,
  mode: InjectionMixMode = 'preDetector',
): InjectionRunResult {
  const analyzer = ANALYSIS_REGISTRY[signatureId];
  if (!analyzer) throw new Error(`Ingen analysmodul kopplad för signatur ${signatureId}`);

  const mixedStream = generateInjectionMix(config, strength, rng.fork(), mode);
  const ctx: AnalysisContext = { stream: mixedStream, config, rng: rng.fork(), nullReplicates };
  const result = analyzer(ctx);
  const headlinePValue = result.components.find((c) => c.pValue !== undefined)?.pValue;

  return {
    signatureId,
    trueStrength: strength,
    detectedVerdict: result.verdict,
    detected: result.verdict !== 'none',
    headlinePValue,
    eventCount: mixedStream.events.length,
  };
}

export function runInjectionSweep(
  signatureId: SignatureId,
  config: RunConfig,
  strengths: number[],
  rng: Rng,
  nullReplicates: number,
  mode: InjectionMixMode = 'preDetector',
): InjectionRunResult[] {
  return strengths.map((s) => runBlindInjection(signatureId, config, s, rng.fork(), nullReplicates, mode));
}
