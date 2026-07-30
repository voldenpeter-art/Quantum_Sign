# CLAUDE.md — Kvantsignaturer (simulerings- och analysplattform)

> Projektinstruktioner för Claude Code. Läs hela denna fil innan du rör kod.
> Denna fil ger **tvärgående principer + karta**. Rapporterna i `/rapporter`
> ger **signaturspecifik metod, trösklar och definitioner**. Vid konflikt:
> rapporten vinner för signaturspecifikt, denna fil vinner för arbetssätt.

---

## 1. Vad projektet är

En TypeScript/React-plattform som **operationaliserar signaturkatalogen A–H
(+ G, M pending)**. Kedjan är:

```
källa (sim/sources) → detektor-icke-idealiteter (sim/detector)
   → händelseström (types/events) → signaturanalys (analysis/*)
   → jämförelse mot SURROGAT-NOLLDISTRIBUTION (nulls/*)
   → metodgrind (validation/metagate) → pass/fail
```

Syftet är **inte** att räkna fram ett vackert punktvärde. Syftet är att avgöra
om en observerad indikator är icke-klassisk **mot ett surrogat**, med kontroll
för detektorartefakter, drift och golvbeteende.

---

## 2. Hur du (Claude Code) ska arbeta

- **Rak feedback.** Avvisa svaga idéer med *kvantitativ* motivering. Ingen
  artighetsvalidering, inga "bra fråga!"-inledningar.
- **Hitta inte på.** Inga påhittade trösklar, siffror eller referenser. Saknas
  ett värde: skriv `// TODO(rapport): <vad som saknas>` och peka på rätt
  rapportfil. Verifiera litteratur innan du citerar den.
- **Spring inte före uttalad avsikt.** Föreslå gärna, men implementera inte hela
  moduler ospurt. Vänta på klartecken innan större arkitekturdrag.
- **Punktskattningar är misstänkta** tills de ställts mot en nolldistribution
  från `nulls/`. Rapportera alltid p/z mot surrogat, aldrig ett ensamt värde.
- **Svenska** i rapporter, dokumentation och innehållsnära kommentarer.
  Kod-identifierare på engelska (matchar mappstrukturen).

---

## 3. Källa till sanning (läsordning)

1. `/rapporter/*` — auktoritativa för varje signaturs metod, trösklar,
   golvmönster och definitioner. **Läs relevant rapport innan du rör
   motsvarande `analysis/`-fil.** AKTUELL AUKTORITATIV VERSION är
   `Signaturtyp_{A..H,M}_rapport_v0.2.md` (samt kandidatprotokollen
   `Signaturkandidat_{I,J}_*_v0.0.txt` och `Partikelnot_*_v1.0.txt`). De äldre
   v0.1-råutkasten är flyttade till `rapporter/arkiv/`
   (`Signaturtyp_A_ickeklassisk_fotonstatistik.txt` m.fl.) och är **superseded**.
   **Filer i `rapporter/arkiv/` är historiska råutkast — läs aldrig därifrån för
   ett aktuellt metodbeslut.**
2. Denna `CLAUDE.md` — tvärgående principer och kartan.
3. `TODO(spec)` — Peters egen visions-/UX-spec för plattformen styr UI och
   interaktionsflöde. Klistra in eller länka den här:
   `<< PETERS PLATTFORMS-/UX-SPEC — INFOGAS >>`

> **v0.2-standarder (tvärgående, back-portade i alla A–H/M-rapporter — gäller
> allt framtida analysarbete):** (1) **p⁽²⁾-regeln** — andra minsta p över
> surrogatfamiljerna bär beslutet; ingen enskild null räcker. (2)
> **Admissibility-gates** G_A/G_B/G_C/G_F/G_G (och H:s inverterade
> känslighetsvolymkarta) — förutsagd effekt / minsta upplösbara, band
> <1/1–3/>3/>10. (3) **Femgradig klassning med förtjänad quantum-nomenklatur**
> — ordet "quantum" endast i klasser som passerat ett äkta icke-klassicitets­
> vittne. (4) **Tvålagers-S4** (detektorlager + analyslager/urvalsstress). (5)
> **Omöjlighetsdetektorer** RF_heisenberg / RF_stokes_bound / RF_energy_balance —
> fysikaliska omöjligheter som inbyggda lögndetektorer. (6) **Mätbar-null-
> principen** — där nollan kan mätas är den primär, surrogaten sekundära. (7)
> **Informationsestimator-standarden** — varje entropi/MI-metrik kräver
> biaskorrektion + matchat N + permutations-/modellnull. (8) **Lab/Astro-
> klyvning** — protokollets giltighet skiljs från astronomispårets målbrist.
> Denna kodbas (v1) implementerar en FÖRENKLAD delmängd; dessa standarder är
> målbilden, inte nuläget.

---

## 4. Tvärgående principer (gäller HELA katalogen)

### 4.1 Arvsregeln (arvsregeln)
`D_invariant`, `E_lowDim` och `F_memory` **ärver `B_polarization`s rådata**.
De är *inte* oberoende analyser — de konsumerar B:s utdata.
- Ändras B:s rådataschema (`types/events`) måste D/E/F revideras i samma svep.
- Bryt aldrig kopplingen "tyst". Om du rör B, flagga påverkan på D/E/F.

