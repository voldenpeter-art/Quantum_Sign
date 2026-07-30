// Metagate (CLAUDE.md §8): "Ingen signatur passerar utan metagate." Grinden är
// en MIN-GATE över de pelare som är tillgängliga PER RESULTAT:
//   P1 kvantvittne (verdict suspect/strong)  ·  P2 inga datadrivna rödflaggor
//   ·  P3 tillräcklig p-upplösning (insufficientResolution === false)
// ALLA måste hålla (min-gate). Den fulla §4.4-disciplinen kräver dessutom en
// BLIND INJECTION-pelare och H-mönstrets flersessions-min-gate — dessa kan inte
// härledas ur ETT resultat, så `full: false` flaggar alltid att den pelaren
// saknas. Det är en medveten arkitekturgräns (single-session), inte en dold
// genväg. TODO(rapport): koppla in blind injection + multi-session.

import type { SignatureResult } from '../analysis/types';

export interface MetagatePillar {
  key: string;
  labelSv: string;
  passes: boolean;
}

export interface MetagateVerdict {
  passes: boolean;
  /** Alltid false: blind injection-/flersessionspelaren kan inte härledas per resultat. */
  full: false;
  pillars: MetagatePillar[];
  reasonSv: string;
}

export function evaluateMetagate(result: SignatureResult): MetagateVerdict {
  if (result.verdict === 'notApplicable') {
    return { passes: false, full: false, pillars: [], reasonSv: 'Analysen är inte tillämplig på denna källa — inget att gate:a.' };
  }
  const activeRedFlags = result.redFlags.filter(
    (f) => f.triggered && !f.code.endsWith('-DENOM') && !f.code.endsWith('-PASSIVE') && !f.code.endsWith('-PSEUDOSESSION') && !f.code.endsWith('-NOWITNESS'),
  );

  const pillars: MetagatePillar[] = [
    { key: 'witness', labelSv: 'Kvantvittne (suspect/strong)', passes: result.verdict === 'suspect' || result.verdict === 'strong' },
    { key: 'redflags', labelSv: 'Inga datadrivna rödflaggor', passes: activeRedFlags.length === 0 },
    { key: 'resolution', labelSv: 'Tillräcklig p-upplösning', passes: result.insufficientResolution !== true },
  ];

  const failed = pillars.filter((p) => !p.passes);
  if (failed.length > 0) {
    const reasonSv =
      !pillars[0].passes
        ? 'Verdict är none/classical/structural — inget kvantvittne att gate:a.'
        : `Faller på pelare: ${failed.map((p) => p.labelSv).join(', ')}` +
          (activeRedFlags.length ? ` (rödflaggor: ${activeRedFlags.map((f) => f.labelSv).join(', ')})` : '') + '.';
    return { passes: false, full: false, pillars, reasonSv };
  }

  return {
    passes: true,
    full: false,
    pillars,
    reasonSv: 'Klarar min-gate över tillgängliga pelare (vittne + rödflaggor + upplösning). Blind injection-/flersessionspelaren (§4.4) saknas ännu.',
  };
}
