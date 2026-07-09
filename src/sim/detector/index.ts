// Detektorpipeline i fast, fysikaliskt betydelsefull ordning (CLAUDE.md §6):
//   HBT-kanaler → loss → jitter → deadTime → afterpulsing → darkCounts → crosstalk
// Källan vet inget om detektorn; alla icke-idealiteter läggs på här, efteråt.

import type { PhotonEvent } from '../../types/events';
import type { DetectorParams, SourceType } from '../../types/config';
import type { Rng } from '../rng';
import type { ConditionEffects } from '../conditions';
import { assignHbtChannels } from './channels';
import { applyLoss } from './loss';
import { applyJitter } from './jitter';
import { applyDeadTime } from './deadTime';
import { applyAfterpulsing } from './afterpulsing';
import { applyDarkCounts } from './darkCounts';
import { applyCrosstalk } from './crosstalk';
import { TWO_ARM_SOURCES } from '../sources';

export function runDetectorPipeline(
  events: PhotonEvent[],
  source: SourceType,
  duration: number,
  params: DetectorParams,
  effects: ConditionEffects,
  rng: Rng,
): PhotonEvent[] {
  const detectorKeys = TWO_ARM_SOURCES.includes(source) ? ['A', 'B'] : ['D1', 'D2'];

  let stream = assignHbtChannels(events, rng);
  stream = applyLoss(stream, params.lossPct, rng);
  stream = applyJitter(stream, params.jitterPs, rng);
  stream = applyDeadTime(stream, params.deadTimeNs);
  stream = applyAfterpulsing(stream, params.afterpulseProb, params.afterpulseTauNs, duration, rng);
  stream = applyDarkCounts(stream, detectorKeys, effects.backgroundRateHz, duration, rng);
  stream = applyCrosstalk(stream, params.crosstalkProb, duration, rng);

  return stream.sort((a, b) => a.detectedT - b.detectedT);
}

export * from './keys';
