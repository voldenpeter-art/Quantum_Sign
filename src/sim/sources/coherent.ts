// Koherent källa (idealiserad laser): ren Poissonprocess, g²(0) = 1.
// Referensfall/kalibreringskälla (A-rapporten §4.2).

import type { PhotonEvent } from '../../types/events';
import type { SourceGenerator } from './types';

export const generateCoherent: SourceGenerator = (ctx) => {
  const { rng, duration, effects } = ctx;
  const rate = effects.effectiveRateHz;
  const events: PhotonEvent[] = [];
  let id = 0;
  let t = 0;
  while (t < duration) {
    t += rng.exponential(rate);
    if (t >= duration) break;
    events.push({
      id: id++,
      t,
      detectedT: t,
      channel: 'D1',
      isBackground: false,
      flags: [],
    });
  }
  return events;
};
