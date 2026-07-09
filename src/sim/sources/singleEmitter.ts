// Enfotonkälla: emittern måste relaxera till grundtillståndet innan nästa
// emission (källans EGEN återhämtningstid — skild från detektordödtid i
// sim/detector). Detta ger antibunching, g²(0) → 0 (A-rapporten §2.2).
// Arrhenius-faktorn (temperatur/aktiveringsenergi) skalar återhämtningstiden:
// snabbare relaxation vid hög temperatur/låg barriär → kortare "källdödtid".

import type { PhotonEvent } from '../../types/events';
import type { SourceGenerator } from './types';

export const generateSingleEmitter: SourceGenerator = (ctx) => {
  const { rng, duration, effects } = ctx;
  const rate = effects.effectiveRateHz;
  const recoveryS = 1 / rate / Math.max(effects.arrheniusFactor, 1e-3);
  const events: PhotonEvent[] = [];
  let id = 0;
  let t = 0;
  while (t < duration) {
    let dt = rng.exponential(rate);
    if (dt < recoveryS) dt = recoveryS + rng.next() * recoveryS * 0.2;
    t += dt;
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
