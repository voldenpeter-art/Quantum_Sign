// Termisk/kaotisk källa: dubbelt-stokastisk Poissonprocess (lokal intensitet
// exponentialfördelad per koherenscell) — reproducerar bunching, g²(0) → 2,
// och Siegert-liknande avklingning med koherenstiden τ_c (B-rapporten §3).
// Temperatur styr τ_c (sim/conditions.ts): varmare källa → kortare koherenstid.

import type { PhotonEvent } from '../../types/events';
import type { SourceGenerator } from './types';

export const generateThermal: SourceGenerator = (ctx) => {
  const { rng, duration, effects } = ctx;
  const rate = effects.effectiveRateHz;
  const tauC = effects.thermalCoherenceTimeS;
  const events: PhotonEvent[] = [];
  let id = 0;
  let tBin = 0;
  while (tBin < duration) {
    const binEnd = Math.min(tBin + tauC, duration);
    // Lokal intensitet: exponentialfördelad med medelvärde = rate (enmods termiskt ljus).
    const localRate = Math.max(rng.exponential(1 / rate), 1e-9);
    let t = tBin;
    while (true) {
      t += rng.exponential(localRate);
      if (t >= binEnd) break;
      events.push({
        id: id++,
        t,
        detectedT: t,
        channel: 'D1',
        isBackground: false,
        flags: [],
      });
    }
    tBin = binEnd;
  }
  return events;
};
