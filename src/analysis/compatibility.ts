// Central kompatibilitetsgrind (granskningsfynd, feedback 2026-07-29): App.tsx
// körde tidigare ALLA implementerade signaturer på VARJE källa, så B/C/D/E/F på
// t.ex. en thermal-källa gav 'none'. Det blandar ihop två helt olika utsagor:
//   'none'          = analysen kördes och hittade inget över golvet,
//   'notApplicable' = analysen gäller inte alls för denna källa/dataström.
// Ett icke-mätt värde får aldrig läsas som ett negativt resultat. sweep.ts har
// alltid filtrerat via requiredSources; den här modulen ger UI:t samma disciplin.

import type { SignatureResult } from './types';
import type { EventStream } from '../types/events';
import type { RunConfig } from '../types/config';
import { getSignatureMeta, type SignatureId } from '../types/signatures';

export interface CompatibilityVerdict {
  compatible: boolean;
  reasonSv?: string;
}

/**
 * Avgör om en signaturanalys är tillämplig på en given körning. Grundregeln är
 * källbehörighet (meta.requiredSources) — samma kriterium som sweep.ts använder.
 * Skild från "hittade signaturen något": en inkompatibel analys ska returnera
 * 'notApplicable', inte 'none'.
 */
export function isSignatureCompatible(
  signatureId: SignatureId,
  _stream: EventStream,
  config: RunConfig,
): CompatibilityVerdict {
  const meta = getSignatureMeta(signatureId);
  if (!meta.requiredSources.includes(config.source)) {
    return {
      compatible: false,
      reasonSv:
        `${signatureId} kräver källa ∈ {${meta.requiredSources.join(', ')}} — ` +
        `nuvarande källa är "${config.source}". Analysen är inte tillämplig här.`,
    };
  }
  return { compatible: true };
}

/** Bygger ett SignatureResult som uttryckligen markerar att analysen inte gäller. */
export function notApplicableResult(
  signatureId: SignatureId,
  reasonSv: string,
): SignatureResult {
  const meta = getSignatureMeta(signatureId);
  return {
    id: signatureId,
    verdict: 'notApplicable',
    verdictLabelSv: `${signatureId}-notApplicable`,
    components: [],
    redFlags: [],
    nullsUsed: [],
    summarySv: reasonSv,
    floorNoteSv: meta.floorNote,
  };
}
