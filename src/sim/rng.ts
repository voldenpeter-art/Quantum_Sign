// Deterministisk, seedbar RNG (CLAUDE.md §6). ALL slump i simuleringen ska gå
// via denna klass — reproducerbarhet och golden datasets bygger på det.
// mulberry32: liten, snabb, tillräckligt bra statistisk kvalitet för Monte Carlo-sim.

export class Rng {
  private state: number;
  readonly seed: number;

  constructor(seed: number) {
    this.seed = seed >>> 0;
    this.state = this.seed;
  }

  /** Uniform [0, 1). */
  next(): number {
    this.state |= 0;
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Uniform (0, 1) — exkluderar 0 så log() är säker. */
  nextOpen(): number {
    let u = this.next();
    while (u === 0) u = this.next();
    return u;
  }

  /** Exponentialfördelad väntetid för en Poissonprocess med given rate (Hz). */
  exponential(rate: number): number {
    return -Math.log(this.nextOpen()) / rate;
  }

  /** Standardnormalfördelning via Box–Muller. */
  gaussian(mean = 0, std = 1): number {
    const u1 = this.nextOpen();
    const u2 = this.next();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * std;
  }

  bool(p: number): boolean {
    return this.next() < p;
  }

  uniformInt(maxExclusive: number): number {
    return Math.floor(this.next() * maxExclusive);
  }

  pick<T>(arr: readonly T[]): T {
    return arr[this.uniformInt(arr.length)];
  }

  /** Ny oberoende RNG-gren, deterministisk från denna RNG:s tillstånd. */
  fork(): Rng {
    return new Rng(Math.floor(this.next() * 4294967296));
  }
}
