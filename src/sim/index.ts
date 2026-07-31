import type { RunConfig } from '../types/config';
import type { EventStream, PhotonEvent } from '../types/events';
import { Rng } from './rng';
import { computeConditionEffects, type ConditionEffects } from './conditions';
import { SOURCE_REGISTRY } from './sources';
import { runDetectorPipeline } from './detector';
import type { SourceContext } from './sources/types';

/**
 * @param rngOverride Används av nulls/S4-S5 för att generera oberoende surrogat
 * utan att dela tillstånd med den "riktiga" körningens RNG.
 * @param effectsOverride Delvis override av villkorseffekter — används av S4
 * (klassisk motståndare, t.ex. visibility-tak vid Bell-gränsen) och S5 (drift).
 */
/**
 * LATENTA källhändelser — källfysiken ENSAM, före instrumentlagret. Exponerad
 * så att flera latenta strömmar kan slås ihop och sedan passera EN GEMENSAM
 * detektor (blind injection, P3): signal och bakgrund måste konkurrera om samma
 * dödtid/mättnad, annars blir injektionen renare än ett verkligt experiment.
 */
export function generateLatentEvents(
  config: RunConfig,
  rng: Rng,
  effectsOverride?: Partial<ConditionEffects>,
): { events: PhotonEvent[]; effects: ConditionEffects } {
  const effects = {
    ...computeConditionEffects(config.sourceRateHz, config.detector.darkCountRateHz, config.conditions),
    ...effectsOverride,
  };

  const ctx: SourceContext = {
    rng,
    duration: config.duration,
    rateHz: config.sourceRateHz,
    conditions: config.conditions,
    effects,
    chsh: config.chsh,
  };

  return { events: SOURCE_REGISTRY[config.source](ctx), effects };
}

/** Instrumentlagret ensamt — tar latenta händelser till detekterade. */
export function applyDetector(
  latentEvents: PhotonEvent[],
  config: RunConfig,
  effects: ConditionEffects,
  rng: Rng,
): EventStream {
  const events = runDetectorPipeline(
    latentEvents,
    config.source,
    config.duration,
    config.detector,
    effects,
    rng,
  );
  return {
    events,
    duration: config.duration,
    seed: config.seed,
    sourceRate: config.sourceRateHz,
  };
}

export function generateEventStream(
  config: RunConfig,
  rngOverride?: Rng,
  effectsOverride?: Partial<ConditionEffects>,
): EventStream {
  // RNG-ordningen (källa först, sedan detektor, samma instans) måste bevaras —
  // golden tests G6 och alla golden datasets bygger på den.
  const rng = rngOverride ?? new Rng(config.seed);
  const { events: rawEvents, effects } = generateLatentEvents(config, rng, effectsOverride);
  return applyDetector(rawEvents, config, effects, rng);
}

export { Rng } from './rng';
export { computeConditionEffects } from './conditions';
export type { ConditionEffects } from './conditions';