### 4.2 Golvmönster (golvmönster)
Varje signaturtyp har ett återkommande **golvbeteende under nollhypotesen**.
Analys jämför mot **golvet**, inte mot noll. Golvets exakta form är
signaturspecifik → `TODO(rapport)` per analys.

### 4.3 Surrogat före punkt
Ingen slutsats vilar på en punktskattning. Varje `analysis/*` måste deklarera
vilka `nulls/*` som är giltiga för den (inte alla surrogat passar alla
signaturer) och rapportera mot dem.

### 4.4 H som metodmall
`H_sensorNetwork` är katalogens metodologiska höjdpunkt och dess innovationer
är **back-portade till A–F**. Nya eller reviderade analyser ska följa
H-mönstret — surrogat + blind injection + red flags + metagate — om inte
rapporten uttryckligen säger annat.

---

## 5. Signaturkarta (`analysis/`)

Fysik nedan är lärobokssäker. Allt *signaturspecifikt* (trösklar, golv, exakt
estimator) → se rapport.

Kolumnen **v0.2-status** är rapportens egen statusetikett. Kolumnen **v1-kod**
är vad DENNA kodbas faktiskt implementerar (en förenklad delmängd av v0.2).

| Fil | Signatur | Ärver | v0.2-status (rapport) | v1-kod |
|---|---|---|---|---|
| `A_g2` | g²(0) fotonstatistik | — | protocol-ready, target-unresolved | förenklad |
| `B_polarization` | Polarisation–tid (**RÅDATA för D/E/F**) | — | infrastructure-ready, B-2 blocked | förenklad |
| `C_chsh` | CHSH / Bell | — | C-Lab/C-Link protocol-ready; C-Astro dormant | förenklad |
| `D_invariant` | Stabil invariant | **B** | fingerprint-ready after code fixes | förenklad |
| `E_lowDim` | Lågdim / kod-likhet | **B** | structure-ready after S5-E + fixes | förenklad |
| `F_memory` | Non-Markovianitet / minne | **B** | memory-structure-ready, quantum-active-only | förenklad |
| `G_squeezing` | Kvadratursqueezing | — | lab-strong, sky-blind (quad) / sky-gated (twin) | **stubbe** |
| `H_sensorNetwork` | Sensornätverk (metodmall 4.4) | — | target-rich, method-exporting | **stubbe** |
| `M_echo` | Eko / minne | — | intervention-ready (lab), awaiting W_env pilot | **stubbe** |

> Fullständiga v0.2-rapporter finns nu i `/rapporter` för **samtliga** A–H och M
> (F, G och M var tidigare oskrivna). Varje rapports §"Kodstatus" listar exakt
> vad som återstår att implementera. G, H och M är fortfarande **stubbar** i
> koden — lämna dem så tills ett medvetet implementationsbeslut tas; v0.2 ger
> nu underlaget men inte en färdig modul.

---

## 6. Simuleringslager (`sim/`)

- **`rng.ts`** — deterministisk, **seedbar** RNG. *All* slump går via denna.
  Bryts detta går golden datasets och reproducerbarhet sönder. Logga seed i
  varje körning.
- **`sources/`** — fysikaliska källmodeller. Varje källa producerar en
  händelseström enligt `types/events`. En källa vet inget om detektorn.
- **`detector/`** — icke-idealiteter läggs på **efter** källan, i en fast,
  fysikaliskt betydelsefull ordning. **Föreslagen** pipeline (bekräfta mot
  rapport/spec innan den låses):
  `loss → jitter → deadTime → afterpulsing → darkCounts → crosstalk`
  `TODO(spec): bekräfta kanonisk ordning och per-detektor-parametrar.`

### 6.1 Arkitektonisk gräns: statistik-nivå, inte tillstånds-nivå (bindande)

Simuleringslagret evolverar ALDRIG ett kvanttillstånd (ingen täthetsmatris,
ingen Hamiltonian, inga Krausoperatorer). Källor som `entangled.ts` samplar
händelser DIREKT ur den sannolikhetsfördelning kvantmekaniken förutsäger för
en given mätning (t.ex. E(a,b) = −V·(â·b̂) i Blochvektor-modellen), inte genom
att evolvera ett tillstånd och simulera en mätning på det. Detta är legitim,
standardpraxis för att generera testdata till en analyspipeline — men sätter
en hård gräns: plattformen kan aldrig svara på frågor om tillståndsdynamik
(Rabi-oscillationer, kontinuerlig dekoherens som process, blandade tillstånd
bortom en skalär "visibility", kontinuerliga variabler). **Detta är den
sannolika förklaringen till varför G (squeezing) korrekt lämnats som stubbe**
— kvadratursqueezing är en kontinuerlig-variabel-egenskap (fältkvadraturer,
homodyndetektion) som inte kan genereras med samma "sampla ur facit"-teknik
som de diskreta klick-baserade källorna använder. G kräver en annan
simuleringsmotor, inte bara en till källfil. Väg detta noga innan G/H/M
implementeras — fråga först vilken simuleringsklass signaturen tillhör.

