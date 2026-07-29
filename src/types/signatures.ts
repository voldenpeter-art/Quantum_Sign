// Signaturregister (CLAUDE.md §9, §5). Detta är den enda plats en ny signatur
// (inklusive framtida sådana, t.ex. J) behöver registreras i för att synas i UI:t —
// analysmodulen kopplas separat via analysis/registry.ts (SignatureAnalyzer).
//
// `reportStatus` speglar rapportens/katalogens egen status (se
// Kvantsignaturkatalogen_syntesrapport_v1.0.md, tabell §3), INTE om denna kodbas
// har implementerat analysen. `implemented` styr om UI:t visar live-analys eller
// en låst platshållare. De två är avsiktligt separata fält.
//
// AUKTORITATIVA RAPPORTER: v0.2-protokollspecifikationerna i
// rapporter/Signaturtyp_{A..H,M}_rapport_v0.2.md är källa till sanning för varje
// signaturs metod, trösklar, klassning och nolluppsättning (CLAUDE.md §3). De
// äldre v0.1-filerna i samma mapp är superseded. `statusV02` och `reportFile`
// nedan pekar ut respektive rapport och dess egen statusetikett. Denna kodbas
// (v1) implementerar en FÖRENKLAD delmängd av v0.2 — de fulla protokollen
// (p⁽²⁾-regeln, admissibility-gates, femgradig klassning med förtjänad
// quantum-nomenklatur, tvålagers-S4, omöjlighetsdetektorer, Lab/Astro-klyvning)
// är ännu inte implementerade; se respektive rapports §"Kodstatus".

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
  /** v0.2-rapportens egen statusetikett (statusetikett), ordagrant. */
  statusV02?: string;
  /** Sökväg till den auktoritativa v0.2-rapporten under rapporter/. */
  reportFile?: string;
}

export const SIGNATURE_CATALOG: SignatureMeta[] = [
  {
    id: 'A',
    nameSv: 'Icke-klassisk fotonstatistik',
    nameEn: 'Non-classical photon statistics',
    evidenceClass: 'I',
    reportStatus: 'klar',
    implemented: true,
    requiredSources: ['singleEmitter', 'coherent', 'thermal', 'entangled', 'memoryEcho'],
    validNulls: ['S1', 'S2', 'S3', 'S4'],
    floorNote: 'Kontrastgolv (modutspädning, ε ~ 1/M)',
    summarySv:
      'g²(0) < 1 via korskorrelation mellan två HBT-kanaler (virtuell 50/50-delning på icke-HBT-källor, se A_g2.ts). ' +
      'Matchat filter, teckendiskriminator ε.',
    statusV02: 'protocol-ready, target-unresolved',
    reportFile: 'rapporter/Signaturtyp_A_rapport_v0.2.md',
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
    statusV02: 'infrastructure-ready, B-2 blocked',
    reportFile: 'rapporter/Signaturtyp_B_rapport_v0.2.md',
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
    statusV02: 'C-Lab/C-Link protocol-ready; C-Astro dormant pending pair-production budget',
    reportFile: 'rapporter/Signaturtyp_C_rapport_v0.2.md',
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
    statusV02: 'fingerprint-ready after code fixes; D-pol kvantneutral, D-Q via korrigerat vittne',
    reportFile: 'rapporter/Signaturtyp_D_rapport_v0.2.md',
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
    statusV02: 'structure-ready after S5-E + stress-module fixes; quantum-neutral unless independently witnessed',
    reportFile: 'rapporter/Signaturtyp_E_rapport_v0.2.md',
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
    statusV02: 'memory-structure-ready, quantum-active-only',
    reportFile: 'rapporter/Signaturtyp_F_rapport_v0.2.md',
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
      'TODO(rapport): kräver squeezedTwin-källa och homodyndetektion — utanför v1-scope. ' +
      'v0.2-rapporten finns nu (G-kvadratur/G-twin/G-pol, mätbar vakuumnull, RF_heisenberg).',
    statusV02: 'lab-strong, link-capable, sky-blind (quadrature) / sky-gated (twin)',
    reportFile: 'rapporter/Signaturtyp_G_rapport_v0.2.md',
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
      'TODO(rapport): axel 2, delar ingen infrastruktur med axel 1 — egen kampanj, utanför v1-scope. ' +
      'v0.2-rapporten finns nu (OSC/GLITCH-spår, tvåskiktsinferens, K_i-mönster, S4e-front).',
    statusV02: 'target-rich, method-exporting, awaiting sensitivity-volume map',
    reportFile: 'rapporter/Signaturtyp_H_rapport_v0.2.md',
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
    summarySv:
      'TODO(rapport): E*-eko och W_env-darwinism — utanför v1-scope. ' +
      'v0.2-rapporten finns nu (ekoscore E*, miljövittne W_env, informationsestimator-standarden).',
    statusV02: 'intervention-ready (lab), witness-defined, awaiting W_env pilot',
    reportFile: 'rapporter/Signaturtyp_M_rapport_v0.2.md',
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
    floorNote: 'Ej fastställt — G_J-gate per uppställning (kanalseparation vs upplösbar kanalandel)',
    summarySv:
      'Kandidat, admission-pending (Klass II materia-/processignatur). Sönderfallsträd T_J, ' +
      'Q-kriterier J-Q1–Q5 och energibokslutet RF_energy_balance. Kräver en annan simuleringsklass ' +
      '(stark drivning över trösklar) än A–F. Se rapporter/Signaturkandidat_J_kandidatprotokoll_v0.0.txt.',
    reportFile: 'rapporter/Signaturkandidat_J_kandidatprotokoll_v0.0.txt',
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
