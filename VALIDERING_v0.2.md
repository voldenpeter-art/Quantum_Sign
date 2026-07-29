# Validering & granskning — v0.2-uppgraderingen av A–F

> Datum: 2026-07-29. Gäller commit av A–F-uppgraderingen (p⁽²⁾, förtjänad
> nomenklatur, tvålagers-S4, RF_stokes_bound) plus två oberoende 1500-
> körningssvep. Svarar på Peters två frågor: *"Är planen uppdaterad?"* och
> *"Har vi all teknisk information vi behöver för att testa nytt material?"*

---

## 1. Vad som ändrades (kodrörelse)

De tvärgående v0.2-standarderna (CLAUDE.md §3) implementerade i de signaturer
som faktiskt kör (A–F):

| Standard | Var | Hur |
|---|---|---|
| **p⁽²⁾-regeln** | A, B, D, E, F | `stats.ts` `pSquared`: ett p PER surrogatfamilj, det **näst minsta** bär beslutet. Poolingen behålls bara för nollfördelnings­visualiseringen. |
| **Femgradig, förtjänad nomenklatur** | alla | Ny verdict `'structural'` mellan `classical` och `suspect`. "suspect"/"strong" (kvantanspråk) endast där ett äkta vittne passerat: A:s ε<0, B:s R_CS>1, C:s S>2. Kvantneutrala D-pol/E/F-passiv taklagda till `'structural'`. |
| **Tvålagers-S4** | B (R_CS), C (motståndare) | `nulls/generateS4Layer2`: lager 1 = värsta-fall detektorartefakt, lager 2 = S4 + analys-/urvalsstress. Vittnet måste slå **båda**. |
| **Omöjlighetsdetektor** | D | `RF_stokes_bound`: PSD-brott (meningsfullt negativt egenvärde) i Stokes-kovariansen ogiltigförklarar D-utsagan. |

Verifierat rent: `tsc -b`, `vitest` (10/10), `vite build`, `oxlint`.

---

## 2. Två oberoende 1500-körningssvep

`scripts/sweep.ts`, 300 körningar/källa × 5 källor = 1500 körningar per runda,
slumpade förhållanden + detektorparametrar. Deterministiska (metaSeed styr).

| | Runda 1 (seed 20260729) | Runda 2 (seed 19730401) |
|---|---|---|
| Signatur-rader | 3300 | 3300 |
| A / B / D / E / F | **100 % none** | **100 % none** |
| C (entangled) | 6 suspect (2.0 %), 0 strong | 10 suspect + 2 strong (4.0 %) |
| `RF_stokes_bound`-utslag | 0 | 0 |
| `structural`-verdict | 0 | 0 |
| Spurious detektion (thermal/coherent/singleEmitter) | 0 | 0 |

**Tolkning.** Resultatet är stabilt mellan rundorna och identiskt i karaktär med
det tidigare (pre-v0.2) svepet: **bara C detekterar, bara på entangled, bara vid
nästan ideal detektor.** Tvålagers-S4 dödade *inte* C:s äkta detektion (bra —
det var risken). `RF_stokes_bound` förblev vilande (korrekt: den ska bara slå på
en trasig estimator, inte på välformad data). Noll spurious detektion på
klassiska källor = noll typ-I-fel i svepet.

---

## 3. Är `structural`/suspect-tiern för D/E/F "död kod"?

Nej — men den är **medvetet svårnådd**, och det är korrekt. En diagnostik
(`scripts/probeStructural.ts`) körde A–F på en **ren, nästan ideal** entangled-
ström (förlust 3 %, jitter 200 ps) och mätte huvudstatistikans z mot dess egen
nollfördelning:

```
C:  primary-z median 1.33  → suspect/strong fyras  ✓
A:  primary-z median 0.16  ┐
B:  primary-z median −0.14 │  alla ≈ 0, intervall inom ±2.6
D:  primary-z median 0.16  │  = rent brus, ingen separerbar struktur
E:  primary-z median −0.06 │
F:  primary-z median −0.10 ┘
```

