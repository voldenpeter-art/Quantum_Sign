// Regressionsskydd för IBM-bryggan.
//
// Det viktigaste testet här är REPRODUKTIONSKRAVET: bryggan måste ge exakt
// S = 2.5317383 och σ_S = 0.0241785, samma värden som den oberoende
// Python-direktberäkningen ur IBM:s BitArray. Avviker de är bryggan fel, inte
// datan. Resten av testerna skyddar avkodningskedjan (base64 → zlib → npy →
// bitar), där en tyst feltolkning av råa mätbitar vore den värsta felklassen i
// hela projektet — den skulle inte krascha, bara ge fel fysik.

import { describe, expect, it } from 'vitest';
import { deflateSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { computeS } from '../../src/analysis/C_chsh';
import { Rng } from '../../src/sim/rng';
import {
  bitstringsFromNpy,
  decodeNdarrayBase64,
  parseNpyUint8,
  readIbmResult,
} from './ibmBitArray';
import {
  bitsToOutcomes,
  correlations,
  labelShuffleWithinSettings,
  stratifiedBootstrap,
  toChshPairs,
  toShotRecords,
} from './ibmChshBridge';
import { merminValue, parityOf, xParityExpectation } from './ibmMerminBridge';

const FIX = join(process.cwd(), 'fixtures/ibm');
const load = (jobId: string) =>
  readIbmResult(JSON.parse(readFileSync(join(FIX, `sanitized_job-${jobId}-result.json`), 'utf-8')));

/** Bygger en npy v1.0-buffert med uint8-data, som IBM:s serialisering gör. */
function makeNpy(data: number[], shape: number[]): Buffer {
  const header = `{'descr': '|u1', 'fortran_order': False, 'shape': (${shape.join(', ')}${
    shape.length === 1 ? ',' : ''
  }), }`;
  const pad = 64 - ((10 + header.length + 1) % 64);
  const full = header + ' '.repeat(pad) + '\n';
  const buf = Buffer.alloc(10 + full.length + data.length);
  buf.write('\x93NUMPY', 0, 'latin1');
  buf[6] = 1;
  buf[7] = 0;
  buf.writeUInt16LE(full.length, 8);
  buf.write(full, 10, 'latin1');
  Buffer.from(data).copy(buf, 10 + full.length);
  return buf;
}

describe('npy-avkodning', () => {
  it('läser uint8 i C-ordning', () => {
    const arr = parseNpyUint8(makeNpy([0, 1, 2, 3], [4, 1]));
    expect(Array.from(arr.data)).toEqual([0, 1, 2, 3]);
    expect(arr.shape).toEqual([4, 1]);
  });

  it('avvisar dtype som inte är uint8 istället för att gissa', () => {
    const bad = makeNpy([0], [1, 1]).toString('latin1').replace("'|u1'", "'<i4'");
    expect(() => parseNpyUint8(Buffer.from(bad, 'latin1'))).toThrow(/uint8/);
  });

  it('avvisar Fortran-ordning', () => {
    const bad = makeNpy([0, 1], [2, 1])
      .toString('latin1')
      .replace("'fortran_order': False", "'fortran_order': True");
    expect(() => parseNpyUint8(Buffer.from(bad, 'latin1'))).toThrow(/Fortran/);
  });

  it('avvisar fel magic', () => {
    expect(() => parseNpyUint8(Buffer.from('NOTNPY........', 'latin1'))).toThrow(/magic/);
  });

  it('hanterar både zlib-komprimerad och rå payload', () => {
    const npy = makeNpy([7], [1, 1]);
    const packed = decodeNdarrayBase64(deflateSync(npy).toString('base64'));
    const raw = decodeNdarrayBase64(npy.toString('base64'));
    expect(Array.from(packed.data)).toEqual([7]);
    expect(Array.from(raw.data)).toEqual([7]);
  });

  it('packar upp bitsträngar big-endian över bytes', () => {
    // 2 bitar per shot: byte 0→'00', 1→'01', 2→'10', 3→'11'
    const arr = parseNpyUint8(makeNpy([0, 1, 2, 3], [4, 1]));
    expect(bitstringsFromNpy(arr, 2)).toEqual(['00', '01', '10', '11']);
  });

  it('hanterar flerbyte-rader', () => {
    // 9 bitar i två bytes: 0x01 0x05 → 0b1_0000_0101 = '100000101'
    const arr = parseNpyUint8(makeNpy([1, 5], [1, 2]));
    expect(bitstringsFromNpy(arr, 9)).toEqual(['100000101']);
  });
});

describe('CHSH-brygga: teckenkonvention och bitordning', () => {
  it("mappar '0'→+1 och '1'→−1, Qiskit little-endian", () => {
    // bits[0] = q1 (B-armen), bits[1] = q0 (A-armen)
    expect(bitsToOutcomes('00')).toEqual({ a: 1, b: 1 });
    expect(bitsToOutcomes('01')).toEqual({ a: -1, b: 1 });
    expect(bitsToOutcomes('10')).toEqual({ a: 1, b: -1 });
    expect(bitsToOutcomes('11')).toEqual({ a: -1, b: -1 });
  });

  it('avvisar bitsträngar som inte är två bitar', () => {
    expect(() => bitsToOutcomes('0')).toThrow();
    expect(() => bitsToOutcomes('012')).toThrow();
  });

  it('S är invariant under byte av bitordning', () => {
    // Detta är varför bitordningsproben aldrig kunde påverka S: produkten a·b
    // är symmetrisk. Proben skyddar armupplösta storheter, inte korrelatorn.
    const pubs = load('d9ndf7gqs0bc73e3adu0');
    const swapped = pubs.map((p) => ({
      ...p,
      bitstrings: p.bitstrings.map((b) => b[1] + b[0]),
    }));
    expect(computeS(toChshPairs(toShotRecords('x', swapped)))).toBeCloseTo(
      computeS(toChshPairs(toShotRecords('x', pubs))),
      12,
    );
  });

  it('stoppar om ett shot saknar settingpar (manifest §4)', () => {
    const records = toShotRecords('x', [{ index: 9, numBits: 2, bitstrings: ['00'] }]);
    expect(() => toChshPairs(records)).toThrow(/stoppregel/);
  });

  it('stoppar om ett settingpar saknar shots', () => {
    const pairs = toChshPairs(toShotRecords('x', [{ index: 0, numBits: 2, bitstrings: ['00'] }]));
    expect(() => correlations(pairs)).toThrow(/stoppregel/);
  });
});

describe('REPRODUKTIONSKRAV: C-analysatorn mot direktberäkningen', () => {
  const pubs = load('d9ndf7gqs0bc73e3adu0');
  const pairs = toChshPairs(toShotRecords('d9ndf7gqs0bc73e3adu0', pubs));

  it('läser 4 PUB:ar × 4096 shots', () => {
    expect(pubs).toHaveLength(4);
    for (const p of pubs) {
      expect(p.bitstrings).toHaveLength(4096);
      expect(p.numBits).toBe(2);
    }
    expect(pairs).toHaveLength(16384);
  });

  it('reproducerar S = 2.5317383 exakt', () => {
    expect(computeS(pairs)).toBeCloseTo(2.5317383, 6);
  });

  it('reproducerar sigma_S = 0.0241785 exakt', () => {
    expect(correlations(pairs).sigmaS).toBeCloseTo(0.0241785, 6);
  });

  it('reproducerar de fyra korrelatorerna', () => {
    const { E } = correlations(pairs);
    expect(E['0,0']).toBeCloseTo(0.619629, 6);
    expect(E['0,1']).toBeCloseTo(-0.60791, 6);
    expect(E['1,0']).toBeCloseTo(0.624512, 6);
    expect(E['1,1']).toBeCloseTo(0.679688, 6);
  });

  it('bryter Bell-gränsen med ~22 sigma', () => {
    const S = computeS(pairs);
    expect((S - 2) / correlations(pairs).sigmaS).toBeGreaterThan(20);
  });
});

describe('giltiga nullar för shot-data', () => {
  const pubs = load('d9ndf7gqs0bc73e3adu0');
  const pairs = toChshPairs(toShotRecords('x', pubs));
  const rng = new Rng(20260802);
  const rand = () => rng.next();

  it('label-shuffle förstör korrelationen men bevarar marginalerna', () => {
    const shuffled = labelShuffleWithinSettings(pairs, rand);
    expect(Math.abs(computeS(shuffled))).toBeLessThan(0.3);
    // Marginalerna per bucket är oförändrade: summan av B-utfall bevaras.
    const sumB = (ps: typeof pairs) => ps.reduce((a, p) => a + p.outcomeB, 0);
    expect(sumB(shuffled)).toBe(sumB(pairs));
  });

  it('stratifierad bootstrap bevarar bucketstorlekar', () => {
    const boot = stratifiedBootstrap(pairs, rand);
    expect(boot).toHaveLength(pairs.length);
    const { counts } = correlations(boot);
    for (const key of ['0,0', '0,1', '1,0', '1,1']) expect(counts[key]).toBe(4096);
  });

  it('bootstrap-sigma ligger nära den analytiska', () => {
    const reps = 120;
    const vals: number[] = [];
    for (let i = 0; i < reps; i++) vals.push(computeS(stratifiedBootstrap(pairs, rand)));
    const m = vals.reduce((a, b) => a + b, 0) / reps;
    const sd = Math.sqrt(vals.reduce((a, b) => a + (b - m) ** 2, 0) / (reps - 1));
    const analytic = correlations(pairs).sigmaS;
    expect(sd).toBeGreaterThan(analytic * 0.7);
    expect(sd).toBeLessThan(analytic * 1.4);
  });
});

describe('Mermin-brygga', () => {
  it('pariteten är (−1)^(antal ettor) och invariant under bitpermutation', () => {
    expect(parityOf('000')).toBe(1);
    expect(parityOf('011')).toBe(1);
    expect(parityOf('001')).toBe(-1);
    expect(parityOf('110')).toBe(1);
    expect(parityOf('101')).toBe(1);
    expect(parityOf('100')).toBe(-1);
  });

  it('avvisar ogiltiga tecken', () => {
    expect(() => parityOf('0x1')).toThrow();
  });

  it('kräver 8 PUB:ar', () => {
    expect(() => merminValue([], 'ghz')).toThrow(/8 PUB/);
  });

  it('reproducerar Mermin 1 (M = 3.6890, kontroll 0.9761)', () => {
    const pubs = load('d9npt5oqs0bc73e3ns90');
    const g = merminValue(pubs, 'ghz');
    const c = merminValue(pubs, 'control');
    expect(g.M).toBeCloseTo(3.689, 4);
    expect(g.sigmaM).toBeCloseTo(0.0121, 4);
    expect(c.M).toBeCloseTo(0.9761, 4);
  });

  it('reproducerar Mermin 2 (M = 3.7788, kontroll 1.0151)', () => {
    const pubs = load('d9nq9lk60llc73cadj8g');
    const g = merminValue(pubs, 'ghz');
    const c = merminValue(pubs, 'control');
    expect(g.M).toBeCloseTo(3.7788, 4);
    expect(g.sigmaM).toBeCloseTo(0.0102, 4);
    expect(c.M).toBeCloseTo(1.0151, 4);
  });

  it('kontrollen håller sig under den lokalrealistiska gränsen i båda körningarna', () => {
    // Bryter kontrollen |M| ≤ 2 är hela körningen ogiltig, oavsett signalen.
    for (const job of ['d9npt5oqs0bc73e3ns90', 'd9nq9lk60llc73cadj8g']) {
      expect(Math.abs(merminValue(load(job), 'control').M)).toBeLessThan(2);
    }
  });

  it('GHZ bryter gränsen, kontrollen gör det inte', () => {
    const pubs = load('d9npt5oqs0bc73e3ns90');
    expect(merminValue(pubs, 'ghz').M).toBeGreaterThan(2);
    expect(merminValue(pubs, 'control').M).toBeLessThan(2);
  });

  it('reproducerar <X^3> och <X^5> ur GHZ-jobbet', () => {
    const pubs = load('d9nimlk60llc73ca58e0');
    expect(xParityExpectation(pubs[1]).value).toBeCloseTo(0.957, 4);
    expect(xParityExpectation(pubs[3]).value).toBeCloseTo(0.9155, 4);
  });

  it('Z-basen är blind för koherens — X-basen är det inte', () => {
    // Z-PUB:arna ger paritet nära 0 för GHZ (jämnt fördelat 000/111 ⇒ +1/−1),
    // medan X-PUB:arna ger ≈ +1. Skillnaden är hela poängen med GHZ-batteriet.
    const pubs = load('d9nimlk60llc73ca58e0');
    expect(Math.abs(xParityExpectation(pubs[0]).value)).toBeLessThan(0.2);
    expect(xParityExpectation(pubs[1]).value).toBeGreaterThan(0.8);
  });
});
