// Dödtid: en detektor är blind under deadTimeNs efter varje registrerat klick.
// Appliceras PER DETEKTOR (arm/kanal), inte globalt — annars fejkas antibunching
// i korskorrelation, vilket A-rapporten §4.1 uttryckligen förbjuder.

import type { PhotonEvent } from '../../types/events';
import { detectorKeyOf } from './keys';

export function applyDeadTime(events: PhotonEvent[], deadTimeNs: number): PhotonEvent[] {
  const deadTimeS = deadTimeNs * 1e-9;
  if (deadTimeS <= 0) return events;

  const sorted = [...events].sort((a, b) => a.detectedT - b.detectedT);
  const lastAccepted = new Map<string, number>();
  const accepted: PhotonEvent[] = [];

  for (const e of sorted) {
    const key = detectorKeyOf(e);
    const last = lastAccepted.get(key);
    if (last === undefined || e.detectedT - last >= deadTimeS) {
      lastAccepted.set(key, e.detectedT);
      accepted.push(e);
    }
    // annars: vetoad (detektorn var blind) — händelsen tas bort ur strömmen.
  }
  return accepted;
}
