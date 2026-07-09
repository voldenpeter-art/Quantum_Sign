import type { RunConfig } from '../types/config';
import type { EventStream } from '../types/events';
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
export function generateEventStream(
  config: RunConfig,
  rngOverride?: Rng,
  effectsOverride?: Partial<ConditionEffects>,
): EventStream {
  const rng = rngOverride ?? new Rng(config.seed);
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

  const rawEvents = SOURCE_REGISTRY[config.source](ctx);
  const events = runDetectorPipeline(
    rawEvents,
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

export { Rng } from './rng';
export { computeConditionEffects } from './conditions';
export type { ConditionEffects } from './conditions';
