// Kombinerad evidens över signaturer (metodbiblioteket, syntesrapporten §7,
// punkt 3 "p⁽²⁾-regeln" och punkt 10 "Hård replikeringsgate med
// metakombination... Fisher/Stouffer-kombinerat p"). Detta är den formella
// versionen av frågan användaren ställde: kan flera signaturer komplettera
// varandra?
//
// Svaret katalogen redan gett (arvsregeln, B §12, bindande i hela katalogen):
// JA — men ENDAST över genuint oberoende instrumentkedjor. I den här
// plattformen är "en session" (ett anrop av generateEventStream, dvs en
// simulerad mätkampanj) den minsta enhet rådata delas inom. Alla signaturer
// beräknade på SAMMA session delar därför alltid rådata — de får aldrig
// räknas som ömsesidig bekräftelse, oavsett hur olika de ser ut (A via en
// virtuell HBT-delning av samma ström är inget undantag, se A-RF-VIRTUALSPLIT
// i A_g2.ts). Kombination kräver alltså MINST TVÅ OLIKA sessioner.

import type { SignatureId } from '../types/signatures';
import type { SignatureResult, Verdict } from './types';

export function getHeadlinePValue(result: SignatureResult): number | undefined {
  // Vissa signaturer (B: dg_cross+r_cs_max; D: chi2_const+separation) har FLERA
  // komponenter med pValue. "Första med pValue" är odefinierat vilken som är
  // det egentliga vittnet — kräv den uttryckligt märkta primary-komponenten.
  const primary = result.components.find((c) => c.primary && c.pValue !== undefined);
  if (primary) return primary.pValue;
  return result.components.find((c) => c.pValue !== undefined)?.pValue;
}

/**
 * Fisher's metod: X = -2·Σ ln(p_i) ~ χ²(2k). Slutet uttryck för överlevnads-
 * funktionen vid jämnt antal frihetsgrader (2k) undviker en generell
 * gammafunktionsimplementation.
 */
export function fisherCombinedPValue(pValues: number[]): number {
  const k = pValues.length;
  if (k === 0) return 1;
  const clipped = pValues.map((p) => Math.min(Math.max(p, 1e-300), 1));
  const X = -2 * clipped.reduce((acc, p) => acc + Math.log(p), 0);
  let term = 1; // (X/2)^0 / 0!
  let sum = term;
  for (let i = 1; i < k; i++) {
    term *= X / 2 / i;
    sum += term;
  }
  return Math.min(1, Math.exp(-X / 2) * sum);
}

export interface CombinedPick {
  sessionId: string;
  sessionLabel: string;
  signatureId: SignatureId;
  result: SignatureResult;
}

export type CombinedVerdict = 'insufficient' | 'none' | 'combined-suspect' | 'combined-strong';

export interface CombinedEvidence {
  picks: CombinedPick[];
  pValues: (number | undefined)[];
  fisherP: number | null;
  minP: number | null;
  verdict: CombinedVerdict;
  reasonSv: string;
}

// 'structural' rankas 0 (som none/classical): kvantneutral struktur bidrar
// ALDRIG till en kombinerad KVANTutsaga (combined-suspect/-strong kräver att
// varje pelare når minst suspect, dvs ett äkta vittne). Se förtjänad
// nomenklatur i types.ts.
const VERDICT_RANK: Record<Verdict, number> = {
  notApplicable: 0,
  none: 0,
  classical: 0,
  structural: 0,
  suspect: 1,
  strong: 2,
};

export function evaluateCombinedEvidence(picks: CombinedPick[]): CombinedEvidence {
  if (picks.length < 2) {
    return {
      picks,
      pValues: [],
      fisherP: null,
      minP: null,
      verdict: 'insufficient',
      reasonSv: 'Välj minst två signaturer från olika sessioner för att kombinera bevis.',
    };
  }

  // Arvsregeln: en session = en delad rådatakälla. Högst ett val per session.
  const seenSessions = new Map<string, string>();
  for (const p of picks) {
    const clash = seenSessions.get(p.sessionId);
    if (clash) {
      return {
        picks,
        pValues: [],
        fisherP: null,
        minP: null,
        verdict: 'insufficient',
        reasonSv: `"${p.sessionLabel}" bidrar med både ${clash} och ${p.signatureId} — de delar rådata (samma ` +
          'session/ström) och räknas aldrig som ömsesidig bekräftelse (arvsregeln, B §12). Välj högst en signatur per session.',
      };
    }
    seenSessions.set(p.sessionId, p.signatureId);
  }

  const pValues = picks.map((p) => getHeadlinePValue(p.result));
  const definedPs = pValues.filter((p): p is number => p !== undefined);

  if (definedPs.length < picks.length) {
    return {
      picks,
      pValues,
      fisherP: null,
      minP: null,
      verdict: 'insufficient',
      reasonSv: 'Minst en vald signatur saknar ett p-värde att kombinera (t.ex. C rapporterar bootstrap-σ, inte p — se C-rapporten §4.3).',
    };
  }

  const fisherP = fisherCombinedPValue(definedPs);
  const minP = Math.min(...definedPs);
  const worstVerdictRank = Math.min(...picks.map((p) => VERDICT_RANK[p.result.verdict]));

  let verdict: CombinedVerdict = 'none';
  let reasonSv = 'Inget kombinerat bevis vid dessa val — Fisher-p är inte tillräckligt lågt.';
  if (fisherP < 1e-2 && minP < 0.5) {
    verdict = 'combined-suspect';
    reasonSv = `Fisher-kombinerat p ≈ ${fisherP.toExponential(2)} över ${picks.length} oberoende sessioner.`;
  }
  if (fisherP < 1e-3 && worstVerdictRank >= 1) {
    verdict = 'combined-strong';
    reasonSv =
      `Fisher-kombinerat p ≈ ${fisherP.toExponential(2)} och varje enskild session når minst suspect ` +
      '(min-gate över pelare, H-mönstret — CLAUDE.md §4.4).';
  }

  return { picks, pValues, fisherP, minP, verdict, reasonSv };
}
