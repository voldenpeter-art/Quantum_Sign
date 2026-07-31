> **REDAKTIONELL STATUSNOT (ej del av originalspecen, tillagd när dokumentet
> landade i repot 2026-07-31).** Detta är Sprint 1:s HISTORISKA exekveringsspec.
> Den bevaras ordagrant nedan som referens för golden tests G1–G7, som är
> verifierade i `src/sim/goldenTests.test.ts` (+ G4 i
> `src/analysis/A_g2.deadtime.test.ts`).
>
> Delar av specen är **superseded** av senare arbete och ska INTE utföras som
> instruktion idag:
> - Klassningsregeln "ε̂ + k·σ < 0 (k=3/5)" (Delmål 4) ersattes i v0.2 av
>   **p⁽²⁾-regeln** mot surrogatfamiljer + femgradig förtjänad nomenklatur.
> - "CHSH-widgeten raderas" (Delmål 5): C är idag plattformens starkaste och
>   mest validerade signatur — den ska inte tas bort.
> - "`coded` och `memory` TAS BORT" (Delmål 2): `memoryEcho` används av
>   signatur F och av kontrollmatrisens F-spår.
> - Delmål 1 (rensa avklippt JSX/BOM) är sedan länge genomfört.
>
> Aktuell auktoritativ metod: `/rapporter/Signaturtyp_*_rapport_v0.2.md` och
> `CLAUDE.md`. Avvikelser som hittades vid G1–G7-verifieringen är dokumenterade
> i testfilen (G3: A-strong kräver ~1000 surrogat/familj; G5: ren attenuering
> bevarar g²(0) — utspädning kommer från bakgrund, inte förlust).

---

# PLATTFORM_SPRINT1_SPEC.md — Körbar grund + A-kärnan

*Exekveringsspec för Claude Code. Förutsätter KATALOG_KONTEXT.md och Signaturtyp A-rapporten (bindande). Omfattning: den externa granskningens steg 1–3 plus arkitekturkorrigeringen från chattgranskningens fynd 3. Plan mode för allt under `analysis/` och `nulls/`; git-checkpoint efter varje numrerat delmål; `npx tsc -b --noEmit` grönt före varje commit.*

## Mål

En körbar, modulär plattform där Signatur A testas korrekt: tillståndsbaserad eventström → instrumentlager → korskorrelations-g² → accidentals-null → bootstrap → A-none/suspect/strong. React visar och styr; all fysik/analys i rena TS-moduler. Pedagogiskt läge och forskningsläge separerade, proxyvärden synligt märkta.

## Bindande arkitekturregler

1. **Tillstånd, inte utfall (chattgranskningen fynd 3).** Källor emitterar aldrig färdiga mätresultat. `EmissionEvent` bär källtillstånd (t.ex. `kind: 'pair', state: 'singlet'` eller latent intensitet/fas); polarisationsutfall genereras först i mätsteget givet analysinställning, med korrekta sannolikheter (singlett: P(a=b) = sin²(θ_A−θ_B) etc.). Utan detta kan Bell aldrig brytas — datastrukturen vore en lokal dold-variabel-modell.
2. **Tre separerade lager:** `sim/sources/` (sann fysik) → `sim/detector/` (instrument: loss, jitter, deadTime, afterpulsing, darkCounts) → `analysis/` (estimatorer). Inget lager läser de andras interna sanningar.
3. **Ingen facitläckage i analys:** `isBackground`, källtyp och sanna tider är förbjudna inputs till alla `analysis/`- och verdiktfunktioner. Endast `DetectedEvent { detectedT, det_id, arm, outcome?, setting? }` når analysen.
4. **Seedad RNG** (`sim/rng.ts`, t.ex. splitmix64/sfc32). Alla generatorer tar RNG-instans; samma seed ⇒ identiskt resultat. Inga `Math.random()` utanför rng.ts.
5. **Katalogfilstruktur** enligt den externa granskningens §4 (types/, sim/, analysis/, nulls/, validation/, ui/).

## Delmål 1 — Körbar bas

