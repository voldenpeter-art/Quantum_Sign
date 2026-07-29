// Metagate (CLAUDE.md §8): "Ingen signatur passerar utan metagate." I v1
// (interaktiv prototyp) väger vi samman surrogat-p + redFlags till en enkel
// grind — INTE den fulla min-gate-över-pelare-disciplinen (surrogat + blind
// injection + red flags, H-mönstret, CLAUDE.md §4.4). Det är en medveten
// v1-avgränsning, inte en genväg som göms: `full: false` flaggar alltid detta.
// TODO(rapport): koppla in blind injection-resultat och H-mönstrets
// min-gate-över-pelare när plattformen får stöd för multi-session-körningar.

import type { SignatureResult } from '../analysis/types';

export interface MetagateVerdict {
  passes: boolean;
  full: false;
  reasonSv: string;
}

export function evaluateMetagate(result: SignatureResult): MetagateVerdict {
  if (result.verdict === 'notApplicable') {
    return { passes: false, full: false, reasonSv: 'Analysen är inte tillämplig på denna källa — inget att gate:a.' };
  }
  const activeRedFlags = result.redFlags.filter((f) => f.triggered && !f.code.endsWith('-DENOM') && !f.code.endsWith('-PASSIVE') && !f.code.endsWith('-PSEUDOSESSION') && !f.code.endsWith('-NOWITNESS'));
  const structurallyOk = result.verdict === 'suspect' || result.verdict === 'strong';

  if (!structurallyOk) {
    return { passes: false, full: false, reasonSv: 'Verdict är none/classical/structural — inget kvantvittne att gate:a.' };
  }
  if (activeRedFlags.length > 0) {
    return {
      passes: false,
      full: false,
      reasonSv: `Datadrivna rödflaggor utlösta: ${activeRedFlags.map((f) => f.labelSv).join(', ')}.`,
    };
  }
  return {
    passes: true,
    full: false,
    reasonSv: 'Klarar v1:s lätta grind (surrogat-p + datadrivna rödflaggor). Full metagate (§4.4) ej implementerad.',
  };
}
