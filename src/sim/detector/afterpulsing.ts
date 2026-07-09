// Efterpuls: en spöklik andra klickning strax efter ett äkta klick, orsakad av
// fångade laddningsbärare i detektorn (SPAD-fysik). Fejkar en topp vid små τ
// (A-rapporten §5) — flaggas explicit så analys/nulls kan känna igen den.

import type { PhotonEvent } from '../../types/events';
import type { Rng } from '../rng';

export function applyAfterpulsing(
  events: PhotonEvent[],
  afterpulseProb: number,
  afterpulseTauNs: number,
  duration: number,
  rng: Rng,
): PhotonEvent[] {
  if (afterpulseProb <= 0) return events;
  const tauS = afterpulseTauNs * 1e-9;
  const extra: PhotonEvent[] = [];
  let nextId = events.reduce((m, e) => Math.max(m, e.id), 0) + 1;

  for (const e of events) {
    if (rng.bool(afterpulseProb)) {
      const t = e.detectedT + rng.exponential(1 / tauS);
      if (t < duration) {
        extra.push({
          ...e,
          id: nextId++,
          t,
          detectedT: t,
          isBackground: false,
          flags: [...e.flags, 'afterpulse'],
        });
      }
    }
  }
  return [...events, ...extra];
}
