// Analysregister: den enda plats en ny signaturs LOGIK behöver kopplas in.
// UI-metadata registreras separat i types/signatures.ts. Att lägga till en
// framtida signatur = skriva en SignatureAnalyzer-funktion + en rad här.

import type { SignatureAnalyzer } from './types';
import type { SignatureId } from '../types/signatures';
import { analyzeA } from './A_g2';
import { analyzeB } from './B_polarization';
import { analyzeC } from './C_chsh';
import { analyzeD } from './D_invariant';
import { analyzeE } from './E_lowDim';
import { analyzeF } from './F_memory';

export const ANALYSIS_REGISTRY: Partial<Record<SignatureId, SignatureAnalyzer>> = {
  A: analyzeA,
  B: analyzeB,
  C: analyzeC,
  D: analyzeD,
  E: analyzeE,
  F: analyzeF,
};

export * from './types';
