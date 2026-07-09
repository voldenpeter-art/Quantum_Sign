// HBT-kanaltilldelning: enkanalskällor (thermal/coherent/singleEmitter/
// memoryEcho) passerar en virtuell 50/50-stråldelare innan detektorerna —
// detta är förutsättningen för Signatur A:s korskorrelationskrav (A-rapporten
// §4.1). Parkällor (entangled) har redan fysiska armar och rörs inte.

import type { PhotonEvent } from '../../types/events';
import type { Rng } from '../rng';

export function assignHbtChannels(events: PhotonEvent[], rng: Rng): PhotonEvent[] {
  return events.map((e) => {
    if (e.arm) return e;
    return { ...e, channel: rng.bool(0.5) ? 'D1' : 'D2' };
  });
}