---

## 7. Nolldistributioner (`nulls/`)

| Fil | Metod | Bevarar | Förstör |
|---|---|---|---|
| `S1_shuffle` | Permutation | marginaler | korrelation |
| `S2_timeSlide` | Tidsförskjutning | rater | äkta koincidenser |
| `S3_block` | Block-permutation/-bootstrap | lokal temporal struktur | struktur mellan block |
| `S4_detectorAdversary` | Värsta-fall-detektorartefakt | — | testar om "signal" = detektorfel |
| `S5_drift` | Driftsurrogat | — | testar långsam drift som konfundering |

**Regel:** varje `analysis/*` deklarerar sin uppsättning giltiga nulls.
`TODO(rapport): giltiga nulls per signatur.`

---

## 8. Validering (`validation/`)

- **`blindInjection`** — injicera känd signal blint; mät detektionsförmåga (ROC).
- **`bootstrap`** — resampling-konfidensintervall.
- **`goldenDatasets`** — referensdataset med känd sanning; regressionsskydd.
  Kräver fast seed (se `rng.ts`).
- **`redFlags`** — automatiska varningsflaggor för kända fallgropar.
- **`metagate`** — meta-beslutsgrind som väger samman **surrogat + red flags +
  injection** till pass/fail. **Ingen signatur passerar utan metagate.**

---

## 9. Typer (`types/`)

- **`events.ts`** — händelseschema (tidsstämpel, kanal, ev. polarisation/
  kvadratur). Ändra **försiktigt**: arvsregeln (4.1) gör att B:s schema
  fortplantar sig till D/E/F.
- **`config.ts`** — körningskonfiguration: seed, källval, detektorparametrar,
  vald analys, valda nulls.
- **`signatures.ts`** — signatur-enum + metadata + status (klar/pending).

---

## 10. UI (`ui/`) — styrs av Peters spec

Grov roll per komponent (detaljerad UX = `TODO(spec)`):
`ControlPanel` (konfig) · `EventStreamView` (rå ström) · `SignatureDashboard`
(per-signatur: värde mot golv + surrogat) · `NullDistributionPanel`
(surrogatvisualisering) · `InjectionStudyPanel` (blind injection-studier).

---

## 11. Verktygskedja & kommandon

Bekräftat (v1): Vite + React 19 + TypeScript, Tailwind v4, Vitest.

```
npm install
npm run dev        # utvecklingsserver
npm run build      # tsc -b && vite build
npm run test       # vitest run
npm run test:watch # vitest (watch-läge)
npm run lint        # oxlint
```

---

## 12. TODO-ankare (måste fyllas från rapporter/spec)

- [x] Verktygskedja + kommandon (§11)
- [x] Kanonisk detektorordning — låst till den föreslagna ordningen i §6
      (loss → jitter → deadTime → afterpulsing → darkCounts → crosstalk)
      för v1; ej separat bekräftad mot en spec utöver denna fil.
- [ ] Trösklar per signatur — v1 använder **approximativa** v0.1-trösklar
      direkt ur rapporterna (ej förregistrerade separat); se `TODO(rapport)`
      i respektive `analysis/*.ts`.
- [ ] Golvmönstrens exakta form per signatur — delvis implementerat
      (kontrastgolv A, K_D-kontrastkrav D), R_CS-nämnarens dödtidsfrihet
      (B §4.2) explicit **ej** löst i v1 (se `B-RF-DENOM`-flaggan i koden).
- [ ] Giltiga nulls per signatur — implementerat enligt bästa tolkning av
      rapporterna (se `types/signatures.ts` `validNulls` + `nulls/`), ej
      separat granskat.
- [ ] G-, H- och M-metod — registrerade som stubbar i `types/signatures.ts`
      (`implemented: false`), ej implementerade i v1.
- [ ] Peters plattforms-/UX-spec (§3.3, §10) — plattformen v1 implementerar
      UI-rollerna i §10 (ControlPanel/EventStreamView/SignatureDashboard/
      NullDistributionPanel/InjectionStudyPanel) utifrån bästa tolkning,
      utan en separat UX-spec att stämma av mot.

**Viktigt granskningsfynd vid inläsning av `/rapporter`:** filen
`rapporter/arkiv/Signaturtyp_H_faltavtryck_sensornatverk_TIDIGT_UTKAST_felmarkt_som_F.txt`
(numera arkiverad) är rubricerad "Signaturtyp F" i sitt eget innehåll, men beskriver
**fältavtryck i sensornätverk** (atomur/magnetometrar, GNOME-stil) — dvs.
det som katalogens syntesrapport (§1) beskriver som bokstavskollisionen
"sensornätverket → H". Filen är alltså ett tidigt utkast till **H**, inte en
rapport för **F** (F = non-Markovianitet/minne, låst i A-rapporten §11 och i
denna fils §5). Döp inte om `analysis/F_memory.ts` utifrån den filens
innehåll.
