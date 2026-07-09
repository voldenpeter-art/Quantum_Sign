# Quantum_Sign — Kvantsignaturplattform

Interaktiv React/TypeScript-plattform för att simulera experimentella kvantoptiska
källor, degradera dem genom en realistisk detektorkedja, och testa den resulterande
händelseströmmen mot en katalog av kvantsignaturer (A–M) — med surrogatbaserade
nollfördelningar, blind injection-studier och exporterbara rapporter.

Se `CLAUDE.md` för den fulla projektspecen (arkitektur, arvsregeln, golvmönster)
och `/rapporter` (bifogas separat) för signaturspecifik metod och trösklar.

## Status (v1)

- **Implementerat:** signaturerna **A–F** (fotonstatistik, polarisation–tid,
  CHSH/Bell, stabil invariant, lågdimensionalitet, non-Markovianitet), med
  riktiga S1–S5-surrogat, bootstrap-CI, blind injection-studie och en lätt
  metagate (inte den fulla min-gate-över-pelare-disciplinen från CLAUDE.md §4.4).
- **Registrerade men ej implementerade:** G (squeezing), H (sensornät), M
  (minne/eko), samt en tionde platshållare **J** (energitransfer/relaxation,
  ännu bara ett idédokument). Att lägga till en ny signatur = en analysfunktion
  i `src/analysis/` + en rad i `src/types/signatures.ts` och
  `src/analysis/registry.ts` — se kommentarerna där.
- Detta är en **pedagogisk Monte Carlo-prototyp och pipeline-validerare**, inte
  ett färdigt vetenskapligt instrument. Kända v1-förenklingar är dokumenterade
  inline (`TODO(rapport)`-kommentarer) i berörda filer, framför allt
  R_CS-nämnarens dödtidshantering (B) och pseudosessioner istället för riktiga
  flersessionskörningar (D).

## Arkitektur

```
sim/sources    → sim/detector (fast pipeline: loss → jitter → deadTime →
                  afterpulsing → darkCounts → crosstalk)
   → types/events (händelseström)
   → analysis/*  (per signatur; B:s features ärvs av D/E/F, se bFeatures.ts)
   → nulls/*     (S1–S5 surrogatgeneratorer)
   → validation/* (bootstrap, blind injection, lätt metagate)
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
