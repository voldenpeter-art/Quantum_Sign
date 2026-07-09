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
import { generateEventStream } from '../sim';
import { ANALYSIS_REGISTRY, type AnalysisContext, type Verdict } from '../analysis/registry';

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

function generateInjectionMix(config: RunConfig, strength: number, rng: Rng): EventStream {
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

  const signalStream = generateEventStream(signalConfig, rng.fork());
  const baselineStream =
    config.source === 'entangled'
      ? generateEventStream(baselineConfig, rng.fork(), { decoherence: 1 })
      : generateEventStream(baselineConfig, rng.fork());

  let nextId = 0;
  const relabel = (events: PhotonEvent[]) => events.map((e) => ({ ...e, id: nextId++ }));

  const events = [...relabel(signalStream.events), ...relabel(baselineStream.events)].sort(
    (a, b) => a.detectedT - b.detectedT,
  );

  return { events, duration: config.duration, seed: config.seed, sourceRate: config.sourceRateHz };
}

export interface InjectionRunResult {
  signatureId: SignatureId;
  trueStrength: number;
  detectedVerdict: Verdict;
  detected: boolean;
  headlinePValue?: number;
}

export function runBlindInjection(
  signatureId: SignatureId,
  config: RunConfig,
  strength: number,
  rng: Rng,
  nullReplicates: number,
): InjectionRunResult {
  const analyzer = ANALYSIS_REGISTRY[signatureId];
  if (!analyzer) throw new Error(`Ingen analysmodul kopplad för signatur ${signatureId}`);

  const mixedStream = generateInjectionMix(config, strength, rng.fork());
  const ctx: AnalysisContext = { stream: mixedStream, config, rng: rng.fork(), nullReplicates };
  const result = analyzer(ctx);
  const headlinePValue = result.components.find((c) => c.pValue !== undefined)?.pValue;

  return {
    signatureId,
    trueStrength: strength,
    detectedVerdict: result.verdict,
    detected: result.verdict !== 'none',
    headlinePValue,
  };
}

export function runInjectionSweep(
  signatureId: SignatureId,
  config: RunConfig,
  strengths: number[],
  rng: Rng,
  nullReplicates: number,
): InjectionRunResult[] {
  return strengths.map((s) => runBlindInjection(signatureId, config, s, rng.fork(), nullReplicates));
}
