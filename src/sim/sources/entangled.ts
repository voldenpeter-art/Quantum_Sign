// Polarisationsentanglad parkälla (singlett-liknande). Varje par avgör
// slumpmässigt sitt mätläge:
//   - "tomografi": båda armar mäts i SAMMA MUB-bas (HV/DA/RL) → föder B/D/E/F.
//   - "CHSH": varje arm mäts med en oberoende, konfigurerad analysatorvinkel
//     (x/y ∈ {0,1}) → föder C.
// Detta är en pedagogisk förenkling (ett par representerar antingen ett
// tomografi- eller ett CHSH-mättillfälle, aldrig båda samtidigt på samma par).
//
// Blochvektor-modell: HV/DA/RL mappas till tre inbördes ortogonala riktningar
// (1,0,0), (0,1,0), (0,0,1); en linjär analysatorvinkel θ mappas till
// (cos2θ, sin2θ, 0) i planet. För singletttillståndet är korrelationen
// E(a,b) = −V·(â·b̂), där V = 1 − dekoherens (sim/conditions.ts, fältstyrd).
// Detta reproducerar standard-CHSH-vinklarna (0°/45° och 22.5°/67.5° ger
// S = 2√2·V) och de tre MUB-baserna för B:s Stokes-tomografi.

import type { Basis, PhotonEvent } from '../../types/events';
import type { SourceGenerator } from './types';

type Vec3 = [number, number, number];

const BASES: Basis[] = ['HV', 'DA', 'RL'];
const BASIS_DIR: Record<Basis, Vec3> = {
  HV: [1, 0, 0],
  DA: [0, 1, 0],
  RL: [0, 0, 1],
};

function angleDir(angleDeg: number): Vec3 {
  const rad = (2 * angleDeg * Math.PI) / 180;
  return [Math.cos(rad), Math.sin(rad), 0];
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export const generateEntangled: SourceGenerator = (ctx) => {
  const { rng, duration, effects, chsh } = ctx;
  const pairRate = effects.effectiveRateHz / 2;
  const visibility = 1 - effects.decoherence;
  const events: PhotonEvent[] = [];
  let id = 0;
  let t = 0;

  while (t < duration) {
    t += rng.exponential(pairRate);
    if (t >= duration) break;

    const tomography = rng.bool(0.5);
    let dirA: Vec3;
    let dirB: Vec3;
    let basis: Basis | undefined;
    let settingA: 0 | 1 | undefined;
    let settingB: 0 | 1 | undefined;

    if (tomography) {
      basis = rng.pick(BASES);
      dirA = BASIS_DIR[basis];
      dirB = BASIS_DIR[basis];
    } else {
      settingA = rng.bool(0.5) ? 1 : 0;
      settingB = rng.bool(0.5) ? 1 : 0;
      dirA = angleDir(chsh.A[settingA]);
      dirB = angleDir(chsh.B[settingB]);
    }

    const E = -visibility * dot(dirA, dirB);
    const outcomeANumeric = rng.bool(0.5) ? 1 : -1;
    const sameSign = rng.bool((1 + E) / 2);
    const outcomeBNumeric = outcomeANumeric * (sameSign ? 1 : -1);

    events.push({
      id: id++,
      t,
      detectedT: t,
      channel: 'D1',
      arm: 'A',
      basis,
      pol: outcomeANumeric === 1 ? '+' : '-',
      setting: settingA,
      isBackground: false,
      flags: [],
    });
    events.push({
      id: id++,
      t,
      detectedT: t,
      channel: 'D1',
      arm: 'B',
      basis,
      pol: outcomeBNumeric === 1 ? '+' : '-',
      setting: settingB,
      isBackground: false,
      flags: [],
    });
  }

  return events;
};
