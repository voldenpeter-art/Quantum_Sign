// Signaturregister (CLAUDE.md §9, §5). Detta är den enda plats en ny signatur
// (inklusive framtida sådana, t.ex. J) behöver registreras i för att synas i UI:t —
// analysmodulen kopplas separat via analysis/registry.ts (SignatureAnalyzer).
//
// `reportStatus` speglar rapportens/katalogens egen status (se
// Kvantsignaturkatalogen_syntesrapport_v1.0.md, tabell §3), INTE om denna kodbas
// har implementerat analysen. `implemented` styr om UI:t visar live-analys eller
// en låst platshållare. De två är avsiktligt separata fält.

import type { SourceType } from './config';

export type SignatureId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'M' | 'J';
export type EvidenceClass = 'I' | 'II' | 'III';
export type ReportStatus = 'klar' | 'pending' | 'draft';
export type NullId = 'S1' | 'S2' | 'S3' | 'S4' | 'S5';

export interface SignatureMeta {
  id: SignatureId;
  nameSv: string;
  nameEn: string;
  evidenceClass: EvidenceClass;
  reportStatus: ReportStatus;
  /** Är analysen kopplad i denna kodbas (v1)? Se analysis/registry.ts. */
  implemented: boolean;
  /** Arvsregeln (B §12 / CLAUDE.md §4.1): vilken signatur denna ärver rådata från. */
  inheritsFrom?: SignatureId;
  requiredSources: SourceType[];
  validNulls: NullId[];
  floorNote: string;
  summarySv: string;
}

export const SIGNATURE_CATALOG: SignatureMeta[] = [
  {
    id: 'A',
    nameSv: 'Icke-klassisk fotonstatistik',
    nameEn: 'Non-classical photon statistics',
    evidenceClass: 'I',
    reportStatus: 'klar',
    implemented: true,
    requiredSources: ['singleEmitter', 'coherent', 'thermal'],
    validNulls: ['S1', 'S2', 'S3', 'S4'],
    floorNote: 'Kontrastgolv (modutspädning, ε ~ 1/M)',
    summarySv:
      'g²(0) < 1 via korskorrelation mellan två HBT-kanaler. Matchat filter, teckendiskriminator ε.',
  },
  {
    id: 'B',
    nameSv: 'Polarisation–tid-korrelation',
    nameEn: 'Polarization–time correlation',
    evidenceClass: 'II',
    reportStatus: 'klar',
    implemented: true,
    requiredSources: ['entangled'],
    validNulls: ['S1', 'S2', 'S3', 'S4'],
    floorNote: 'Depolarisation; dödtid i R_CS-nämnaren',
    summarySv:
      'g²_ab-matris (HV/DA/RL) och Stokes-korrelationer C_ij(τ). Kvantvittne: Cauchy–Schwarz R_CS > 1.',
  },
  {
    id: 'C',
    nameSv: 'Bell/CHSH',
    nameEn: 'Bell / CHSH',
    evidenceClass: 'I',
    reportStatus: 'klar',
    implemented: true,
    requiredSources: ['entangled'],
    validNulls: ['S1', 'S2', 'S3', 'S4'],
    floorNote: 'Par-golvet (dubbel rymdvinkelutspädning)',
    summarySv:
      'CHSH S > 2 via faktiska A/B-koincidenser. Primärtest S − 2 > k·σ_S; synlighet V > 1/√2.',
  },
  {
    id: 'D',
    nameSv: 'Stabil invariant',
    nameEn: 'Stable invariant',
    evidenceClass: 'II',
    reportStatus: 'klar',
    implemented: true,
    inheritsFrom: 'B',
    requiredSources: ['entangled'],
    validNulls: ['S1', 'S2', 'S3', 'S4'],
    floorNote: 'Instrument-invariantens ogenomtränglighet',
    summarySv:
      'Basoberoende egenvärdesinvariant I = [λ̃₁, λ̃₂] ur Stokes-kovarians. Separation + stabilitet + kontrast (K_D).',
  },
  {
    id: 'E',
    nameSv: 'Kod-lik lågdimensionalitet',
    nameEn: 'Code-like low dimensionality',
    evidenceClass: 'II',
    reportStatus: 'klar',
    implemented: true,
    inheritsFrom: 'B',
    requiredSources: ['entangled'],
    validNulls: ['S1', 'S3', 'S5'],
    floorNote: 'Kompression är klassisk vardag',
    summarySv: 'Effektiv dimension (deltagarkvot) hos B:s feature-vektorer, mot drift-null S5.',
  },
  {
    id: 'F',
    nameSv: 'Non-Markovianitet / minne',
    nameEn: 'Non-Markovianity / memory',
    evidenceClass: 'II',
    reportStatus: 'klar',
    implemented: true,
    inheritsFrom: 'B',
    requiredSources: ['entangled', 'memoryEcho'],
    validNulls: ['S1', 'S3', 'S5'],
    floorNote: 'Flicker (klassiskt långminne i varje detektor)',
    summarySv: 'Revival-mönster i g²(τ)-svansen; modellfamilje-null med flicker-medlem.',
  },
  {
    id: 'G',
    nameSv: 'Kvadratursqueezing',
    nameEn: 'Quadrature squeezing',
    evidenceClass: 'I',
    reportStatus: 'klar',
    implemented: false,
    requiredSources: [],
    validNulls: [],
    floorNote: 'Fasmedelvärdning; (V + 1/V)/2 ≥ 1',
    summarySv:
      'TODO(rapport): kräver squeezedTwin-källa och homodyndetektion — utanför v1-scope.',
  },
  {
    id: 'H',
    nameSv: 'Fältavtryck i sensornät',
    nameEn: 'Field imprint in sensor network',
    evidenceClass: 'III',
    reportStatus: 'klar',
    implemented: false,
    requiredSources: [],
    validNulls: [],
    floorNote: 'Vandrande miljöfront',
    summarySv:
      'TODO(rapport): axel 2, delar ingen infrastruktur med axel 1 — egen kampanj, utanför v1-scope.',
  },
  {
    id: 'M',
    nameSv: 'Minnes-/ekospår',
    nameEn: 'Memory / echo trace',
    evidenceClass: 'II',
    reportStatus: 'klar',
    implemented: false,
    requiredSources: ['memoryEcho'],
    validNulls: [],
    floorNote: 'Initialkorrelationer; klassiska ekon',
    summarySv: 'TODO(rapport): E*-eko och W_env-darwinism — utanför v1-scope.',
  },
  {
    id: 'J',
    nameSv: 'Energitransfer- och relaxationssignatur',
    nameEn: 'Energy transfer & relaxation signature',
    evidenceClass: 'II',
    reportStatus: 'draft',
    implemented: false,
    requiredSources: [],
    validNulls: [],
    floorNote: 'Ej fastställt — inget golv definierat än',
    summarySv:
      'TODO(rapport): endast idédokument, ingen konsoliderad protokollspec eller tröskel finns. ' +
      'Registrerad som platshållare för att katalogen ska kunna växa (se rapporter/Signaturtypning.txt).',
  },
];

export function getSignatureMeta(id: SignatureId): SignatureMeta {
  const meta = SIGNATURE_CATALOG.find((s) => s.id === id);
  if (!meta) throw new Error(`Okänd signatur: ${id}`);
  return meta;
}

export const IMPLEMENTED_SIGNATURES: SignatureId[] = SIGNATURE_CATALOG.filter(
  (s) => s.implemented,
).map((s) => s.id);
