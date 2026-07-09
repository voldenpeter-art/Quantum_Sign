import type { PhotonEvent } from '../../types/events';
import type { Rng } from '../rng';

export function applyJitter(events: PhotonEvent[], jitterPs: number, rng: Rng): PhotonEvent[] {
  const jitterS = jitterPs * 1e-12;
  if (jitterS <= 0) return events;
  return events.map((e) => ({
    ...e,
    detectedT: Math.max(0, e.t + rng.gaussian(0, jitterS)),
  }));
}
