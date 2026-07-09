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
}

export type Verdict = 'none' | 'classical' | 'suspect' | 'strong';

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
