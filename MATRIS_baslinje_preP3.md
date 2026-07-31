# Kontrollmatris — pre-P3-baslinje (tvåstegs)

**Syfte:** ge ett rent "före"-facit inför P3:s motorbyte. Den tidigare
publicerade baslinjen (`MATRIS_baslinje_v0.2.md`) mättes **innan** P1
(per-familj-null) och P2 (namngiven S4-familj) landade, och kunde därför inte
användas för en före/efter-jämförelse av detektormotorn utan att blanda in
metodändringar.

**Uppställning:** `scripts/controlMatrix.ts`, 15 scenarier × 50 seeds, metaSeed
20260729, tvåstegs: screening 99 surrogat/familj → confirmation 499 för
kandidater (positiv tier eller headline-p < 0.05) + 100 slumpade
audit-negativa. Kod: `main` @ `0bbf70e` (före P3), körd i isolerad worktree.

## Resultat (confirmation-steget är det giltiga facit)

| Scenario | Signatur | Roll | Screening (99) | Confirmation (499) |
|---|---|---|---|---|
| A1 single emitter, gynnsam | A | positiv | 0.00 ⚠️ | **0.59** (16/27) |
| A2 single emitter, låg S/B | A | positiv | 0.00 ⚠️ | 0.00 (0/7) |
| A3/A4/A5 klassiska | A | negativ | 0.00 | **0.00** |
| E1 entangled V=1 | C | positiv | 1.00 | **1.00** (50/50) |
| E2 entangled V=0.8 | C | tröskel | 0.38 | 0.47 (19/40) |
| E3 entangled V=0.72 | C | tröskel | 0.00 | 0.00 |
| E4 V=1/√2, E5 V=0.5 | C | negativ | 0.00 | **0.00** |
| E6 V=1 + 60 % förlust | C | positiv | 0.84 | **0.86** (42/49) |
| E7 V=1 + jitter/dark | C | positiv | 1.00 | **1.00** (50/50) |
| E1 | B/D/E | sekundär | 0.00 | 0.00 |
| F1/F2 memory echo | F | positiv | 0.00 | 0.00 |
| F3 coherent (forced) | F | negativ | 0.00 | 0.00 |

**Falskpositivfrekvens: 0/100 audit-negativa** blev positiva vid
confirmation-upplösning (499 surrogat/familj). Noll falska kvantanspråk i hela
matrisen, i båda stegen.

## Jämförelse mot den tidigare baslinjen

C är **oförändrad** inom statistisk osäkerhet — P1 och P2 (inklusive den
namngivna S4-motståndarfamiljen, som gjorde motståndargrinden strängare)
försämrade alltså inte C:s detektionsförmåga:

| | Tidigare (150/48/24 rep) | Pre-P3 (confirmation, 499 rep) |
|---|---|---|
| E1 C | 1.00 | 1.00 |
| E2 C | 0.36 | 0.47 |
| E6 C | 0.82 | 0.86 |
| E7 C | 1.00 | 1.00 |
| Negativa (A3–A5, E4, E5, F3) | 0.00 | 0.00 |

A1 ser vid första anblicken ut att ha rasat (0.34 → 0.00), men det är **inte**
en regression — se nedan.

## Fynd: off-by-one i upplösningsgrinden (åtgärdad)

Screening-steget körde 99 surrogat/familj. Empiriskt p har golvet 1/(N+1) =
**exakt 1e-2**, och A:s verdict-tröskel är **strikt** `p < 1e-2`. Minsta
uppnåeliga p⁽²⁾ blev därmed precis lika med tröskeln — A kunde **omöjligt**
fyra, oavsett hur stark antibunchingen var. Hela A-spåret föll till 0 % i
screening av den anledningen, inte av fysik.

Värre: `resolutionInsufficient` använde `>` och rapporterade därför
"tillräcklig upplösning" vid N=99 — precis den falska trygghet flaggan byggdes
för att förhindra. Åtgärdat till `>=` (upplösningen måste vara *strikt* under
golvet), med regressionstest som pinnar gränsfallet N=99 vs N=100.

Att tvåstegsdesignen ändå fångade A (kandidatgränsen p < 0.05 skickade raderna
vidare, och vid 499 surrogat fyrade A1 i 59 % av fallen) är ett konkret bevis
för att screening→confirmation-upplägget gör vad det ska.

## Slutsats inför P3

- **C är stabil och oförändrad** genom P1+P2 — motståndarfamiljen kostade ingen
  detektionsförmåga.
- **A fungerar men är upplösningsbegränsad**: den behöver ≥100 surrogat/familj
  för att kunna fyra överhuvudtaget, och ~500 för att göra det tillförlitligt.
- **B/D/E/F har fortsatt noll operationell effekt** på sina egna scenarier.
- **Noll falska positiva** genomgående.

Detta är "före"-facit. Nästa steg är att köra samma matris med
`detector.engine = 'stateful'` och jämföra — då mäter vi enbart motorbytet.

## Reproduktion
```
npx tsx scripts/controlMatrix.ts 50 out 20260729 99 499
```
