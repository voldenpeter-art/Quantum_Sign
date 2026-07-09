import type { RunConfig } from './config';
import type { SignatureId } from './signatures';
import type { SignatureResult } from '../analysis/types';

/**
 * En sparad körning: ett snapshot av config + färdigberäknade resultat.
 * Detta är plattformens "session" i arvsregelns mening (D-rapporten §8:
 * "en session = ett observationstillfälle med fryst konfiguration") — den
 * minsta enhet rådata kan räknas som delad inom, se analysis/combine.ts.
 */
export interface SavedSession {
  id: string;
  label: string;
  createdAt: string;
  config: RunConfig;
  results: Partial<Record<SignatureId, SignatureResult>>;
}
