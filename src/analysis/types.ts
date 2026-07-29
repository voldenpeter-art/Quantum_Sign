import type { EventStream } from '../types/events';
import type { RunConfig } from '../types/config';
import type { NullId, SignatureId } from '../types/signatures';
import type { Rng } from '../sim/rng';

export interface SignatureComponent {
  key: string;
  labelSv: string;
  value: number;
  /** Empiriskt p-värde mot den primära nollan för denna komponent, om beräknat. */
  pValue?: number;
  /** Klassiskt/golv-relaterat referensvärde för visuell jämförelse i UI. */
  classicalReference?: number;
  unit?: string;
  /**
   * Markerar VILKEN komponent som är signaturens huvudvittne när flera
   * komponenter bär ett pValue (t.ex. B har både dg_cross och r_cs_max; D har
   * både chi2_const och separation). Utan denna flagga är "första komponenten
   * med ett pValue" odefinierat vilken som väljs — se analysis/combine.ts och
   * scripts/sweep.ts, som båda letar efter primary===true först.
   */
  primary?: boolean;
}

// Femgradig klassning med FÖRTJÄNAD quantum-nomenklatur (syntesrapporten §7,
// punkt 3): orden "suspect"/"strong" (kvantanspråk) får BARA sättas där ett
// äkta icke-klassicitetsvittne passerat — A:s antibunching (ε < 0), B:s
// Cauchy–Schwarz R_CS > 1, C:s S > 2. Kvantneutrala signaturer (D-pol, E, samt
// F-passiv) kan bära struktur som överlevt surrogaten men aldrig ett
// kvantvittne; deras tak är därför 'structural', inte 'suspect'. 'classical' =
// struktur aktivt förenlig med en klassisk modell; 'none' = inget över golvet.
//
// 'notApplicable' är en SÄRSKILD sentinel, inte en styrkenivå: analysen gäller
// inte för denna källa/dataström alls (t.ex. C/D/E på en enkanalig thermal-
// källa utan armar). Den får ALDRIG blandas ihop med 'none' ("kördes, hittade
// inget") — det vore att tolka ett icke-mätt värde som ett negativt resultat.
export type Verdict =
  | 'notApplicable'
  | 'none'
  | 'classical'
  | 'structural'
  | 'suspect'
  | 'strong';

export interface RedFlag {
  code: string;
  labelSv: string;
  triggered: boolean;
  detailSv: string;
}

export interface SignatureResult {
  id: SignatureId;
  verdict: Verdict;
  verdictLabelSv: string;
  components: SignatureComponent[];
  redFlags: RedFlag[];
  nullsUsed: NullId[];
  summarySv: string;
  floorNoteSv: string;
  /** Nollfördelning för huvudstatistikan (NullDistributionPanel) + observerat värde. */
  primaryNull?: { labelSv: string; observed: number; nullValues: number[] };
}

export interface AnalysisContext {
  stream: EventStream;
  config: RunConfig;
  rng: Rng;
  /** Antal surrogat per nulltyp för denna körning (UI-styrt, avvägning hastighet/precision). */
  nullReplicates: number;
}

export type SignatureAnalyzer = (ctx: AnalysisContext) => SignatureResult;
