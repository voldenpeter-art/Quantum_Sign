import type { PhotonEvent } from '../../types/events';

/** Vilken fysisk detektor en händelse hör till — nyckel för dödtid/efterpuls/crosstalk. */
export function detectorKeyOf(e: PhotonEvent): string {
  return e.arm ?? e.channel ?? 'D1';
}

/** Kopplad "grann"-detektor för crosstalk (samma HBT-par eller samma parkälla-arm). */
export function pairedDetectorKey(key: string): string {
  const map: Record<string, string> = { D1: 'D2', D2: 'D1', A: 'B', B: 'A' };
  return map[key] ?? key;
}
