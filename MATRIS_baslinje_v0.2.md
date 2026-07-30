# Förregistrerad kontrollmatris — v0.2-baslinje

**Uppställning:** 15 namngivna scenarier × 50 seeds, `scripts/controlMatrix.ts`
(metaSeed 20260729, duration 20 s). Varje scenario kör bara sina designerade
signaturer; negativa kontroller utanför `requiredSources` körs 'forced'.
"Fyrar" = quantum-klass (suspect/strong) för äkta vittnen A/C, structural för
kvantneutrala D/E/F. Wilson-95 %-intervall inom hakparentes.

## Resultat

| Scenario | Signatur | Roll | Detektionsfrekvens (Wilson 95 %) | Tolkning |
|---|---|---|---|---|
| **A1** single emitter, gynnsam | A | positiv | **0,34** [0,22–0,48] | Äkta antibunching-detektion |
| **A2** single emitter, låg S/B | A | positiv | 0,04 [0,01–0,14] | Känslighet faller vid hård bakgrund/förlust |
| A3 coherent | A | negativ | **0,00** [0–0,07] | Ingen falsk antibunching |
| A4 thermal | A | negativ | **0,00** [0–0,07] | Ingen falsk antibunching |
| A5 thermal + dödtid/afterpulse | A | negativ | **0,00** [0–0,07] | **Artefaktmotstånd bekräftat** |
| **E1** entangled V=1 | C | positiv | **1,00** [0,93–1,0] | Perfekt Bell-effekt |
| E2 entangled V=0,8 | C | tröskel | 0,36 [0,24–0,50] | Delvis detektion |
| E3 entangled V=0,72 | C | tröskel | 0,00 [0–0,07] | Under detektionsgräns (denna längd/takt) |
| E4 entangled V=1/√2 | C | negativ | **0,00** [0–0,07] | Klassisk CHSH-gräns → ingen kränkning |
| E5 entangled V=0,5 | C | negativ | **0,00** [0–0,07] | Negativ kontroll ren |
| E6 entangled V=1 + hög förlust | C | positiv | 0,82 [0,69–0,90] | Robust mot 60 % förlust |
| E7 entangled V=1 + jitter/dark | C | positiv | **1,00** [0,93–1,0] | Robust mot timingstress |
| E1 | B/D/E | sekundär | 0,00 (både quantum & structural) | Ingen operationell signal |
| **F1/F2** memory echo | F | positiv | **0,00** [0–0,07] | **F fyrar aldrig på sin egen positivkontroll** |
| F3 coherent (forced) | F | negativ | 0,00 [0–0,07] | (Trivialt, då F1/F2 också är 0) |

## Slutsatser

**1. C är ett fungerande, kalibrerat Bell-vittne.** Perfekt effekt vid V=1
(50/50), robust mot 60 % förlust (0,82) och timingstress (1,00), **noll falska
positiva** vid och under den klassiska gränsen (V ≤ 1/√2), och en **monoton**
effektkurva i V (0 → 0 → 0,36 → 1,00 för V = 0,5/0,707/0,8/1,0). Detektionströskeln
ligger runt V≈0,8 vid denna längd/takt.

**2. A är specifikt men lågkänsligt (vid denna längd/takt).** 34 % effekt på
gynnsam single-emitter, faller till 4 % vid hård S/B — men **noll falska
positiva** på alla klassiska källor, inklusive den artefakttunga A5 (kraftig
dödtid + afterpulse). Effekten är räknebegränsad; längre körning/högre takt
höjer den (jfr `sim.test.ts` vid duration 60). A är alltså trovärdigt men bör
köras längre för skarp känslighet.

**3. B, D, E, F har noll operationell effekt i denna simulering.** De fyrar
aldrig på sina designerade positiva scenarier — bekräftar den tidigare
z≈0-diagnostiken: den statistik-nivå-simulatorn injicerar ingen antibunching (A
på entangled), stabil Stokes-invariant (D), lågdim (E) eller revival (F). För
**F är detta det viktiga, ärliga fyndet**: memory-echo-källan producerar ingen
detekterbar revival → **F-passiv är operationellt inert här**, helt i linje med
rapportens status "quantum-active-only". D/E/F ska beskrivas som strukturella
sök-/kvalitetslager, inte som fristående vittnen med bevisad effekt.

**4. Falskpositivfrekvens: 0/50 på samtliga negativa kontroller** (Wilson-tak
≈ 7 %). Inga falska kvantanspråk någonstans i matrisen.

## Vad matrisen bevisar mot det gamla slumpsvepet

Det slumpade svepet visade "bara C detekterar" utan att kunna skilja *saknad
effekt* från *saknad signal*. Matrisen skiljer dem: **C och A har verifierad
effekt och nollkontroller; B/D/E/F har bevisat noll effekt på egen mark.** Det
gör plattformens detektionsprofil till en mätbar egenskap i stället för en
anekdot — precis den kalibreringsbaslinje granskningen efterfrågade.

## Reproduktion
```
npx tsx scripts/controlMatrix.ts 50 out 20260729
# → out/matrix_runs.csv, out/matrix_summary.txt, out/matrix_manifest.json
```
