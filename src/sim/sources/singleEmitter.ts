// Enfotonkälla: emittern måste relaxera till grundtillståndet innan nästa
// emission (källans EGEN återhämtningstid — skild från detektordödtid i
// sim/detector). Detta ger antibunching, g²(0) → 0 (A-rapporten §2.2).
// Arrhenius-faktorn (temperatur/aktiveringsenergi) skalar återhämtningstiden:
// snabbare relaxation vid hög temperatur/låg barriär → kortare "källdödtid".
//
// GRANSKNINGSFYND (bindande, dokumenterat här eftersom det ändrade fysiken):
// v1 modellerade återhämtningen som en HÅRD golvregel — dt = recoveryS +
// U(0,0.2·recoveryS) — vilket gör mellanhändelsetiderna nästan deterministiskt
// periodiska (kluster i ett smalt fönster runt recoveryS). Ett granskningssvep
// avslöjade att detta ALIASAR mot analysens τ-rutnät: g²(τ) fick en skarp
// oscillation (topp/dal vartannat bin, se scripts/debug_a.ts-utforskningen)
// istället för den släta stigningen g²(τ) = 1 − e^(−γτ) som ett verkligt
// tvånivåsystem ger. Det gjorde ε känslig för godtycklig binjustering — exakt
// den robusthet mot binningändring rapporterna kräver (t.ex. B-rapporten §9)
// höll INTE. Ersatt med "thinning"/avvisningssampling: en kandidatemission vid
// tid t accepteras med sannolikhet 1 − e^(−γ·Δt) där Δt är tiden sedan
// föregående ACCEPTERADE emission — detta är en standardmetod för att
// generera en förnyelseprocess med exakt den önskade g²-profilen, utan någon
// konstgjord periodicitet.
import type { PhotonEvent } from '../../types/events';
import type { SourceGenerator } from './types';

const RELAXATION_RATE_MULTIPLIER = 4; // dipbredd ≈ 1/(4·takt) — samma storleksordning som tidigare golv

export const generateSingleEmitter: SourceGenerator = (ctx) => {
  const { rng, duration, effects } = ctx;
  const rate = effects.effectiveRateHz;
  const gamma = rate * Math.max(effects.arrheniusFactor, 1e-3) * RELAXATION_RATE_MULTIPLIER;
  const events: PhotonEvent[] = [];
  let id = 0;
  let t = 0;
  let lastAccepted = -Infinity;
  while (t < duration) {
    t += rng.exponential(rate);
    if (t >= duration) break;
    const sinceLast = t - lastAccepted;
    const acceptProb = 1 - Math.exp(-gamma * sinceLast);
    if (!rng.bool(acceptProb)) continue; // avvisad kandidat: emittern hann inte relaxera
    lastAccepted = t;
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