Slutsatsen är fysikalisk, inte en bugg: den **statistik-nivå-simulering**
plattformen använder (CLAUDE.md §6.1) samplar mätutfall direkt ur QM:s
korrelationer för CHSH/polarisation. Den **injicerar aldrig** antibunching (A),
en påtvingad Stokes-invariant (D), låg effektiv dimension (E) eller temporalt
minne (F). Därför är `none` det **korrekta** svaret för A/B/D/E/F på all data
plattformen kan generera — och `structural` är en **reserverad, korrekt kopplad**
klass som fyras först när sådan struktur verkligen finns (t.ex. i importerat
riktigt material eller en rikare simulatorklass).

**Ett upplösningsgolv värt att känna till:** empiriskt p har golvet 1/(N+1) per
familj, och p⁽²⁾ väger per familj → tröskeln 1e-2 kräver ≥~100 surrogat/familj.
UI-reglaget höjdes därför från max 60 → 200. Vi bytte **medvetet inte** till en
parametrisk svans för att komma under golvet — det vore att hitta på signifikans
surrogaten inte stöder (surrogat-först, CLAUDE.md §4.3). Hellre ärligt `none`.

---

## 4. Svar på Peters två frågor

### "Har vi planen uppdaterad?"

Ja. Auktoritativa källan är nu v0.2-rapporterna i `/rapporter` (landade i commit
`3b32adf`), speglade i `CLAUDE.md` §3/§5 och `types/signatures.ts`
(`statusV02`/`reportFile` per signatur). Denna uppgradering implementerar den
**förenklade delmängd** av v0.2 som är meningsfull för A–F i v1-koden; vad som
kvarstår per signatur står i respektive rapports §"Kodstatus". G/H/M är
fortfarande medvetna stubbar (kräver en annan simulatorklass, CLAUDE.md §6.1).

### "Har vi all teknisk information vi behöver för att testa nytt material?"

**Delvis — beror på materialtyp.** Ärlig uppdelning:

- ✅ **Diskret, klick-baserat material som liknar A–F** (fotonräkningar,
  polarisation-tid, koincidenser): pipelinen är redo. Adaptern för riktig
  NIST-Bell-data finns och är verifierad end-to-end (`scripts/lib/nistBellRaw.ts`
  m.fl.), med GPS-klockjustering och kontaminationsdetektor.
- ⚠️ **Riktig Bell-kränkning ur NIST-datan (signatur C/J)**: blockerad på **en
  saknad bit** — NIST:s kalibreringsparametrar (sync-till-klick-fördröjningens
  radie/fönster per part, deras `cw45`-metod). Utan dem kan vår blinda grindning
  inte isolera signalfönstret (dokumenterat i eberhard-slutsatsen). Detta är
  nästa konkreta fråga till NIST.
- ❌ **Kontinuerlig-variabel-material (G squeezing, homodyn)**: kräver en
  **annan simulatorklass** än "sampla ur facit" (CLAUDE.md §6.1). Inte redo, och
  bör inte tvingas in i A–F-formen.
- ❌ **Signatur J (energitransfer/relaxation)**: kandidatprotokoll v0.0, kräver
  stark drivning över trösklar — ny simulatorklass. Registrerad som stubbe.

**Kort:** för det materialet du redan pekat på (NIST-Bell, diskreta
klickströmmar) har vi infrastrukturen; det som fattas för en skarp C/J-kränkning
är NIST:s egna kalibreringsparametrar, inte kod hos oss. För G/H/M/CV-material
behövs ett medvetet beslut om en ny simulatorklass innan de kan testas.

---

## 5. Reproduktion

```
npm run test                       # 10/10
npm run build                      # tsc -b && vite build
npx tsx scripts/sweep.ts 300 out1 20260729   # runda 1
npx tsx scripts/sweep.ts 300 out2 19730401   # runda 2
npx tsx scripts/probeStructural.ts           # z-diagnostik (ren entangled)
```
