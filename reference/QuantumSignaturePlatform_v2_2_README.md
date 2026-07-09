# QuantumSignaturePlatform v2.2

React/TypeScript-plattform för pedagogisk kvantsignaturanalys A/B/C/D/E/M.

Den här versionen bygger ovanpå v2.1-eventmotorn och lägger till tre viktiga forskningsdelar:

1. **S1–S4-surrogat/nullfördelningar**
2. **Bootstrapintervall för observerade scores**
3. **Blind injection study**
4. **Rapport-/resultatexport till JSON, CSV och Markdown**

## Grundmotor från v2.1

v2.1 korrigerade två centrala problem:

- `g²(τ)` räknas från alla tidspar inom ett fysiskt τ-fönster, inte från närliggande array-index.
- CHSH beräknas från faktiska A/B-coincidences, mätinställningar och binära outcomes i eventstreamen.
- Mandel Q/Fano visas över flera binbredder.
- A och C klassas separat, eftersom single-emitter-antibunching och entangled-pair/CHSH inte är samma fenomen.

## Nytt i v2.2

### S1–S4-surrogat

Plattformen bygger en konservativ nullfördelning genom att i varje nullrunda skapa fyra motståndarmodeller:

- **S1 — label shuffle:** polarisation/outcome-labels blandas inom arm+setting. Tider/rates bevaras.
- **S2 — time-slide:** arm B tidsförskjuts cirkulärt. Internstatistik bevaras, men A/B-coincidences bryts.
- **S3 — block bootstrap:** tidsblock resamplas. Lokal klustring bevaras, global struktur bryts.
- **S4 — klassisk vektorprocess:** klassisk drift/polarisation + Poisson-detektion utan kvantpar.

För varje signatur används den starkaste S1–S4-responsen i respektive runda som konservativ null.

### Bootstrap

Block-bootstrap används för att uppskatta intern osäkerhet i observerade signatur-scores. UI:t visar 5–95%-intervall.

### Blind injection study

En separat blind dataset skapas från en klassisk baslinje plus en dold syntetisk anomali av typ A, B, C, D, E eller M. Pipeline får analysera datasetet innan facit visas.

Detta är inte en ersättning för riktig blindanalys med extern part, men det är ett bra första test av om pipeline hittar injicerade signaturer utan att bara följa UI-parametrarna.

### Rapport/export

UI:t kan exportera:

- **JSON**: full maskinläsbar rapport med config, resultat, nullfördelningar, bootstrap och injection study.
- **CSV**: kompakt tabell för kalkylblad.
- **Markdown**: läsbar rapport för dokumentation, journalföring eller vidare granskning.

## Användning

Kopiera `QuantumSignaturePlatform_v2_2.tsx` till `src/App.tsx` i ett React/Vite-projekt.

```bash
npm create vite@latest quantum-signatures -- --template react-ts
cd quantum-signatures
npm install
# ersätt src/App.tsx med QuantumSignaturePlatform_v2_2.tsx
npm run dev
```

## Viktiga begränsningar

Detta är fortfarande en pedagogisk Monte Carlo-prototyp och en pipeline-validerare, inte ett färdigt vetenskapligt instrument.

För skarpa data behövs fortfarande:

- instrumentkalibrering
- förregistrerade trösklar
- kontrollkällor
- real instrumentresponsmodell
- optimerad coincidence-kärna i Numba/C++/Rust vid stora eventmängder
- separat, oberoende blind injection study
- dokumenterad hantering av look-elsewhere effect och multipeltestning

## Snabb tolkning

En signatur som passerar S1–S4 Q99 betyder endast:

> Den observerade simuleringens score överstiger den konservativa null som byggdes av de fyra surrogatfamiljerna i just denna prototyp.

Det betyder inte automatiskt att signaturen är verkligt kvantoptisk.
