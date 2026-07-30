import type { EventStream } from '../types/events';
import type { RunConfig } from '../types/config';
import type { NullId } from '../types/signatures';
import type { Rng } from '../sim/rng';
import { shufflePolS1, shuffleGapsS1 } from './S1_shuffle';
import { timeSlideS2 } from './S2_timeSlide';
import { blockBootstrapS3 } from './S3_block';
import { generateS4, generateS4Adversary } from './S4_detectorAdversary';
import { generateS5 } from './S5_drift';

export { generateS4Adversary, S4_CHSH_ADVERSARIES, type S4AdversaryName } from './S4_detectorAdversary';

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

/**
 * Tvålagers-S4 (syntesrapporten §7, punkt 4 — back-portad till A–H/M).
 * Lager 1 är den vanliga S4 (`generateS4`): värsta-fall DETEKTORartefakt.
 * Lager 2 lägger en ANALYS-/URVALSSTRESS ovanpå lager 1 — en block-ombytes-
 * bootstrap (S3-kärnan) på den redan detektor-adversariella strömmen. Den
 * frågar: överlever ett påstått vittne inte bara värsta-fall-detektorn utan
 * också ett värsta-fall lokalt tidsurval? Ett vittne som klarar lager 1 men
 * faller på lager 2 är ett urvals-/struktureringsartefakt, inte signal.
 *
 * Anropas parallellt med lager 1 av B (R_CS) och C (motståndargrinden); p⁽²⁾
 * över {lager 1, lager 2} kräver per konstruktion att vittnet slår det HÅRDARE
 * av de två (andra minsta av två = det största p:t).
 */
export function generateS4Layer2(config: RunConfig, rng: Rng): EventStream {
  // = motståndarfamiljens 'selectionStress'-medlem (behålls som namngiven wrapper
  // för bakåtkompatibilitet; B/C använder numera hela S4_CHSH_ADVERSARIES).
  return generateS4Adversary('selectionStress', config, rng);
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
