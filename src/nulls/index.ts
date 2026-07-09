import type { EventStream } from '../types/events';
import type { RunConfig } from '../types/config';
import type { NullId } from '../types/signatures';
import type { Rng } from '../sim/rng';
import { shufflePolS1, shuffleGapsS1 } from './S1_shuffle';
import { timeSlideS2 } from './S2_timeSlide';
import { blockBootstrapS3 } from './S3_block';
import { generateS4 } from './S4_detectorAdversary';
import { generateS5 } from './S5_drift';

const isPolarizationStream = (stream: EventStream) => stream.events.some((e) => e.arm);

/**
 * Genererar EN surrogatström av given typ. `stream` är den observerade
 * (redan detektor-degraderade) strömmen; `config` behövs för S4/S5 som
 * bygger om från grunden med en substituerad klassisk källa.
 */
export function generateNull(
  nullId: NullId,
  stream: EventStream,
  config: RunConfig,
  rng: Rng,
): EventStream {
  switch (nullId) {
    case 'S1':
      return isPolarizationStream(stream) ? shufflePolS1(stream, rng) : shuffleGapsS1(stream, rng);
    case 'S2':
      return timeSlideS2(stream, rng);
    case 'S3':
      return blockBootstrapS3(stream, rng, Math.max(0.5, stream.duration / 40));
    case 'S4':
      return generateS4(config, rng);
    case 'S5':
      return generateS5(config, rng);
  }
}

/** Genererar `n` replikat av given nulltyp (empirisk nollfördelning, CLAUDE.md §7). */
export function generateNullEnsemble(
  nullId: NullId,
  stream: EventStream,
  config: RunConfig,
  rng: Rng,
  n: number,
): EventStream[] {
  return Array.from({ length: n }, () => generateNull(nullId, stream, config, rng.fork()));
}

export * from './types';
