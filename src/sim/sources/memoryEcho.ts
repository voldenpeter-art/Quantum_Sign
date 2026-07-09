// Minneskälla: primär Poissonprocess plus en sannolik "eko"-händelse efter
// fördröjning τ_echo (Gaussiskt utsmetad). Ger en revival-topp i g²(τ) vid
// τ ≈ τ_echo ovanpå den vanliga avklingningen — det F_memory letar efter
// (F-rapporten: revival-mallar mot semigrupp-/Markov-null). τ_echo skalas av
// Arrhenius-faktorn: långsammare relaxation (lägre T eller högre E_a) → längre
// levande eko.

import type { PhotonEvent } from '../../types/events';
import type { SourceGenerator } from './types';

export const generateMemoryEcho: SourceGenerator = (ctx) => {
  const { rng, duration, effects } = ctx;
  const rate = effects.effectiveRateHz;
  const echoProb = 0.35;
  const echoDelayS = 0.05 / Math.max(effects.arrheniusFactor, 1e-3);
  const echoJitterS = echoDelayS * 0.15;
  const events: PhotonEvent[] = [];
  let id = 0;
  let t = 0;

  const push = (time: number) => {
    if (time >= 0 && time < duration) {
      events.push({
        id: id++,
        t: time,
        detectedT: time,
        channel: 'D1',
        isBackground: false,
        flags: [],
      });
    }
  };

  while (t < duration) {
    t += rng.exponential(rate);
    if (t >= duration) break;
    push(t);
    if (rng.bool(echoProb)) {
      push(t + Math.max(0, rng.gaussian(echoDelayS, echoJitterS)));
    }
  }

  return events;
};
