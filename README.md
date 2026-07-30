# Quantum_Sign — Kvantsignaturplattform

Interaktiv React/TypeScript-plattform för att simulera experimentella kvantoptiska
källor, degradera dem genom en realistisk detektorkedja, och testa den resulterande
händelseströmmen mot en katalog av kvantsignaturer (A–M) — med surrogatbaserade
nollfördelningar, blind injection-studier och exporterbara rapporter.

Se `CLAUDE.md` för den fulla projektspecen (arkitektur, arvsregeln, golvmönster)
och `/rapporter` (bifogas separat) för signaturspecifik metod och trösklar.

## Status (v0.2)

- **Implementerat:** signaturerna **A–F** (fotonstatistik, polarisation–tid,
  CHSH/Bell, stabil invariant, lågdimensionalitet, non-Markovianitet), med
  riktiga S1–S5-surrogat och v0.2-metodiken:
  - **p⁽²⁾-regeln** — beslutet bärs av det näst minsta p-värdet PER
    surrogatfamilj (ingen poolning i rapporteringen; per-familj-resultat med
    replikat/exceedances/upplösning surfas i `SignatureResult.nullFamilyResults`).
  - **Femgradig klassning med förtjänad nomenklatur** — `none` / `classical` /
    `structural` / `suspect` / `strong`, plus sentineln `notApplicable`. Orden
    "suspect"/"strong" (kvantanspråk) sätts BARA där ett äkta vittne passerat
    (A: ε<0, B: R_CS>1, C: S>2); kvantneutrala D/E/F-passiv taklagda till
    `structural`.
  - **Tvålagers-S4** (detektorartefakt + urvals-/analysstress) på B:s R_CS och
    C:s motståndargrind; **RF_stokes_bound** omöjlighetsdetektor på D;
    **stratifierad** CHSH-bootstrap per inställningspar.
  - **`insufficientResolution`** — flaggar när surrogatantalet inte kan upplösa
    verdict-tröskeln (default 15 → golv 0.0625), så ett `none` inte förväxlas
    med "kunde inte upplösas".
  - Central **kompatibilitetsgrind** (`analysis/compatibility.ts`): en analys
    som inte gäller källan returnerar `notApplicable`, aldrig `none`.
- **Validering:** förregistrerad kontrollmatris (`scripts/controlMatrix.ts`, 15
  namngivna scenarier med kända kontroller + Wilson-CI), två 1500-körningssvep,
  blind injection-studie, 39 tester och CI (`.github/workflows/ci.yml`). En
  **lätt** metagate (`full: false`) — inte den fulla min-gate-över-pelare-
  disciplinen från CLAUDE.md §4.4.
- **Registrerade men ej implementerade:** G (squeezing), H (sensornät), M
  (minne/eko), samt kandidaten **J** (energitransfer/relaxation). Att lägga till
  en ny signatur = en analysfunktion i `src/analysis/` + en rad i
  `src/types/signatures.ts` och `src/analysis/registry.ts`.
- Detta är fortfarande en **Monte Carlo-prototyp och metodvaliderare**, inte ett
  färdigt vetenskapligt instrument. Kända, medvetet kvarlämnade v0.2-begränsningar
  (dokumenterade inline och i regressionstester): detektorpipelinen är en fast
  array-kedja där dödtid appliceras före afterpulse/dark/crosstalk; blind
  injection detektorbehandlar signal och bakgrund var för sig; R_CS-nämnaren är
  inte dödtidsfri (B); D använder pseudosessioner. Se `MATRIS_baslinje_v0.2.md`
  och `VALIDERING_v0.2.md` för mätt detektions-/falskpositivprofil.

## Arkitektur

```
sim/sources    → sim/detector (fast pipeline: loss → jitter → deadTime →
                  afterpulsing → darkCounts → crosstalk)
   → types/events (händelseström)
   → analysis/*  (per signatur; B:s features ärvs av D/E/F, se bFeatures.ts;
                   kompatibilitetsgrind i compatibility.ts)
   → nulls/*     (S1–S5 surrogatgeneratorer + tvålagers-S4)
   → analys: p⁽²⁾ per familj → femgradig verdict + insufficientResolution
   → validation/* (bootstrap, blind injection, kontrollmatris, lätt metagate)
   → ui/*        (ControlPanel, EventStreamView, SignatureDashboard,
                   NullDistributionPanel, InjectionStudyPanel)
```

"Förhållanden" (temperatur, fält/spänning, strålning, aktiveringsenergi) är
namngivna, dokumenterat förenklade kopplingar in i käll-/detektorparametrar —
se `sim/conditions.ts`.

## Kommandon

```bash
npm install
npm run dev        # utvecklingsserver
npm run build      # typecheck + produktionsbygge
npm run test       # vitest (engångskörning)
npm run test:watch # vitest (watch-läge)
npm run lint        # oxlint
```
