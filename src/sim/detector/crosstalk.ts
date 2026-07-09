// Detektor-crosstalk: ett klick på en detektor inducerar (elektriskt eller
// optiskt) ett spökklick på grann-detektorn, nära samma tidpunkt. Detta är en
// av de enda vägarna till falskt R_CS > 1 (B-rapporten §4.4) och ska därför
// alltid finnas i den klassiska motståndaren S4, inte bara i "riktig" data.

import type { PhotonEvent } from '../../types/events';
import type { Rng } from '../rng';
import { detectorKeyOf, pairedDetectorKey } from './keys';

export function applyCrosstalk(
  events: PhotonEvent[],
  crosstalkProb: number,
  duration: number,
  rng: Rng,
): PhotonEvent[] {
  if (crosstalkProb <= 0) return events;
  const extra: PhotonEvent[] = [];
  let nextId = events.reduce((m, e) => Math.max(m, e.id), 0) + 1;

  for (const e of events) {
    if (e.isBackground) continue;
    if (rng.bool(crosstalkProb)) {
      const pairedKey = pairedDetectorKey(detectorKeyOf(e));
      const t = e.detectedT + rng.gaussian(0, 200e-12);
      if (t >= 0 && t < duration) {
        extra.push({
          ...e,
          id: nextId++,
          t,
          detectedT: t,
          channel: pairedKey === 'D1' || pairedKey === 'D2' ? pairedKey : e.channel,
          arm: pairedKey === 'A' || pairedKey === 'B' ? pairedKey : e.arm,
          isBackground: false,
          flags: [...e.flags, 'crosstalk'],
        });
      }
    }
  }
  return [...events, ...extra];
}
