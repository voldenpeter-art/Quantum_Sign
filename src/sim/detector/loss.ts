import type { PhotonEvent } from '../../types/events';
import type { Rng } from '../rng';

export function applyLoss(events: PhotonEvent[], lossPct: number, rng: Rng): PhotonEvent[] {
  const survivalProb = 1 - lossPct / 100;
  return events.filter(() => rng.bool(survivalProb));
}