Rensa till giltig `.tsx`/`.ts`: bort med rubriktext och BOM före import, komplettera eller ersätt den avklippta JSX-returen, ta bort oanvänd `useRef`. Vite + projektreferens-tsconfig som tidigare. Acceptans: `npx tsc -b --noEmit` grönt; appen renderar.

## Delmål 2 — Källmodeller (sim/sources/)

- `coherent.ts`: homogen Poisson. 
- `thermal.ts`: OU-modulerad intensitet med koherenstid τ_c som parameter (chattgranskningen fynd 1 — nuvarande modell saknar tidsskala och ersätts helt); inhomogen Poisson-sampling via thinning.
- `singleEmitter.ts`: återexcitationstid som källfysik (behåll idén), parametriserad livstid.
- `spdcPair.ts`: paremission med `state: 'singlet'`; inga polarisationsutfall vid emission (regel 1).
- `coded` och `memory` TAS BORT tills egna modeller finns (idag aliaser av coherent — vilseledande).

## Delmål 3 — Instrumentlager (sim/detector/)

Kedja i ordning: loss → stråldelning/armfördelning → jitter (gaussisk, parametriserad σ) → **deadTime per detektor** (paralyserbar/icke-paralyserbar som flagga) → darkCounts (Poisson-bakgrund, utan facitflagga i output) → afterpulsing (sannolikhet + fördröjningsfördelning). Varje steg ren funktion `DetectedEvent[] → DetectedEvent[]` med RNG.

## Delmål 4 — A-analysen (analysis/A_g2.ts)

Enligt A-rapporten §4–6, bindande:
- **Endast korskorrelation** mellan två detektorer (HBT). Autokorrelation implementeras separat och exponeras enbart i pedagogiskt läge, märkt "skräckexempel: dödtidsartefakt".
- Koincidenshistogram H_AB(τ) med two-pointer (O(N log N) eller bättre), förregistrerat τ-grid.
- Normalisering: accidentals via time-slide av ena kanalen (flera slides, medelvärdesbildade — B §4.3-lärdomen).
- ĝ²(0)-skattning med fiducialfönster som exkluderar artefaktzon.
- Bootstrap-σ (blockbootstrap över tid) för ε̂ = ĝ²(0) − 1.
- Klassning: primärtest ε̂ + k·σ < 0 (k förregistrerat i config: suspect k=3, strong k=5) — tvådelad inferens per C §4.3-mönstret; S1/S2-null i Sprint 2.

## Delmål 5 — UI-minimum (ui/)

ControlPanel (källa, loss, jitter σ, dödtid, darkrate, seed), SignatureDashboard som visar ĝ²(τ)-kurva (kors + auto sida vid sida i pedagogiskt läge), ε̂ ± σ, klassning. Forskningsläge döljer alla proxyer; CHSH-widgeten ur v2 raderas (återkommer som riktig estimator i Sprint 2). Verdiktlogik får inte läsa källval (regel 3).

## Acceptanskriterier (golden tests, körs med fast seed)

| # | Scenario | Krav |
|---|---|---|
| G1 | Coherent, idealt instrument | ĝ²(0) = 1 ± 3σ; klassning A-none |
| G2 | Thermal (τ_c = 200 ns-ekv.), idealt | ĝ²(0) → 2 med avklingning på skala τ_c; A-none |
| G3 | SingleEmitter, idealt | ĝ²(0) < 1 signifikant; dipbredd ~ livstiden; A-strong |
| G4 | Coherent + dödtid PÅ | **auto**-g² visar falsk dipp; **kors**-g² förblir ≈ 1 (A §4-demonstrationen) |
| G5 | SingleEmitter + 90 % loss | ε̂ krymper mot 0 men byter aldrig tecken (teckenbevarande, A §8) |
| G6 | Samma seed två körningar | bitidentiska metrics |
| G7 | Thermal med hög darkrate | ĝ²(0) dras mot 1 (utspädning), aldrig under 1 − 3σ |

G4 är sprintens kronjuvel: plattformens första äkta demonstration av katalogens huvudbedragare.

## Utanför scope (Sprint 2+)

C-estimatorn (kräver settings/outcome-mätsteget från regel 1 — förberett men inte byggt), S1–S4-nullerna, blind injection, E/M-strukturstöd, H-modulen, metagaten, I-kandidatens inträdesprov.
