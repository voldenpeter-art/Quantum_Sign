import type { PhotonEvent } from '../../types/events';
import type { Rng } from '../rng';

export function applyDarkCounts(
  events: PhotonEvent[],
  detectorKeys: string[],
  darkCountRateHz: number,
  duration: number,
  rng: Rng,
): PhotonEvent[] {
  if (darkCountRateHz <= 0) return events;
  const extra: PhotonEvent[] = [];
  let nextId = events.reduce((m, e) => Math.max(m, e.id), 0) + 1;

  for (const key of detectorKeys) {
    let t = 0;
    while (t < duration) {
      t += rng.exponential(darkCountRateHz);
      if (t >= duration) break;
      extra.push({
        id: nextId++,
        t,
        detectedT: t,
        channel: key === 'D1' || key === 'D2' ? key : 'D1',
        arm: key === 'A' || key === 'B' ? key : undefined,
        isBackground: true,
        flags: ['background'],
      });
    }
  }
  return [...events, ...extra];
}
